import axios from "axios";

// ===================== BACKEND URL =====================

 const API_URL = "https://backend-production-81c5.up.railway.app/api"; // Railway backend

// ===================== USER API =====================

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/signup`, userData, {
    withCredentials: true, // ✅ important for cookies
  });
  return response.data;
};

// Login user
export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/users/login`, loginData, {
    withCredentials: true, // ✅ important for cookies
  });
  return response.data;
};

// Tasks API
export const getTasks = async () => {
  const res = await axios.get(`${API_URL}/tasks`, {
    withCredentials: true, // ✅ cookie sent automatically
  });
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await axios.post(`${API_URL}/tasks`, taskData, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await axios.delete(`${API_URL}/tasks/${taskId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getMyTasks = async (userName) => {
  const res = await axios.get(`${API_URL}/tasks/my-tasks/${userName}`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateTask = async (taskId, updatedData) => {
  const res = await axios.put(`${API_URL}/tasks/${taskId}`, updatedData, {
    withCredentials: true,
  });
  return res.data;
};

// Comments API
export const getComments = async () => {
  const res = await axios.get(`${API_URL}/comments`, {
    withCredentials: true,
  });
  return res.data;
};

export const createComment = async (commentData) => {
  const res = await axios.post(`${API_URL}/comments`, commentData, {
    withCredentials: true,
  });
  return res.data;
};

// Projects API
export const getProjects = async () => {
  const res = await axios.get(`${API_URL}/projects`, {
    withCredentials: true,
  });
  return res.data;
};

export const createProject = async (formData) => {
  await axios.post(`${API_URL}/projects`, formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProject = async (id) => {
  await axios.delete(`${API_URL}/projects/${id}`, {
    withCredentials: true,
  });
};

export const updateProject = async (id, formData) => {
  await axios.put(`${API_URL}/projects/${id}`, formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
};
