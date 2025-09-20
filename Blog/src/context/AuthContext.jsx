import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { api } from "../service/api";

const AuthContext = createContext();

// Format profile image URLs
const formatProfileImage = (img, bustCache = false) => {
  if (!img) return null;
  if (/^https?:\/\//.test(img)) return img;

  const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
  const imagePath = img.replace(/^\//, "");
  return `${baseURL}/${imagePath}${bustCache ? `?t=${Date.now()}` : ""}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save / clear user
  const saveUser = (userData) => setUser(userData || null);
  const clearUser = () => setUser(null);

  // Centralized user state update
  const updateUserState = (userData, bustCache = false) => {
    if (!userData) {
      clearUser();
      return null;
    }

    const formattedUser = {
      ...userData,
      profileImage: /^https?:\/\//.test(userData.profileImage)
        ? userData.profileImage
        : formatProfileImage(userData.profileImage, bustCache),
    };

    setUser(formattedUser);
    setError(null);
    return formattedUser;
  };

  // Fetch profile from backend
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/profile", {
        withCredentials: true,
      });
      if (data.success) return updateUserState(data.user);
      clearUser();
      return null;
    } catch (err) {
      const msg =
        err.response?.data?.message || "Session expired. Please log in again.";
      setError(msg);
      clearUser();
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    const cachedUser = localStorage.getItem("authUser");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
        setLoading(false); 
      } catch {
        localStorage.removeItem("authUser");
      }
    }
    fetchProfile();
  }, [fetchProfile]);

  // Keep user synced with localStorage
  useEffect(() => {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    else localStorage.removeItem("authUser");
  }, [user]);

  // Generic auth request (register/login/google)
  const authRequest = async (endpoint, payload) => {
    try {
      const { data } = await api.post(endpoint, payload, {
        withCredentials: true,
      });

      if (data.success) {
        if (data.user) {
          return { success: true, user: updateUserState(data.user, true) };
        }
        return { success: true, user: await fetchProfile() };
      }

      return { success: false, message: data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  // Auth actions
  const register = (name, email, password) =>
    authRequest("/auth/register", { name, email, password });
  const login = (email, password) =>
    authRequest("/auth/login", { email, password });
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

 
  const value = useMemo(
    () => ({
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
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
