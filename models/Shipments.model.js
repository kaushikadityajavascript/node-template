const mongoose = require("mongoose");
const {
  STRING_REQUIRED_TRIM,
  BOOLEAN_DEFAULT,
  DATE,
  STATUS,
  REF_OBJECT_ID_REQUIRED,
  STRING,
  BOOLEAN_DEFAULT_TRUE,
  ADDRESS,
  NUMBER,
  REF_OBJECT_ID,
} = require("../utils/DBSchemaTypes");

const shipmentSchema = new mongoose.Schema(
  {
    code: STRING_REQUIRED_TRIM,
    artists: [
      {
        artist: REF_OBJECT_ID_REQUIRED("users"),
      },
    ],
    shipVia: STRING,
    trackingNo: STRING,
    isDelivery: BOOLEAN_DEFAULT_TRUE,
    takeAwayInfo: {
      storeName: STRING,
      fromDate: DATE,
      toDate: DATE,
      fromTime: DATE,
      ToTime: DATE,
    },
    address: ADDRESS,
    merchandises: [
      {
        merchandise: STRING,
        qty: NUMBER,
        sizeColor: STRING,
      },
    ],
    status: STATUS,
    isDeleted: BOOLEAN_DEFAULT,
    createdBy: REF_OBJECT_ID_REQUIRED("users"),
    updatedBy: REF_OBJECT_ID("users"),
    deletedBy: REF_OBJECT_ID("users"),
    deletedAt: DATE,
  },
  { timestamps: true }
);

const Shipments = mongoose.model("shipments", shipmentSchema);

module.exports = Shipments;
