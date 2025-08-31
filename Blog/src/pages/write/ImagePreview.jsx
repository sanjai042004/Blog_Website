export const ImagePreview = ({ url, alt = "preview", className = "" }) => {
  if (!url) return null; 

  return (
    <div className="mb-4 flex justify-center">
      <img
        src={url}
        alt={alt}
        className={`max-w-3xl w-full rounded-lg shadow ${className}`}
        loading="lazy"
      />
    </div>
  );
};
