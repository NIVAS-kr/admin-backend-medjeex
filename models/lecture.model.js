const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    videoTitle: {
      type: String,
      required: true,
    },
    videoLink: {
      type: String,
      required: true,
    },
    videoDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["live", "recorded"],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    lectureDate: {
      type: Date,
      required: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lecture", lectureSchema);
