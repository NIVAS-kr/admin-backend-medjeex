const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDescription: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      enum: ["jee", "neet", "foundation"],
      required: true,
    },
    standard: {
      type: String,
      enum: ["8th", "9th", "10th", "11th", "12th", "dropper"],
      required: true,
    },
    tags: [{
      type: [String],
      enum: [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Botany",
        "Science",
        "Zoology",
      ],
      required: true,
    }],
    courseStartDate: {
      type: Date,
      required: true,
    },
    courseEndDate: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    courseFeatures: {
      type: [String],
      required: true,
    },
    faq: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    instructorId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
        required: true,
      },
    ],
    courseCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
