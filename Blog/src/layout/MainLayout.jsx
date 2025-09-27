import { useState } from "react";
import { Outlet } from "react-router-dom";
import { MainNav } from "../components/Navbars/MainNav";
import { Login, Register } from "../pages/user";
import { Footer } from "../components/ui";

export const MainLayout = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleSwitchToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleSwitchToRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] flex flex-col">
      <MainNav
        onLoginOpen={() => setLoginOpen(true)}
        onRegisterOpen={() => setRegisterOpen(true)}
      />

      
      <main className="flex-1">
        <Outlet context={{ onRegisterOpen: () => setRegisterOpen(true) }} />
      </main>

      
      <Login
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <Register
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
     <Footer />
    </div>
  );
};
