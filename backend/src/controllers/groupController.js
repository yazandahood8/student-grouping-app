import Answer from "../models/Answer.js";
import Group from "../models/Group.js";
import { groupStudents } from "../utils/clustering.js";

export const makeGroups = async (req, res) => {
  try {
    const { examId, numGroups } = req.body;
    const answers = await Answer.find({ exam: examId });

    const grouped = groupStudents(answers, numGroups);

    await Group.deleteMany({ exam: examId });

    const groups = await Promise.all(
      grouped.map((students, idx) =>
        Group.create({ exam: examId, groupNumber: idx + 1, students })
      )
    );

    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
