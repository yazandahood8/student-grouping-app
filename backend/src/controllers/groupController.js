// src/controllers/groupController.js
import Answer from "../models/Answer.js";
import Group from "../models/Group.js";

const defaultNamesBalanced = (n) =>
  n === 3 ? ["Advanced", "Intermediate", "Foundation"]
          : Array.from({ length: n }, (_, i) => `Group ${String.fromCharCode(65 + i)}`);

const defaultNamesHomogeneous = (n) =>
  n === 3 ? ["Advanced", "Intermediate", "Foundation"]
          : Array.from({ length: n }, (_, i) => `Tier ${i + 1}`);

// snake-draft to balance totals across groups (heterogeneous by ability)
const snakeAssign = (rows, k) => {
  const buckets = Array.from({ length: k }, () => []);
  for (let i = 0; i < rows.length; i++) {
    const lap = Math.floor(i / k);
    const pos = i % k;
    const g = lap % 2 === 0 ? pos : k - 1 - pos;
    buckets[g].push(rows[i]);
  }
  return buckets;
};

// split contiguous chunks (homogeneous: similar levels together)
const contiguousChunks = (rows, k) => {
  const buckets = Array.from({ length: k }, () => []);
  const base = Math.floor(rows.length / k);
  let extra = rows.length % k;
  let idx = 0;
  for (let g = 0; g < k; g++) {
    const size = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;
    buckets[g] = rows.slice(idx, idx + size);
    idx += size;
  }
  return buckets;
};

// POST /api/groups/make
export const makeGroups = async (req, res) => {
  try {
    if (req.user?.role !== "teacher") {
      return res.status(403).json({ error: "Teachers only" });
    }

    const {
      examId,
      numGroups = 3,
      mode = "balanced",              // "balanced" | "homogeneous"
      metric = "percentage",          // "percentage" | "grade"
      names,                          // optional: ["Advanced","Intermediate","Foundation"]
    } = req.body;

    if (!examId || !Number.isInteger(numGroups) || numGroups < 1) {
      return res.status(400).json({ error: "examId and valid numGroups are required" });
    }

    // Pull all answers with student identity
    const answers = await Answer.find({ exam: examId })
      .populate("student", "name email grade")
      .lean();

    if (!answers.length) return res.json([]);

    // Build rows with chosen metric
    const rows = answers.map(a => {
      const m =
        metric === "grade"
          ? (typeof a.student?.grade === "number" ? a.student.grade : null)
          : (typeof a.percentage === "number" ? a.percentage : null);

      // Fallback to percentage if grade missing
      const scoreForSort = m ?? a.percentage ?? 0;

      return {
        studentId: a.student?._id?.toString(),
        name: a.student?.name || "Unknown",
        email: a.student?.email || null,
        grade: typeof a.student?.grade === "number" ? a.student.grade : null,
        percentage: typeof a.percentage === "number" ? a.percentage : null,
        sortScore: scoreForSort,
      };
    });

    // Sort highest → lowest by selected metric (or fallback)
    rows.sort((a, b) => b.sortScore - a.sortScore);

    // Assign to groups
    const buckets =
      mode === "homogeneous" ? contiguousChunks(rows, numGroups) : snakeAssign(rows, numGroups);

    // Names
    const defaultNames =
      mode === "homogeneous" ? defaultNamesHomogeneous(numGroups) : defaultNamesBalanced(numGroups);

    const finalNames =
      Array.isArray(names) && names.length === numGroups ? names : defaultNames;

    // Persist
    await Group.deleteMany({ exam: examId });

    const docs = buckets.map((members, i) => {
      const percents = members.map(m => m.percentage).filter(p => typeof p === "number");
      const avg = percents.length ? Math.round(percents.reduce((s, p) => s + p, 0) / percents.length) : 0;
      const min = percents.length ? Math.min(...percents) : 0;
      const max = percents.length ? Math.max(...percents) : 0;

      return {
        exam: examId,
        groupNumber: i + 1,
        name: finalNames[i],
        students: members.map(m => m.studentId),
        size: members.length,
        averagePercentage: avg,
        minPercentage: min,
        maxPercentage: max,
      };
    });

    await Group.insertMany(docs);

    // Return populated groups with each student's percentage
    const percentByStudent = new Map(
      answers.map(a => [a.student?._id?.toString(), a.percentage])
    );

    const populated = await Group.find({ exam: examId })
      .sort({ groupNumber: 1 })
      .populate("students", "name email grade")
      .lean();

    const response = populated.map(g => ({
      _id: g._id,
      groupNumber: g.groupNumber,
      name: g.name,
      size: g.size,
      average: g.averagePercentage,
      min: g.minPercentage,
      max: g.maxPercentage,
      students: (g.students || []).map(s => ({
        _id: s._id,
        name: s.name,
        email: s.email,
        grade: s.grade,
        percentage: percentByStudent.get(s._id.toString()) ?? null,
      })),
    }));

    return res.json(response);
  } catch (err) {
    console.error("makeGroups error:", err);
    res.status(500).json({ error: "Server error making groups" });
  }
};


export const getGroups = async (req, res) => {
  try {
    const { examId } = req.params;
    const groups = await Group.find({ exam: examId })
      .sort({ groupNumber: 1 })
      .populate("students", "name email grade")
      .lean();

    if (!groups.length) return res.json([]);

    // Optional: enrich with percentages from answers
    const answers = await Answer.find({ exam: examId }).select("student percentage").lean();
    const percentByStudent = new Map(answers.map(a => [a.student.toString(), a.percentage]));

    const response = groups.map(g => ({
      _id: g._id,
      groupNumber: g.groupNumber,
      name: g.name,
      size: g.size,
      average: g.averagePercentage,
      min: g.minPercentage,
      max: g.maxPercentage,
      students: (g.students || []).map(s => ({
        _id: s._id,
        name: s.name,
        email: s.email,
        grade: s.grade,
        percentage: percentByStudent.get(s._id.toString()) ?? null,
      })),
    }));

    res.json(response);
  } catch (err) {
    console.error("getGroups error:", err);
    res.status(500).json({ error: "Server error getting groups" });
  }
};
