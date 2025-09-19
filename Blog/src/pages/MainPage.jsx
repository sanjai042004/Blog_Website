import { useState } from "react";
import softwares from "../assets/softwares.png";
import { Register } from "./user/Register";


export const MainPage = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="flex w-auto justify-around items-center mt-20">
      <section className="w-full flex flex-col items-center px-6">
        {/* Main Title */}
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-900 text-center leading-tight">
          Human <br /> stories & ideas
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg text-gray-700 text-center max-w-2xl">
          A place to read, write, and deepen your understanding
        </p>

        {/* Button */}
        <button
          onClick={() => setShowRegister(true)}
          className="mt-8 px-6 py-3 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-800 transition"
        >
          Start reading
        </button>
      </section>

      {/* Hero Image */}
      <img src={softwares} alt="img" className="max-w-md" />

      {/* Register Popup */}
      <Register isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  );
};
