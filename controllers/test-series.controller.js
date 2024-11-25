const TestSeries = require("../models/test-series");
const TestPaper = require("../models/test-paper");
const Question = require("../models/question");
const User = require("../models/user");
const Notification = require("../models/notifications");

// fetching functionalities

exports.getAllTestSeries = async (req, res) => {
  try {
    const allTestSeries = await TestSeries.find();

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

    // Check required fields
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

    const { testSeriesCreatedBy } = req.userId;

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


