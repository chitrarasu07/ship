const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("ReferenceMaster");
  const refValueRepo = app.db.getRepository("ReferenceValue");

  app.get("/reference-master", async (req, res) => {
    try {
      const {
        id,
        code,
        name,
        codeOrName,
        isActive,
        getCount,
        getRefValues,
        entity_id,
      } = req.query;
      const qb = repo.createQueryBuilder("reference_master");
      const dataToSend = {};
      qb.select([
        "reference_master.id",
        "reference_master.code",
        "reference_master.name",
        "reference_master.status",
        "reference_master.description",
        "entity.id",
        "entity.code",
        "entity.name",
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

      if (entity_id) {
        qb.andWhere("entitySection.entity_id = :entityId", {
          entityId: entity_id,
        });
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

      qb.leftJoin("reference_master.entity", "entity");

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
        { f: "entity_id", t: "number" },
      ])
    )
      return;

    try {
      const conn = app.db; // TypeORM DataSource
      const { code, name, referenceValues, description, entity_id } = req.body;

      // Check for duplicate reference_master code
      const existing = await repo.findOne("ReferenceMaster", {
        where: {
          code,
          organization: { id: req.user.orgId },
          status: "A",
        },
      });

      if (existing) {
        return res.code(400).send({ error: `Code "${code}" already exists.` });
      }

      // Create new reference_master
      // const refMasterRepo = manager.getRepository("ReferenceMaster");
      // const reference_master = refMasterRepo.create({
      //   code,
      //   name,
      //   status: "A",
      //   description,
      //   created_by: { id: req.user.id },
      //   organization: { id: req.user.orgId },
      // });

      // const savedRefMaster = await refMasterRepo.save(reference_master);

      const payload = repo.create({
        code,
        name,
        comments,
        status: "A",
        cameras_installed,
        created_by: { id: req.user.id },
        organization: { id: req.user.orgId },
        entity: { id: entity_id },
      });

      const saved = await repo.save(payload);

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
      app.logAudit(req, payload.id, "reference_masters", "create", {
        code,
        name,
        description,
        entity_id,
        referenceValues,
      });

      res.send({ success: true, id: saved.id });
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
        { f: "entity_id", t: "number" },
      ])
    )
      return;

    try {
      const { id } = req.params;
      const { name, referenceValues, description, entity_id } = req.body;
        // Update parent reference_master fields
        await repo.update({ id }, { name, description , entity: { id: entity_id } });

        // Handle child referenceValues entities
        const refValueRepo = app.db.getRepository("ReferenceValue");

        // 🔎 Fetch existing referenceValues for this reference_master
        const existingReferenceValues = await refValueRepo.find( {
          where: {
            status: "A",
            reference_master: { id },
            organization: { id: req.user.orgId },
          },
        });

      // Map existing data by ID for easy lookups
    const existingMap = new Map(existingReferenceValues.map(rv => [rv.id, rv]));

    // IDs present in incoming payload
    const incomingIds = referenceValues.map(rv => rv.id).filter(Boolean);

       // 3. Update existing or add new reference values
    for (const rv of referenceValues) {
      if (rv.id && existingMap.has(rv.id)) {
        // Update existing record
        const existing = existingMap.get(rv.id);
        existing.code = rv.code;
        existing.name = rv.name;
        existing.isActive = rv.isActive;
        existing.description = rv.description;
        existing.relatedValue = rv.relatedValue;
        existing.sortOrder = rv.sortOrder;

        await refValueRepo.save(existing);
      } else {
        // Add new record
        const newRefValue = refValueRepo.create({
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
        await refValueRepo.save(newRefValue);
      }
    }

    // 4. Soft-delete reference values not included in the update payload
    for (const oldRef of existingReferenceValues) {
      if (!incomingIds.includes(oldRef.id)) {
        oldRef.status = "D";
        await refValueRepo.save(oldRef);
      }
    }

        app.logAudit(req, id, "reference_masters", "update", {
          name,
          referenceValues,
          description,
          entity_id,
        });

        res.send({ success: true });
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
