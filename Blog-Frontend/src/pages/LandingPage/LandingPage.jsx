import { useOutletContext } from "react-router-dom";
import softwares from "../../assets/softwares.WebP";

export const LandingPage = () => {
  const { onRegisterOpen } = useOutletContext();

  return (
    <div className="flex flex-col md:flex-row w-auto justify-around items-center mt-40 px-4">
      <section className="w-full flex flex-col items-center px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-tight">
          Human <br /> stories & ideas
        </h1>

        <p className="mt-6 text-lg text-gray-700 max-w-2xl">
          A place to read, write, and deepen your understanding
        </p>

        <button
          onClick={onRegisterOpen}
          className="mt-8 px-6 py-3 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-600 transition cursor-pointer"
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
