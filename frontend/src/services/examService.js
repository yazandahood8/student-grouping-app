import api from "./api";

// 🔹 Helper להכניס token ל־headers
const authHeader = () => {
  const token = localStorage.getItem("token"); // 👈 מניח ששמרת token אחרי login
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const getExams = () => api.get("/exams", authHeader());
export const createExam = (data) => api.post("/exams", data, authHeader());
export const getMyExams = () => api.get("/exams/my", authHeader());
