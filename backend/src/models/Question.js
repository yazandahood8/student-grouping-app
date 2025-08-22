import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    // index 0..3 of the correct option
    correctAnswer: { type: Number, required: true, min: 0, max: 3 }
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
