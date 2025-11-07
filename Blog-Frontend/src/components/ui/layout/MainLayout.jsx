import { useState } from "react";
import { Outlet } from "react-router-dom";
import { MainNav } from "../../Navbars/MainNav";
import { Login, Register } from "../../../pages/LandingPage";
import { Footer } from "./Footer";

export const MainLayout = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openLogin = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav onLogin={openLogin} onRegister={openRegister} />

      <main className="flex-1">
        <Outlet context={{ onLoginOpen: openLogin, onRegisterOpen: openRegister }} />
      </main>

      <Footer />

      {activeModal === "login" && (
        <Login
          isOpen
          onClose={closeModal}
          onSwitchToRegister={openRegister}
        />
      )}

      {activeModal === "register" && (
        <Register
          isOpen
          onClose={closeModal}
          onSwitchToLogin={openLogin}
        />
      )}
    </div>
  );
};
