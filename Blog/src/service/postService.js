import axios from "axios";

const API_URL = "http://localhost:5000/api/post"; 

// Create a new post
export const createPost = async (postData) => {
  try {
    const res = await axios.post(API_URL, postData);
    return res.data;
  } catch (error) {
    console.error("Error creating post:", error.response?.data || error.message);
    throw error;
  }
};
