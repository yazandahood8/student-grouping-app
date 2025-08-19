import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  answers: [
    {
      question: String,
      selectedOption: Number
    }
  ]
});

export default mongoose.model("Answer", answerSchema);
