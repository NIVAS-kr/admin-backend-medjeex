const express = require("express");
const {
  createTestSeries,
  createTestPaper,
  addQuestion,
  getAllTestSeries,
  getAllTestPapersByTestSeriesId,
  getAllTestPapersByCreatorId,
  getAllQuestionsByTestPaperId,
} = require("../controllers/test-series.controller");
const { isAuthenticated,  isAuthorized, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// creating routes
router.post("/create-test-series", isAdmin, createTestSeries);
router.post("/create-test-paper",  isAuthenticated, createTestPaper);
router.post("/add-question",  isAuthenticated, addQuestion);


// fetching routes
router.get("/all-test-series", isAuthenticated, getAllTestSeries);
router.post("/all-test-papers", isAuthenticated, getAllTestPapersByTestSeriesId);
// router.post("/all-test-papers-by-creator", isAuthenticated, isAuthorized, getAllTestPapersByCreatorId);
router.post("/all-questions-by-test-paper", isAuthenticated, getAllQuestionsByTestPaperId);




module.exports = router;
