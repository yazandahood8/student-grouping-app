// src/models/Group.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new Schema(
  {
    exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
    groupNumber: { type: Number, required: true },
    name: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student", required: true }],
    size: { type: Number, default: 0 },
    averagePercentage: { type: Number, default: 0 },
    minPercentage: { type: Number, default: 0 },
    maxPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

groupSchema.index({ exam: 1, groupNumber: 1 }, { unique: true });

export default mongoose.model("Group", groupSchema);
