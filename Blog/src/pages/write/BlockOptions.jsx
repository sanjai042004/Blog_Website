import {
  IoAddCircleOutline,
  IoCloseCircleOutline,
  IoImageOutline,
} from "react-icons/io5";
import { LuFileVideo } from "react-icons/lu";
import { TbBrandUnsplash } from "react-icons/tb";
import { prepareImage } from "./helper";

export const BlockOptions = ({
  block,
  index,
  handleChange,
  imageInputRefs,
}) => {
  const hideIcons = !!block.content;

  const handleFileChange = (file) => {
    if (!file) return;
    const updated = prepareImage(file, block.preview);
    handleChange(index, "image", updated.image);
    handleChange(index, "preview", updated.preview);
    handleChange(index, "showImageOptions", updated.showImageOptions);
  };

  if (hideIcons) return null;

  return (
    <div className="flex gap-3 mb-15 items-center">
      {/* Toggle Add/Close */}
      <button
        onClick={() =>
          handleChange(index, "showImageOptions", !block.showImageOptions)
        }
      >
        {block.showImageOptions ? (
          <IoCloseCircleOutline className="size-10 cursor-pointer text-gray-500" />
        ) : (
          <IoAddCircleOutline className="size-10 cursor-pointer text-gray-300 hover:text-gray-500" />
        )}
      </button>

      {block.showImageOptions && (
        <>
          {/* Upload image */}
          <button onClick={() => imageInputRefs.current[index]?.click()}>
            <IoImageOutline className="size-7 cursor-pointer text-gray-500 hover:text-green-700" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={(el) => (imageInputRefs.current[index] = el)}
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="hidden"
          />

          {/* Video */}
          <button onClick={() => handleChange(index, "showVideoInput", true)}>
            <LuFileVideo className="size-7 cursor-pointer text-gray-500 hover:text-gray-700" />
          </button>

          {/* Unsplash */}
          <button
            onClick={() =>
              handleChange(index, "showUnsplashInput", !block.showUnsplashInput)
            }
          >
            <TbBrandUnsplash className="size-7 cursor-pointer text-gray-500 hover:text-gray-700" />
          </button>
        </>
      )}
    </div>
  );
};
