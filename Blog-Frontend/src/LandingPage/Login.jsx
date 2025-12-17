import { useState, useRef } from "react";
import { Modal, Button, InputField } from "../components/ui";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { ForgotPassword } from "./ForgotPassword";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (message) setMessage("");
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { email, password } = form;

  if (!email || !password) return setMessage("Please fill in all fields.");

  setLoading(true);
  try {
    const res = await login(form);

    if (res.success) {
      setMessage(res.message || "✅ Login successful!");
      setTimeout(() => {
        navigate(from, { replace: true });
        handleClose();
      }, 1000);
    } else {
      setMessage(res.message || "Invalid credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    setMessage(error.response?.data?.message || "Invalid credentials.");
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    setForm({ email: "", password: "" });
    setMessage("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Welcome Back 👋">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5 px-2 sm:px-4 max-w-md mx-auto w-full"
      >
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          ref={emailRef}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          showToggle
          ref={passwordRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(e);
          }}
        />

        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-600 text-sm hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full p-2 sm:p-3 text-sm sm:text-base"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {message && (
          <p
            className={`text-center text-sm sm:text-base ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-gray-600 text-sm sm:text-base">
          Don’t have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => {
              handleClose();
              onSwitchToRegister();
            }}
          >
            Register
          </button>
        </p>

        <div className="flex flex-col items-center mt-5 sm:mt-6">
          <div className="flex items-center w-full mb-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <GoogleLoginButton />
        </div>
      </form>

      {showForgotPassword && (
        <ForgotPassword
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </Modal>
  );
};
