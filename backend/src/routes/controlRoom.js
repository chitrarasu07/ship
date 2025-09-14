const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("ControlRoom");

  // GET /controlroom
  app.get("/controlroom", async (req, res) => {
    try {
      const { id, code, name, type, ip_address, port, stream_url, isActive, getCount, entity_id } =
        req.query;

      const qb = repo.createQueryBuilder("controlroom");
      const dataToSend = {};

      qb.select([
        "controlroom.id",
        "controlroom.code",
        "controlroom.name",
        "controlroom.type",
        "controlroom.location",
        "controlroom.status",
        "controlroom.ip_address",
        "controlroom.port",
        "controlroom.stream_url",
        "entity.id",
        "entity.code",
        "entity.name",
      ]);

      qb.where("controlroom.org_id = :orgId", { orgId: req.user.orgId });

      if (id) qb.andWhere("controlroom.id = :id", { id });
      if (code)
        qb.andWhere("LOWER(controlroom.code) LIKE LOWER(:code)", {
          code: `%${code.toLowerCase()}%`,
        });
      if (name)
        qb.andWhere("LOWER(controlroom.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      if (type)
        qb.andWhere("LOWER(controlroom.type) LIKE LOWER(:type)", {
          type: `%${type.toLowerCase()}%`,
        });
      if (ip_address)
        qb.andWhere("controlroom.ip_address = :ip_address", { ip_address });
      if (port) qb.andWhere("controlroom.port = :port", { port });
      if (stream_url)
        qb.andWhere("LOWER(controlroom.stream_url) LIKE LOWER(:stream_url)", {
          stream_url: `%${stream_url.toLowerCase()}%`,
        });
      if (entity_id) {
        qb.andWhere("controlroom.entity_id = :entityId", {
          entityId: entity_id,
        });
      }

      if (isActive === "false") {
        qb.andWhere("controlroom.status IN (:...status)", { status: ["A", "D"] });
      } else {
        qb.andWhere("controlroom.status = :status", { status: "A" });
      }

      qb.orderBy("controlroom.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      }
      qb.leftJoin("controlroom.entity", "entity");
      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const results = await qb.skip(offset).take(limit).getMany();
      dataToSend.controlroom = results;

      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  // POST /controlroom
  app.post("/controlroom", async (req, res) => {
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
      const {
        code,
        name,
        type,
        location,
        ip_address,
        port,
        stream_url,
        description,
        entity_id,
      } = req.body;

      const existing = await repo.findOne({
        where: {
          code,
          organization: { id: req.user.orgId },
          status: "A",
        },
      });

      if (existing) {
        return res.code(500).send({
          error: `ControlRoom with code "${code}" already exists.`,
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

      await app.logAudit(req, payload.id, "controlroom", "create", {
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

  // PUT /controlroom/:id
  app.put("/controlroom/:id", async (req, res) => {
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

      await app.logAudit(req, id, "controlroom", "update", {
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

  // DELETE /controlroom/:id for Soft Delete
  app.delete("/controlroom/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      await app.logAudit(req, id, "controlroom", "inactivate", { status: "D" });

      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
