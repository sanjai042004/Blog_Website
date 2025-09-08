import { IoAddCircleOutline, IoCloseCircleOutline, IoImageOutline } from "react-icons/io5";
import { LuFileVideo } from "react-icons/lu";
import { TbBrandUnsplash } from "react-icons/tb";

export const BlockOptions = ({ block = {}, index, handleChange, onUploadClick }) => {
  const ui = block.ui || {};
  const expanded = ui.showOptions;

  // Don't show options if block already has content/media/video
  if (block.content || block.media || block.youtubeEmbed) return null;

  // Toggle add / close options
  const toggleOptions = () =>
    handleChange(index, "ui", { ...ui, showOptions: !expanded });

  // Update UI state for showing specific input
  const setUI = (updates) =>
    handleChange(index, "ui", { ...ui, ...updates, showOptions: false });

  // Button definitions
  const buttons = [
    { Icon: IoImageOutline, action: onUploadClick, hover: "hover:text-green-700" },
    { Icon: LuFileVideo, action: () => setUI({ showVideoInput: true }), hover: "hover:text-gray-700" },
    { Icon: TbBrandUnsplash, action: () => setUI({ showUnsplashInput: true }), hover: "hover:text-gray-700" },
  ];

  return (
    <div className="flex gap-3 items-center mt-3">
      {/* Toggle Add / Close Button */}
      <button
        type="button"
        onClick={toggleOptions}
        className="transition-colors"
      >
        {expanded ? (
          <IoCloseCircleOutline className="w-9 h-9 text-gray-500 hover:text-red-500" />
        ) : (
          <IoAddCircleOutline className="w-9 h-9 text-gray-300 hover:text-gray-500" />
        )}
      </button>

      {/* Expanded Options */}
      {expanded && (
        <div className="flex gap-4 animate-fade-in">
          {buttons.map(({ Icon, action, hover }, i) => (
            <button
              key={i}
              type="button"
              onClick={action}
              className={`transition-colors ${hover}`}
            >
              <Icon className="w-7 h-7 text-gray-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
