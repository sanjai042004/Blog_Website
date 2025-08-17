import { parseYouTubeLink } from "./helper";

export const VideoInput = ({ index, handleChange }) => {
  const handleVideoLink = (link) => {
    const embedUrl = parseYouTubeLink(link);
    if (embedUrl) {
      
      handleChange(index, "youtubeEmbed", embedUrl);
      handleChange(index, "showVideoInput", false);
    } else {
     
      handleChange(index, "showVideoInput", false);
      handleChange(index, "youtubeEmbed", null);
      handleChange(index, "content", ""); 
    }
  };

  return (
    <input
      type="text"
      placeholder="Paste YouTube link and press Enter.."
      className="w-full border-none outline-none p-2 mb-4"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleVideoLink(e.target.value.trim());
        }
      }}
    />
  );
};
