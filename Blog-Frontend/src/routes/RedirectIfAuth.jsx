import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const RedirectIfAuth = () => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Checking session...</p>;

  if (user) return <Navigate to="/home" replace />;
  return <Outlet />;
};
