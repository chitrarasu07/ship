const permissionData = require("../../user-permissions");

module.exports = async function (app) {
  const Role = app.db.getRepository("Role");
  const Permission = app.db.getRepository("Permission");

  app.get("/no-guards/all-roles", async (req, reply) => {
    return reply.send({ allRoles: permissionData });
  });

  app.get("/no-guards/my-roles", async (req, reply) => {
    const { roleId, orgId } = req.user;
    const { getAvailableRoles } = req.query;

    if (!roleId || !orgId)
      return reply.code(403).send({ error: "Role is not mapped" });

    const [role, permissions] = await Promise.all([
      Role.findOne({
        where: {
          id: roleId,
          status: "A",
          organization: { id: orgId },
        },
        relations: ["organization"],
      }),
      Permission.find({
        where: {
          status: "A",
          role: { id: roleId },
          organization: { id: orgId },
        },
      }),
    ]);

    if (!role) return reply.code(403).send({ error: "Role not found" });

    const { name, landing_page } = role;
    const pages = (permissions || []).map((perm) => perm.page) || [];
    return reply.send({
      role: { name, landing_page, pages },
      organization: role.organization,
      allAvailableRoles: getAvailableRoles ? permissionData : undefined,
    });
  });

  function getInjectParam(req, url) {
    return {
      url,
      method: "GET",
      query: req.query,
      headers: {
        ...req.headers,
        "x-internal-call": "1", // custom flag
      },
    };
  }

  app.get("/no-guards/category1", async (req, reply) => {
    const injectRes = await app.inject(getInjectParam(req, "/api/category1"));
    return reply.code(injectRes.statusCode).send(injectRes.json());
  });

  app.get("/no-guards/category2", async (req, reply) => {
    const injectRes = await app.inject(getInjectParam(req, "/api/category2"));
    return reply.code(injectRes.statusCode).send(injectRes.json());
  });

  app.get("/no-guards/category3", async (req, reply) => {
    const injectRes = await app.inject(getInjectParam(req, "/api/category3"));
    return reply.code(injectRes.statusCode).send(injectRes.json());
  });

  app.get("/no-guards/entity", async (req, reply) => {
    const injectRes = await app.inject(getInjectParam(req, "/api/entity"));
    return reply.code(injectRes.statusCode).send(injectRes.json());
  });
};
