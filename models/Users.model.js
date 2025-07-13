const mongoose = require("mongoose");
const {
  STRING_REQUIRED_TRIM,
  REF_OBJECT_ID_REQUIRED,
  STRING,
  STATUS,
  REF_OBJECT_ID,
  ADDRESS,
  BOOLEAN_DEFAULT,
  DATE,
} = require("../utils/DBSchemaTypes");

const userSchema = new mongoose.Schema(
  {
    artistCode: STRING,
    name: STRING_REQUIRED_TRIM,
    email: {
      ...STRING_REQUIRED_TRIM,
      unique: true,
    },
    phone: STRING,
    role: REF_OBJECT_ID_REQUIRED("roles"),
    password: STRING_REQUIRED_TRIM,
    profilePhoto: STRING,
    artistInfo: {
      preferredEmail: STRING,
      companyName: STRING,
      availability: {
        ...STRING,
        enum: ["Open", "Limited", "Unavilable"],
      },
      unAvailabityReason: STRING,
      homeAddress: ADDRESS,
      isShipAddrSameShipAddr: BOOLEAN_DEFAULT,
      shipAddress: ADDRESS,
      rentCar: BOOLEAN_DEFAULT,
      willFlyAirport: BOOLEAN_DEFAULT,
      airPort: STRING,
      driverLience: STRING,
      autoIns: STRING,
      liencePlate: STRING,
      isLiabilityInsurance: {
        ...STRING,
        enum: ["Yes", "No", "May be"],
        default: "Yes",
      },
      w9: {
        ...STRING,
        enum: ["Yes", "No"],
        default: "Yes",
      },
      liabilityInsurance: STRING,
      equipmentAgreement: STRING,
      vaccine: {
        ...STRING,
        enum: ["Yes", "No", "Willing"],
        default: "Yes",
      },
      device_type: STRING,
      fcm_token: STRING,
      device_name: STRING,
      device_version: STRING,
      software_version: STRING,
      app_version: STRING,
      // uuid: STRING
    },
    status: STATUS,
    isDeleted: BOOLEAN_DEFAULT,
    createdBy: REF_OBJECT_ID_REQUIRED("users"),
    updatedBy: REF_OBJECT_ID("users"),
    deletedBy: REF_OBJECT_ID("users"),
    deletedAt: DATE,
  },
  { timestamps: true }
);

const Users = mongoose.model("users", userSchema);

module.exports = Users;
