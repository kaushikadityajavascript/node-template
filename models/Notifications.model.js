const mongoose = require("mongoose");
const {
  STRING_REQUIRED_TRIM,
  BOOLEAN_DEFAULT,
  DATE,
  REF_OBJECT_ID_REQUIRED,
  REF_OBJECT_ID,
} = require("../utils/DBSchemaTypes");

const notificationSchema = new mongoose.Schema(
  {
    title: STRING_REQUIRED_TRIM,
    description: STRING_REQUIRED_TRIM,
    opInvManager: [
      {
        user: REF_OBJECT_ID_REQUIRED("users"),
        isRead: BOOLEAN_DEFAULT,
      },
    ],
    artist: [
      {
        user: REF_OBJECT_ID_REQUIRED("users"),
        isRead: BOOLEAN_DEFAULT,
      },
    ],
    isDeleted: BOOLEAN_DEFAULT,
    createdBy: REF_OBJECT_ID_REQUIRED("users"),
    updatedBy: REF_OBJECT_ID("users"),
    deletedBy: REF_OBJECT_ID("users"),
    deletedAt: DATE,
  },
  { timestamps: true }
);

const Notifications = mongoose.model("notifications", notificationSchema);

module.exports = Notifications;
