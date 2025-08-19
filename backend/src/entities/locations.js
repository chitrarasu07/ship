// src/entity/Location.ts
const { EntitySchema } = require("typeorm");
const commonColumns = require("./common/columns");
const {
  organizationRelation,
  createdByRelation,
} = require("./common/relations");
const commonIndices = require("./common/indices");

module.exports = new EntitySchema({
  name: 'Location',
  tableName: 'locations',
  columns: {
    id: {type: "int",primary: true,generated: true,},
    port: {type: "varchar",nullable: false,},
    country: {type: "varchar",nullable: false,},
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
});
