import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoIosContact } from "react-icons/io";
import { IoLibraryOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { TfiWrite } from "react-icons/tfi";
import { useAuth } from "../../context/AuthContext";
import { useClickAway } from "react-use";

export const ProfileDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const dropdownRef = useRef(null);

  // Close when route changes
  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  
  useClickAway(dropdownRef, () => setShowDropdown(false));

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="ml-6 relative hidden sm:flex" ref={dropdownRef}>
      <div
        className="cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user ? (
          user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.profileImage}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )
        ) : (
          <IoIosContact
            size={24}
            className="w-10 h-10 bg-gray-300 rounded-full p-2 text-gray-700"
          />
        )}
      </div>

      {showDropdown && (
        <div className="absolute right-0 top-14 bg-white shadow-md rounded-md w-44 z-50">
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
            onClick={handleLogout}
          >
            <BiLogOut className="size-6" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};
