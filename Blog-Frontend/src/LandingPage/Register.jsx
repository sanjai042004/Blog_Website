import { useState } from "react";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, InputField, Modal } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (feedback.text) setFeedback({ type: "", text: "" });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;

    if (!name || !email || !password) {
      return setFeedback({
        type: "error",
        text: "All fields are required.",
      });
    }

    if (!isValidEmail(email)) {
      return setFeedback({
        type: "error",
        text: "Enter a valid email address.",
      });
    }

    if (!isStrongPassword(password)) {
      return setFeedback({
        type: "error",
        text:
          "Password must be 8+ chars, include 1 uppercase and 1 number.",
      });
    }

    setLoading(true);

    try {
      const res = await register(form);

      if (res && res.success === true) {
        setFeedback({
          type: "success",
          text: res.message || "Registration successful!",
        });
        navigate(from, { replace: true });
        handleClose();
      } else {
        setFeedback({
          type: "error",
          text: res?.message || "Registration failed.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: "", email: "", password: "" });
    setFeedback({ type: "", text: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Join CodeVerse">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />

        <InputField
          id="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          showToggle
        />

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Registering..." : "Register"}
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

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              handleClose();
              onSwitchToLogin();
            }}
            className="text-blue-600 hover:underline"
          >
            Login
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
    </Modal>
  );
};
