import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// טען .env שממוקם ב-backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/groups", groupRoutes);

const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI?.trim();

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing from .env (got:", MONGO_URI, ")");
  process.exit(1);
}

let server;

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("✅ MongoDB Connected");

    server = app.listen(PORT, () =>
      console.log(`🚀 Server listening on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ DB Connection Failed:", err?.message || err);
    // לא מרימים שרת בלי DB
    process.exit(1);
  }
})();

// סגירה נקייה
function shutdown() {
  Promise.resolve()
    .then(() => mongoose.disconnect().catch(() => {}))
    .then(() => server && server.close(() => process.exit(0)))
    .catch(() => process.exit(1));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
