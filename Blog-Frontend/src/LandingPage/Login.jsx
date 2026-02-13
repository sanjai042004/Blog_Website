import { useState } from "react";
import { Modal, Button, InputField } from "../components/ui";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { ForgotPassword } from "./ForgotPassword";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (feedback.text) setFeedback({ type: "", text: "" });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email.trim() || !password.trim()) {
      return setFeedback({
        type: "error",
        text: "Email and password are required.",
      });
    }

    if (!isValidEmail(email)) {
      return setFeedback({
        type: "error",
        text: "Enter a valid email address.",
      });
    }

    setLoading(true);

    try {
      const res = await login(form);

      if (res && res.success === true) {
        setFeedback({
          type: "success",
          text: res.message || "Login successful.",
        });
        navigate(from, { replace: true });
        handleClose();
      } else {
        setFeedback({
          type: "error",
          text: res?.message || "Invalid email or password.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Login failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ email: "", password: "" });
    setFeedback({ type: "", text: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Welcome Back">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md mx-auto w-full"
      >
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          showToggle
        />

        <div className="text-right">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-blue-600 text-sm hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {feedback.text && (
          <p
            className={`text-center text-sm ${
              feedback.type === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {feedback.text}
          </p>
        )}

        <p className="text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => {
              handleClose();
              onSwitchToRegister();
            }}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>

        <div className="flex flex-col items-center mt-5">
          <div className="flex items-center w-full mb-3">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <GoogleLoginButton disabled={loading} />
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
