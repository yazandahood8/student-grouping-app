// src/services/groupService.js
import api from "./api";

export const makeGroups = (payload) => api.post("/groups/make", payload);
export const getGroups = (examId) => api.get(`/groups/${examId}`);
