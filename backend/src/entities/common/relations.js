module.exports = {
  organizationRelation: {
    organization: {
      type: "many-to-one",
      target: "Organization",
      joinColumn: { name: "org_id" },
      onDelete: "CASCADE",
      nullable: false,
    },
  },
  createdByRelation: {
    created_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "created_by" },
      nullable: false,
    },
  },
};
