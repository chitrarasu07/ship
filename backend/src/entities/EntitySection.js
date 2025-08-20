const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");
const {
  organizationRelation,
  createdByRelation,
} = require("./common/relations");
const commonIndices = require("./common/indices");

module.exports = new EntitySchema({
  name: "EntitySection",
  tableName: "entity_sections",
  columns: {
    id: { primary: true, type: "int", generated: true },
    code: { type: "varchar", nullable: false },
    name: { type: "varchar", nullable: false },
    comments: { type: "varchar" },
    cameras_installed:{ type: "int", nullable: true, default: 0 },
    ...commonColumns,
  },
  relations: {
    ...createdByRelation,
    ...organizationRelation,
    entity: {
      type: "many-to-one",
      target: "Entity",
      joinColumn: { name: "entity_id" },
      nullable: false,
    },
  },
  indices: [
    ...commonIndices,
    { name: "IDX_CODE", columns: ["code"] },
    { name: "IDX_NAME", columns: ["name"] },
    { name: "IDX_ENTITY", columns: ["entity"] },
  ],
});
