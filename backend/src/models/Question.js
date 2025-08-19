import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
