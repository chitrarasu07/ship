const {
  validateRequiredFields,
  getDefaultPassword,
} = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("User");
  const entityRepo = app.db.getRepository("Entity");

  app.get("/user", async (req, res) => {
    try {
      const { id, code, name, codeOrName, isActive, getCount, emailid } =
        req.query;

      const qb = repo.createQueryBuilder("user");
      const dataToSend = {};

      qb.select([
        "user.id",
        "user.code",
        "user.name",
        "user.emailid",
        "user.status",
        "user.is_all_entity_access",
        "role.id",
        "role.code",
        "role.name",
      ]);

      qb.where("user.org_id = :orgId", {
        orgId: req.user.orgId,
      });

      if (id) qb.andWhere("user.id = :id", { id });

      if (emailid) {
        qb.andWhere("LOWER(user.emailid) LIKE LOWER(:emailid)", {
          emailid: `%${emailid.toLowerCase()}%`,
        });
      }

      if (name) {
        qb.andWhere("LOWER(user.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      }

      if (code) {
        qb.andWhere("LOWER(user.code) LIKE LOWER(:code)", {
          code: `${code.toLowerCase()}%`,
        });
      }

      if (codeOrName) {
        qb.andWhere(
          "(LOWER(user.name) LIKE LOWER(:nameLike) OR LOWER(user.code) LIKE LOWER(:codeLike))",
          {
            nameLike: `%${codeOrName.toLowerCase()}%`,
            codeLike: `${codeOrName.toLowerCase()}%`,
          }
        );
      }

      if (isActive === "false") {
        qb.andWhere("user.status IN (:...status)", {
          status: ["A", "D"],
        });
      } else {
        qb.andWhere("user.status = :status", { status: "A" });
      }

      qb.orderBy("user.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      }

      qb.leftJoin("user.role", "role");
      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const results = await qb.skip(offset).take(limit).getMany();
      console.log({ page, limit, offset, count: dataToSend.total });

      // console.log("DB query", qb.getSql(), req.user.orgId);
      // console.log("results", results);
      dataToSend.users = results;
      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  app.post("/user", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "emailid", t: "string" },
        { f: "role_id", t: "number" },
      ])
    )
      return;

    try {
      const { code, name, emailid, role_id, is_all_entity_access, entityIds } =
        req.body;

      // ✅ Check for duplicate code within same org
      let existing = await repo.findOne({
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

      existing = await repo.findOne({
        where: {
          emailid,
          organization: { id: req.user.orgId },
          status: "A",
        },
      });

      if (existing) {
        return res.code(500).send({
          error: `Emailid "${emailid}" already exists.`,
        });
      }
      let user_entities = [];
      if (!is_all_entity_access && entityIds?.length)
        user_entities = entityIds.map((eid) => entityRepo.create({ id: eid }));

      const password_hash = await getDefaultPassword();
      const payload = repo.create({
        code,
        name,
        emailid,
        status: "A",
        password_hash,
        user_entities,
        is_all_entity_access,
        created_by: { id: req.user.id },
        organization: { id: req.user.orgId },
        role: { id: role_id },
      });

      const saved = await repo.save(payload);
      app.logAudit(req, payload.id, "user", "create", {
        code,
        name,
        emailid,
        role_id,
        entityIds,
        is_all_entity_access,
      });

      res.send({ success: true, id: saved.id });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.put("/user/:id", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "name", t: "string" },
        { f: "emailid", t: "string" },
        { f: "role_id", t: "number" },
      ])
    )
      return;

    try {
      const { id } = req.params;
      const { name, emailid, role_id, is_all_entity_access, entityIds } =
        req.body;
      let user_entities = [];
      if (!is_all_entity_access && entityIds?.length)
        user_entities = entityIds.map((eid) => entityRepo.create({ id: eid }));

      const user = await repo.findOne({
        where: { id },
        relations: ["user_entities"], // include relation so it's loaded
      });

      if (!user) return res.code(404).send({ error: "User not found" });

      user.name = name;
      user.emailid = emailid;
      user.role = { id: role_id };
      user.user_entities = user_entities;
      user.is_all_entity_access = is_all_entity_access;
      await repo.save(user);

      app.logAudit(req, id, "user", "update", {
        name,
        emailid,
        role_id,
        entityIds,
        is_all_entity_access,
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.delete("/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      app.logAudit(req, id, "user", "inactivate", {
        status: "D",
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.put("/users/:id/reset-password", async (req, res) => {
    const { id } = req.params;

    try {
      const user = await repo.findOne({
        where: { id },
        organization: { id: req.user.orgId },
        status: "A",
      });

      if (!user) {
        return res.code(404).send({ error: "User not found or inactive." });
      }

      user.password_hash = await getDefaultPassword();
      user.wrong_password_cnt = 0;
      user.is_locked = false;
      await repo.save(user);
      await app.logAudit(req, id, "users", "reset-password");
      return res.send({ success: true, message: "Password has been reset." });
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });
};
