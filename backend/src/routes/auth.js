const bcrypt = require("bcrypt");

async function authRoutes(app, opts) {
  const userRepo = app.db.getRepository("User");
  const orgRepo = app.db.getRepository("Organization");

  app.post("/login", async (req, reply) => {
    try {
      const { emailid, password, org_id } = req.body;

      if (!emailid || !password) {
        return reply
          .code(400)
          .send({ error: "Email ID and password are required" });
      }

      // Determine organization
      let org;
      if (org_id) {
        org = await orgRepo.findOne({
          where: { id: org_id, status: "A" },
        });
      } else {
        org = await orgRepo.findOne({
          where: { code: "DEFAULT_ORG", status: "A" },
        });
      }

      if (!org) {
        return reply.code(400).send({ error: "Invalid organization" });
      }

      // Find user
      const user = await userRepo.findOne({
        where: {
          emailid,
          status: "A",
          organization: { id: org.id },
        },
        relations: ["organization", "role"],
      });

      if (!user) return reply.code(401).send({ error: "Invalid credentials" });

      if (user.is_locked)
        return reply.code(401).send({
          error: "Your user account is locked. Please contact administrator",
        });

      if (!(await bcrypt.compare(password, user.password_hash))) {
        user.wrong_password_cnt = user.wrong_password_cnt || 0;
        let error = "";
        if (user.wrong_password_cnt > 5) {
          user.is_locked = true;
          error =
            "Your user account is locked now. Please contact administrator";
        } else {
          user.wrong_password_cnt++;
          error = "Invalid credentials";
        }

        await userRepo.save(user);
        return reply.code(401).send({ error });
      }

      // Sign token using @fastify/jwt
      const token = app.jwt.sign({
        id: user.id,
        code: user.code,
        name: user.name,
        emailid: user.emailid,
        roleId: user.role.id,
        orgId: org.id,
      });
      app.activityCache.set(user.id, true);
      return reply.send({ token });
    } catch (err) {
      app.log.error(err);
      return reply.code(400).send({ error: "Login failed" });
    }
  });
}

module.exports = authRoutes;
