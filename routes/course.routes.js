const express = require("express");
const { createCourse, editCourse, deleteCourse, getAllCourse } = require("../controllers/course.controller");

const router = express.Router();
router.get("/get-course",getAllCourse);

router.post("/create-course", createCourse);
router.put("/edit-course",editCourse);
router.delete("delete-course",deleteCourse);

module.exports = router;