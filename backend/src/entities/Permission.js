const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");
const {
  organizationRelation,
  createdByRelation,
} = require("./common/relations");
const commonIndices = require("./common/indices");

module.exports = new EntitySchema({
  name: "Permission",
  tableName: "permissions",
  columns: {
    id: { primary: true, type: "int", generated: true },
    page: { type: "varchar" },
    ...commonColumns,
  },
  relations: {
    ...createdByRelation,
    ...organizationRelation,
    role: {
      type: "many-to-one",
      target: "Role",
      joinColumn: { name: "role_id" },
    },
  },
  indices: [...commonIndices, { name: "IDX_ROLE", columns: ["role"] }],
});
