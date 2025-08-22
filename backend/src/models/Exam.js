// models/Exam.js
import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }]
});

export default mongoose.model("Exam", examSchema);
