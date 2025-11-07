import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebars";
import { Footer } from "./Footer";
import { Navbar } from "../../Navbars/Navbar";

export const HomePageLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          className={`fixed md:static top-0 left-0 h-full w-64 shadow-md z-50 transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        />

        <main
          className={`flex-1 p-4 transition-all duration-300 ${
            sidebarOpen ? "md:ml-64" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
