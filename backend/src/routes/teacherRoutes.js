import express from "express";

const router = express.Router();

// GET all teachers
router.get("/", (req, res) => {
  res.json([{ id: 1, name: "Example Teacher" }]);
});

// POST create new teacher
router.post("/", (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: Date.now(), name, email });
});

export default router;
