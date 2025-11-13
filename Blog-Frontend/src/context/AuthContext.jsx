import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { AuthService } from "../service/authService";
import { getProfileImage } from "../utilis/utilis";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Format & cache user data
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

  // ✅ Fetch user profile from backend
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AuthService.getProfile();
      if (data.success && data.user) updateUserState(data.user);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [updateUserState]);

  // ✅ Auto-load cached user from localStorage
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

  // ✅ Sync user state to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    else localStorage.removeItem("authUser");
  }, [user]);

  // ✅ Register
  const register = useCallback(async (formData) => {
    const data = await AuthService.register(formData);
    if (data.success && data.user) {
      localStorage.setItem("accessToken", data.accessToken);
      updateUserState(data.user, true);
    }
    return data;
  }, [updateUserState]);

  // ✅ Login
  const login = useCallback(async (formData) => {
    const data = await AuthService.login(formData);
    if (data.success && data.user) {
      localStorage.setItem("accessToken", data.accessToken);
      updateUserState(data.user, true);
    }
    return data;
  }, [updateUserState]);

  // ✅ Google login
  const googleLogin = useCallback(async (token) => {
    const data = await AuthService.googleLogin(token);
    if (data.success && data.user) {
      localStorage.setItem("accessToken", data.accessToken);
      updateUserState(data.user, true);
    }
    return data;
  }, [updateUserState]);

  // ✅ Logout
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch {}
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
  }, []);

  // ✅ Update Profile
  const updateProfile = useCallback(async (form) => {
    const data = await AuthService.updateProfile(form);
    if (data.success && data.user) {
      updateUserState(data.user, true);
      return { success: true };
    }
    return { success: false, message: data.message || "Failed to update profile." };
  }, [updateUserState]);

  // ✅ Context value
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
