import express from "express";
import { makeGroups } from "../controllers/groupController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", authMiddleware, makeGroups);

export default router;
