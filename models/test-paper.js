const mongoose = require("mongoose");

const testPaperSchema = new mongoose.Schema(
  {
    testPaperId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    testSeriesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSeries",
      required: true,
      index: true,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    testName: {
      type: String,
      required: true,
      trim: true,
    },
    testDuration: {
      type: Number,
      required: true,
    },
    testStartTime: {
      type: Date,
      required: false,
    },
    testEndTime: {
      type: Date,
      required: false,
    },
    approved: {
      type: Boolean,
      default: false,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
    },
    testDescription: {
      type: String,
      required: true,
      maxLength: 80,
    },
    totalAttempts: {
      type: Number,
      required: true,
      min: 1,
    },
    subjectsCovered: [
      {
        type: String,
        required: true,
        enum: ["Physics", "Chemistry", "Mathematics", "Botany", "Science", "Zoology"],
      },
    ],
    negativeMarking: {
      type: Boolean,
      required: true,
      default: false,
    },
    testPaperCreatedBy: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

testPaperSchema.methods.toJSON = function () {
  const obj = this.toObject();
  
  return obj;
};

const TestPaper = mongoose.model("TestPaper", testPaperSchema);

module.exports = TestPaper;
