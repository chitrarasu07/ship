const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");
const {
  organizationRelation,
  createdByRelation,
} = require("./common/relations");
const commonIndices = require("./common/indices");

module.exports = new EntitySchema({
  name: "Deck3",
  tableName: "decks_3",
  columns: {
    id: { primary: true, type: "int", generated: true },
    code: { type: "varchar", nullable: false, unique: true },
    name: { type: "varchar", nullable: false },
    type: { type: "varchar", nullable: false },
    location: { type: "varchar", nullable: false },
    ip_address: { type: "varchar", nullable: false },
    port: { type: "varchar", nullable: false },
    stream_url: { type: "varchar", nullable: false },
    description: { type: "varchar", nullable: true },
    status: { type: "char", length: 1 },
    ...commonColumns,
  },
  relations: {
    ...createdByRelation,
    ...organizationRelation,
    entity:{
      type: "many-to-one",
      target: "Entity",
      joinColumn: { name: "entity_id" },
      nullable: true,
    }
  },
  indices: [
    ...commonIndices,
    { name: "IDX_CODE", columns: ["code"] },
    { name: "IDX_NAME", columns: ["name"] },
    { name: "IDX_IP_ADDRESS", columns: ["ip_address"] },
    { name: "IDX_TYPE", columns: ["type"] },
    { name: "IDX_ENTITY", columns: ["entity"] },
  ],
});
