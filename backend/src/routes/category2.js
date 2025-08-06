const { validateRequiredFields } = require("../utils/appUtils");

module.exports = async function (app) {
  const repo = app.db.getRepository("Category2");

  app.get("/category2", async (req, res) => {
    try {
      const { id, code, name, codeOrName, isActive, getCount, category1_id } =
        req.query;

      const qb = repo.createQueryBuilder("category");
      const dataToSend = {};

      qb.select([
        "category.id",
        "category.code",
        "category.name",
        "category.sortOrder",
        "category.status",
        "category1.id",
        "category1.code",
        "category1.name",
      ]);

      qb.where("category.org_id = :orgId", {
        orgId: req.user.orgId,
      });

      if (id) qb.andWhere("category.id = :id", { id });

      if (name) {
        qb.andWhere("LOWER(category.name) LIKE LOWER(:name)", {
          name: `%${name.toLowerCase()}%`,
        });
      }

      if (code) {
        qb.andWhere("LOWER(category.code) LIKE LOWER(:code)", {
          code: `${code.toLowerCase()}%`,
        });
      }

      if (codeOrName) {
        qb.andWhere(
          "(LOWER(category.name) LIKE LOWER(:nameLike) OR LOWER(category.code) LIKE LOWER(:codeLike))",
          {
            nameLike: `%${codeOrName.toLowerCase()}%`,
            codeLike: `${codeOrName.toLowerCase()}%`,
          }
        );
      }

      if (category1_id) {
        qb.andWhere("category.category1_id = :category1Id", {
          category1Id: category1_id,
        });
      }

      if (isActive === "false") {
        qb.andWhere("category.status IN (:...status)", {
          status: ["A", "D"],
        });
      } else {
        qb.andWhere("category.status = :status", { status: "A" });
      }

      qb.orderBy("category.sortOrder", "ASC");

      if (getCount === "true") {
        const count = await qb.clone().getCount();
        dataToSend.total = count;
      }

      qb.leftJoin("category.category1", "category1");
      const page = parseInt(req.query.pageNo) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const results = await qb.skip(offset).take(limit).getMany();
      console.log({ page, limit, offset, count: dataToSend.total });

      // console.log("DB query", qb.getSql(), req.user.orgId);
      // console.log("results", results);
      dataToSend.categories2 = results;
      return res.send(dataToSend);
    } catch (err) {
      app.log.error(err);
      return res.code(500).send({ error: "Internal server error" });
    }
  });

  app.post("/category2", async (req, res) => {
    if (
      !validateRequiredFields(req, res, [
        { f: "code", t: "string" },
        { f: "name", t: "string" },
      ])
    )
      return;

    try {
      const { code, name, sortOrder, category1_id } = req.body;

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
        status: "A",
        sortOrder: sortOrder || 99,
        created_by: { id: req.user.id },
        organization: { id: req.user.orgId },
        category1: category1_id && { id: category1_id },
      });

      const saved = await repo.save(payload);

      app.logAudit(req, payload.id, "category2", "create", {
        code,
        name,
        sortOrder,
        category1_id,
      });

      res.send({ success: true, id: saved.id });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.put("/category2/:id", async (req, res) => {
    if (!validateRequiredFields(req, res, [{ f: "name", t: "string" }])) return;

    try {
      const { id } = req.params;
      const { name, sortOrder, category1_id } = req.body;

      await repo.update(
        { id },
        {
          name,
          sortOrder,
          category1: category1_id && { id: category1_id },
        }
      );
      app.logAudit(req, id, "category2", "update", {
        name,
        sortOrder,
        category1_id,
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });

  app.delete("/category2/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await repo.update({ id }, { status: "D" });

      app.logAudit(req, id, "category2", "inactivate", {
        status: "D",
      });
      res.send({ success: true });
    } catch (err) {
      app.log.error(err);
      res.code(500).send({ error: "Internal error" });
    }
  });
};
