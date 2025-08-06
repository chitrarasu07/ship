const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");
const { organizationRelation } = require("./common/relations");
const commonIndices = require("./common/indices");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    code: { type: "varchar", nullable: false },
    name: { type: "varchar", nullable: false },
    emailid: { type: "varchar", nullable: false },
    password_hash: { type: "varchar" },
    is_all_entity_access: { type: "boolean", default: false },
    wrong_password_cnt: { type: "int", default: 0 },
    is_locked: { type: "boolean", default: false },
    ...commonColumns,
  },
  relations: {
    ...organizationRelation,
    created_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "created_by" },
      nullable: true,
    },
    role: {
      type: "many-to-one",
      target: "Role",
      joinColumn: { name: "role_id" },
    },
    user_entities: {
      type: "many-to-many",
      target: "Entity",
      joinTable: {
        name: "user_entities",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "entity_id", referencedColumnName: "id" },
      },
    },
  },
  indices: [
    ...commonIndices,
    { name: "IDX_CODE", columns: ["code"] },
    { name: "IDX_NAME", columns: ["name"] },
    { name: "IDX_EMAIL", columns: ["emailid"] },
  ],
});
