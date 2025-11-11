import { CirclePlus, CircleX, Image, Video, Images } from "lucide-react";

export const BlockOptions = ({
  block = {},
  index,
  handleChange,
  onUploadClick,
}) => {
  const ui = block.ui || {};
  const isExpanded = ui.showOptions;

  if (block.content || block.media || block.youtubeEmbed) return null;
  const toggleOptions = () => {
    handleChange(index, "ui", { ...ui, showOptions: !isExpanded });
  };
  const updateUI = (updates) => {
    handleChange(index, "ui", { ...ui, ...updates, showOptions: false });
  };
  const optionButtons = [
    {
      key: "image",
      Icon: Image,
      onClick: onUploadClick,
      tooltip: "Add Image",
    },
    {
      key: "video",
      Icon: Video,
      onClick: () => updateUI({ showVideoInput: true }),
      tooltip: "Add YouTube Video",
    },
    {
      key: "unsplash",
      Icon: Images,
      onClick: () => updateUI({ showUnsplashInput: true }),
      tooltip: "Search Unsplash Image",
    },
  ];

  return (
    <div className="flex items-center gap-3 mt-3">
      <button
        type="button"
        onClick={toggleOptions}
        className="cursor-pointer transition-colors"
      >
        {isExpanded ? (
          <CircleX className="text-gray-400 hover:text-gray-600" />
        ) : (
          <CirclePlus className="text-gray-400 hover:text-gray-600" />
        )}
      </button>
      {isExpanded && (
        <div className="flex gap-4 animate-fade-in">
          {optionButtons.map(({ key, Icon, onClick, tooltip }) => (
            <button
              key={key}
              type="button"
              onClick={onClick}
              title={tooltip}
              className="transition-colors hover:text-blue-600 cursor-pointer "
            >
              <Icon className="text-gray-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
