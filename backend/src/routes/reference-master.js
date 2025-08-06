const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("ReferenceMaster");
  const refValueRepo = app.db.getRepository("ReferenceValue");

  app.get("/reference-master", async (req, res) => {
    try {
      const { id, code, name, codeOrName, isActive, getCount, getRefValues } =
        req.query;
      const qb = repo.createQueryBuilder("reference_master");
      const dataToSend = {};
      qb.select([
        "reference_master.id",
        "reference_master.code",
        "reference_master.name",
        "reference_master.status",
        "reference_master.description",
      ]);

      qb.where("reference_master.org_id = :orgId", {
        orgId: req.user.orgId,
      });

      if (id) qb.andWhere("reference_master.id = :id", { id });

      if (name) {
        qb.andWhere("LOWER(reference_master.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      }

      if (code) {
        qb.andWhere("LOWER(reference_master.code) LIKE LOWER(:code)", {
          code: `${code.toLowerCase()}%`,
        });
      }

      if (codeOrName) {
        qb.andWhere(
          "(LOWER(reference_master.name) LIKE LOWER(:nameLike) OR LOWER(reference_master.code) LIKE LOWER(:codeLike))",
          {
            nameLike: `%${codeOrName.toLowerCase()}%`,
            codeLike: `${codeOrName.toLowerCase()}%`,
          }
        );
      }

      if (isActive === "false") {
        qb.andWhere("reference_master.status IN (:...status)", {
          status: ["A", "D"],
        });
      } else {
        qb.andWhere("reference_master.status = :status", { status: "A" });
      }

      qb.orderBy("reference_master.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      } else if (getRefValues === "true" && id) {
        const referenceValues = await refValueRepo.find({
          where: {
            reference_master: { id },
            status: "A",
            organization: { id: req.user.orgId },
          },
        });
        dataToSend.referenceValues = referenceValues;
      }

      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const results = await qb.skip(offset).take(limit).getMany();
      console.log({ page, limit, offset, count: dataToSend.total });

      // console.log("DB query", qb.getSql(), req.user.orgId);
      // console.log("results", results);
      dataToSend.referenceMasters = results;
      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  app.post("/reference-master", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "referenceValues", t: "array" },
      ])
    )
      return;

    try {
      const conn = app.db; // TypeORM DataSource
      const { code, name, referenceValues, description } = req.body;

      await conn
        .transaction(async (manager) => {
          // Check for duplicate reference_master code
          const existing = await manager.findOne("ReferenceMaster", {
            where: {
              code,
              organization: { id: req.user.orgId },
              status: "A",
            },
          });

          if (existing) {
            return res
              .code(400)
              .send({ error: `Code "${code}" already exists.` });
          }

          // Create new reference_master
          const refMasterRepo = manager.getRepository("ReferenceMaster");
          const reference_master = refMasterRepo.create({
            code,
            name,
            status: "A",
            description,
            created_by: { id: req.user.id },
            organization: { id: req.user.orgId },
          });

          const savedRefMaster = await refMasterRepo.save(reference_master);

          // Create related referenceValues if provided
          if (Array.isArray(referenceValues)) {
            const permRepoTx = manager.getRepository("ReferenceValue");
            const permissionEntities = referenceValues.map((rv) =>
              permRepoTx.create({
                code: rv.code,
                name: rv.name,
                isActive: rv.isActive,
                description: rv.description,
                relatedValue: rv.relatedValue,
                sortOrder: rv.sortOrder,
                status: "A",
                reference_master: { id: savedRefMaster.id },
                created_by: { id: req.user.id },
                organization: { id: req.user.orgId },
              })
            );
            await permRepoTx.save(permissionEntities);
          }

          // Log audit entry
          await app.logAudit(
            req,
            savedRefMaster.id,
            "reference_masters",
            "create",
            {
              code,
              name,
              description,
              referenceValues,
            }
          );

          res.send({ success: true, id: savedRefMaster.id });
        })
        .catch((err) => {
          app.log.error(err);
          res.code(500).send({ error: "Transaction failed" });
        });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.put("/reference-master/:id", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "name", t: "string" },
        { f: "referenceValues", t: "array" },
      ])
    )
      return;

    const { id } = req.params;
    const { name, referenceValues, description } = req.body;
    const conn = app.db;

    try {
      await conn.transaction(async (manager) => {
        // 🧩 Update the reference_master
        await manager.update("ReferenceMaster", { id }, { name, description });

        // 🔎 Fetch existing referenceValues for this reference_master
        const existing = await manager.find("ReferenceValue", {
          where: {
            status: "A",
            reference_master: { id },
            organization: { id: req.user.orgId },
          },
        });

        const existingPagesMap = new Map();
        for (const p of existing) {
          existingPagesMap.set(p.id, p);
        }

        // 🔄 Upsert referenceValues
        for (const rv of referenceValues) {
          const match = existingPagesMap.get(rv.id);
          if (!match) {
            const permRepoTx = manager.getRepository("ReferenceValue");
            const newPerm = permRepoTx.create({
              code: rv.code,
              name: rv.name,
              isActive: rv.isActive,
              description: rv.description,
              relatedValue: rv.relatedValue,
              sortOrder: rv.sortOrder,
              reference_master: { id },
              organization: { id: req.user.orgId },
              created_by: { id: req.user.id },
              status: "A",
            });
            await permRepoTx.save(newPerm);
          } else if (match.status === "D") {
            match.code = rv.code;
            match.name = rv.name;
            match.isActive = rv.isActive;
            match.description = rv.description;
            match.relatedValue = rv.relatedValue;
            match.sortOrder = rv.sortOrder;
            await manager.save("ReferenceValue", match);
          }
        }

        await app.logAudit(req, id, "reference_masters", "update", {
          name,
          referenceValues,
          description,
        });

        res.send({ success: true });
      });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.delete("/reference-master/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      app.logAudit(req, id, "reference_master", "inactivate", {
        status: "D",
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
