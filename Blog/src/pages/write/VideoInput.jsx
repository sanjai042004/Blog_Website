import { useState } from "react";
import { parseYouTubeLink } from "../../constant/helper";

export const VideoInput = ({ index, handleChange }) => {
  const [link, setLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

 const handleVideoLink = () => {
  const embedUrl = parseYouTubeLink(link.trim());
  if (embedUrl) {
    handleChange(index, "youtubeEmbed", embedUrl);
    setErrorMessage("");
  } else {
    setErrorMessage("Invalid YouTube link. Please try again.");
    handleChange(index, "youtubeEmbed", null);
  }
  handleChange(index, "showVideoInput", false);
  setLink("");
};


  return (
    <div>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Paste YouTube link and press Enter.."
        className="w-full border-none outline-none p-2 mb-4 rounded shadow"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleVideoLink();
          }
        }}
      />
      {errorMessage && (
        <div className="text-red-500 mt-2 font-bold">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
