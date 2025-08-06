const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");
const {
  organizationRelation,
  createdByRelation,
} = require("./common/relations");
const commonIndices = require("./common/indices");

module.exports = new EntitySchema({
  name: "ReferenceValue",
  tableName: "reference_values",
  columns: {
    id: { primary: true, type: "int", generated: true },
    code: { type: "varchar", nullable: false },
    name: { type: "varchar", nullable: false },
    description: { type: "varchar", nullable: true },
    isActive: { type: "boolean", default: true },
    relatedValue: { type: "varchar", nullable: true },
    sortOrder: { type: "int", nullable: true },
    ...commonColumns,
  },
  relations: {
    ...createdByRelation,
    ...organizationRelation,
    reference_master: {
      type: "many-to-one",
      target: "ReferenceMaster",
      joinColumn: { name: "reference_master_id" },
      nullable: false,
    },
  },
  indices: [
    ...commonIndices,
    { name: "IDX_CODE", columns: ["code"] },
    { name: "IDX_NAME", columns: ["name"] },
    { name: "IDX_ACTIVE", columns: ["isActive"] },
    { name: "IDX_SORT_ORDER", columns: ["sortOrder"] },
    { name: "IDX_REF_MASTER", columns: ["reference_master"] },
  ],
});
