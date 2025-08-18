import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLoginButton } from "./GoogleLoginButton";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register form submit
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register Email:", email, "Password:", password);


  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

       
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="📧 Email"
            className="w-full bg-gray-50 px-6 py-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="🔒 Password"
            className="w-full bg-gray-50 px-6 py-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Register
          </button>
        </form>

       
        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <GoogleLoginButton />

      
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
