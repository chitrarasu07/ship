const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("EntitySection");

  app.get("/entity-section", async (req, res) => {
    try {
      const { id, code, name, codeOrName, isActive, getCount, entity_id } =
        req.query;

      const qb = repo.createQueryBuilder("entitySection");
      const dataToSend = {};

      qb.select([
        "entitySection.id",
        "entitySection.code",
        "entitySection.name",
        "entitySection.status",
        "entity.id",
        "entity.code",
        "entity.name",
      ]);

      qb.where("entitySection.org_id = :orgId", {
        orgId: req.user.orgId,
      });

      if (id) qb.andWhere("entitySection.id = :id", { id });

      if (name) {
        qb.andWhere("LOWER(entitySection.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      }

      if (code) {
        qb.andWhere("LOWER(entitySection.code) LIKE LOWER(:code)", {
          code: `${code.toLowerCase()}%`,
        });
      }

      if (codeOrName) {
        qb.andWhere(
          "(LOWER(entitySection.name) LIKE LOWER(:nameLike) OR LOWER(entitySection.code) LIKE LOWER(:codeLike))",
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
        qb.andWhere("entitySection.status IN (:...status)", {
          status: ["A", "D"],
        });
      } else {
        qb.andWhere("entitySection.status = :status", { status: "A" });
      }

      qb.orderBy("entitySection.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      }

      qb.leftJoin("entitySection.entity", "entity");
      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const results = await qb.skip(offset).take(limit).getMany();
      console.log({ page, limit, offset, count: dataToSend.total });

      console.log("DB query", qb.getSql(), req.user.orgId);
      // console.log("results", results);
      dataToSend.entitySections = results;
      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  app.post("/entity-section", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "entity_id", t: "number" },
      ])
    )
      return;

    try {
      const { code, name, comments, entity_id } = req.body;

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
        entity: { id: entity_id },
      });

      const saved = await repo.save(payload);

      app.logAudit(req, payload.id, "entity-section", "create", {
        code,
        name,
        comments,
        entity_id,
      });

      res.send({ success: true, id: saved.id });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.put("/entity-section/:id", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "name", t: "string" },
        { f: "entity_id", t: "number" },
      ])
    )
      return;

    try {
      const { id } = req.params;
      const { name, comments, entity_id } = req.body;

      await repo.update(
        { id },
        {
          name,
          comments,
          entity: { id: entity_id },
        }
      );
      app.logAudit(req, id, "entity-section", "update", {
        name,
        comments,
        entity_id,
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.delete("/entity-section/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      app.logAudit(req, id, "entity-section", "inactivate", {
        status: "D",
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
