// routes/answerRoutes.js
import express from "express";
import { submitAnswers, getAnswers } from "../controllers/answerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/answers
router.post("/", authMiddleware, submitAnswers);
// GET /api/answers/:examId
router.get("/:examId", authMiddleware, getAnswers);

export default router;
