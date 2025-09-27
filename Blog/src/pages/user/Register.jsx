import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoMailOpenOutline } from "react-icons/io5";

export const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const result = await authRegister(data.name, data.email, data.password);

      if (result.success) {
        setTimeout(() => {
          onClose();
          navigate("/home");
        }, 1500);
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      alert(err.message || "Failed to register");
    }
  };

  const handleSwitchToLogin = () => {
    if (typeof onSwitchToLogin === "function") {
      onClose();
      onSwitchToLogin();
    }
  };

  const handleEmailSignUpClick = () => {
    setShowEmailForm(true);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-black text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-serif text-center mb-6 mt-4">
          Join codeVerse.
        </h2>

        {!showEmailForm ? (
          <button
            className="w-full border rounded-full py-2 mb-4 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:bg-blue-50 transition"
            onClick={handleEmailSignUpClick}
          >
            <IoMailOpenOutline /> Sign up with email
          </button>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-6">
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Name"
              className="border rounded-full py-2 px-4 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
              })}
              placeholder="Email"
              className="border rounded-full py-2 px-4 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
              placeholder="Password"
              className="border rounded-full py-2 px-4 focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white rounded-full py-2 hover:bg-green-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Sign up"}
            </button>
          </form>
        )}

        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="w-full mb-4">
          <GoogleLoginButton mode="register" />
        </div>

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
