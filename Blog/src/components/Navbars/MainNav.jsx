import { Link } from "react-router-dom";

export const MainNav = () => {
  return (
    <header className="w-full  border-b">
      <nav className="flex items-center justify-around  py-10">
        {/* Logo */}
        <div>
          <Link
            to="/"
            className="text-5xl font-extrabold text-black "
          >
            codeVerse
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/register"
            className="text-xl text-gray-700 font-medium"
          >
            Write
          </Link>
          <Link
            to="/login"
            className="text-xl text-gray-700 font-medium "
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-2xl bg-black text-white font-medium "
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
};
