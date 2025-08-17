import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      return setError("⚠️ All fields are required");
    }
    try {
      const payload = { userName: name, email, password };
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );
      if (res.status === 201 || res.status === 200) {
        alert("🎉 Registration successful!");
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again later."
      );
    }
  };

  return (
    <div className="flex items-center justify-center mt-30 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white  p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Create an account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="👤 Full Name"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg outline-none "
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="📧 Email Address"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg outline-none "
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="🔒 Password"
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg outline-none "
        />

        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-3 rounded-lg  shadow-md cursor-pointer"
        >
          🚀 Register
        </button>

        <p className="text-shadow-md text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer font-light"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};
