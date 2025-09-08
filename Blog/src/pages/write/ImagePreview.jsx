export const ImagePreview = ({ url, alt = "preview", className = "", onRemove }) => {
  if (!url) return null;

  return (
    <div className="mb-4 relative flex justify-center">
      <img
        src={url}
        alt={alt}
        className={`max-w-3xl w-full rounded-lg shadow ${className}`}
        loading="lazy"
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-1 bg-white p-1 rounded-full shadow hover:bg-red-100"
          aria-label="Remove image"
        >
          ✕
        </button>
      )}
    </div>
  );
};
