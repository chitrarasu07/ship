const permissionData = require("../user-permissions");
const { getDefaultPassword } = require("./utils/appUtils");

async function runInitialSetup(app) {
  const userRepo = app.db.getRepository("User");
  const roleRepo = app.db.getRepository("Role");
  const entityRepo = app.db.getRepository("Entity");
  const orgRepo = app.db.getRepository("Organization");
  const permissionRepo = app.db.getRepository("Permission");

  // 1. Check if any org exists, create if none
  let org = await orgRepo.findOne({ where: {} });
  if (!org) {
    org = orgRepo.create({
      code: "DEFAULT_ORG",
      name: "Default Organization",
      type: "SHIPPING",
      category1: "Ship Type",
      category2: "City",
      category3: "Area",
      entity: "Ship",
      entity_section: "Ship Sections",
      status: "A",
    });
    await orgRepo.save(org);
    console.log("Created default organization:", org);
  }

  // 2. Check if any user exists, create admin user if none
  let user = await userRepo.findOne({
    where: {
      organization: { id: org.id },
    },
  });
  if (!user) {
    const password_hash = await getDefaultPassword();
    user = userRepo.create({
      code: "ADMIN",
      name: "Admin",
      emailid: "admin@abc.com",
      password_hash,
      status: "A",
      organization: org,
      is_all_entity_access: true,
    });
    await userRepo.save(user);
    console.log("Created admin user:", user);
  }

  // 3. Check if any user exists, create admin user if none
  let entity = await entityRepo.findOne({
    where: {
      organization: { id: org.id },
    },
  });
  if (!entity) {
    entity = entityRepo.create({
      code: "DEFAULT_ENTITY",
      name: "Default Entity",
      status: "A",
      comments: "",
      category1: null,
      category2: null,
      category3: null,
      organization: org,
      created_by: user,
    });
    await entityRepo.save(entity);
    console.log("Created default entity:", entity);
  }

  // 3. Check if admin role exists for this org & user, create if none
  let role = await roleRepo.findOne({
    where: {
      status: "A",
      code: "ADMIN",
      organization: { id: org.id },
    },
    relations: ["organization"],
  });
  if (!role) {
    role = roleRepo.create({
      code: "ADMIN",
      name: "Admin",
      status: "A",
      organization: org,
      created_by: user,
    });
    await roleRepo.save(role);
    console.log("Created admin role:", role);
  }

  // 4. Link admin user with admin role if not linked
  if (user.role_id != role.id) {
    user.role = role;
    user.created_by = { id: user.id };
    await userRepo.save(user);
    console.log("Assigned admin role to user");
  }

  for (const perm of permissionData) {
    const exists = await permissionRepo.findOne({
      where: {
        status: "A",
        page: perm.page,
        role: { id: role.id },
        organization: { id: org.id },
      },
      relations: ["role"],
    });
    // console.log("page ", perm, " exists: ", exists);
    if (!exists) {
      const newPerm = permissionRepo.create({
        page: perm.page,
        role: { id: role.id },
        organization: { id: org.id },
        created_by: { id: user.id },
      });
      await permissionRepo.save(newPerm);
      console.log(`Permission added: ${perm.page}`);
    }
  }

  console.log("✅ Initial setup complete");
}

module.exports = {
  runInitialSetup,
};
