export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-lg text-gray-600">Oops! The page you are looking for does not exist.</p>

      <a
        href="/home"
        className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
      >
        Go Back Home
      </a>
    </div>
  );
};
