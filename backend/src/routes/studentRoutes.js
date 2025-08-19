import express from "express";
import Student from "../models/Student.js"; // ודא שיש לך studentModel.js

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CREATE new student
router.post("/", async (req, res) => {
  try {
    const { name, email, grade } = req.body;
    if (!name || !email || !grade) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = new Student({ name, email, grade });
    await student.save();

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
