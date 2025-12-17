import { api } from "./api";

export const authService = {
  register: async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    return data;
  },

  login: async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    return data;
  },

  googleLogin: async (token) => {
    const { data } = await api.post("/auth/google-login", { token });
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get("/users/profile");
    return data;
  },

  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  updateProfile: async (formData) => {
    const { data } = await api.put("/users/update", formData, {
      withCredentials: true,
    });
    return data;
  },
};
