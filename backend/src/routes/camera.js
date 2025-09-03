const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("Camera");

  // GET /camera
  app.get("/camera", async (req, res) => {
    try {
      const { id, code, name, type, ip_address, port, isActive, getCount } = req.query;

      const qb = repo.createQueryBuilder("camera");
      const dataToSend = {};

      qb.select([
        "camera.id",
        "camera.code",
        "camera.name",
        "camera.type",
        "camera.location",
        "camera.status",
        "camera.ip_address",
        "camera.port",
      ]);

      qb.where("camera.org_id = :orgId", { orgId: req.user.orgId });

      if (id) qb.andWhere("camera.id = :id", { id });
      if (code) qb.andWhere("LOWER(camera.code) LIKE LOWER(:code)", { code: `%${code}%` });
      if (name) qb.andWhere("LOWER(camera.name) LIKE LOWER(:name)", { name: `%${name.toLowerCase()}%` });
      if (type) qb.andWhere("LOWER(camera.type) LIKE LOWER(:type)", { type: `%${type.toLowerCase()}%` });
      if (ip_address) qb.andWhere("camera.ip_address = :ip_address", { ip_address });
      if (port) qb.andWhere("camera.port = :port", { port });

      if (isActive === "false") {
        qb.andWhere("camera.status IN (:...status)", { status: ["A", "D"] });
      } else {
        qb.andWhere("camera.status = :status", { status: "A" });
      }

      qb.orderBy("camera.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      }

      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const results = await qb.skip(offset).take(limit).getMany();
      dataToSend.cameras = results;

      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  // POST /camera
  app.post("/camera", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "type", t: "string" },
        { f: "location", t: "string" },
        { f: "ip_address", t: "string" },
        { f: "port", t: "string" },
      ])
    )
      return;

    try {
      const { code, name, type, location, ip_address, port, description } = req.body;

      const existing = await repo.findOne({
        where: {
          code,
          organization: { id: req.user.orgId },
          status: "A",
        },
      });

      if (existing) {
        return res.code(500).send({
          error: `Camera with code "${code}" already exists.`,
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
      });

      const saved = await repo.save(payload);

      await app.logAudit(req, payload.id, "camera", "create", {
        code,
        name,
        type,
        location,
        ip_address,
        port,
        description,
      });

      res.send({ success: true, id: saved.id });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  // PUT /camera/:id
  app.put("/camera/:id", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "type", t: "string" },
        { f: "location", t: "string" },
        { f: "ip_address", t: "string" },
        { f: "port", t: "string" },
      ])
    )
      return;

    const { id } = req.params;
    const { code, name, type, location, ip_address, port, description } = req.body;

    try {
      await repo.update(
        { id },
        { code, name, type, location, ip_address, port, description }
      );

      await app.logAudit(req, id, "camera", "update", {
        code,
        name,
        type,
        location,
        ip_address,
        port,
        description,
      });

      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  // DELETE /camera/:id for Soft Delete
  app.delete("/camera/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      await app.logAudit(req, id, "camera", "inactivate", { status: "D" });

      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
