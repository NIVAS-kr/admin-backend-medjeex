const mongoose = require("mongoose");

const attemptedTestSchema = new mongoose.Schema(
  {
    attemptedTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestPaper",
      required: true,
      index: true,
    },
    testSeriesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSeries",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionArr: [
      {
        questionId: {
          type: String,
          required: true,
        },
        selectedOption: {
          type: String,
          required: true,
        },
        correctOption: {
          type: String,
          required: true,
        },
      },
    ],
    timeTaken: {
      type: Date,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AttemptedTest = mongoose.model("AttemptedTest", attemptedTestSchema);

module.exports = AttemptedTest;
