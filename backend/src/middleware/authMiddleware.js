// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // make sure correct path

export const authMiddleware = (req, res, next) => {
  try {
    // בודקים אם יש header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    // שולפים את הטוקן
    const token = authHeader.split(" ")[1];

    // מוודאים את הטוקן מול ה־secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // שמים את המשתמש המבוזר באובייקט request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); // ממשיכים ל־controller
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
