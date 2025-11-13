import { api } from "./api";

// All authentication-related backend calls
export const AuthService = {
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

  // Google login (if you support it)
  googleLogin: async (token) => {
    const { data } = await api.post("/auth/google-login", { token });
    return data;
  },

  // Get the logged-in user's profile
  getProfile: async () => {
    const { data } = await api.get("/auth/profile");
    return data;
  },

  // Logout user
  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  // Update user profile
  updateProfile: async (formData) => {
    const { data } = await api.put("/auth/profile", formData, {
      withCredentials: true,
    });
    return data;
  },
};
