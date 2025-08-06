const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");

module.exports = new EntitySchema({
  name: "Organization",
  tableName: "organizations",
  columns: {
    id: { primary: true, type: "int", generated: true },
    code: { type: "varchar", nullable: false },
    name: { type: "varchar", nullable: false },
    category1: { type: "varchar", nullable: true },
    category2: { type: "varchar", nullable: true },
    category3: { type: "varchar", nullable: true },
    category4: { type: "varchar", nullable: true },
    category5: { type: "varchar", nullable: true },
    entity: { type: "varchar", nullable: true },
    entity_section: { type: "varchar", nullable: true },
    type: { type: "enum", enum: ["GOLD JEWELLERY", "SHIPPING"] },
    ...commonColumns,
  },
});
