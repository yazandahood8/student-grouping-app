import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Student from "./models/Student.js";
import Teacher from "./models/Teacher.js";
import Exam from "./models/Exam.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for seeding");

    // מחיקת כל האוספים
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Exam.deleteMany({});
    console.log("🧹 Cleared all collections");

    // --- יצירת מורים ---
    const teachers = await Teacher.insertMany([
      { name: "Dr. Albert Cohen", email: "albert.cohen@gmail.com", password: await bcrypt.hash("teacher123", 10), subject: "Physics" },
      { name: "Prof. Sara Levi", email: "sara.levi@gmail.com", password: await bcrypt.hash("teacher123", 10), subject: "Mathematics" },
      { name: "Dr. David Ben-Ari", email: "david.benari@gmail.com", password: await bcrypt.hash("teacher123", 10), subject: "History" },
      { name: "Ms. Miriam Shaked", email: "miriam.shaked@gmail.com", password: await bcrypt.hash("teacher123", 10), subject: "Literature" },
      { name: "Eng. Tomer Ashkenazi", email: "tomer.ashkenazi@gmail.com", password: await bcrypt.hash("teacher123", 10), subject: "Computer Science" },
    ]);
    console.log("👨‍🏫 Inserted 5 teachers");

    // --- יצירת תלמידים ---
    const students = await Student.insertMany([
      { name: "Yossi Mizrahi", email: "yossi.mizrahi@gmail.com", password: await bcrypt.hash("student123", 10), age: 20, grade: 95 },
      { name: "Dana Cohen", email: "dana.cohen@gmail.com", password: await bcrypt.hash("student123", 10), age: 22, grade: 85 },
      { name: "Mohammed Hassan", email: "mohammed.hassan@gmail.com", password: await bcrypt.hash("student123", 10), age: 23, grade: 90 },
      { name: "Rina Levi", email: "rina.levi@gmail.com", password: await bcrypt.hash("student123", 10), age: 21, grade: 80 },
      { name: "Omar Saleh", email: "omar.saleh@gmail.com", password: await bcrypt.hash("student123", 10), age: 24, grade: 75 },
      { name: "Noa Shapiro", email: "noa.shapiro@gmail.com", password: await bcrypt.hash("student123", 10), age: 20, grade: 95 },
      { name: "Eli Katz", email: "eli.katz@gmail.com", password: await bcrypt.hash("student123", 10), age: 22 , grade: 85 },
      { name: "Lina Abadi", email: "lina.abadi@gmail.com", password: await bcrypt.hash("student123", 10), age: 23, grade: 90 },
      { name: "Avi Rosen", email: "avi.rosen@gmail.com", password: await bcrypt.hash("student123", 10), age: 25, grade: 95 },
      { name: "Maya Haddad", email: "maya.haddad@gmail.com", password: await bcrypt.hash("student123", 10), age: 21, grade: 80 },
    ]);
    console.log("👩‍🎓 Inserted 10 students");

    // --- יצירת בחינות ---
    const exams = await Exam.insertMany([
      {
        title: "Physics Final Exam",
        teacher: teachers[0]._id,
        questions: [
          {
            questionText: "What is the speed of light?",
            options: ["3x10^8 m/s", "5x10^6 m/s", "1x10^3 m/s", "None of the above"],
            correctAnswer: 0,
          },
          {
            questionText: "Who developed the theory of relativity?",
            options: ["Newton", "Einstein", "Galileo", "Bohr"],
            correctAnswer: 1,
          },
          {
            questionText: "What is F = ma known as?",
            options: ["Newton’s First Law", "Newton’s Second Law", "Newton’s Third Law", "Hooke’s Law"],
            correctAnswer: 1,
          },
        ],
      },
      {
        title: "Mathematics Exam",
        teacher: teachers[1]._id,
        questions: [
          {
            questionText: "What is the derivative of x²?",
            options: ["x", "2x", "x²", "2"],
            correctAnswer: 1,
          },
          {
            questionText: "What is the integral of 1/x dx?",
            options: ["ln(x)", "x", "1/x²", "e^x"],
            correctAnswer: 0,
          },
          {
            questionText: "Solve: 2x + 3 = 7",
            options: ["x = 2", "x = 3", "x = 5", "x = 7"],
            correctAnswer: 0,
          },
        ],
      },
      {
        title: "History Exam",
        teacher: teachers[2]._id,
        questions: [
          {
            questionText: "Who was the first President of the United States?",
            options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
            correctAnswer: 1,
          },
          {
            questionText: "In which year did World War II end?",
            options: ["1945", "1939", "1918", "1963"],
            correctAnswer: 0,
          },
          {
            questionText: "Which empire built the Colosseum?",
            options: ["Greek", "Roman", "Ottoman", "Byzantine"],
            correctAnswer: 1,
          },
        ],
      },
      {
        title: "Literature Exam",
        teacher: teachers[3]._id,
        questions: [
          {
            questionText: "Who wrote 'Romeo and Juliet'?",
            options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Leo Tolstoy"],
            correctAnswer: 0,
          },
          {
            questionText: "In which language was 'Don Quixote' originally written?",
            options: ["English", "Spanish", "French", "Italian"],
            correctAnswer: 1,
          },
          {
            questionText: "Who is the author of 'Pride and Prejudice'?",
            options: ["Emily Brontë", "Charlotte Brontë", "Jane Austen", "George Eliot"],
            correctAnswer: 2,
          },
        ],
      },
      {
        title: "Computer Science Exam",
        teacher: teachers[4]._id,
        questions: [
          {
            questionText: "What does HTML stand for?",
            options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "High Transfer Mark Language", "Home Tool Markup Language"],
            correctAnswer: 1,
          },
          {
            questionText: "Which data structure uses FIFO (First In First Out)?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            correctAnswer: 1,
          },
          {
            questionText: "Which programming language is primarily used for Android development?",
            options: ["Swift", "Java", "Python", "C#"],
            correctAnswer: 1,
          },
        ],
      },
    ]);
    console.log("📝 Inserted exams");

    console.log("🎉 Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
};

seed();
