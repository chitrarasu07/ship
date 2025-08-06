const { EntitySchema } = require("typeorm");
const { organizationRelation } = require("./common/relations");
const commonIndices = require("./common/indices");
const commonColumns = require("./common/columns");

module.exports = new EntitySchema({
  name: "AuditLog",
  tableName: "audit_logs",
  columns: {
    id: { primary: true, type: "int", generated: true },
    action: { type: "varchar" },
    table_name: { type: "varchar" },
    table_id: { type: "int" },
    details: { type: "text" },
    timestamp: { type: "datetime", default: () => "CURRENT_TIMESTAMP" },
    ...commonColumns,
  },
  relations: {
    ...organizationRelation,
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      nullable: true,
    },
  },
  indices: [
    ...commonIndices,
    { name: "IDX_TID", columns: ["table_id"] },
    { name: "IDX_TNAME", columns: ["table_name"] },
  ],
});
