import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../service/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
      // ❌ don’t remove token here (only on logout)
    }
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile", { withCredentials: true });
      if (res.data.success) {
        saveUser(res.data.user);
        return res.data.user;
      } else {
        clearUser();
        return null;
      }
    } catch {
      console.log("No profile, probably not logged in yet");
      clearUser();
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const authRequest = async (endpoint, payload) => {
    try {
      const res = await api.post(endpoint, payload, { withCredentials: true });

      if (res.data.success) {
        // 🟢 Save access token
        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }

        // Fetch profile after saving token
        const freshUser = await fetchProfile();
        return { success: true, user: freshUser };
      }

      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  const register = (email, password) =>
    authRequest("/auth/register", { email, password });

  const login = (email, password) =>
    authRequest("/auth/login", { email, password });

  const googleLogin = (token) =>
    authRequest("/auth/google", { token });

  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/auth/refresh", {}, { withCredentials: true });

      if (res.data?.success) {
        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }

        const freshUser = await fetchProfile();
        return { ...res.data, user: freshUser };
      } else {
        clearUser();
        return { success: false };
      }
    } catch (err) {
      clearUser();
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      // 🟢 clear both user and token only on logout
      clearUser();
      localStorage.removeItem("accessToken");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: saveUser,
        register,
        login,
        googleLogin,
        refreshAccessToken,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
