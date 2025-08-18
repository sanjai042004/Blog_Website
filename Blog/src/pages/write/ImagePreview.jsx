export const ImagePreview = ({ url }) => (
  <div className="mb-4">
    <img
      src={url}
      alt="preview"
      className=" mt-18 max-w-3xl w-full rounded-lg shadow"
    />
  </div>
);
