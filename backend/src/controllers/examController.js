import Exam from "../models/Exam.js";
import Question from "../models/Question.js";

// ✅ Create exam
export const createExam = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: "Title and questions are required" });
    }

    const questionDocs = await Question.insertMany(questions);

    const exam = await Exam.create({
      title,
      teacher: req.user._id,
      questions: questionDocs.map((q) => q._id)
    });

    res.status(201).json(exam);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    const exams = await Exam.find({ teacher: req.user._id })
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
