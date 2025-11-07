import { useState } from "react";
import { parseYouTubeLink } from "../../constant/helper";

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
    } else {
      handleChange(index, "youtubeEmbed", null);
      setError("Invalid YouTube link. Please try again.");
    }

    closeInput();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleVideoLink();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste YouTube link and press Enter..."
        className="w-xl p-2 mb-3 rounded outline-none shadow-sm"
      />
      {error && <p className="text-red-500 font-semibold">{error}</p>}
    </div>
  );
};
