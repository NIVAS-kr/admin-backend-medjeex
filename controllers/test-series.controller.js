const TestSeries = require("../models/test-series");
const TestPaper = require("../models/test-paper");
const Question = require("../models/question");
const User = require("../models/user");
const Notification = require("../models/notifications");
const mongoose = require('mongoose');
exports.getAllTestSeries = async (req, res) => {
  try {
    const allTestSeries = await TestSeries.find();
    if(allTestSeries.length <= 0){
      return res.status(404).json({
        success: true,
        message: "Test series not found."
      });
    }

    return res.status(200).json({
      success: true,
      allTestSeries: allTestSeries,
    });
  } catch (error) {
    console.error("Error fetching test series:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.getAllTestPapersByTestSeriesId = async (req, res) => {
  try {
    const { testSeriesId } = req.body;
    console.log(req.body);
    console.log(testSeriesId);

    const allTestPapers = await TestPaper.find({ testSeriesId: testSeriesId });

    if(allTestPapers.length <= 0){
      return res.status(404).json({
        success: true,
        message: "Test Papers not found."
      });
    }

    return res.status(200).json({
      success: true,
      allTestPapers: allTestPapers,
      
    });
  } catch (error) {
    console.error("Error fetching test papers:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.getAllQuestionsByTestPaperId = async (req, res) => {
  try {
    const { testPaperId } = req.body;

    const allQuestions = await Question.find({ testPaperId: testPaperId });
    if(allQuestions.length <= 0){
      return res.status(404).json({
        success: true,
        message: "Questions not found."
      });
    }
    return res.status(200).json({
      success: true,
      allQuestions: allQuestions,
    });
  } catch (error) {
    console.error("Error fetching Questions:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.getAllTestPapersByCreatorId = async (req, res) => {
  try {
    const { testPaperCreatedBy } = req.user._id;

    const allTestPapers = await TestPaper.find({ testPaperCreatedBy });

    return res.status(200).json({
      success: true,
      allTestPapers: allTestPapers,
    });
  } catch (error) {
    console.error("Error fetching test papers:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// Creation functionalities
exports.createTestSeries = async (req, res) => {
  try {
    const {
      title,
      description,
      features,
      testSeriesType,
      imageUrls,
      tags,
      totalTest,
      stream,
      standard,
      price,
      discountedPrice,
    } = req.body;
    console.log("Received data:", req.body); 

if (
      (!title || !description || !features,
      !testSeriesType ||
        !imageUrls ||
        !tags ||
        !totalTest ||
        !stream ||
        !standard ||
        !price)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: testSeriesId, title, description, testSeriesType, imageUrl, tags, totalTest, stream, and standard",
      });
    }

    const { _id:testSeriesCreatedBy } = req.user;

    const newTestSeries = new TestSeries({
      title,
      description,
      features,
      testSeriesType,
      imageUrls,
      tags,
      totalTest,
      stream,
      standard,
      price,
      discountedPrice,
      testSeriesCreatedBy,
    });

    await newTestSeries.save();

    return res.status(201).json({
      success: true,
      message: "Test series added successfully",
      testSeries: newTestSeries,
    });
  } catch (error) {
    console.error("Error adding test series:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.createTestPaper = async (req, res) => {
  try {
    const {
      testSeriesId,
     
      totalQuestions,
      totalMarks,
      testDescription,
      
      testName,
      testDuration,
      testStartTime,
      testEndTime,
      totalAttempts,
      subjectsCovered,
      negativeMarking,
      
    } = req.body;

    

    if (
      
      !testSeriesId||
      !testName ||
      !testDuration ||
      !testStartTime ||
      !testEndTime ||
      !totalQuestions ||
      !totalMarks||
      !testDescription ||
      !subjectsCovered 
    
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newTestPaper = new TestPaper({
      testSeriesId,
      testName,
      testDuration,
      testStartTime,
      testEndTime,
      totalQuestions,
      testDescription,
      totalMarks,
      totalAttempts,
      subjectsCovered,
      negativeMarking,
      
    });

    newTestPaper.save()

    return res.status(201).json({
      success: true,
      message: "Test paper added successfully",
    });
  } catch (error) {
    console.error("Error adding test paper:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const {
      testPaperId,
    questionType,
      questionFormat,
      question,
      options,
      
      marks,
      subject,
      correctAnswer,
      negativeMarks,
    } = req.body;
    console.log(req.body);

    if (
      !testPaperId||
      !questionType||
      !questionFormat ||
      !question ||
      !options ||
      !marks ||
      !subject ||
      !correctAnswer ||
      !negativeMarks
     
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, including options.",
      });
    }

    const newQuestion = new Question({
      questionType,
      testPaperId,
     
      questionFormat,
      question,
      options,
      
      marks,
      subject,
      correctAnswer,
      negativeMarks,
    });

    await newQuestion.save();

    return res.status(201).json({
      success: true,
      message: "Question added successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    
    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required",
      });
    }

 
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    
    if (!deletedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
   
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.editQuestion = async (req, res) => {
  try {
    const {
      
      questionType,
      questionFormat,
      question,
      options,
      marks,
      subject,
      correctAnswer,
      negativeMarks,
    } = req.body;
    const {id } = req.params;
    if (
      !id ||
      !questionType ||
      !questionFormat ||
      !question ||
      !options ||
      !marks ||
      !subject ||
      !correctAnswer ||
      !negativeMarks
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, including options.",
      });
    }
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        questionType,
        questionFormat,
        question,
        options,
        marks,
        subject,
        correctAnswer,
        negativeMarks,
      },
      { new: true } 
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.editTestSeries = async (req, res) => {
  try {
    const { testSeriesId } = req.params; 

    const {
      title,
      description,
      features,
      testSeriesType,
      imageUrls,
      tags,
      totalTest,
      stream,
      standard,
      price,
      discountedPrice,
    } = req.body;
    console.log(req.body);

    if (
      !testSeriesId ||
      !title ||
      !description ||
      !features ||
      !testSeriesType ||
      !imageUrls ||
      !tags ||
      !totalTest ||
      !stream ||
      !standard ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for updating a test series.",
      });
    }

    const updatedTestSeries = await TestSeries.findByIdAndUpdate(
      {_id :testSeriesId}, 
      {
        title,
        description,
        features,
        testSeriesType,
        imageUrls,
        tags,
        totalTest,
        stream,
        standard,
        price,
        discountedPrice,
      },
      { new: true } 
    );

    if (!updatedTestSeries) {
      return res.status(404).json({
        success: false,
        message: "Test series not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test series updated successfully.",
      testSeries: updatedTestSeries,
    });
  } catch (error) {
    console.error("Error updating test series:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



exports.deleteTestSeries = async (req, res) => {
  try {
    const { testSeriesId } = req.params; // Get the ID from the URL params
    console.log("Received testSeriesId:", testSeriesId); // Check if backend receives the ID

    if (!testSeriesId || !mongoose.Types.ObjectId.isValid(testSeriesId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing Test Series ID." });
    }

    const deletedTestSeries = await TestSeries.findByIdAndDelete(testSeriesId);

    if (!deletedTestSeries) {
      return res.status(404).json({ success: false, message: "Test series not found." });
    }

    return res.status(200).json({ success: true, message: "Test series deleted successfully." });
  } catch (error) {
    console.error("Error deleting test series:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.deleteTestPaper = async (req, res) => {
  try {
    const { _id } = req.params; // Extract _id from the URL params
    console.log("Received _id for deletion:", _id); // Log for debugging

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing ID." });
    }

    const deletedTestPaper = await TestPaper.findByIdAndDelete(_id);

    if (!deletedTestPaper) {
      return res.status(404).json({ success: false, message: "Test paper not found." });
    }

    return res.status(200).json({ success: true, message: "Test paper deleted successfully." });
  } catch (error) {
    console.error("Error deleting test paper:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};


exports.fetchAdmin = async (req, res) => {
  try {
   
    const admins = await User.find({ role: "admin" }).select("_id username");

    
    if (!admins || admins.length === 0) {
      return res.status(404).json({ success: false, message: "No admins found." });
    }

  
    return res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error("Error finding admin users:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.sendRequestToAdmin = async (req, res) => {
  try {
    const { approversId, testPaperId, message } = req.body;
    console.log(req.body);

    const approver = await User.findById(approversId);
    if (!approver) {
      return res.status(404).json({ message: "Approver not found" });
    }

    const testPaper = await TestPaper.find({testPaperId});
    if (!testPaper) {
      return res.status(404).json({ message: "Test Paper not found" });
    }

    console.log(testPaper)

    const testPaperCreatedBy = req.user._id;
    const creator = await User.findById(testPaperCreatedBy);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const newNotification = new Notification({
      approversId,
      testPaperId,
      testName: testPaper[0].testName,
      creatorName: creator.username,
      message,
      testPaperCreatedBy,
      approved:testPaper[0].approved
    });

    await newNotification.save();

    approver.requests.push(newNotification._id);
    await approver.save();
    
    creator.requests.push(newNotification._id);
    await creator.save();

    res.status(201).json({ message: "Notification sent successfully", notification: newNotification });
  } catch (error) {
    console.error("Error in sendRequestToAdmin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchAllRequests = async (req, res) => {
  try {
    const adminId = req.user._id; 
    const admin = await User.findById(adminId).populate('requests');

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ requests: admin.requests });
  } catch (error) {
    console.error("Error in fetchAllRequests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.approveDirect = async (req, res) => {
  try {
    const { testPaperId } = req.body;

    const testPaper = await TestPaper.findOne({ testPaperId });
    if (!testPaper) {
      return res.status(404).json({ message: "Test Paper not found" });
    }
    const notification = await Notification.findOne({ testPaperId });
    if (notification) {
      notification.approved= true;
      await notification.save()
    }
    const testPaperCreatedBy = req.user._id;
    const creator = await User.findById(testPaperCreatedBy);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    testPaper.approved = true; 
    await testPaper.save()

    res.status(200).json({ success: true, message: "Test Paper approved successfully" }); 
  } catch (error) {
    console.error("Error in approve:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}




exports.editTestPaper = async (req, res) => {
  try {
    const { testPaperId } = req.params; // Extract test paper ID from request parameters

    const {
      testName,
      testDuration,
      testStartTime,
      testEndTime,
      totalQuestions,
      totalMarks,
      testDescription,
      totalAttempts,
      subjectsCovered,
      negativeMarking,
    } = req.body;

    if (
      !testPaperId ||
      !testName ||
      !testDuration ||
      !testStartTime ||
      !testEndTime ||
      !totalQuestions ||
      !totalMarks ||
      !testDescription ||
      !subjectsCovered
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided for updating the test paper.",
      });
    }

    const updatedTestPaper = await TestPaper.findByIdAndUpdate(
      { _id: testPaperId }, // Filter by test paper ID
      {
        testName,
        testDuration,
        testStartTime,
        testEndTime,
        totalQuestions,
        totalMarks,
        testDescription,
        totalAttempts,
        subjectsCovered,
        negativeMarking,
      },
      { new: true } // Return the updated document
    );

    if (!updatedTestPaper) {
      return res.status(404).json({
        success: false,
        message: "Test paper not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test paper updated successfully.",
      testPaper: updatedTestPaper,
    });
  } catch (error) {
    console.error("Error updating test paper:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};




exports.publishTestSeries = async (req, res) => {
  try {
    const { testSeriesId } = req.body;
    const { _id: testSeriesCreatedBy } = req.user;

    const testSeriesPublished = await TestSeries.find({
      testSeriesId,
      testSeriesCreatedBy,
    });

    if (!testSeriesPublished) {
      return res.status(404).json({
        success: true,
        message: "Test Series not found.",
      });
    }

    if(testSeriesPublished[0].published){
      return res.status(400).json({
        success: true,
        message: "Test Series already Published.",
      });
    }

    testSeriesPublished[0].published = true;
    await testSeriesPublished[0].save();

    return res.status(201).json({
      success: true,
      message: "Test Series Published successfully",
    });
  } catch (error) {
    console.error("Error Publishing Test Series:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

