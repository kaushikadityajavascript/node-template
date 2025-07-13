const mongoose = require("mongoose");
const SchemaTypes = mongoose.Schema.Types;

module.exports = {
  STRING: {
    type: String,
  },
  NUMBER_REQUIRED: {
    type: Number,
    required: true,
  },
  NUMBER: {
    type: Number,
    default: 0,
  },
  STRING_REQUIRED: {
    type: String,
    required: true,
  },
  STRING_REQUIRED_TRIM: {
    type: String,
    required: true,
    trim: true,
  },
  STATUS: {
    type: String,
    required: true,
    trim: true,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  CREATED_DATE: {
    type: Date,
    default: Date.now,
  },
  DATE_REQUIRED: {
    type: Date,
    required: true,
  },
  DATE: {
    type: Date,
  },
  ARRAY_REQUIRED: {
    type: Array,
    required: true,
  },
  MIXED: {
    type: SchemaTypes.Mixed,
  },
  OBJECT_REQUIRED: {
    type: Object,
    required: true,
  },
  OBJECT: {
    type: Object,
  },
  NUMBER_MIN_MAX: {
    type: Number,
    min: 1,
    max: 220,
    required: true,
  },
  ARRAY: {
    type: Array,
    default: [],
  },
  BOOLEAN_DEFAULT: {
    type: Boolean,
    default: false,
  },
  BOOLEAN_DEFAULT_TRUE: {
    type: Boolean,
    default: true,
  },
  REF_OBJECT_ID: (ref) => {
    return {
      type: SchemaTypes.ObjectId,
      ref,
    };
  },
  REF_OBJECT_ID_REQUIRED: (ref) => {
    return {
      type: SchemaTypes.ObjectId,
      ref,
      required: true,
    };
  },
  ADDRESS: {
    addressLine1: {
      type: String,
    },
    addressLine2: {
      type: String,
    },
    zip: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
  },
};
