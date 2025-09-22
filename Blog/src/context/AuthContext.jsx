import {createContext,useContext,useEffect,useState,useCallback,useMemo,} from "react";
import { api } from "../service/api";
import { getProfileImage } from "../utilis/utilis";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUserState = (userData, bustCache = false) => {
    if (!userData) {
      setUser(null);
      return null;
    }

    const formattedUser = {
      ...userData,
      profileImage: /^https?:\/\//.test(userData.profileImage)
        ? userData.profileImage
        : getProfileImage(userData.profileImage, bustCache),
    };

    setUser(formattedUser);
    return formattedUser;
  };

  // Fetch profile from backend
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/profile", {
        withCredentials: true,
      });

      if (data.success)
         return updateUserState(data.user);
      setUser(null);
      return null;
    } catch {
      setUser(null);
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
      fetchProfile();
    } catch {
      localStorage.removeItem("authUser");
    }
  } else {
    setLoading(false); 
  }
}, [fetchProfile]);


  useEffect(() => {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    else localStorage.removeItem("authUser");
  }, [user]);


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
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      register,
      login,
      googleLogin,
      refreshAccessToken,
      logout,
      fetchProfile,
      loading,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
