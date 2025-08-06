require("dotenv").config();

const Fastify = require("fastify");
const fastifyJWT = require("@fastify/jwt");
const fastifyFormbody = require("@fastify/formbody");

const logger = require("./src/logger");
const AppDataSource = require("./src/dataSource");
const { runInitialSetup } = require("./src/initialSetup");
const { logAudit, hasPermission } = require("./src/utils/appUtils");
const { USER_INACTIVITY_TIMEOUT } = require("./src/appContant");
const SlidingExpireCache = require("./src/utils/slidingExpireCache");

const app = Fastify({
  logger: false, // disable internal pino config
  loggerInstance: logger, // use custom instance with rotating file
});
const PORT = process.env.BACKEND_PORT || 3001;

if (process.env.NODE_ENV === "development") {
  const fastifyCors = require("@fastify/cors");
  app.register(fastifyCors, { origin: true });
}

app.register(fastifyJWT, {
  secret: process.env.JWT_SECRET,
  sign: {
    expiresIn: "12h",
  },
});
app.register(fastifyFormbody);

const start = async () => {
  try {
    await AppDataSource.initialize();
    app.decorate("db", AppDataSource);
    await runInitialSetup(app);

    app.register(require("./src/routes"), {
      prefix: "/api",
    });

    await app.listen({ port: PORT });
    console.log("✅ Backend Server running on http://localhost:" + PORT);
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
};

start();

app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
    if (!app.activityCache.get(request.user.id)) {
      reply.code(401).send({ error: "Session expired" });
    }
  } catch (err) {
    reply.code(401).send({ error: "Unauthorized" });
  }
});

app.decorate("hasPermission", async function (request, reply) {
  // If this request was triggered internally, skip permission checks
  if (request.headers["x-internal-call"] === "1") {
    return true;
  }

  try {
    // Extract permission name from path
    const cleanUrl = request.url?.split("?")[0];
    const match = cleanUrl?.match(/^\/api\/([^\/]+)/);
    const page = match?.[1];
    if (!page) {
      return reply.code(400).send({ error: "Invalid route" });
    }

    const { orgId, roleId } = request.user;
    const allowed = await hasPermission(app, orgId, roleId, page);
    if (!allowed) {
      return reply.code(403).send({ error: "Access denied" });
    }
  } catch (err) {
    app.log.error(err);
    reply.code(403).send({ error: "Access denied" });
  }
});

app.decorate(
  "logAudit",
  async function (req, tableId, tableName, action, details) {
    const { orgId, id } = req.user;
    logAudit(app, id, orgId, tableId, tableName, action, details);
  }
);

app.addHook("onRequest", async (request, reply) => {
  console.log("Incoming request", request.method, request.url);
  const publicRoutes = ["/api/login"];
  if (publicRoutes.includes(request.url)) return;
  await app.authenticate(request, reply);
  await app.hasPermission(request, reply);
});

const activityCache = new SlidingExpireCache(USER_INACTIVITY_TIMEOUT);
app.decorate("activityCache", activityCache);
