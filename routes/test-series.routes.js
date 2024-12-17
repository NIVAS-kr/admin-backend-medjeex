const express = require("express");
const {
  createTestSeries,
  createTestPaper,
  addQuestion,
  getAllTestSeries,
  getAllTestPapersByTestSeriesId,
  getAllTestPapersByCreatorId,
  getAllQuestionsByTestPaperId,
  deleteQuestion,
  editQuestion,
  deleteTestSeries,
  editTestSeries,
  deleteTestPaper,
  fetchAdmin,
  sendRequestToAdmin,
  fetchAllRequests,
  approveDirect,
  editTestPaper,
  publishTestSeries,
} = require("../controllers/test-series.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const router = express.Router();


router.post("/create-test-series",  isAdmin, createTestSeries);
router.post("/create-test-paper",  isAuthenticated, createTestPaper);
router.post("/add-question",  isAuthenticated, addQuestion);



router.get("/all-test-series", isAuthenticated, getAllTestSeries);
router.post("/all-test-papers", isAuthenticated, getAllTestPapersByTestSeriesId);

router.post("/all-questions-by-test-paper", isAuthenticated, getAllQuestionsByTestPaperId);
router.delete("/delete-question/:questionId",deleteQuestion);
router.put("/edit-question/:id",editQuestion);

router.put("/edit-test-series/:testSeriesId", editTestSeries); 
router.put("/edit-test-paper/:testPaperId", editTestPaper); 

router.delete("/delete-test-series/:testSeriesId", deleteTestSeries);
router.delete("/delete-test-paper/:_id", deleteTestPaper);


router.get("/getAdmins",isAuthenticated,fetchAdmin);
router.post("/send-request",isAuthenticated,sendRequestToAdmin);
router.get("/all-requests", isAdmin, fetchAllRequests)
router.post("/direct-approve",isAdmin, approveDirect);
router.post("/publish-test-series",isAdmin,publishTestSeries)





module.exports = router;
