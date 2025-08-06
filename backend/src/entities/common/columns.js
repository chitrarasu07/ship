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
};
module.exports = commonColumns;
