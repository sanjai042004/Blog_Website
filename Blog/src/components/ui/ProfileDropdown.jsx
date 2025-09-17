import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TbSettings2 } from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import { useClickAway } from "react-use";
import { Avatar } from "./Avatar";

export const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => setOpen(false), [location]);
  useClickAway(ref, () => setOpen(false));

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="ml-6 relative hidden sm:flex" ref={ref}>
      {/* Avatar trigger */}
      <div className="cursor-pointer" 
      onClick={() => setOpen(!open)}
      title="Account"
      >
        <Avatar user={user} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-14 bg-white shadow-md rounded-b-sm w-56 overflow-hidden">
          
          {/* Profile preview */}
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <Avatar user={user} className="size-10" />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {user?.name || "Your Name"}
              </span>
              <span className="text-sm text-green-600 hover:underline">
                View Profile
              </span>
            </div>
          </NavLink>

          <div>
            {/* Settings */}
            <NavLink
              to="/settings"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
            >
              <TbSettings2 className="size-5"  /> Settings
            </NavLink>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center border-t border-gray-200  px-4 py-2 text-gray-500 cursor-pointer hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
