import express from "express";
import {
  createExam,
  getExams,
  getMyExams,
  getExamById
} from "../controllers/examController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createExam);
router.get("/", authMiddleware, getExams);
router.get("/my", authMiddleware, getMyExams);
router.get("/:id", authMiddleware, getExamById);

export default router;
