import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoIosContact } from "react-icons/io";
import { IoLibraryOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { TfiWrite } from "react-icons/tfi";

export const ProfileDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  const handleLogout = () => {
    setShowDropdown(false);
    alert("Logged out!");
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
            onClick={() => setShowDropdown(false)}
          >
            <IoIosContact /> Profile
          </NavLink>
          <NavLink
            to="/write"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={() => setShowDropdown(false)}
          >
            <TfiWrite /> write
          </NavLink>

          <NavLink
            to="/library"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={() => setShowDropdown(false)}
          >
            <IoLibraryOutline /> Library
          </NavLink>

          <NavLink
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={() => setShowDropdown(false)}
          >
            <FiSettings /> Settings
          </NavLink>

          <button
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
            onClick={handleLogout}
          >
            <BiLogOut /> Logout
          </button>
        </div>
      )}
    </div>
  );
};
