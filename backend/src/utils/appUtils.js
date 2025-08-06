const bcrypt = require("bcrypt");
const defaultAccess = ["notifications", "no-guards"];

module.exports = {
  hasPermission: async function (app, orgId, roleId, page) {
    if (defaultAccess.indexOf(page) > -1) return true;
    const permissionRepo = app.db.getRepository("Permission");
    if (!roleId || !orgId) return false;

    const result = await permissionRepo.findOne({
      where: {
        page,
        status: "A",
        role: { id: roleId },
        organization: { id: orgId },
      },
    });

    return !!result;
  },

  logAudit: async function (
    app,
    userId,
    orgId,
    tableId,
    tableName,
    action,
    details
  ) {
    try {
      const auditRepo = app.db.getRepository("AuditLog");
      const audit = auditRepo.create({
        action,
        table_id: tableId,
        table_name: tableName,
        details:
          typeof details === "object" ? JSON.stringify(details) : details,
        organization: { id: orgId },
        user: userId ? { id: userId } : null,
        status: "A",
      });

      await auditRepo.save(audit);
    } catch (e) {
      app.log.error(e);
    }
  },

  validateRequiredFields: function (req, res, requiredFields) {
    const body = req.body || {};
    const missingOrInvalid = [];

    for (const rf of requiredFields) {
      const { f, t } = rf;
      const value = body[f];
      if (!value) {
        missingOrInvalid.push(`${f} (missing)`);
        continue;
      }

      const isArrayType = t === "array";
      const actualType = Array.isArray(value) ? "array" : typeof value;

      const isValid = isArrayType
        ? actualType === "array" && value.length > 0
        : actualType === t;

      if (!isValid) {
        missingOrInvalid.push(`${f} (expected ${t})`);
      }
    }

    if (missingOrInvalid.length > 0) {
      res.code(400).send({
        error: `Invalid/missing field(s): ${missingOrInvalid.join(", ")}`,
      });
      return false;
    }

    return true;
  },

  getDefaultPassword: async function () {
    return bcrypt.hash(process.env.DEFAULT_PASSWORD || "admin123", 10);
  },
};
