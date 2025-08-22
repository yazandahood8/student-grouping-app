// src/routes/groupRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { makeGroups, getGroups } from "../controllers/groupController.js";

const router = express.Router();
const requireTeacher = (req, res, next) =>
  req.user?.role === "teacher" ? next() : res.status(403).json({ error: "Teachers only" });

router.post("/make", authMiddleware, requireTeacher, makeGroups);
router.get("/:examId", authMiddleware, requireTeacher, getGroups);

export default router;
