import api from "./api";

export const submitAnswers = (data) => api.post("/answers", data);
export const getAnswers = (examId) => api.get(`/answers/${examId}`);
