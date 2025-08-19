import api from "./api";

export const makeGroups = (data) => api.post("/groups", data);
