import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GoogleLoginButton } from "./GoogleLoginButton";

export const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(form.email, form.password);

    if (result.success) {
      onClose();
      navigate("/home");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleSwitchToRegister = () => {
    if (typeof onSwitchToRegister === "function") {
      onClose();
      onSwitchToRegister();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      onClick={onClose}>

      <div
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 cursor-pointer hover:text-black text-xl">
          ✖
        </button>

        <h2 className="text-2xl font-serif text-center mb-6">Welcome back.</h2>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-md mb-4 text-center">
            {error}
          </div>
        )}
       

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-black"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-black"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-full text-white transition cursor-pointer mb-2 mt-3 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <GoogleLoginButton mode="login" />

        <p className="text-center text-sm mt-6">
          No account?{" "}
          <button
            type="button"
            onClick={handleSwitchToRegister}
            className="text-green-600 hover:underline cursor-pointer">
            Create one
          </button>
        </p>

         <p className="text-xs text-gray-500 text-center mt-4">
          By clicking “Sign In”, you accept codeVerse’s{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
};
