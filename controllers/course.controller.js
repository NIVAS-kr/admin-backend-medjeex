const User = require("../models/user");
const Chapter = require("../models/chapter.model");
const Instructor = require("../models/instructor.model");
const Course = require("../models/course-admin.model"); 
const Lecture = require("../models/lecture.model");
const Notes = require("../models/notes.model");

exports.createCourse = async (req, res) => {
  try {
    const {
      instructors,
      courseName,
      courseDescription,
      category,
      standard,
      tags,
      courseStartDate,
      courseEndDate,
      imageUrl,
      courseFeatures,
      faq,
      scheduledLecture, 
      price,
      discountedPrice,
      courseDuration
    } = req.body;

    if (
      !courseName ||
      !category ||
      !standard ||
      !courseStartDate ||
      !courseEndDate ||
      !imageUrl ||
      instructors.length <= 0 ||
      courseDescription.length <= 0 ||
      tags.length <= 0 ||
      courseFeatures.length <= 0 ||
      faq.length <= 0 ||
      typeof scheduledLecture !== "boolean",
      !price ||
      !discountedPrice ||
      !courseDuration
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for course creation or format is not right.",
      });
    }


    const instructorPromises = instructors.map((instructor) => {
      const { fullname, instructorsInfo, qualification, instructorImg } =
        instructor;

      if (!fullname || !instructorsInfo || qualification.length <= 0 || !instructorImg) {
        throw new Error(
          `Instructor validation failed: fullname, instructorsInfo, qualification, and instructorImg are required.`
        );
      }

      const newInstructor = new Instructor(instructor);
      return newInstructor.save();
    });

    const savedInstructors = await Promise.all(instructorPromises);
    const instructorIds = savedInstructors.map((instructor) => instructor._id);

    const { _id: courseCreatedBy } = req.user;

    const newCourse = new Course({
      courseName,
      courseDescription,
      category,
      standard,
      tags,
      courseStartDate,
      courseEndDate,
      imageUrl,
      courseFeatures,
      faq,
      instructorId: instructorIds,
      courseCreatedBy,
      courseDuration,
      price,
      discountedPrice,
      scheduledLecture
    });

    await newCourse.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    if (error.message.includes("Instructor validation failed")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.createChapter = async (req, res) => {
  try {
    const { subjectName, chapterName, courseId } = req.body;

    if (!subjectName || !chapterName || !courseId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: subjectName, chapterName, or courseId.",
      });
    }

    const validSubjects = [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Botany",
      "Science",
      "Zoology",
    ];
    if (!validSubjects.includes(subjectName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid subjectName. Valid values are: ${validSubjects.join(
          ", "
        )}`,
      });
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const newChapter = new Chapter({
      subjectName,
      chapterName,
      courseId,
    });

    await newChapter.save();

    return res.status(201).json({
      success: true,
      message: "Chapter created successfully.",
      chapter: newChapter,
    });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.createLecture = async (req, res) => {
  try {
    const {
      videoTitle,
      videoLink,
      videoDescription,
      status,
      duration,
      lectureDate,
      chapterId,
      lecturerName,
      streamKey
    } = req.body;

    if (
      !videoTitle ||
      !videoLink ||
      !videoDescription ||
      !status ||
      !duration ||
      !lectureDate ||
      !chapterId ||
      !lecturerName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: videoTitle, videoLink, videoDescription, status, duration, lectureDate, or chapterId.",
      });
    }

    const validStatuses = ["live", "recorded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values are: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    const chapterExists = await Chapter.findById(chapterId);
    if (!chapterExists) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found.",
      });
    }

    const newLecture = new Lecture({
      videoTitle,
      videoLink,
      videoDescription,
      status,
      duration,
      lectureDate,
      chapterId,
      lecturerName,
      streamKey: streamKey ? streamKey : ""
    });

    await newLecture.save();

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully.",
      lecture: newLecture,
    });
  } catch (error) {
    console.error("Error creating lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.createNotes = async (req, res) => {
  try {
    const { notesTitle, notesDescription, file, LectureId } = req.body;

    if (!notesTitle || !notesDescription || !file || !LectureId) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: notesTitle, notesDescription, file, or LectureId.",
      });
    }

    const lectureExists = await Lecture.findById(LectureId);
    if (!lectureExists) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    const newNotes = new Notes({
      notesTitle,
      notesDescription,
      file,
      LectureId,
    });

    await newNotes.save();

    if (!newNotes) {
      return res.status(404).json({
        success: false,
        message: "Notes are not added.",
      });
    }

    lectureExists.notesCount += 1;
    await lectureExists.save();

    return res.status(201).json({
      success: true,
      message: "Notes created successfully.",
      notes: newNotes,
    });
  } catch (error) {
    console.error("Error creating notes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};




exports.getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find();

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully.",
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


exports.getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find();
    return res.status(200).json({
      success: true,
      message: "Chapters retrieved successfully.",
      chapters,
    });
  } catch (error) {
    console.error("Error retrieving chapters:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


exports.getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find();
    return res.status(200).json({
      success: true,
      message: "Lectures retrieved successfully.",
      lectures,
    });
  } catch (error) {
    console.error("Error retrieving lectures:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



exports.getNotes = async (req, res) => {
  try {
    const notes = await Notes.find();
    return res.status(200).json({
      success: true,
      message: "Notes retrieved successfully.",
      notes,
    });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const {
      instructors,
      courseName,
      courseDescription,
      category,
      standard,
      tags,
      courseStartDate,
      courseEndDate,
      imageUrl,
      courseFeatures,
      faq,
      courseUpdatedBy,
    } = req.body;

    if (
      !courseId ||
      !courseName ||
      !category ||
      !standard ||
      !courseStartDate ||
      !courseEndDate ||
      !imageUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided for course update.",
      });
    }

    const instructorIds = instructors
      ? await Promise.all(
          instructors.map(async (instructor) => {
            const newInstructor = new Instructor(instructor);
            await newInstructor.save();
            return newInstructor._id;
          })
        )
      : undefined;

    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        courseName,
        courseDescription,
        category,
        standard,
        tags,
        courseStartDate,
        courseEndDate,
        imageUrl,
        courseFeatures,
        faq,
        instructorId: instructorIds,
        courseUpdatedBy,
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};






exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      instructors,
      courseName,
      courseDescription,
      category,
      standard,
      tags,
      courseStartDate,
      courseEndDate,
      imageUrl,
      courseFeatures,
      faq,
      courseUpdatedBy,
    } = req.body;

    // Find the course to update
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Update instructors if provided
    let instructorIds = course.instructorId;
    if (instructors && instructors.length > 0) {
      const instructorPromises = instructors.map(async (instructor) => {
        const newInstructor = new Instructor(instructor);
        await newInstructor.save();
        return newInstructor._id;
      });
      instructorIds = await Promise.all(instructorPromises);
    }

    // Update course details
    course.courseName = courseName || course.courseName;
    course.courseDescription = courseDescription || course.courseDescription;
    course.category = category || course.category;
    course.standard = standard || course.standard;
    course.tags = tags || course.tags;
    course.courseStartDate = courseStartDate || course.courseStartDate;
    course.courseEndDate = courseEndDate || course.courseEndDate;
    course.imageUrl = imageUrl || course.imageUrl;
    course.courseFeatures = courseFeatures || course.courseFeatures;
    course.faq = faq || course.faq;
    course.instructorId = instructorIds;
    course.courseUpdatedBy = courseUpdatedBy || course.courseUpdatedBy;

    // Save updated course
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


exports.updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectName, chapterName, courseId } = req.body;

    const updatedChapter = await Chapter.findByIdAndUpdate(
      id,
      { subjectName, chapterName, courseId },
      { new: true, runValidators: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chapter updated successfully.",
      chapter: updatedChapter,
    });
  } catch (error) {
    console.error("Error updating chapter:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};








exports.updateLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      videoTitle,
      videoLink,
      videoDescription,
      status,
      duration,
      lectureDate,
      chapterId,
      lecturerName,
      streamKey
    } = req.body;

    const updatedLecture = await Lecture.findByIdAndUpdate(
      id,
      {
        videoTitle,
        videoLink,
        videoDescription,
        status,
        duration,
        lectureDate,
        chapterId,
        lecturerName,
        streamKey
      },
      { new: true, runValidators: true }
    );

    if (!updatedLecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully.",
      lecture: updatedLecture,
    });
  } catch (error) {
    console.error("Error updating lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
exports.updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notesTitle, notesDescription, file, LectureId } = req.body;

    const updatedNotes = await Notes.findByIdAndUpdate(
      id,
      { notesTitle, notesDescription, file, LectureId },
      { new: true, runValidators: true }
    );

    if (!updatedNotes) {
      return res.status(404).json({
        success: false,
        message: "Notes not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notes updated successfully.",
      notes: updatedNotes,
    });
  } catch (error) {
    console.error("Error updating notes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};










exports.deleteNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotes = await Notes.findByIdAndDelete(id);

    if (!deletedNotes) {
      return res.status(404).json({
        success: false,
        message: "Notes not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notes deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting notes:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


exports.deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLecture = await Lecture.findByIdAndDelete(id);

    if (!deletedLecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};




exports.deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedChapter = await Chapter.findByIdAndDelete(id);

    if (!deletedChapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chapter deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
      course: deletedCourse,
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};







