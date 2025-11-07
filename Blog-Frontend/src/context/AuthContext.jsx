import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { api } from "../service/api";
import { getProfileImage } from "../utilis/utilis";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUserState = useCallback((userData, bustCache = false) => {
    if (!userData) return setUser(null);

    const formattedUser = {
      ...userData,
      profileImage: /^https?:\/\//.test(userData.profileImage)
        ? userData.profileImage
        : getProfileImage(userData.profileImage, bustCache),
    };

    setUser(formattedUser);
    return formattedUser;
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/profile");
      if (data.success && data.user) updateUserState(data.user);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [updateUserState]);

  useEffect(() => {
    const cachedUser = localStorage.getItem("authUser");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        setTimeout(fetchProfile, 300);
      } catch {
        localStorage.removeItem("authUser");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    else localStorage.removeItem("authUser");
  }, [user]);

  const authRequest = useCallback(
    async (endpoint, payload) => {
      try {
        const { data } = await api.post(endpoint, payload);

        if (!data.success) {
          return { success: false, message: data.message };
        }

        if (data.accessToken)
          localStorage.setItem("accessToken", data.accessToken);

        if (data.user) {
          return { success: true, user: updateUserState(data.user, true) };
        }

        const profile = await fetchProfile();
        return { success: true, user: profile };
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || err.message,
        };
      }
    },
    [fetchProfile, updateUserState]
  );

  const register = (formData) => authRequest("/auth/register", formData);
  const login = (formData) => authRequest("/auth/login", formData);
  const googleLogin = (token) => authRequest("/auth/google-login", { token });

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
  }, []);

  const updateProfile = useCallback(
    async (form) => {
      try {
        const { data } = await api.put("/auth/profile", form, {
          withCredentials: true,
        });

        if (data.success && data.user) {
          updateUserState(data.user, true);
          return { success: true };
        }

        return { success: false, message: data.message || "Failed to update profile." };
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || "Failed to update profile.",
        };
      }
    },
    [updateUserState]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      register,
      login,
      googleLogin,
      logout,
      fetchProfile,
      updateProfile,
    }),
    [user, loading, register, login, googleLogin, logout, fetchProfile, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
