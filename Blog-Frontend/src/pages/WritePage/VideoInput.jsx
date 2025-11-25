import { useState } from "react";
import { parseYouTubeLink } from "../../constant/helper";
import { Play, X } from "lucide-react";

export const VideoInput = ({ block, index, handleChange }) => {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  const closeInput = () => {
    handleChange(index, "ui", { ...(block.ui || {}), showVideoInput: false });
    setLink("");
    setError("");
  };

  const handleVideoLink = () => {
    const trimmedLink = link.trim();
    if (!trimmedLink) return closeInput();

    const embedUrl = parseYouTubeLink(trimmedLink);

    if (embedUrl) {
      handleChange(index, "youtubeEmbed", embedUrl);
      setError("");
      closeInput();
    } else {
      setError("Invalid YouTube link. Please try again.");
      handleChange(index, "youtubeEmbed", null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleVideoLink();
    }
  };

  return (
    <div className="w-full max-w-xl p-4 flex flex-col gap-4 bg-white">
      <div className="flex items-center gap-3 w-full">
        <div className="relative w-full">
          {/* Close Button */}
          <button
            onClick={closeInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition cursor-pointer"
          >
            <X size={20} />
          </button>

          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste YouTube link here..."
            className="border border-gray-300 rounded-xl p-2 w-full outline-none focus:border-gray-300 transition"
          />
        </div>

        <button
          onClick={handleVideoLink}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow transition cursor-pointer whitespace-nowrap"
        >
          <Play size={18} />
          Add
        </button>
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
};
