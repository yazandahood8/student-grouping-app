import Exam from "../models/Exam.js";
import Question from "../models/Question.js";



export const createExam = async (req, res) => {
  try {
    // only teachers can create exams
    if (req.user?.role !== "teacher") {
      return res.status(403).json({ error: "Only teachers can create exams" });
    }

    const { title, questions } = req.body;
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Title and questions are required" });
    }

    // questions are like: { text, options:[], correctAnswer:number }
    const questionDocs = await Question.insertMany(questions);

    const exam = await Exam.create({
      title,
      teacher: req.user.id,
      questions: questionDocs.map(q => q._id)
    });

    // return fully populated exam
    const populated = await Exam.findById(exam._id)
      .populate("teacher", "name email")
      .populate("questions");

    return res.status(201).json(populated);
  } catch (err) {
    console.error("createExam error:", err);
    return res.status(500).json({ error: "Server error creating exam" });
  }
};


// ✅ Get all exams
export const getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("teacher", "name email")
      .populate("questions");
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get exams created by logged-in teacher
export const getMyExams = async (req, res) => {
  try {
    const teacherId = req.user.id || req.user._id; // ← support both, just in case
    const exams = await Exam.find({ teacher: teacherId })
      .populate("teacher", "name email")
      .populate("questions");
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("questions");

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.json(exam);
  } catch (err) {
    console.error("getExamById error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
