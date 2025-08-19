import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/groups", groupRoutes);

export default app;
