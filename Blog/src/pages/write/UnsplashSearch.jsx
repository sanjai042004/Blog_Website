import { UnsplashGrid } from "../../components/ui";
import { fetchUnsplashImage } from "../../service/unsplashService";
import { prepareImage } from "../../constant/helper";

export const UnsplashSearch = ({ block, index, handleChange, createNextBlock }) => {

  const closeInput = () => {
    handleChange(index, "ui", { ...(block?.ui || {}), showUnsplashInput: false });
    if (createNextBlock) createNextBlock(index);
  };

  const handleUnsplashSearch = async () => {
    const query = block?.unsplashQuery?.trim();

    if (!query) {
      closeInput();
      return;
    }

    try {
      const images = await fetchUnsplashImage(query);
      handleChange(index, "unsplashResults", images);
    } catch (err) {
      console.error("Error fetching Unsplash images:", err);
      handleChange(index, "unsplashResults", []);
    }
  };

  const handleSelect = (url) => {
    const updated = prepareImage(url, block?.media || []);

    handleChange(index, "media", updated.media);     
    handleChange(index, "preview", updated.preview); 
    handleChange(index, "imageFile", updated.imageFile);
    handleChange(index, "type", "image");            

    handleChange(index, "unsplashResults", []);
    closeInput();
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!block?.unsplashQuery?.trim()) {
        closeInput();
        return;
      }

      handleUnsplashSearch();
    }

    if (e.key === "Backspace" && !(block?.unsplashQuery?.trim())) {
      e.preventDefault();
      closeInput();
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={block?.unsplashQuery || ""}
        onChange={(e) => {
          const value = e.target.value;
          handleChange(index, "unsplashQuery", value);

          if (!(block?.media) && (block?.unsplashResults?.length > 0)) {
            handleChange(index, "unsplashResults", []);
          }
        }}
        onKeyDown={handleKey}
        placeholder="Search Unsplash images..."
        className="border-b outline-none p-2 w-full mb-3"
      />

      {block?.unsplashResults?.length > 0 && (
        <UnsplashGrid images={block.unsplashResults} onSelect={handleSelect} />
      )}
    </div>
  );
};
