import { useOutletContext } from "react-router-dom";

export const LandingPage = () => {
  const outletContext = useOutletContext();
  const onRegisterOpen = outletContext?.onRegisterOpen;

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] justify-center items-center gap-12 px-6">
      <section className="w-full max-w-xl text-center">
        <h1 className="font-serif font-medium text-gray-900 text-5xl sm:text-6xl md:text-7xl leading-tight">
          Human stories <span className="block">& ideas</span>
        </h1>

        <p className="mt-6 text-lg text-gray-800">
          A place to read, write, and deepen your understanding.
        </p>

        <button
          onClick={() => onRegisterOpen?.()}
          className="mt-8 px-6 py-3 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-700 transition disabled:opacity-50 cursor-pointer"
          disabled={!onRegisterOpen}
          aria-label="Create an account to start reading"
        >
          Get started
        </button>
      </section>

      <img
        src="/Softwares.WebP"
        loading="lazy"
        alt="Illustration representing software and ideas"
        className="hidden md:block w-full max-w-md"
      />
    </div>
  );
};
