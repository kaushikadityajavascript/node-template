const mongoose = require("mongoose");
const {
  STRING_REQUIRED_TRIM,
  BOOLEAN_DEFAULT,
  DATE,
  ADDRESS,
  STRING,
  REF_OBJECT_ID,
  NUMBER,
  BOOLEAN_DEFAULT_TRUE,
  REF_OBJECT_ID_REQUIRED,
} = require("../utils/DBSchemaTypes");

const eventFeedbackSchema = new mongoose.Schema(
  {
    event: REF_OBJECT_ID_REQUIRED("events"),
    artist: REF_OBJECT_ID_REQUIRED("users"),
    isMerchandiseLeft: BOOLEAN_DEFAULT,
    leftOverMerchandise: [
      {
        merchandise: STRING,
        qty: NUMBER,
        sizeColor: STRING,
      },
    ],
    thankYouEmail: STRING,
    isOverTimeAsked: STRING,
    overTime: STRING,
    rating: NUMBER,
    haveAnyIdea: STRING,
    ideas: STRING,
    haveCustomerIdea: STRING,
    customerIdea: STRING,
    ideaPhotos: [
      {
        imagePath: STRING,
      },
    ],
    eventPhotosTaken: BOOLEAN_DEFAULT_TRUE,
    eventPhotos: [
      {
        imagePath: STRING,
      },
    ],
    partRepair: BOOLEAN_DEFAULT_TRUE,
    repairDescription: STRING,
    damagePhotos: [
      {
        imagePath: STRING,
      },
    ],
    lowOnCareInst: BOOLEAN_DEFAULT_TRUE,
    dontForgotTo: {
      drainAirCompressor: BOOLEAN_DEFAULT,
      replenisPaint: BOOLEAN_DEFAULT,
      replenishPens: BOOLEAN_DEFAULT,
      wipeBottleRack: BOOLEAN_DEFAULT,
      sendInvoice: BOOLEAN_DEFAULT,
    },
    isDeleted: BOOLEAN_DEFAULT,
    createdBy: REF_OBJECT_ID_REQUIRED("users"),
    updatedBy: REF_OBJECT_ID("users"),
    deletedBy: REF_OBJECT_ID("users"),
    deletedAt: DATE,
  },
  { timestamps: true }
);

const EventFeedback = mongoose.model("event_feedbacks", eventFeedbackSchema);

module.exports = EventFeedback;
