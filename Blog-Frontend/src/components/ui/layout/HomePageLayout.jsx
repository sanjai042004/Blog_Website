import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebars";
import { Navbar } from "../../Navbars/Navbar";

export const HomePageLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(v => !v)} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />

        <main
          className={`
            flex-1 px-4 py-6 transition-all duration-300 ml-0
            ${sidebarOpen ? "md:ml-60" : "md:ml-0"}
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

