const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("Deck2");

  // GET /deck2
  app.get("/deck2", async (req, res) => {
    try {
      const { id, code, name, type, ip_address, port, stream_url, isActive, getCount , entity_id } =
        req.query;

      const qb = repo.createQueryBuilder("deck2");
      const dataToSend = {};

      qb.select([
        "deck2.id",
        "deck2.code",
        "deck2.name",
        "deck2.type",
        "deck2.location",
        "deck2.status",
        "deck2.ip_address",
        "deck2.port",
        "deck2.stream_url",
        "entity.id",
        "entity.code",
        "entity.name", 
      ]);

      qb.where("deck2.org_id = :orgId", { orgId: req.user.orgId });

      if (id) qb.andWhere("deck2.id = :id", { id });
      if (code)
        qb.andWhere("LOWER(deck2.code) LIKE LOWER(:code)", {
          code: `%${code}%`,
        });
      if (name)
        qb.andWhere("LOWER(deck2.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      if (type)
        qb.andWhere("LOWER(deck2.type) LIKE LOWER(:type)", {
          type: `%${type.toLowerCase()}%`,
        });
      if (ip_address)
        qb.andWhere("deck2.ip_address = :ip_address", { ip_address });
      if (port) qb.andWhere("deck2.port = :port", { port });
      if (stream_url)
        qb.andWhere("LOWER(deck2.stream_url) LIKE LOWER(:stream_url)", {
          stream_url: `%${stream_url.toLowerCase()}%`,
        });
      if (entity_id) {
        qb.andWhere("deck2.entity_id = :entityId", {
          entityId: entity_id,
          });
        }

      if (isActive === "false") {
        qb.andWhere("deck2.status IN (:...status)", { status: ["A", "D"] });
      } else {
        qb.andWhere("deck2.status = :status", { status: "A" });
      }

      qb.orderBy("deck2.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      }
      qb.leftJoin("deck2.entity", "entity");
      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const results = await qb.skip(offset).take(limit).getMany();
      dataToSend.deck2 = results;

      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  // POST /deck2
  app.post("/deck2", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "type", t: "string" },
        { f: "location", t: "string" },
        { f: "ip_address", t: "string" },
        { f: "port", t: "string" },
        { f: "stream_url", t: "string" },
        // { f: "entity_id", t: "number" },
      ])
    )
      return;

    try {
      const { code, name, type, location, ip_address, port, stream_url , description, entity_id } =
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
          error: `Deck2 with code "${code}" already exists.`,
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

      await app.logAudit(req, payload.id, "deck2", "create", {
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
    }
  });

  // PUT /deck2/:id
  app.put("/deck2/:id", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "type", t: "string" },
        { f: "location", t: "string" },
        { f: "ip_address", t: "string" },
        { f: "port", t: "string" },
        { f: "stream_url", t: "string" },
        { f: "entity_id", t: "number" },
      ])
    )
      return;

    const { id } = req.params;
    const { code, name, type, location, ip_address, port, stream_url ,entity_id, description } =
      req.body;

    try {
      await repo.update(
        { id },
        { code, name, type, location, ip_address, port, stream_url, description, entity: { id: entity_id } }
      );

      await app.logAudit(req, id, "deck2", "update", {
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

      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  // DELETE /deck2/:id for Soft Delete
  app.delete("/deck2/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      await app.logAudit(req, id, "deck2", "inactivate", { status: "D" });

      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
