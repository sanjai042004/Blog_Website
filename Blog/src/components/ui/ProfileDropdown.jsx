import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoIosContact } from "react-icons/io";
import { IoLibraryOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { TfiWrite } from "react-icons/tfi";
import { useAuth } from "../../context/AuthContext";
import { useClickAway } from "react-use";

const Avatar = ({ user }) => {
  if (!user) {
    return (
      <IoIosContact
        size={24}
        className="w-10 h-10 bg-gray-300 rounded-full p-2 text-gray-700"
      />
    );
  }

  return user.profileImage ? (
    <img
      src={user.profileImage}
      alt={user.name}
      className="w-10 h-10 rounded-full object-cover"
    />
  ) : (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold">
      {user.name?.[0]?.toUpperCase()}
    </div>
  );
};

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

  const menuItems = [
    { to: "/profile", label: "Profile", icon: <IoIosContact className="size-6" /> },
    { to: "/write", label: "Write", icon: <TfiWrite className="size-5" /> },
    { to: "/library", label: "Library", icon: <IoLibraryOutline className="size-5" /> },
    { to: "/settings", label: "Settings", icon: <FiSettings className="size-5" /> },
  ];

  return (
    <div className="ml-6 relative hidden sm:flex" ref={ref}>
      {/* Avatar */}
      <div className="cursor-pointer" onClick={() => setOpen(!open)}>
        <Avatar user={user} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-14 bg-white shadow-md rounded-md w-44 z-50">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              {item.icon} {item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
          >
            <BiLogOut className="size-6" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};
