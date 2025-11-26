import axios from "axios";

// ===================== BACKEND URL =====================
// const API_URL = "http://localhost:5000/api"; // old local backend URL
const API_URL = "https://backend-production-81c5.up.railway.app/api"; // Railway backend URL

// ===================== USER API =====================

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/signup`, userData);
  return response.data;
};

// Login user
export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/users/login`, loginData);
  return response.data;
};

// Tasks API
export const getTasks = async (token) => {
  const res = await axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createTask = async (taskData, token) => {
  const res = await axios.post(`${API_URL}/tasks`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTask = async (taskId, token) => {
  const res = await axios.delete(`${API_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getMyTasks = async (userName, token) => {
  const res = await axios.get(`${API_URL}/tasks/my-tasks/${userName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateTask = async (taskId, updatedData, token) => {
  const res = await axios.put(`${API_URL}/tasks/${taskId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Comments API
export const getComments = async (token) => {
  const res = await axios.get(`${API_URL}/comments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createComment = async (commentData, token) => {
  const res = await axios.post(`${API_URL}/comments`, commentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Projects API
export const getProjects = async (token) => {
  const res = await axios.get(`${API_URL}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createProject = async (formData, token) => {
  await axios.post(`${API_URL}/projects`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProject = async (id, token) => {
  await axios.delete(`${API_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProject = async (id, formData, token) => {
  await axios.put(`${API_URL}/projects/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
