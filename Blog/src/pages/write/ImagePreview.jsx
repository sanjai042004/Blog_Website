export const ImagePreview = ({ url, alt = "preview", className = "", onRemove }) => {
  if (!url) return null;

  return (
    <div className="mb-4 relative flex justify-center">
      <img
        src={url}
        alt={alt}
        className={`w-full max-w-xl rounded-lg${className}`}
        loading="lazy"
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-1  p-1 rounded-full cursor-pointer "
          aria-label="Remove image"
        >
          ✕
        </button>
      )}
    </div>
  );
};
