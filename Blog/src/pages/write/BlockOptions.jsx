import { IoAddCircleOutline, IoCloseCircleOutline, IoImageOutline } from "react-icons/io5";
import { LuFileVideo } from "react-icons/lu";
import { TbBrandUnsplash } from "react-icons/tb";

export const BlockOptions = ({ block = {}, index, handleChange, onUploadClick }) => {
  const ui = block.ui || {};
  const expanded = ui.showOptions;

  // Skip if block already has content/media
  if (block.content || block.media || block.youtubeEmbed) return null;

  const toggleOptions = () =>
    handleChange(index, "ui", { ...ui, showOptions: !expanded });

  const setUI = (updates) =>
    handleChange(index, "ui", { ...ui, ...updates, showOptions: false });

  const buttons = [
    { Icon: IoImageOutline, action: onUploadClick, hover: "hover:text-green-700" },
    { Icon: LuFileVideo, action: () => setUI({ showVideoInput: true }), hover: "hover:text-gray-700" },
    { Icon: TbBrandUnsplash, action: () => setUI({ showUnsplashInput: true }), hover: "hover:text-gray-700" },
  ];

  return (
    <div className="flex gap-3 items-center mt-3">
      {/* Toggle Add / Close */}
      <button type="button" onClick={toggleOptions}>
        {expanded ? (
          <IoCloseCircleOutline className="size-9 text-gray-500 hover:text-red-500 transition" />
        ) : (
          <IoAddCircleOutline className="size-9 text-gray-300 hover:text-gray-500 transition" />
        )}
      </button>

      {/* Expanded Options */}
      {expanded && (
        <div className="flex gap-4 animate-fade-in">
          {buttons.map(({ Icon, action, hover }, i) => (
            <button key={i} type="button" onClick={action}>
              <Icon className={`size-7 text-gray-500 transition ${hover}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
