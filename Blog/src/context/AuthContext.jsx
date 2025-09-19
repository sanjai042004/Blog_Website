import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../service/api";

const AuthContext = createContext();

//Format profile image URLs 
const formatProfileImage = (img) => {
  if (!img) return null;
  if (/^https?:\/\//.test(img)) return img;
  const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
  const imagePath = img.replace(/^\//, "");
  return `${baseURL}/${imagePath}?t=${Date.now()}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save / clear user
  const saveUser = (userData) => setUser(userData || null);
  const clearUser = () => setUser(null);

  // Centralized user state update
  const updateUserState = (userData) => {
    if (!userData) return clearUser();
    const formattedUser = { ...userData, profileImage: formatProfileImage(userData.profileImage) };
    setUser(formattedUser);
    setError(null);
    return formattedUser;
  };

  // Fetch profile from backend
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/profile", { withCredentials: true });
      if (data.success) return updateUserState(data.user);
      clearUser();
      return null;
    } catch {
      clearUser();
      setError("Session expired. Please log in again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Generic auth request (register/login/google)
  const authRequest = async (endpoint, payload) => {
    try {
      const { data } = await api.post(endpoint, payload, { withCredentials: true });
      if (data.success) return { success: true, user: await fetchProfile() };
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Auth actions
  const register = (name,email, password) => authRequest("/auth/register", { name,email, password });
  const login = (email, password) => authRequest("/auth/login", { email, password });
  const googleLogin = (token) => authRequest("/auth/google", { token });

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const { data } = await api.post("/auth/refresh", {}, { withCredentials: true });
      if (data.success) {
        return { ...data, user: await fetchProfile() };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout Error:", err.response?.data || err.message);
    } finally {
      clearUser();
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
        fetchProfile,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
