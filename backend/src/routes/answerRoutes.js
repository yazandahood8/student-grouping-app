import express from "express";
import { submitAnswers, getAnswers, getExamStats,getExamDetailedStats } from "../controllers/answerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMyAnswer, getMySummary } from "../controllers/answerController.js";

const router = express.Router();
const requireTeacher = (req, res, next) =>
  req.user?.role === "teacher" ? next() : res.status(403).json({ error: "Teachers only" });

// student submits
router.post("/", authMiddleware(["student"]), submitAnswers);
// teacher views all submissions for an exam
router.get("/:examId", authMiddleware, requireTeacher, getAnswers);

// teacher stats
router.get("/stats/:examId", authMiddleware, requireTeacher, getExamStats);
router.get("/stats/detailed/:examId", authMiddleware, requireTeacher, getExamDetailedStats);

router.get("/my", authMiddleware(["student"]), getMyAnswer);
router.get("/my-summary", authMiddleware(["student"]), getMySummary);

export default router;
