const mongoose = require("mongoose");

const testSeriesSchema = new mongoose.Schema(
  {
    testSeriesId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    features: [
      {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
      },
    ],
    testSeriesType: {
      type: String,
      enum: ["All-India", "Mock-Test-Series"],
      required: true,
    },
    imageUrls: [
      {
        type: String,
        required: true,
      },
    ],
    tags: [
      {
        type: String,
        enum: [
          "Physics",
          "Chemistry",
          "Mathematics",
          "Botany",
          "Science",
          "Zoology",
        ],
        required: true,
        maxLength: 9,
      },
    ],
    totalTest: {
      type: Number,
      required: true,
      min: 0,
    },
    stream: {
      type: String,
      enum: ["jee", "neet", "foundation"],
      required: true,
    },
    standard: {
      type: String,
      enum: ["8th", "9th", "10th", "11th", "12th", "dropper"],
      required: true,
    },
    price: {
      type: String,
      required: false,
    },
    currency: {
      type: String,
      required: false,
      default: "INR",
    },
    discountedPrice: {
      type: String,
      required: false,
    },
    published: {
      type: Boolean,
      required: true,
      default: false,
    },
    testSeriesCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyUser",
      required: false,
     
    },
  },
  {
    timestamps: true,
  }
);

testSeriesSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
};

const TestSeries = mongoose.model("TestSeries", testSeriesSchema);

module.exports = TestSeries;
