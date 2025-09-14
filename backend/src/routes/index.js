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
const deck4Routes = require("./deck4");
const deck5Routes = require("./deck5");
const deck6Routes = require("./deck6");
const deck7Routes = require("./deck7");
const deck8Routes = require("./deck8");
const deck9Routes = require("./deck9");
const deck10Routes = require("./deck10");
const deck11Routes = require("./deck11");
const deck12Routes = require("./deck12");
const bridgeroomRoutes = require("./bridgeRoom")
const controlroomRoutes = require("./controlRoom")
const machineryroomRoutes = require("./machineryRoom")
const outdoorRoutes = require("./outRoom")
const mooringRoutes = require("./mooring")


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
  await app.register(deck4Routes);
  await app.register(deck5Routes);
  await app.register(deck6Routes);
  await app.register(deck7Routes);
  await app.register(deck8Routes);
  await app.register(deck9Routes);
  await app.register(deck10Routes);
  await app.register(deck11Routes);
  await app.register(deck12Routes);
  await app.register(bridgeroomRoutes);
  await app.register(controlroomRoutes);
  await app.register(machineryroomRoutes);
  await app.register(outdoorRoutes);
  await app.register(mooringRoutes);


}

module.exports = routes;
