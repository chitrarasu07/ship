const userRoutes = require("./user");
const authRoutes = require("./auth");
const roleRoutes = require("./role");
const entityRoutes = require("./entity");
const noGuardsRoutes = require("./no-guards");
const category1Routes = require("./category1");
const category2Routes = require("./category2");
const category3Routes = require("./category3");
const notificationRoutes = require("./notification");
const entitySectionRoutes = require("./entity-section");
const referenceMasterRoutes = require("./reference-master");
const cameraRouters = require("./camera");
const deck1Routes = require("./deck1");
const deck2Routes = require("./deck2");
const deck3Routes = require("./deck3");

async function routes(app, opts) {
  await app.register(authRoutes);
  await app.register(userRoutes);
  await app.register(roleRoutes);
  await app.register(entityRoutes);
  await app.register(noGuardsRoutes);
  await app.register(category1Routes);
  await app.register(category2Routes);
  await app.register(category3Routes);
  await app.register(notificationRoutes);
  await app.register(entitySectionRoutes);
  await app.register(referenceMasterRoutes);
  await app.register(cameraRouters);
  await app.register(deck1Routes);
  await app.register(deck2Routes);
  await app.register(deck3Routes);
}

module.exports = routes;
