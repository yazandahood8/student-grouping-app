import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/exams", authMiddleware, examRoutes);              // PROTECTED
app.use("/api/answers", authMiddleware, answerRoutes);          // PROTECTED
app.use("/api/groups", authMiddleware, groupRoutes); 

export default app;
