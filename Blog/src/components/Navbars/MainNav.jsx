import { useState } from "react";
import { Link } from "react-router-dom";
import { Register } from "../../pages/user/Register";
import { Login } from "../../pages/user/Login";

export const MainNav = () => {

  const [activeModal, setActiveModal] = useState(null);

  return (
    <header className="w-full border-b">
      <nav className="p-10 flex items-center justify-around">
        {/* Logo */}
        <div>
          <Link to="/" className="text-5xl font-extrabold text-black">
            codeVerse
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveModal("register")}
            className="text-xl text-gray-700 font-medium">
            Write
          </button>
          <button
            onClick={() => setActiveModal("login")}
            className="text-xl text-gray-700 font-medium">
            Sign in
          </button>
          <button
            onClick={() => setActiveModal("register")}
            className="px-4 py-2 rounded-2xl bg-black text-white font-medium">
            Get started
          </button>
        </div>
      </nav>

      {/* Modals */}
      <Register
        isOpen={activeModal === "register"}
        onClose={() => setActiveModal(null)}
        onSwitchToLogin={() => setActiveModal("login")}
      />

      <Login
        isOpen={activeModal === "login"}
        onClose={() => setActiveModal(null)}
        onSwitchToRegister={() => setActiveModal("register")}
      />
    </header>
  );
};
