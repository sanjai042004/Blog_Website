import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { IoIosContact } from "react-icons/io";
import { IoLibraryOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { TfiWrite } from "react-icons/tfi";

export const ProfileDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user"); 
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="ml-6 relative hidden sm:flex">
      <div
        className="cursor-pointer text-2xl"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <CgProfile className="size-8 hover:text-blue-900" />
      </div>

      {showDropdown && (
        <div className="absolute right-0 top-14 bg-white shadow-md rounded-md w-40 z-50">
          <NavLink
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            <IoIosContact className="size-6" /> Profile
          </NavLink>
          <NavLink
            to="/write"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            <TfiWrite className="size-5" /> Write
          </NavLink>
          <NavLink
            to="/library"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            <IoLibraryOutline className="size-5" /> Library
          </NavLink>
          <NavLink
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
          >
            <FiSettings className="size-5" /> Settings
          </NavLink>

          <button
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
            onClick={handleLogout} // ✅ now works
          >
            <BiLogOut className="size-6" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};
