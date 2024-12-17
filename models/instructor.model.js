const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    instructorsInfo: {
      type: String,
      required: true,
    },
    qualification: {
      type: [String],
      required: true,
    },
    instructorImg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Instructor", instructorSchema);
