import { api } from "./api";

export const authService = {
  // Register a new user
  register: async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    return data;
  },

  // Login with email/password
  login: async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    return data;
  },

  // Google login
  googleLogin: async (token) => {
    const { data } = await api.post("/auth/google-login", { token });
    return data;
  },

  // Get the logged-in user's profile
  getProfile: async () => {
    const { data } = await api.get("/users/profile");
    return data;
  },

  // Logout user
  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  // Update user profile
  updateProfile: async (formData) => {
    const { data } = await api.put("/users/update", formData, {
      withCredentials: true,
    });
    return data;
  },
};
