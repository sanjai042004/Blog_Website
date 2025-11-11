import { useState } from "react";
import { UnsplashGrid } from "../../components/ui";
import { fetchUnsplashImage } from "../../service/unsplashService";
import { prepareImage } from "../../constant/helper";
import { Search, X, ArrowLeft, ArrowRight } from "lucide-react";

export const UnsplashSearch = ({
  block,
  index,
  handleChange,
  createNextBlock,
}) => {
  const ui = block?.ui || {};
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // 🔹 current page

  const closeInput = () => {
    handleChange(index, "ui", { ...ui, showUnsplashInput: false });
    createNextBlock?.(index);
  };

  // 🔹 Fetch Unsplash images by page
  const searchUnsplash = async (newPage = 1) => {
    const query = block?.unsplashQuery?.trim();
    if (!query) return closeInput();

    setLoading(true);
    try {
      const images = await fetchUnsplashImage(query, newPage);
      handleChange(index, "unsplashResults", images);
      setPage(newPage);
    } catch (error) {
      console.error("Unsplash fetch error:", error);
      handleChange(index, "unsplashResults", []);
    } finally {
      setLoading(false);
    }
  };

  const selectImage = (url) => {
    const { media, preview, imageFile } = prepareImage(url);

    handleChange(index, "media", media);
    handleChange(index, "preview", preview);
    handleChange(index, "imageFile", imageFile);
    handleChange(index, "type", "image");

    handleChange(index, "unsplashResults", []);
    closeInput();
  };

  const handleKeyDown = (e) => {
    const query = block?.unsplashQuery?.trim();
    if (e.key === "Enter") {
      e.preventDefault();
      return query ? searchUnsplash(1) : closeInput();
    }
    if (e.key === "Backspace" && !query) {
      e.preventDefault();
      closeInput();
    }
  };

  const handleChangeInput = (e) => {
    const value = e.target.value;
    handleChange(index, "unsplashQuery", value);

    if (!block?.media && block?.unsplashResults?.length > 0) {
      handleChange(index, "unsplashResults", []);
    }
  };

  return (
    <div className="mb-4 w-full">
      {/* Search box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={block?.unsplashQuery || ""}
          onChange={handleChangeInput}
          onKeyDown={handleKeyDown}
          placeholder="Search Unsplash images..."
          className="border border-gray-300 rounded-xl p-2 w-full outline-none focus:border-blue-500 transition"
        />

        <button
          onClick={() => searchUnsplash(1)}
          disabled={loading}
          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-blue-600 active:scale-95 transition"
        >
          <Search size={18} />
          <span className="hidden sm:inline">Search</span>
        </button>

        <button
          onClick={closeInput}
          className="text-gray-400 hover:text-red-500 transition"
          title="Close search"
        >
          <X size={20} />
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <p className="text-sm text-gray-500 mt-2 animate-pulse">
          Loading images...
        </p>
      )}

      {/* Image results */}
      {!loading && block?.unsplashResults?.length > 0 && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <UnsplashGrid images={block.unsplashResults} onSelect={selectImage} />

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => searchUnsplash(page - 1)}
              disabled={page === 1}
              className={`flex items-center gap-1 border border-blue-500 px-4 py-2 rounded-lg transition cursor-pointer ${
                page === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              <ArrowLeft size={18} /> Previous
            </button>

            <button
              onClick={() => searchUnsplash(page + 1)}
              className="flex items-center gap-1 text-blue-600 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 transition cursor-pointer"
            >
              Next <ArrowRight size={18} />
            </button>
          </div>

          {/* Page number display */}
          <p className="text-sm text-gray-500">Page {page}</p>
        </div>
      )}
    </div>
  );
};
