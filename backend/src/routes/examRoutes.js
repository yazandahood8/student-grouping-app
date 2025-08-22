import express from "express";
import {
  createExam,
  getExams,
  getMyExams,
  getExamById,
} from "../controllers/examController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Public endpoints (so the student dashboard can load even before login).
 * If you want them protected, wrap with authMiddleware() accordingly.
 */
router.get("/", getExams);

// Put specific path BEFORE the param route
router.get("/my", authMiddleware(["teacher"]), getMyExams);

// Param route must come after /my or it would match "my" as :id
router.get("/:id", getExamById);

// Teacher-only create exam (invoke the factory!)
router.post("/", authMiddleware(["teacher"]), createExam);

export default router;
