export const UnsplashGrid = ({ images = [], loading, onSelect }) => {
  if (loading) return <p className="text-center text-gray-500">Loading images...</p>;
  if (!loading && images.length === 0) return <p className="text-center text-gray-400">No results found</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 mt-3">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`Unsplash ${i}`}
          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 hover:opacity-90 transition"
          onClick={() => onSelect(url)}
        />
      ))}
    </div>
  );
};
