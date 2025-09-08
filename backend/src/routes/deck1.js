const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("Deck1");

  // GET /deck1
  app.get("/deck1", async (req, res) => {
    try {
      const { id, code, name, type, ip_address, port, isActive, getCount , entity_id} =
        req.query;

      const qb = repo.createQueryBuilder("deck1");
      const dataToSend = {};

      qb.select([
        "deck1.id",
        "deck1.code",
        "deck1.name",
        "deck1.type",
        "deck1.location",
        "deck1.status",
        "deck1.ip_address",
        "deck1.port",
        "entity.id",
        "entity.code",
        "entity.name",  
      ]);

      qb.where("deck1.org_id = :orgId", { orgId: req.user.orgId });

      if (id) qb.andWhere("deck1.id = :id", { id });
      if (code)
        qb.andWhere("LOWER(deck1.code) LIKE LOWER(:code)", {
          code: `%${code}%`,
        });
      if (name)
        qb.andWhere("LOWER(deck1.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      if (type)
        qb.andWhere("LOWER(deck1.type) LIKE LOWER(:type)", {
          type: `%${type.toLowerCase()}%`,
        });
      if (ip_address)
        qb.andWhere("deck1.ip_address = :ip_address", { ip_address });
      if (port) qb.andWhere("deck1.port = :port", { port });

      if (entity_id) {
        qb.andWhere("deck1.entity_id = :entityId", {
          entityId: entity_id,
        });
      } 

      if (isActive === "false") {
        qb.andWhere("deck1.status IN (:...status)", { status: ["A", "D"] });
      } else {
        qb.andWhere("deck1.status = :status", { status: "A" });
      }

      qb.orderBy("deck1.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      }
      qb.leftJoin("deck1.entity", "entity");
      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const results = await qb.skip(offset).take(limit).getMany();
      dataToSend.deck1 = results;

      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  // POST /deck1
  app.post("/deck1", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "type", t: "string" },
        { f: "location", t: "string" },
        { f: "ip_address", t: "string" },
        { f: "port", t: "string" },
        { f: "entity_id", t: "number" },
      ])
    )
      return;

    try {
      const { code, name, type, location, ip_address, port, description , entity_id } =
        req.body;

      const existing = await repo.findOne({
        where: {
          code,
          organization: { id: req.user.orgId },
          status: "A",
        },
      });

      if (existing) {
        return res.code(500).send({
          error: `Deck1 with code "${code}" already exists.`,
        });
      }

      const payload = repo.create({
        code,
        name,
        type,
        location,
        ip_address,
        port,
        description,
        status: "A",
        created_by: { id: req.user.id },
        organization: { id: req.user.orgId },
        entity: { id: entity_id },
      });

      const saved = await repo.save(payload);

      await app.logAudit(req, payload.id, "deck1", "create", {
        code,
        name,
        type,
        location,
        ip_address,
        port,
        entity_id,
        description,
      });

      res.send({ success: true, id: saved.id });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  // PUT /deck1/:id
  app.put("/deck1/:id", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "type", t: "string" },
        { f: "location", t: "string" },
        { f: "ip_address", t: "string" },
        { f: "port", t: "string" },
        { f: "entity_id", t: "number" },
      ])
    )
      return;

    const { id } = req.params;
    const { code, name, type, location, ip_address, port, description, entity_id } =
      req.body;

    try {
      await repo.update(
        { id },
        { code, name, type, location, ip_address, port, description , entity: { id: entity_id } }
      );

      await app.logAudit(req, id, "deck1", "update", {
        code,
        name,
        type,
        location,
        ip_address,
        port,
        description,
        entity_id,
      });

      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  // DELETE /deck1/:id for Soft Delete
  app.delete("/deck1/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      await app.logAudit(req, id, "deck1", "inactivate", { status: "D" });

      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
