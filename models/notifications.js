const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    approversId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyUser",
      required: true,
    },
    testPaperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestPaper",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    testPaperCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyUser",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
