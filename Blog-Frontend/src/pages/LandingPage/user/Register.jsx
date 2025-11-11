import { useState, useRef } from "react";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, InputField, Modal } from "../../../components/ui";
import { useAuth } from "../../../hooks/useAuth";

export const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const from = location.state?.from?.pathname || "/home"; 

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
    const { name, email, password } = form;

    if (!name || !email || !password)
      return setMessage("All fields are required.");
    if (password.length < 8)
      return setMessage("Password must be at least 8 characters long.");

    setLoading(true);
    try {
      const res = await register(form);

      if (res.success) {
        setMessage(res.message || "✅ Registration successful!");
        setTimeout(() => {
          navigate(from, { replace: true });
          handleClose();
        }, 1000);
      } else {
        setMessage(res.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: "", email: "", password: "" });
    setMessage("");
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
          ref={nameRef}
          onKeyDown={(e) => handleKeyDown(e, emailRef)}
        />
        <InputField
          id="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          ref={emailRef}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
        />
        <InputField
          id="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          showToggle
          placeholder="Enter your password"
          ref={passwordRef}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e); }}
        />

        <Button type="submit" loading={loading} className="w-full p-2 rounded-lg">
          {loading ? "Registering..." : "Register"}
        </Button>

        {message && (
          <p className={`text-center text-sm transition-colors ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => {
              handleClose();
              onSwitchToLogin();
            }}
          >
            Login
          </button>
        </p>

        <div className="flex flex-col items-center mt-5">
          <div className="flex items-center w-full mb-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <GoogleLoginButton />
        </div>
      </form>
    </Modal>
  );
};
