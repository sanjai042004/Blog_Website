import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { UserProfile } from "../author/UserProfile";
import { useAuth } from "../../context/AuthContext";

export const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative ml-6">
      <div className="cursor-pointer" onClick={() => setOpen(!open)}>
        <UserProfile user={user} />
      </div>

      {open && (
        <div className="absolute right-0 top-14 w-56 bg-white shadow-md rounded-md overflow-hidden animate-fadeIn">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <UserProfile user={user} size="w-10 h-10" />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {user?.name || "Your Name"}
              </span>
              <span className="text-sm text-green-600 hover:underline">
                View Profile
              </span>
            </div>
          </NavLink>

          <NavLink
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <Settings className="size-5" /> Settings
          </NavLink>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-left flex items-center border-t border-gray-200 px-4 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
};
