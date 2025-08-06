const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");
const {
  organizationRelation,
  createdByRelation,
} = require("./common/relations");
const commonIndices = require("./common/indices");

module.exports = new EntitySchema({
  name: "Entity",
  tableName: "entities",
  columns: {
    id: { primary: true, type: "int", generated: true },
    code: { type: "varchar", nullable: false },
    name: { type: "varchar", nullable: false },
    comments: { type: "varchar" },
    ref_number: { type: "varchar", nullable: true },
    category4: { type: "varchar", nullable: true },
    category5: { type: "varchar", nullable: true },
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
    category2: {
      type: "many-to-one",
      target: "Category2",
      joinColumn: { name: "category2_id" },
      nullable: true,
    },
    category3: {
      type: "many-to-one",
      target: "Category3",
      joinColumn: { name: "category3_id" },
      nullable: true,
    },
  },
  indices: [
    ...commonIndices,
    { name: "IDX_CODE", columns: ["code"] },
    { name: "IDX_NAME", columns: ["name"] },
    { name: "IDX_RNO", columns: ["ref_number"] },
    { name: "IDX_CATE1", columns: ["category1"] },
    { name: "IDX_CATE2", columns: ["category2"] },
    { name: "IDX_CATE3", columns: ["category3"] },
  ],
});
