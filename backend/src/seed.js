// src/seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Student from "./models/Student.js";
import Teacher from "./models/Teacher.js";
import Exam from "./models/Exam.js";
import Question from "./models/Question.js";
import Answer from "./models/Answer.js";

dotenv.config();

const examBanks = {
  Physics: [
    {
      title: "Physics Final Exam",
      questions: [
        { text: "What is the speed of light?", options: ["3x10^8 m/s","5x10^6 m/s","1x10^3 m/s","None of the above"], correctAnswer: 0 },
        { text: "Who developed the theory of relativity?", options: ["Newton","Einstein","Galileo","Bohr"], correctAnswer: 1 },
        { text: "What is F = ma known as?", options: ["Newton’s First Law","Newton’s Second Law","Newton’s Third Law","Hooke’s Law"], correctAnswer: 1 },
      ],
    },
    {
      title: "Physics Midterm",
      questions: [
        { text: "Main unit of force?", options: ["Joule","Newton","Pascal","Watt"], correctAnswer: 1 },
        { text: "Which wave needs a medium?", options: ["Light","Radio","Sound","X-ray"], correctAnswer: 2 },
        { text: "g on Earth is ≈ ?", options: ["4.9 m/s²","9.8 m/s²","19.6 m/s²","1 m/s²"], correctAnswer: 1 },
      ],
    },
  ],
  Mathematics: [
    {
      title: "Mathematics Exam",
      questions: [
        { text: "Derivative of x²?", options: ["x","2x","x²","2"], correctAnswer: 1 },
        { text: "∫(1/x) dx = ?", options: ["ln(x)","x","1/x²","e^x"], correctAnswer: 0 },
        { text: "Solve: 2x + 3 = 7", options: ["x = 2","x = 3","x = 5","x = 7"], correctAnswer: 0 },
      ],
    },
    {
      title: "Algebra & Calculus Quiz",
      questions: [
        { text: "Limit of sin(x)/x as x→0?", options: ["0","1","∞","Does not exist"], correctAnswer: 1 },
        { text: "Roots of x²−5x+6=0?", options: ["1,6","2,3","−2,−3","3,6"], correctAnswer: 1 },
        { text: "d/dx (e^x) = ?", options: ["x e^x","e^x","ln(x)","x"], correctAnswer: 1 },
      ],
    },
  ],
  History: [
    {
      title: "History Exam",
      questions: [
        { text: "First US President?", options: ["Abraham Lincoln","George Washington","Thomas Jefferson","John Adams"], correctAnswer: 1 },
        { text: "WWII ended in?", options: ["1945","1939","1918","1963"], correctAnswer: 0 },
        { text: "Empire of the Colosseum?", options: ["Greek","Roman","Ottoman","Byzantine"], correctAnswer: 1 },
      ],
    },
    {
      title: "Modern History Quiz",
      questions: [
        { text: "Cold War mainly between?", options: ["USA & USSR","USA & China","UK & Germany","France & Spain"], correctAnswer: 0 },
        { text: "UN founded in?", options: ["1919","1945","1955","1969"], correctAnswer: 1 },
        { text: "The Marshall Plan aimed to?", options: ["Rebuild Europe","Colonize Africa","Disarm Japan","Create NATO"], correctAnswer: 0 },
      ],
    },
  ],
  Literature: [
    {
      title: "Literature Exam",
      questions: [
        { text: "Author of 'Romeo and Juliet'?", options: ["Shakespeare","Dickens","Austen","Tolstoy"], correctAnswer: 0 },
        { text: "'Don Quixote' language?", options: ["English","Spanish","French","Italian"], correctAnswer: 1 },
        { text: "Author of 'Pride and Prejudice'?", options: ["E. Brontë","C. Brontë","J. Austen","G. Eliot"], correctAnswer: 2 },
      ],
    },
    {
      title: "Poetry & Prose Quiz",
      questions: [
        { text: "Haiku syllable pattern?", options: ["5-5-7","5-7-5","7-5-7","7-7-5"], correctAnswer: 1 },
        { text: "Metaphor is…", options: ["Exaggeration","Direct comparison","Indirect comparison","Sound imitation"], correctAnswer: 2 },
        { text: "Alliteration repeats…", options: ["Vowel sounds","Consonant sounds","Rhymes","Syllables"], correctAnswer: 1 },
      ],
    },
  ],
  "Computer Science": [
    {
      title: "Computer Science Exam",
      questions: [
        { text: "HTML stands for?", options: ["Hyper Trainer Marking Language","Hyper Text Markup Language","High Transfer Mark Language","Home Tool Markup Language"], correctAnswer: 1 },
        { text: "FIFO structure?", options: ["Stack","Queue","Tree","Graph"], correctAnswer: 1 },
        { text: "Primary Android language?", options: ["Swift","Java","Python","C#"], correctAnswer: 1 },
      ],
    },
    {
      title: "Data Structures Quiz",
      questions: [
        { text: "Binary search requires…", options: ["Sorted array","Linked list","Hash map","Tree only"], correctAnswer: 0 },
        { text: "DFS uses typically…", options: ["Queue","Stack","Priority queue","Deque"], correctAnswer: 1 },
        { text: "Big-O of quicksort average?", options: ["O(n)","O(n log n)","O(n²)","O(log n)"], correctAnswer: 1 },
      ],
    },
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for seeding");

    // Clear everything
    await Promise.all([
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Exam.deleteMany({}),
      Question.deleteMany({}),
      Answer.deleteMany({}),
    ]);
    console.log("🧹 Cleared all collections");

    // ---- Teachers ----
    const teachers = await Teacher.insertMany([
      { name: "Dr. Albert Cohen",    email: "albert.cohen@gmail.com",   password: await bcrypt.hash("123", 10), subject: "Physics" },
      { name: "Prof. Sara Levi",     email: "sara.levi@gmail.com",      password: await bcrypt.hash("123", 10), subject: "Mathematics" },
      { name: "Dr. David Ben-Ari",   email: "david.benari@gmail.com",   password: await bcrypt.hash("123", 10), subject: "History" },
      { name: "Ms. Miriam Shaked",   email: "miriam.shaked@gmail.com",  password: await bcrypt.hash("123", 10), subject: "Literature" },
      { name: "Eng. Tomer Ashkenazi",email: "tomer.ashkenazi@gmail.com",password: await bcrypt.hash("123", 10), subject: "Computer Science" },
    ]);
    console.log(`👨‍🏫 Inserted ${teachers.length} teachers`);

    // ---- Students ----
    const students = await Student.insertMany([
      { name: "Yossi Mizrahi",   email: "yossi.mizrahi@gmail.com",   password: await bcrypt.hash("123", 10), grade: 95 },
      { name: "Dana Cohen",      email: "dana.cohen@gmail.com",      password: await bcrypt.hash("123", 10), grade: 85 },
      { name: "Mohammed Hassan", email: "mohammed.hassan@gmail.com", password: await bcrypt.hash("123", 10), grade: 90 },
      { name: "Rina Levi",       email: "rina.levi@gmail.com",       password: await bcrypt.hash("123", 10), grade: 80 },
      { name: "Omar Saleh",      email: "omar.saleh@gmail.com",      password: await bcrypt.hash("123", 10), grade: 75 },
      { name: "Noa Shapiro",     email: "noa.shapiro@gmail.com",     password: await bcrypt.hash("123", 10), grade: 95 },
      { name: "Eli Katz",        email: "eli.katz@gmail.com",        password: await bcrypt.hash("123", 10), grade: 85 },
      { name: "Lina Abadi",      email: "lina.abadi@gmail.com",      password: await bcrypt.hash("123", 10), grade: 90 },
      { name: "Avi Rosen",       email: "avi.rosen@gmail.com",       password: await bcrypt.hash("123", 10), grade: 95 },
      { name: "Maya Haddad",     email: "maya.haddad@gmail.com",     password: await bcrypt.hash("123", 10), grade: 80 },
    ]);
    console.log(`👩‍🎓 Inserted ${students.length} students`);

    // Helper: seed one exam (create Question docs, Exam doc, and Answer docs)
    let examIndex = 0;
    const seedExamForTeacher = async (teacherDoc, spec) => {
      const qdocs = await Question.insertMany(spec.questions);
      const exam = await Exam.create({
        title: spec.title,
        teacher: teacherDoc._id,
        questions: qdocs.map(q => q._id),
      });

      // Choose participants (rotating slice) — 6 per exam or fewer if not enough students
      const countParticipants = Math.min(6, students.length);
      const start = (examIndex * 3) % students.length; // rotate to vary participants per exam
      const participants = Array.from({ length: countParticipants }, (_, i) => students[(start + i) % students.length]);

      const answersPayloads = participants.map((stu, idx) => {
        // tiers to vary correctness: 0≈80%, 1≈50%, 2≈20%
        const tier = idx % 3;
        const items = qdocs.map((q) => {
          let pick;
          if (tier === 0) pick = Math.random() < 0.8 ? q.correctAnswer : (q.correctAnswer + 1) % 4;
          else if (tier === 1) pick = Math.random() < 0.5 ? q.correctAnswer : (q.correctAnswer + 2) % 4;
          else pick = Math.random() < 0.2 ? q.correctAnswer : (q.correctAnswer + 3) % 4;
          const isCorrect = pick === q.correctAnswer;
          return { question: q._id, selectedOption: pick, isCorrect };
        });

        const score = items.filter(x => x.isCorrect).length;
        const total = qdocs.length;
        const percentage = Math.round((score * 100) / total);

        return {
          exam: exam._id,
          student: stu._id,
          answers: items,
          score,
          total,
          percentage,
          submittedAt: new Date(),
        };
      });

      await Answer.insertMany(answersPayloads);
      console.log(`📝 Seeded exam "${spec.title}" for ${teacherDoc.name} with ${participants.length} answers`);
      examIndex += 1;
    };

    // For each teacher, create multiple exams from their subject bank
    for (const t of teachers) {
      const bank = examBanks[t.subject] || [];
      if (bank.length === 0) {
        // Fallback generic if subject not in bank
        await seedExamForTeacher(t, {
          title: `${t.subject} Assessment`,
          questions: [
            { text: "Generic Q1?", options: ["A","B","C","D"], correctAnswer: 0 },
            { text: "Generic Q2?", options: ["A","B","C","D"], correctAnswer: 1 },
            { text: "Generic Q3?", options: ["A","B","C","D"], correctAnswer: 2 },
          ],
        });
        continue;
      }
      // Create all exams in the subject bank (=> more than one exam per teacher)
      for (const spec of bank) {
        await seedExamForTeacher(t, spec);
      }
    }

    const [examCount, qCount, ansCount] = await Promise.all([
      Exam.countDocuments(), Question.countDocuments(), Answer.countDocuments()
    ]);
    console.log(`✅ Totals → Exams: ${examCount}, Questions: ${qCount}, Answers: ${ansCount}`);

    console.log("🎉 Database seeded successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
};

seed();
