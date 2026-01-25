import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../service/authService";
import { getProfileImage } from "../utilis/utilis";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  const register = async (formData) => {
    const data = await authService.register(formData);

    if (data.success && data.user) {
      localStorage.setItem("accessToken", data.accessToken);
      setUser({
        ...data.user,
        profileImage: getProfileImage(data.user.profileImage),
      });
    }

    return data;
  };

  const login = async (formData) => {
    const data = await authService.login(formData);

    if (data.success && data.user) {
      localStorage.setItem("accessToken", data.accessToken);
      setUser({
        ...data.user,
        profileImage: getProfileImage(data.user.profileImage),
      });
    }

    return data;
  };

  const googleLogin = async (token) => {
    const data = await authService.googleLogin(token);

    if (data.success && data.user) {
      localStorage.setItem("accessToken", data.accessToken);
      setUser({
        ...data.user,
        profileImage: getProfileImage(data.user.profileImage),
      });
    }

    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}

    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
  };

  const updateProfile = async (form) => {
    const data = await authService.updateProfile(form);

    if (data.success && data.user) {
      setUser({
        ...data.user,
        profileImage: getProfileImage(data.user.profileImage),
      });
      return { success: true };
    }

    return { success: false, message: "Profile update failed" };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        googleLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
const context = useContext(AuthContext);


if (!context) {
throw new Error("useAuth must be used inside AuthProvider");
}


return context;
};