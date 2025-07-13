const mongoose = require("mongoose");
const {
  STRING_REQUIRED_TRIM,
  STRING,
  BOOLEAN_DEFAULT,
  NUMBER_REQUIRED,
  DATE,
  STATUS,
  REF_OBJECT_ID_REQUIRED,
  REF_OBJECT_ID,
} = require("../utils/DBSchemaTypes");

const catalogSchema = new mongoose.Schema(
  {
    image: STRING,
    tier: STRING_REQUIRED_TRIM,
    partyFavor: STRING_REQUIRED_TRIM,
    supplier: STRING_REQUIRED_TRIM,
    style: {
      title: STRING_REQUIRED_TRIM,
      url: STRING_REQUIRED_TRIM,
    },
    size: STRING_REQUIRED_TRIM,
    altSupplier: STRING_REQUIRED_TRIM,
    costPerPc: NUMBER_REQUIRED,
    piecePerHr: NUMBER_REQUIRED,
    costPerHr: NUMBER_REQUIRED,
    merchRatePerHr: NUMBER_REQUIRED,
    status: STATUS,
    isDeleted: BOOLEAN_DEFAULT,
    createdBy: REF_OBJECT_ID_REQUIRED("users"),
    updatedBy: REF_OBJECT_ID("users"),
    deletedBy: REF_OBJECT_ID("users"),
    deletedAt: DATE,
  },
  { timestamps: true }
);

const Catalogs = mongoose.model("inventory_catalogs", catalogSchema);

module.exports = Catalogs;
