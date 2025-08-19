import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

export const login = async (req, res) => {
  try {
    console.log("📩 Login request body:", req.body);
    const { email, password } = req.body;

    // Try teacher first
    let user = await Teacher.findOne({ email });
    let role = "teacher";

    // If not teacher, try student
    if (!user) {
      user = await Student.findOne({ email });
      role = "student";
    }

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log(`✅ Login success for: ${email} (${role})`);

    // Sign JWT with explicit role
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send token + role back
    res.json({ token, role });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const register = async (req, res) => {
  try {
    console.log("📩 Register request body:", req.body);
    const { email, password, name, role } = req.body;

    // Check if user already exists
    let existingUser = await Teacher.findOne({ email });
    if (!existingUser) {
      existingUser = await Student.findOne({ email });
    }

    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (role === "teacher") {
      user = new Teacher({
        email,
        password: hashedPassword,
        name,
        subject: "General" // Default subject, can be updated later
      });
    } else {
      user = new Student({
        email,
        password: hashedPassword,
        name,
        grade: 10 // Default grade, can be updated later
      });
    }

    await user.save();
    console.log(`✅ Registration success for: ${email} (${role})`);

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role });
  } catch (err) {
    console.error("🔥 Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
