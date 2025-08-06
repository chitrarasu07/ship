const permissions = [
  { page: "management-dashboard", urlPath: "/management-dashboard" },
  { page: "entity-manager-dashboard", urlPath: "/entity-manager-dashboard" },
  { page: "statistics", urlPath: "/statistics" },
  { page: "reports", urlPath: "/reports" },
  { page: "locations", urlPath: "/locations" },
  { page: "alerts", urlPath: "/alerts" },

  // Admin menus
  { page: "user", urlPath: "/master-data/user" },
  { page: "role", urlPath: "/master-data/role" },
  { page: "entity", urlPath: "/master-data/entity" },
  { page: "category1", urlPath: "/master-data/categoryMaster" },
  { page: "category2", urlPath: "/master-data/categoryMaster" },
  { page: "category3", urlPath: "/master-data/categoryMaster" },
  { page: "entity-section", urlPath: "/master-data/entitySection" },
  { page: "reference-master", urlPath: "/master-data/referenceMaster" },
];
module.exports = permissions;
