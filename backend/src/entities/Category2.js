const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");
const {
  organizationRelation,
  createdByRelation,
} = require("./common/relations");
const commonIndices = require("./common/indices");

module.exports = new EntitySchema({
  name: "Category2",
  tableName: "categories_2",
  columns: {
    id: { primary: true, type: "int", generated: true },
    code: { type: "varchar", nullable: false },
    name: { type: "varchar", nullable: false },
    sortOrder: { type: "int" },
    ...commonColumns,
  },
  relations: {
    ...createdByRelation,
    ...organizationRelation,
    category1: {
      type: "many-to-one",
      target: "Category1",
      joinColumn: { name: "category1_id" },
      nullable: true,
    },
  },
  indices: [
    ...commonIndices,
    { name: "IDX_CODE", columns: ["code"] },
    { name: "IDX_NAME", columns: ["name"] },
    { name: "IDX_CATE1", columns: ["category1"] },
    { name: "IDX_SORT_ORDER", columns: ["sortOrder"] },
  ],
});
