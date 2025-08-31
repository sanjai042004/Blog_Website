import { UnsplashGrid } from "../../components/ui";
import { fetchUnsplashImage } from "../../service/unsplashService";
import { prepareImage } from "../../constant/helper";

export const UnsplashSearch = ({ block, index, handleChange }) => {

  const handleUnsplashSearch = async () => {
    if (!block.unsplashQuery.trim()) return;

    try {
      const images = await fetchUnsplashImage(block.unsplashQuery);
      handleChange(index, "unsplashResults", images);
    } catch (err) {
      console.error("Error fetching Unsplash images:", err);
      handleChange(index, "unsplashResults", []);
    }
  };

  const handleSelect = (url) => {
    const updated = prepareImage(url, block.media);

    handleChange(index, "media", updated.media);     
    handleChange(index, "preview", updated.preview); 
    handleChange(index, "imageFile", updated.imageFile);
    handleChange(index, "type", "image");            
    
    // clear grid after selecting
    handleChange(index, "unsplashResults", []);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={block.unsplashQuery || ""}
        onChange={(e) => {
          const value = e.target.value;
          handleChange(index, "unsplashQuery", value);

          if (!block.media && block.unsplashResults?.length > 0) {
            handleChange(index, "unsplashResults", []);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleUnsplashSearch();
          }
        }}
        placeholder="Search Unsplash images..."
        className="border-b outline-none p-2 w-full mb-3"
      />

      {block.unsplashResults?.length > 0 && (
        <UnsplashGrid images={block.unsplashResults} onSelect={handleSelect} />
      )}

    </div>
  );
};
