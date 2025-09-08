import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../service/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Save user to state */
  const saveUser = (userData) => setUser(userData || null);

  /** Clear user state */
  const clearUser = () => setUser(null);

  /** Fetch profile from backend (cookies handle auth) */
 const fetchProfile = useCallback(async () => {
  setLoading(true);
  try {
    const res = await api.get("/auth/profile", { withCredentials: true });
    if (res.data.success) {
      const userData = res.data.user;
      const formattedUser = {
        ...userData,
        profileImage: userData.profileImage
          ? userData.profileImage.startsWith("http")
            ? userData.profileImage
            : `${import.meta.env.VITE_API_URL}${userData.profileImage}`
          : null,
      };
      saveUser(formattedUser);
      setError(null);
      return formattedUser;
    } else {
      clearUser();
      return null;
    }
  } 
  catch (err) {
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

  //  Generic auth request (login/register/google)
  const authRequest = async (endpoint, payload) => {
    try {
      const res = await api.post(endpoint, payload, { withCredentials: true });
      if (res.data.success) {
        const freshUser = await fetchProfile();
        return { success: true, user: freshUser };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  /** Auth actions */
  const register = (email, password) => authRequest("/auth/register", { email, password });
  const login = (email, password) => authRequest("/auth/login", { email, password });
  const googleLogin = (token) => authRequest("/auth/google", { token });

  /** Refresh token handled via cookie */
  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/auth/refresh", {}, { withCredentials: true });
      if (res.data.success) {
        return { ...res.data, user: await fetchProfile() };
      } else {
        clearUser();
        return { success: false };
      }
    } catch (err) {
      clearUser();
      throw err;
    }
  };

  /** Logout */
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
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
