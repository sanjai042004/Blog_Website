import { Link } from "react-router-dom";

export const MainNav = ({ onLogin, onRegister }) => {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm sticky top-0 z-30">
      <nav className="p-4 flex items-center justify-between max-w-6xl mx-auto gap-4">
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex-shrink-0"
        >
          codeVerse
        </Link>

        <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6 w-full md:w-auto">
          <button className="text-base text-gray-700 font-medium hover:text-black transition-colors cursor-pointer">
            Write
          </button>

          <button
            onClick={onLogin}
            className="hidden md:block text-base text-gray-700 font-medium hover:text-black transition-colors cursor-pointer"
          >
            Sign in
          </button>

          <button
            onClick={onRegister}
            className="px-4 py-2 rounded-2xl bg-black text-white font-medium hover:bg-gray-900 transition-colors text-sm sm:text-base cursor-pointer"
          >
            Get started
          </button>
        </div>
      </nav>
    </header>
  );
};
