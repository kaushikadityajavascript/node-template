const mongoose = require("mongoose");
const {
  STRING_REQUIRED_TRIM,
  BOOLEAN_DEFAULT,
  DATE,
  STATUS,
  REF_OBJECT_ID,
} = require("../utils/DBSchemaTypes");

const roleSchema = new mongoose.Schema(
  {
    name: {
      ...STRING_REQUIRED_TRIM,
      unique: true,
    },
    status: STATUS,
    isDeleted: BOOLEAN_DEFAULT,
    createdBy: REF_OBJECT_ID("users"),
    updatedBy: REF_OBJECT_ID("users"),
    deletedBy: REF_OBJECT_ID("users"),
    deletedAt: DATE,
  },
  { timestamps: true }
);

const Roles = mongoose.model("roles", roleSchema);

module.exports = Roles;
