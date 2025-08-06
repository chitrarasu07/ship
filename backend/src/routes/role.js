const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("Role");
  const permRepo = app.db.getRepository("Permission");

  app.get("/role", async (req, res) => {
    try {
      const { id, code, name, codeOrName, isActive, getCount, getPermissions } =
        req.query;
      const qb = repo.createQueryBuilder("role");
      const dataToSend = {};
      qb.select([
        "role.id",
        "role.code",
        "role.name",
        "role.status",
        "role.landing_page",
      ]);

      qb.where("role.org_id = :orgId", {
        orgId: req.user.orgId,
      });

      if (id) qb.andWhere("role.id = :id", { id });

      if (name) {
        qb.andWhere("LOWER(role.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      }

      if (code) {
        qb.andWhere("LOWER(role.code) LIKE LOWER(:code)", {
          code: `${code.toLowerCase()}%`,
        });
      }

      if (codeOrName) {
        qb.andWhere(
          "(LOWER(role.name) LIKE LOWER(:nameLike) OR LOWER(role.code) LIKE LOWER(:codeLike))",
          {
            nameLike: `%${codeOrName.toLowerCase()}%`,
            codeLike: `${codeOrName.toLowerCase()}%`,
          }
        );
      }

      if (isActive === "false") {
        qb.andWhere("role.status IN (:...status)", {
          status: ["A", "D"],
        });
      } else {
        qb.andWhere("role.status = :status", { status: "A" });
      }

      qb.orderBy("role.name", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      } else if (getPermissions === "true" && id) {
        const permissions = await permRepo.find({
          where: {
            role: { id },
            status: "A",
            organization: { id: req.user.orgId },
          },
        });
        dataToSend.permissions = permissions.map((p) => p.page);
      }

      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const results = await qb.skip(offset).take(limit).getMany();
      console.log({ page, limit, offset, count: dataToSend.total });

      // console.log("DB query", qb.getSql(), req.user.orgId);
      // console.log("results", results);
      dataToSend.roles = results;
      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  app.post("/role", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
        { f: "landing_page", t: "string" },
        { f: "permissions", t: "array" },
      ])
    )
      return;

    try {
      const conn = app.db; // TypeORM DataSource
      const { code, name, permissions, landing_page } = req.body;

      await conn
        .transaction(async (manager) => {
          // Check for duplicate role code
          const existing = await manager.findOne("Role", {
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

          // Create new role
          const roleRepo = manager.getRepository("Role");
          const role = roleRepo.create({
            code,
            name,
            status: "A",
            landing_page,
            created_by: { id: req.user.id },
            organization: { id: req.user.orgId },
          });

          const savedRole = await roleRepo.save(role);

          // Create related permissions if provided
          if (Array.isArray(permissions)) {
            const permRepoTx = manager.getRepository("Permission");
            const permissionEntities = permissions.map((page) =>
              permRepoTx.create({
                page,
                status: "A",
                role: { id: savedRole.id },
                created_by: { id: req.user.id },
                organization: { id: req.user.orgId },
              })
            );
            await permRepoTx.save(permissionEntities);
          }

          // Log audit entry
          await app.logAudit(req, savedRole.id, "roles", "create", {
            code,
            name,
            permissions,
            landing_page,
          });

          res.send({ success: true, id: savedRole.id });
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

  app.put("/role/:id", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "name", t: "string" },
        { f: "permissions", t: "array" },
        { f: "landing_page", t: "string" },
      ])
    )
      return;

    const { id } = req.params;
    const { name, permissions, landing_page } = req.body;
    const conn = app.db;

    try {
      await conn.transaction(async (manager) => {
        // 🧩 Update the role
        await manager.update("Role", { id }, { name, landing_page });

        // 🔎 Fetch existing permissions for this role
        const existing = await manager.find("Permission", {
          where: {
            role: { id },
            organization: { id: req.user.orgId },
          },
        });

        const reqPagesSet = new Set(permissions);
        const existingPagesMap = new Map();

        for (const p of existing) {
          existingPagesMap.set(p.page, p);
        }

        // 🧼 Mark missing ones as D
        for (const oldPerm of existing) {
          if (!reqPagesSet.has(oldPerm.page) && oldPerm.status !== "D") {
            oldPerm.status = "D";
            await manager.save("Permission", oldPerm);
          }
        }

        // 🔄 Upsert permissions
        for (const page of permissions) {
          const match = existingPagesMap.get(page);
          if (!match) {
            // ➕ New permission
            const permRepoTx = manager.getRepository("Permission");
            const newPerm = permRepoTx.create({
              page,
              role: { id },
              organization: { id: req.user.orgId },
              created_by: { id: req.user.id },
              status: "A",
            });
            await permRepoTx.save(newPerm);
          } else if (match.status === "D") {
            // ♻️ Reactivate
            match.status = "A";
            await manager.save("Permission", match);
          }
        }

        await app.logAudit(req, id, "roles", "update", {
          name,
          permissions,
          landing_page,
        });

        res.send({ success: true });
      });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.delete("/role/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      app.logAudit(req, id, "role", "inactivate", {
        status: "D",
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
