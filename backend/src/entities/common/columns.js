const commonColumns = {
  status: {
    type: "enum",
    enum: ["A", "D"],
    default: "A",
  },
  created_at: {
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  },
  // Updated by trigger
  updated_at: {
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  },
};
module.exports = commonColumns;
