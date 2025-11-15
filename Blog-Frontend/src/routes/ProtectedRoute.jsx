import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Checking auth...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};
