import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbars";
import { Sidebar } from "../components/ui/SideBar";
import { Footer } from "../components/ui";

export const HomePageLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        className={`fixed top-0 left-0 h-full w-64 shadow-md z-50 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}/>

      {/* Main content */}
      <main
        className={`flex-1 p-4 transition-all duration-300
          ${sidebarOpen ? "ml-0 md:ml-64" : "ml-0"}`}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
