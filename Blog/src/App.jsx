import { Outlet } from "react-router-dom";
import { useState } from "react";
import { userData } from "./constant/data";
import { Navbar } from "./components/Navbars";
import { Footer } from "./components/ui";


export const App = () => {
  const [user, setUser] = useState(userData);

  return (
    <div className="min-h-screen flex flex-col">
      
      <Navbar />

      <main className="flex-1">
        <Outlet context={{ user, setUser }} />
      </main>

      <Footer />
    </div>
  );
};