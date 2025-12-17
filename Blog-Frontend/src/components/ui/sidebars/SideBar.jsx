import { NavLink } from "react-router-dom";
import {House,BookOpenText,CircleFadingPlus,UserRoundPen,} from "lucide-react";

const MENU = [
  { label: "Home", path: "/", Icon: House },
  { label: "Library", path: "/library", Icon: BookOpenText },
  { label: "Profile", path: "/profile", Icon: UserRoundPen },
  { label: "Stories", path: "/stories", Icon: CircleFadingPlus },
];

export const Sidebar = ({ isOpen }) => {
  return (
    <aside
      className={`fixed top-16 left-0 w-70 h-screen bg-white shadow-lg z-40
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <ul className="flex flex-col p-4 gap-5">
        {MENU.map(({ label, path, Icon }) => (
          <li key={label}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-3 py-2 rounded-md
                 ${
                   isActive
                     ? "bg-gray-100 text-black"
                     : "text-gray-600 hover:text-black"
                 }`
              }
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};
