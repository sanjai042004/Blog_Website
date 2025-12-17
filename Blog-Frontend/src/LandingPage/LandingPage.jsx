import { useOutletContext } from "react-router-dom";
import softwares from "../assets/softwares.WebP";

export const LandingPage = () => {
  const { onRegisterOpen } = useOutletContext();

  return (
    <div className="flex flex-col md:flex-row w-auto justify-around items-center mt-40 px-4">
      <section className="w-full flex flex-col items-center px-6 text-center">
        <h1
          className="font-serif font-medium text-gray-900 
               text-6xl sm:text-5xl md:text-8xl leading-tight"
        >
          <span className="block">Human</span>
          <span className="block md:inline">stories</span>
          <span className="block md:inline"> & ideas</span>
        </h1>

        <p className="mt-6 text-lg text-gray-800 max-w-2xl">
          A place to read, write, and deepen your understanding
        </p>

        <button
          onClick={onRegisterOpen}
          className="mt-8 px-6 py-3 bg-green-700 md:bg-black text-white text-lg font-medium rounded-full hover:bg-gray-600 transition cursor-pointer"
        >
          Start reading
        </button>
      </section>

      <img
        src={softwares}
        loading="lazy"
        alt="Softwares illustration"
        className="w-full hidden md:block max-w-sm md:max-w-md mt-10 md:mt-0"
      />
    </div>
  );
};
