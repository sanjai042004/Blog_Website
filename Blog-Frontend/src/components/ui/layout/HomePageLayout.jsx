import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebars";
import { Navbar } from "../../Navbars/Navbar";

export const HomePageLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          className={`fixed md:static top-0 left-0 h-full w-64 shadow-md z-50 transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        />

        {/* Main content */}
        <main
          className={`
            flex-1 px-4 py-6
            transition-all duration-300
            ${sidebarOpen ? "ml-60" : "ml-0"}
          `}
        >
          <Outlet />
        </main>
      </div>

    </div>
  );
};
