import mongoose from "mongoose";

const { Schema } = mongoose;

const answerItemSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  selectedOption: { type: Number, min: 0, max: 3, required: true },
  isCorrect: { type: Boolean, default: false },
});

const answerSchema = new Schema(
  {
    exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    answers: [answerItemSchema],
    score: { type: Number, required: true },        // number correct
    total: { type: Number, required: true },        // total questions
    percentage: { type: Number, required: true },   // 0..100
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

answerSchema.index({ exam: 1, student: 1 }, { unique: true });

export default mongoose.model("Answer", answerSchema);
