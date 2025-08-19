import Answer from "../models/Answer.js";

export const submitAnswers = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    if (!examId || !answers) {
      return res.status(400).json({ error: "Missing examId or answers" });
    }

    const newAnswer = new Answer({
      exam: examId,
      student: req.user.id,
      answers
    });

    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (err) {
    console.error("Answer save error:", err);
    res.status(500).json({ error: "Server error saving answer" });
  }
};

export const getAnswers = async (req, res) => {
  try {
    const { examId } = req.params;
    const answers = await Answer.find({ exam: examId }).populate('student', 'name email');
    res.json(answers);
  } catch (err) {
    console.error("Get answers error:", err);
    res.status(500).json({ error: "Server error getting answers" });
  }
};
