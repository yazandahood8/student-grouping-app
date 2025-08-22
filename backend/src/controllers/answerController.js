import mongoose from "mongoose";
import Answer from "../models/Answer.js";
import Exam from "../models/Exam.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

// POST /api/answers
export const submitAnswers = async (req, res) => {
  try {
    const { examId, answers } = req.body; // answers can be [{selectedOption}] or [Number]
    if (!examId || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Missing examId or answers" });
    }

    // Load exam with questions
    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    if (answers.length !== exam.questions.length) {
      return res.status(400).json({ error: "Answers length must match number of questions" });
    }

    // 🔒 BLOCK second submissions — do this early
    const existing = await Answer.findOne({ exam: exam._id, student: req.user.id }).select("_id");
    if (existing) {
      return res.status(409).json({ error: "You already submitted this exam" });
    }

    // Build per-question results aligned by order
    const items = exam.questions.map((q, idx) => {
      const picked = typeof answers[idx] === "number" ? answers[idx] : Number(answers[idx]?.selectedOption);
      const isCorrect = picked === q.correctAnswer;
      return { question: q._id, selectedOption: picked, isCorrect };
    });

    const score = items.filter((x) => x.isCorrect).length;
    const total = exam.questions.length;
    const percentage = Math.round((score * 100) / total);

    // Create a brand-new doc (no upsert)
    const doc = await Answer.create({
      exam: exam._id,
      student: req.user.id,
      answers: items,
      score,
      total,
      percentage,
      submittedAt: new Date(),
    });

    return res.status(201).json({
      _id: doc._id,
      score,
      total,
      percentage,
    });
  } catch (err) {
    // If a unique index (below) catches a race condition, convert to 409
    if (err?.code === 11000) {
      return res.status(409).json({ error: "You already submitted this exam" });
    }
    console.error("Server error saving answer:", err);
    res.status(500).json({ error: "Server error saving answer" });
  }
};


// GET /api/answers/:examId (teacher view – list of students + scores)
export const getAnswers = async (req, res) => {
  try {
    const { examId } = req.params;
    const rows = await Answer.find({ exam: examId })
      .populate("student", "name email")
      .sort({ percentage: -1, submittedAt: 1 });
    res.json(rows);
  } catch (err) {
    console.error("Get answers error:", err);
    res.status(500).json({ error: "Server error getting answers" });
  }
};

// GET /api/answers/stats/:examId (teacher stats)
export const getExamStats = async (req, res) => {
  try {
    const { examId } = req.params;
    const rows = await Answer.find({ exam: examId }).select("score total percentage");
    const count = rows.length;
    if (!count) return res.json({ count: 0, avg: 0, min: 0, max: 0, distribution: {} });

    const percentages = rows.map((r) => r.percentage);
    const avg = Math.round(percentages.reduce((a, b) => a + b, 0) / count);
    const min = Math.min(...percentages);
    const max = Math.max(...percentages);

    const distribution = { "0-59": 0, "60-69": 0, "70-79": 0, "80-89": 0, "90-100": 0 };
    for (const p of percentages) {
      if (p < 60) distribution["0-59"]++;
      else if (p < 70) distribution["60-69"]++;
      else if (p < 80) distribution["70-79"]++;
      else if (p < 90) distribution["80-89"]++;
      else distribution["90-100"]++;
    }

    res.json({ count, avg, min, max, distribution });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Server error getting stats" });
  }
};

export const getExamDetailedStats = async (req, res) => {
  try {
    const { examId } = req.params;

    // load exam with questions
    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // load all submissions (with student identity)
    const rows = await Answer.find({ exam: examId })
      .populate("student", "name email")
      .lean();

    const count = rows.length;
    if (!count) {
      return res.json({
        summary: { count: 0, avg: 0, min: 0, max: 0, distribution: {} },
        questions: [],
        studentsBelowThreshold: [],
      });
    }

    // overall summary
    const ps = rows.map(r => r.percentage);
    const avg = Math.round(ps.reduce((a, b) => a + b, 0) / count);
    const min = Math.min(...ps);
    const max = Math.max(...ps);
    const distribution = { "0-59": 0, "60-69": 0, "70-79": 0, "80-89": 0, "90-100": 0 };
    ps.forEach(p => {
      if (p < 60) distribution["0-59"]++;
      else if (p < 70) distribution["60-69"]++;
      else if (p < 80) distribution["70-79"]++;
      else if (p < 90) distribution["80-89"]++;
      else distribution["90-100"]++;
    });

    // map questions -> indices
    const qIndexById = new Map();
    exam.questions.forEach((q, i) => qIndexById.set(q._id.toString(), i));

    // per-question counters
    const Q = exam.questions.length;
    const optionCounts = Array.from({ length: Q }, () => [0, 0, 0, 0]);
    const wrongPickStudents = Array.from({ length: Q }, () => [[], [], [], []]); // names per chosen option
    const totalPerQ = Array(Q).fill(0);

    // accumulate
    for (const r of rows) {
      for (const item of r.answers || []) {
        const qid = item.question?.toString();
        if (!qIndexById.has(qid)) continue;
        const qi = qIndexById.get(qid);
        const pick = Number(item.selectedOption);
        if (Number.isInteger(qi) && pick >= 0 && pick <= 3) {
          optionCounts[qi][pick] += 1;
          totalPerQ[qi] += 1;
          if (pick !== exam.questions[qi].correctAnswer) {
            const display = r.student?.name || r.student?.email || "Unknown";
            wrongPickStudents[qi][pick].push(display);
          }
        }
      }
    }

    // build question-level stats
    const questions = exam.questions.map((q, qi) => {
      const total = totalPerQ[qi] || 1;
      const correctIdx = q.correctAnswer;
      const correctCount = optionCounts[qi][correctIdx] || 0;
      const correctPct = Math.round((correctCount * 100) / total);

      // most chosen wrong option
      let commonWrongIdx = null, commonWrongCount = 0;
      for (let i = 0; i < 4; i++) {
        if (i === correctIdx) continue;
        if (optionCounts[qi][i] > commonWrongCount) {
          commonWrongCount = optionCounts[qi][i];
          commonWrongIdx = i;
        }
      }

      const optionBreakdown = optionCounts[qi].map((c) => ({
        count: c,
        percent: Math.round((c * 100) / total),
      }));

      return {
        questionId: q._id,
        order: qi + 1,
        text: q.text,
        options: q.options,
        correctAnswer: correctIdx,
        correctPct,
        optionBreakdown,
        commonWrongOption: commonWrongIdx,
        commonWrongStudents: commonWrongIdx != null ? wrongPickStudents[qi][commonWrongIdx].slice(0, 5) : [],
      };
    }).sort((a, b) => a.correctPct - b.correctPct); // hardest first

    // students below threshold (e.g., < 60%)
    const studentsBelowThreshold = rows
      .filter(r => r.percentage < 60)
      .map(r => ({ name: r.student?.name, email: r.student?.email, percentage: r.percentage }))
      .sort((a, b) => a.percentage - b.percentage);

    res.json({
      summary: { count, avg, min, max, distribution },
      questions,
      studentsBelowThreshold,
    });
  } catch (err) {
    console.error("getExamDetailedStats error:", err);
    res.status(500).json({ error: "Server error getting detailed stats" });
  }
};

export const getMyAnswer = async (req, res) => {
  try {
    const { examId } = req.query;
    if (!examId) return res.status(400).json({ error: "examId is required" });

    const attempt = await Answer.findOne({
      exam: examId,
      student: req.user.id,
    })
      .sort({ submittedAt: -1 })
      .select("exam student score total percentage submittedAt");

    return res.json(attempt || null);
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMySummary = async (req, res) => {
  try {
    const raw = (req.query.examIds || "").split(",").map((s) => s.trim()).filter(Boolean);
    const examIds = raw.map((id) => new mongoose.Types.ObjectId(id));

    const pipeline = [
      { $match: { student: new mongoose.Types.ObjectId(req.user.id), ...(examIds.length ? { exam: { $in: examIds } } : {}) } },
      { $sort: { submittedAt: -1, createdAt: -1 } },
      { $group: { _id: "$exam", doc: { $first: "$$ROOT" } } },
      {
        $project: {
          _id: 0,
          exam: "$_id",
          percentage: "$doc.percentage",
          score: "$doc.score",
          total: "$doc.total",
          submittedAt: "$doc.submittedAt",
        },
      },
    ];

    const docs = await Answer.aggregate(pipeline);
    return res.json(docs);
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
};
