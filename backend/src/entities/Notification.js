const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");
const {
  organizationRelation,
  createdByRelation,
} = require("./common/relations");
const commonIndices = require("./common/indices");

module.exports = new EntitySchema({
  name: "Notification",
  tableName: "notifications",
  columns: {
    id: { primary: true, type: "int", generated: true },
    message: { type: "text", nullable: true },
    isRead: { type: "boolean", default: false },
    readAt: { type: "datetime", nullable: true },
    actionUrl: { type: "varchar", nullable: true },
    ...commonColumns,
  },
  relations: {
    ...createdByRelation,
    ...organizationRelation,
    toUser: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "to_user_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
  indices: [
    ...commonIndices,
    { name: "IDX_READ", columns: ["isRead"] },
    { name: "IDX_TOUSER", columns: ["toUser"] },
  ],
});
