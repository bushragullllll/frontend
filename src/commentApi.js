// commentApi.js
import axios from "axios";
const { data } = await axios.get("http://localhost:5000/api/comments", {
  headers: { Authorization: `Bearer ${token}` },
});

// Get all comments
export const getComments = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new comment
export const createComment = async (commentData, token) => {
  const response = await axios.post(API_URL, commentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
