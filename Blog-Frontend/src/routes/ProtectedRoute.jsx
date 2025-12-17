import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthLoader } from "../components/ui";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoader />

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};
