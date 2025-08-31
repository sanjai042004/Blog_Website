import {
  IoAddCircleOutline,
  IoCloseCircleOutline,
  IoImageOutline,
} from "react-icons/io5";
import { LuFileVideo } from "react-icons/lu";
import { TbBrandUnsplash } from "react-icons/tb";

export const BlockOptions = ({
  block = {},
  index,
  handleChange,
  onUploadClick, 
}) => {
  const ui = block.ui || {}; 
  const expanded = ui.showOptions;

  // If block already has content or media → don't show options
  if (block.content || block.media || block.youtubeEmbed) return null;

  const toggleOptions = () =>
    handleChange(index, "ui", { ...ui, showOptions: !expanded });

  return (
    <div className="flex gap-3 items-center mt-3">
      {/* Toggle Add / Close */}
      <button type="button" onClick={toggleOptions}>
        {expanded ? (
          <IoCloseCircleOutline className="size-9 cursor-pointer text-gray-500 hover:text-red-500 transition" />
        ) : (
          <IoAddCircleOutline className="size-9 cursor-pointer text-gray-300 hover:text-gray-500 transition" />
        )}
      </button>

      {/* Options */}
      {expanded && (
        <div className="flex gap-4 animate-fade-in">
          {/* Upload Image */}
          <button type="button" onClick={onUploadClick}>
            <IoImageOutline className="size-7 cursor-pointer text-gray-500 hover:text-green-700 transition" />
          </button>

          {/* Video */}
          <button
            type="button"
            onClick={() =>
              handleChange(index, "ui", {
                ...ui,
                showVideoInput: true,
                showOptions: false,
              })
            }
          >
            <LuFileVideo className="size-7 cursor-pointer text-gray-500 hover:text-gray-700 transition" />
          </button>

          {/* Unsplash */}
          <button
            type="button"
            onClick={() =>
              handleChange(index, "ui", {
                ...ui,
                showUnsplashInput: true,
                showOptions: false,
              })
            }
          >
            <TbBrandUnsplash className="size-7 cursor-pointer text-gray-500 hover:text-gray-700 transition" />
          </button>
        </div>
      )}
    </div>
  );
};
