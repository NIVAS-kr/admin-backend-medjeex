const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    questionType: {
      type: String,
      enum: ["single-correct", "integer", "multi-correct"],
      required: true,
    },
    testPaperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestPaper",
      required: false,
      index: true,
    },
    questionFormat: {
      type: String,
      required: true,
      enum: ["imageurl", "text"],
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        value: {
          type: String,
          required: false,
        },
        format: {
          type: String,
          required: false,
          enum: ["text", "imageurl"],
        },
      },
    ],
    marks: {
      type: String,
      required: true,
      
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Botany",
        "Science",
        "Zoology",
      ],
    },
    correctAnswer:[ {
      type: String,
      required: false,
    }],
    negativeMarks: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
