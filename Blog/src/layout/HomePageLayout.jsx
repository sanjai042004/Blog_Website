import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbars";
import { Footer } from "../components/ui";



export const HomePageLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
