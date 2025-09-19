import { useState } from "react";
import { Outlet } from "react-router-dom";
import { MainNav } from "../components/Navbars/MainNav";
import { Login, Register } from "../pages/user";

export const MainLayout = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f6f2] flex flex-col">
      <MainNav
        onLoginOpen={() => setLoginOpen(true)}
        onRegisterOpen={() => setRegisterOpen(true)}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <Register isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
};
