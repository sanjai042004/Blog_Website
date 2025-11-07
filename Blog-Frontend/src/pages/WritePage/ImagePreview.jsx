export const ImagePreview = ({ url, alt = "preview", className = "", onRemove }) => {
  if (!url) return null;

  return (
    <div className="mb-4 relative flex justify-center">
      <div className="relative inline-block">
        <img
          src={url}
          alt={alt}
          className={`max-h-100 w-xl rounded-lg ${className}`}
          loading="lazy"
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 cursor-pointer text-black rounded-full  p-1.5 text-sm"
            aria-label="Remove image"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
