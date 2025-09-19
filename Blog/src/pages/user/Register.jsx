import { useState } from "react";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";
import { IoMailOpenOutline } from "react-icons/io5";

export const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { register } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSwitchToLogin = () => {
    if (typeof onSwitchToLogin === "function") {
      onClose();
      onSwitchToLogin();
    }
  };

  const handleEmailSignUpClick = () => {
    setShowEmailForm(true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await register(name, email, password);

      if (result.success) {
        setSuccess("Account created successfully!");
        setTimeout(() => {
          onClose();
          navigate("/home");
        }, 1500);
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      onClick={onClose}>
      <div
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}>
      
        <button onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl">
          ✖
        </button>

        <h2 className="text-2xl font-serif text-center mb-6">
          Join codeVerse.
        </h2>

      
        <div className="w-full mb-4">
          <GoogleLoginButton mode="register" />
        </div>

        {!showEmailForm ? (
          <button
            className="w-full border rounded-full py-2 mb-6 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:bg-blue-50 transition"
            onClick={handleEmailSignUpClick}>
            <IoMailOpenOutline /> Sign up with email
          </button>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white rounded-full py-2 hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Sign up"}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm text-center">{success}</p>
            )}
          </form>
        )}

        <p className="text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleSwitchToLogin}
            className="text-green-600 cursor-pointer hover:underline"
          >
            Sign in
          </button>
        </p>

        <p className="text-xs text-gray-500 text-center mt-4">
          By clicking “Sign up”, you accept codeVerse’s{" "}
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
