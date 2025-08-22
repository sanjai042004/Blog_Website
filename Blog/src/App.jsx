import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbars";
import { Footer } from "./components/ui";
import { useAuth } from "./context/AuthContext";

export const App = () => {
  const { user, setUser, logout, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} logout={logout} />

      <main className="flex-1">
        <Outlet context={{ user, setUser }} />
      </main>

      <Footer />
    </div>
  );
};
