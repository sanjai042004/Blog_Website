import { Navigate, Outlet } from "react-router-dom";
import { AuthLoader } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoader />

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};
