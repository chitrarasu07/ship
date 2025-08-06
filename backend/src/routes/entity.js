const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("Entity");

  app.get("/entity", async (req, res) => {
    try {
      const {
        id,
        code,
        name,
        codeOrName,
        isActive,
        getCount,
        category1_id,
        category2_id,
        category3_id,
      } = req.query;

      const qb = repo.createQueryBuilder("entity");
      const dataToSend = {};

      qb.select([
        "entity.id",
        "entity.code",
        "entity.name",
        "entity.status",
        "category1.id",
        "category1.code",
        "category1.name",
        "category2.id",
        "category2.code",
        "category2.name",
        "category3.id",
        "category3.code",
        "category3.name",
      ]);

      qb.where("entity.org_id = :orgId", {
        orgId: req.user.orgId,
      });

      if (id) qb.andWhere("entity.id = :id", { id });

      if (name) {
        qb.andWhere("LOWER(entity.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      }

      if (code) {
        qb.andWhere("LOWER(entity.code) LIKE LOWER(:code)", {
          code: `${code.toLowerCase()}%`,
        });
      }

      if (codeOrName) {
        qb.andWhere(
          "(LOWER(entity.name) LIKE LOWER(:nameLike) OR LOWER(entity.code) LIKE LOWER(:codeLike))",
          {
            nameLike: `%${codeOrName.toLowerCase()}%`,
            codeLike: `${codeOrName.toLowerCase()}%`,
          }
        );
      }

      if (category1_id) {
        qb.andWhere("entity.category1_id = :category1Id", {
          category1Id: category1_id,
        });
      }

      if (category2_id) {
        qb.andWhere("entity.category2_id = :category2Id", {
          category2Id: category2_id,
        });
      }

      if (category3_id) {
        qb.andWhere("entity.category3_id = :category3Id", {
          category2Id: category3_id,
        });
      }

      if (isActive === "false") {
        qb.andWhere("entity.status IN (:...status)", {
          status: ["A", "D"],
        });
      } else {
        qb.andWhere("entity.status = :status", { status: "A" });
      }

      qb.orderBy("entity.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      }

      qb.leftJoin("entity.category1", "category1");
      qb.leftJoin("entity.category2", "category2");
      qb.leftJoin("entity.category3", "category3");
      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const results = await qb.skip(offset).take(limit).getMany();
      console.log({ page, limit, offset, count: dataToSend.total });

      // console.log("DB query", qb.getSql(), req.user.orgId);
      // console.log("results", results);
      dataToSend.entities = results;
      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  app.post("/entity", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "category1_id", t: "number" },
        { f: "category2_id", t: "number" },
        { f: "category3_id", t: "number" },
      ])
    )
      return;

    try {
      const { code, name, comments, category1_id, category2_id, category3_id } =
        req.body;

      // ✅ Check for duplicate code within same org
      const existing = await repo.findOne({
        where: {
          code,
          organization: { id: req.user.orgId },
          status: "A",
        },
      });

      if (existing) {
        return res.code(500).send({
          error: `Code "${code}" already exists.`,
        });
      }

      const payload = repo.create({
        code,
        name,
        comments,
        status: "A",
        created_by: { id: req.user.id },
        organization: { id: req.user.orgId },
        category1: category1_id && { id: category1_id },
        category2: category2_id && { id: category2_id },
        category3: category3_id && { id: category3_id },
      });

      const saved = await repo.save(payload);

      app.logAudit(req, payload.id, "entity", "create", {
        code,
        name,
        comments,
        category1_id,
        category2_id,
        category3_id,
      });

      res.send({ success: true, id: saved.id });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.put("/entity/:id", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "name", t: "string" },
        { f: "category1_id", t: "number" },
        { f: "category2_id", t: "number" },
        { f: "category3_id", t: "number" },
      ])
    )
      return;

    try {
      const { id } = req.params;
      const { name, comments, category1_id, category2_id, category3_id } =
        req.body;

      await repo.update(
        { id },
        {
          name,
          comments,
          category1: category1_id && { id: category1_id },
          category2: category2_id && { id: category2_id },
          category3: category3_id && { id: category3_id },
        }
      );
      app.logAudit(req, id, "entity", "update", {
        name,
        comments,
        category1_id,
        category2_id,
        category3_id,
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.delete("/entity/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      app.logAudit(req, id, "entity", "inactivate", {
        status: "D",
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
