import { NavLink } from "react-router-dom";
import {
  House,
  BookOpenText,
  CircleFadingPlus,
  UserRoundPen,
} from "lucide-react";

export const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { name: "Home", link: "/home", icon: <House className="size-6" /> },
    {
      name: "Library",
      link: "/library",
      icon: <BookOpenText className="size-6" />,
    },
    {
      name: "Profile",
      link: "/profile",
      icon: <UserRoundPen className="size-6" />,
    },
    {
      name: "Stories",
      link: "/stories",
      icon: <CircleFadingPlus className="size-6" />,
    },
  ];

  return (
    <div
      className={`fixed top-15 left-0 sm:w-60 h-screen bg-white shadow-lg z-40 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="flex flex-col p-4 gap-6">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.link}
              className="flex items-center gap-4 text-gray-700 hover:text-black"
            >
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
