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

const eventsSchema = new mongoose.Schema(
  {
    code: STRING_REQUIRED_TRIM,
    type: STRING_REQUIRED_TRIM,
    name: STRING_REQUIRED_TRIM,
    address: ADDRESS,
    instruction: STRING_REQUIRED_TRIM,
    coverImage: STRING_REQUIRED_TRIM,
    attire: STRING,
    arrivalPerformanceTime: [
      {
        artist: [
          {
            artistId: REF_OBJECT_ID("users"),
            flightInfo: [
              {
                fromCity: STRING,
                toCity: STRING,
                airlineName: STRING,
                flightNumber: STRING,
                departureDate: DATE,
                departureTime: DATE,
                arrivalDate: DATE,
                arrivalTime: DATE,
                confirmationNumber: STRING,
              },
            ],
            hotelInfo: {
              name: STRING,
              frontDesk: STRING,
              confirmationNumber: STRING,
              checkInDate: DATE,
              checkInTime: DATE,
              checkOutDate: DATE,
              checkoutTime: DATE,
              address: ADDRESS,
              isPaymentByAirbrush: BOOLEAN_DEFAULT_TRUE,
            },
          },
        ],
        performanceDate: DATE,
        arrivalTime: STRING,
        performanceTimeFrom: STRING,
        performanceTimeTo: STRING,
      },
    ],
    location: {
      venue: {
        name: STRING,
        locationLink: STRING,
      },
      setupLocation: {
        name: STRING,
        locationLink: STRING,
      },
      unloadingLocation: {
        name: STRING,
        locationLink: STRING,
      },
      parkingLocation: {
        name: STRING,
        locationLink: STRING,
      },
    },
    inventory: [
      {
        artist: REF_OBJECT_ID("users"),
        merchandise: STRING,
        qty: NUMBER,
        sizeColor: STRING,
      },
    ],
    additionalDetails: {
      teamLeader: REF_OBJECT_ID("users"),
      reportToPerson: {
        name: STRING,
        phone: STRING,
      },
      guestOfHonor: STRING,
      noOfGuests: NUMBER,
    },
    designReference: [
      {
        imagePath: STRING,
      },
    ],
    reserveCar: BOOLEAN_DEFAULT_TRUE,
    makeCarPoolArrangmet: BOOLEAN_DEFAULT_TRUE,
    bringTable: BOOLEAN_DEFAULT_TRUE,
    bringExtraPaint: BOOLEAN_DEFAULT_TRUE,
    useRideShare: BOOLEAN_DEFAULT_TRUE,
    bringStencil: BOOLEAN_DEFAULT_TRUE,
    bringDropCloth: BOOLEAN_DEFAULT_TRUE,
    independentContractorAgreement: STRING,
    privacyShare: BOOLEAN_DEFAULT,
    isDeleted: BOOLEAN_DEFAULT,
    createdBy: REF_OBJECT_ID_REQUIRED("users"),
    updatedBy: REF_OBJECT_ID("users"),
    deletedBy: REF_OBJECT_ID("users"),
    deletedAt: DATE,
  },
  { timestamps: true }
);

const Events = mongoose.model("events", eventsSchema);

module.exports = Events;
