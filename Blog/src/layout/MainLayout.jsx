import { Outlet } from "react-router-dom";
import { MainNav } from "../components/Navbars/MainNav";
// import { Footer } from "../components/Footer";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f2]  flex flex-col">
      <MainNav />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};
