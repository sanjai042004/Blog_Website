import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../service/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUser = (userData) => setUser(userData);
  const clearUser = () => setUser(null);

  // Fetch profile using cookie (no localStorage token)
  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile", { withCredentials: true });
      if (res.data.success) saveUser(res.data.user);
      else clearUser();
    } catch {
      clearUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Auth requests (login/register)
  const authRequest = async (endpoint, payload) => {
    try {
      const res = await api.post(endpoint, payload, { withCredentials: true });
      if (res.data.success) saveUser(res.data.user);
      return { success: res.data.success };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const register = (email, password) => authRequest("/auth/register", { email, password });
  const login = (email, password) => authRequest("/auth/login", { email, password });
  const googleLogin = (token) => authRequest("/auth/google", { token });

  // Refresh token (cookie-based)
  const refreshAccessToken = async () => {
    try {
      await api.post("/auth/refresh", {}, { withCredentials: true });
      await fetchProfile();
    } catch (err) {
      console.error("Token refresh failed:", err.response?.data || err.message);
      clearUser();
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      clearUser();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, register, login, googleLogin, refreshAccessToken, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
