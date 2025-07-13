const mongoose = require("mongoose");
const {
  STRING_REQUIRED_TRIM,
  REF_OBJECT_ID_REQUIRED,
} = require("../utils/DBSchemaTypes");

const tokenSchema = new mongoose.Schema(
  {
    user: REF_OBJECT_ID_REQUIRED("users"),
    token: STRING_REQUIRED_TRIM,
    tokenType: {
      ...STRING_REQUIRED_TRIM,
      enum: ["Auth", "RefreshAuth", "Reset"],
      default: "Auth",
    },
  },
  { timestamps: true }
);

const Tokens = mongoose.model("tokens", tokenSchema);

module.exports = Tokens;
