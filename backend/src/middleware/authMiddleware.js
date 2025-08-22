import jwt from "jsonwebtoken";

// Usage:
//   authMiddleware()                         -> any authenticated user
//   authMiddleware(['student'])              -> only students
//   authMiddleware(['teacher'])              -> only teachers

export const authMiddleware = (roles = []) => (req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);

  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id, role };
    if (roles.length && !roles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};