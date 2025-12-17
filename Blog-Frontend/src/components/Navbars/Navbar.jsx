import { NavLink } from "react-router-dom";
import { SquarePen, Menu, Bell } from 'lucide-react';
import { ProfileDropdown } from "./ProfileDropdown";


export const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-2 border-b border-gray-300 sticky top-0 bg-white z-50">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <button onClick={onMenuClick} className="cursor-pointer">
          <Menu  />
        </button>
        <NavLink to="/home" className="text-black">
          CodeVerse
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        <NavLink
          to="/write"
          className="flex items-center gap-2 text-gray-600 hover:text-black text-lg"
          title="Write"
        >
          <SquarePen className="size-5" />
          <span className="hidden sm:inline">Write</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className="text-gray-600 hover:text-black text-2xl"
          title="Notifications"
        >
          <Bell  />
        </NavLink>

        <ProfileDropdown />
      </div>
    </nav>
  );
};
