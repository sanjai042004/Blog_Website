import { Navigate, Outlet } from "react-router-dom";
import { AuthLoader } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export const RedirectAuth = () => {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoader />

  if (user) return <Navigate to="/home" replace />;
  return <Outlet />;
};
