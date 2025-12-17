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
      className={`
        fixed top-16 left-0 z-40
        h-[calc(100vh-4rem)]
        bg-white shadow-lg
        transition-all duration-300
        overflow-hidden

        /* width */
        ${isOpen ? "w-60" : "w-0"}

        /* mobile slide */
        ${isOpen ? "translate-x-0" : "-translate-x-full"}

        /* desktop */
        md:translate-x-0
      `}
    >
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        <ul className="flex flex-col p-4 gap-5 w-60">
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
      </div>
    </aside>
  );
};
