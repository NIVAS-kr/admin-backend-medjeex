const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    approved:{
type: Boolean,
required:true,

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
    testName: {
      type: String,
      required: true
    },
    creatorName:{
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
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
