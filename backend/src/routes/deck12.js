const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("Deck12");

  // GET /deck12
  app.get("/deck12", async (req, res) => {
    try {
      const { id, code, name, type, ip_address, port, stream_url, isActive, getCount , entity_id} =
        req.query;

      const qb = repo.createQueryBuilder("deck12");
      const dataToSend = {};

      qb.select([
        "deck12.id",
        "deck12.code",
        "deck12.name",
        "deck12.type",
        "deck12.location",
        "deck12.status",
        "deck12.ip_address",
        "deck12.port",
        "deck12.stream_url",
        "entity.id",
        "entity.code",
        "entity.name",  
      ]);

      qb.where("deck12.org_id = :orgId", { orgId: req.user.orgId });

      if (id) qb.andWhere("deck12.id = :id", { id });
      if (code)
        qb.andWhere("LOWER(deck12.code) LIKE LOWER(:code)", {
          code: `%${code}%`,
        });
      if (name)
        qb.andWhere("LOWER(deck12.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      if (type)
        qb.andWhere("LOWER(deck12.type) LIKE LOWER(:type)", {
          type: `%${type.toLowerCase()}%`,
        });
      if (ip_address)
        qb.andWhere("deck12.ip_address = :ip_address", { ip_address });
      if (port) qb.andWhere("deck12.port = :port", { port });
      if (stream_url)
        qb.andWhere("LOWER(deck12.stream_url) LIKE LOWER(:stream_url)", {
          stream_url: `%${stream_url.toLowerCase()}%`,
        });

      if (entity_id) {
        qb.andWhere("deck12.entity_id = :entityId", {
          entityId: entity_id,
        });
      } 

      if (isActive === "false") {
        qb.andWhere("deck12.status IN (:...status)", { status: ["A", "D"] });
      } else {
        qb.andWhere("deck12.status = :status", { status: "A" });
      }

      qb.orderBy("deck12.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      }
      qb.leftJoin("deck12.entity", "entity");
      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const results = await qb.skip(offset).take(limit).getMany();
      dataToSend.deck12 = results;

      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  // POST /deck12
  app.post("/deck12", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "ip_address", t: "string" },
        { f: "stream_url", t: "string" },
      ])
    )
      return;

    try {
      const { code, name, type, location, ip_address, port, stream_url, description , entity_id } =
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
          error: `Deck12 with code "${code}" already exists.`,
        });
      }

      const payload = repo.create({
        code,
        name,
        type,
        location,
        ip_address,
        port,
        stream_url,
        description,
        status: "A",
        created_by: { id: req.user.id },
        organization: { id: req.user.orgId },
        entity: { id: entity_id },
      });

      const saved = await repo.save(payload);

      await app.logAudit(req, payload.id, "deck12", "create", {
        code,
        name,
        type,
        location,
        ip_address,
        port,
        stream_url,
        entity_id,
        description,
      });

      res.send({ success: true, id: saved.id });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
      console.log(err);
    }
  });

  // PUT /deck12/:id
  app.put("/deck12/:id", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "ip_address", t: "string" },
        { f: "stream_url", t: "string" },
        { f: "entity_id", t: "number" },
      ])
    )
      return;

    const { id } = req.params;
    const { code, name, type, location, ip_address, port, stream_url, entity_id, description } =
      req.body;

    try {
      await repo.update(
        { id },
        { code, name, type, location, ip_address, port, stream_url, entity: { id: entity_id }, description }
      );

      await app.logAudit(req, id, "deck12", "update", {
        code,
        name,
        type,
        location,
        ip_address,
        port,
        stream_url,
        description,
        entity_id,
      });

      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  // DELETE /deck12/:id for Soft Delete
  app.delete("/deck12/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      await app.logAudit(req, id, "deck12", "inactivate", { status: "D" });

      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
