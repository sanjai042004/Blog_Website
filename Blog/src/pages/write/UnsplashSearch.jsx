import { UnsplashGrid } from "../../components/ui";
import { fetchUnsplashImage } from "../../service/unsplashService";
import { prepareImage } from "./helper";


export const UnsplashSearch = ({ block, index, handleChange }) => {
  const handleUnsplashSearch = async () => {
    
    if (!block.unsplashQuery) return;

    const images = await fetchUnsplashImage(block.unsplashQuery);
    handleChange(index, "unsplashResults", images);
  };

  const handleSelect = (url) => {
    const updated = prepareImage(url, block.preview);
    handleChange(index, "image", updated.image);
    handleChange(index, "preview", updated.preview);
    handleChange(index, "showImageOptions", updated.showImageOptions);
    handleChange(index, "showUnsplashInput", false);
    handleChange(index, "unsplashResults", []);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={block.unsplashQuery}
        onChange={(e) => handleChange(index, "unsplashQuery", e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUnsplashSearch())}
        className="border-b outline-none p-2 w-2xl mb-3"
      />
      <UnsplashGrid images={block.unsplashResults} onSelect={handleSelect} />
    </div>
  );
};


