import { IoAddCircleOutline, IoCloseCircleOutline, IoImageOutline } from "react-icons/io5";
import { LuFileVideo } from "react-icons/lu";
import { TbBrandUnsplash } from "react-icons/tb";

export const BlockOptions = ({ block = {}, index, handleChange, onUploadClick }) => {
  const ui = block.ui || {};
  const expanded = ui.showOptions;

  if (block.content || block.media || block.youtubeEmbed) return null;

  const toggleOptions = () =>
    handleChange(index, "ui", { ...ui, showOptions: !expanded });

  const setUI = (updates) =>
    handleChange(index, "ui", { ...ui, ...updates, showOptions: false });

  const buttons = [
    { key: "image", Icon: IoImageOutline, action: onUploadClick, hover: "hover:text-green-700 cursor-pointer" },
    { key: "video", Icon: LuFileVideo, action: () => setUI({ showVideoInput: true }), hover: "hover:text-gray-700 cursor-pointer" },
    { key: "unsplash", Icon: TbBrandUnsplash, action: () => setUI({ showUnsplashInput: true }), hover: "hover:text-gray-700 cursor-pointer" },
  ];

  return (
    <div className="flex gap-3 items-center mt-3">
    {/* add cancel  */}
      <button type="button" onClick={toggleOptions} className="cursor-pointer transition-colors">
        {expanded ? (
          <IoCloseCircleOutline className="w-9 h-9 text-gray-500 hover:text-red-500" />
        ) : (
          <IoAddCircleOutline className="w-9 h-9 text-gray-300 hover:text-gray-500" />
        )}
      </button>

      {/* expanded option */}
      {expanded && (
        <div className="flex gap-4 animate-fade-in">
          {buttons.map(({ key, Icon, action, hover }) => (
            <button
              key={key}
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

