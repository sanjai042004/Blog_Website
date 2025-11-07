import { UnsplashGrid } from "../../components/ui";
import { fetchUnsplashImage } from "../../service/unsplashService";
import { prepareImage } from "../../constant/helper";

export const UnsplashSearch = ({ block, index, handleChange, createNextBlock }) => {
  const ui = block?.ui || {};

  const closeInput = () => {
    handleChange(index, "ui", { ...ui, showUnsplashInput: false });
    createNextBlock?.(index); 
  };

  const searchUnsplash = async () => {
    const query = block?.unsplashQuery?.trim();
    if (!query) return closeInput();

    try {
      const images = await fetchUnsplashImage(query);
      handleChange(index, "unsplashResults", images);
    } catch (error) {
      console.error("Unsplash fetch error:", error);
      handleChange(index, "unsplashResults", []);
    }
  };

  const selectImage = (url) => {
    const { media, preview, imageFile } = prepareImage(url);

    handleChange(index, "media", media);
    handleChange(index, "preview", preview);
    handleChange(index, "imageFile", imageFile);
    handleChange(index, "type", "image");

    // Clear results and close search box
    handleChange(index, "unsplashResults", []);
    closeInput();
  };

  // Handle Enter or Backspace keys 
  const handleKeyDown = (e) => {
    const query = block?.unsplashQuery?.trim();

    if (e.key === "Enter") {
      e.preventDefault();
      return query ? searchUnsplash() : closeInput();
    }

    if (e.key === "Backspace" && !query) {
      e.preventDefault();
      closeInput();
    }
  };

  // Handle typing in input 
  const handleChangeInput = (e) => {
    const value = e.target.value;
    handleChange(index, "unsplashQuery", value);

    // Reset previous results when typing a new query
    if (!block?.media && block?.unsplashResults?.length > 0) {
      handleChange(index, "unsplashResults", []);
    }
  };

  return (
    <div className="mb-4">
      {/* Search input box */}
      <input
        type="text"
        value={block?.unsplashQuery || ""}
        onChange={handleChangeInput}
        onKeyDown={handleKeyDown}
        placeholder="Search Unsplash images..."
        className="border-b outline-none p-2 w-full mb-3"
      />

      {/* Show image results */}
      {block?.unsplashResults?.length > 0 && (
        <UnsplashGrid images={block.unsplashResults} onSelect={selectImage} />
      )}
    </div>
  );
};
