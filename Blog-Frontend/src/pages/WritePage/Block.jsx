import { useRef, useCallback, memo } from "react";
import { UnsplashSearch } from "./UnsplashSearch";
import { VideoInput } from "./VideoInput";
import { ImagePreview } from "./ImagePreview";
import { BlockOptions } from "./BlockOptions";

const BlockComponent = ({
  index,
  block,
  blocks,
  handleChange,
  removeBlock,
  addBlock,
  contentRefs,
  handleFileChange,
  handleUnsplashSelect,
}) => {
  const fileInputRef = useRef();

  const focusNext = useCallback(
    (nextIndex) => {
      if (nextIndex < 0) return;
      setTimeout(() => {
        contentRefs.current[nextIndex]?.focus();
      }, 50);
    },
    [contentRefs]
  );

  const removeMedia = useCallback(
    (type) => {
      if (type === "image") {
        handleChange(index, "preview", null);
        handleChange(index, "media", null);
        handleChange(index, "imageFile", null);
        handleChange(index, "type", "text");
      } else if (type === "youtube") {
        handleChange(index, "youtubeEmbed", null);
      } else if (type === "unsplash") {
        handleChange(index, "unsplashResults", []);
        handleChange(index, "unsplashQuery", "");
      }
    },
    [handleChange, index]
  );

  const onFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileChange(index, file);
        e.target.value = "";
      }
    },
    [handleFileChange, index]
  );

  const autoResize = useCallback((el) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);


  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (index === blocks.length - 1) addBlock();
        focusNext(index + 1);
      }
      if (e.key === "Backspace" && !block.content?.trim()) {
        e.preventDefault();

        if (block.preview || block.media) return removeMedia("image");
        if (block.youtubeEmbed) return removeMedia("youtube");
        if (block.unsplashResults?.length > 0 || block.unsplashQuery)
          return removeMedia("unsplash");

        if (blocks.length > 1) {
          removeBlock(index);
          focusNext(index - 1);
        }
      }
    },
    [block, blocks.length, index, addBlock, focusNext, removeMedia, removeBlock]
  );

  return (
    <div className="flex items-start gap-3 mt-10">
      <BlockOptions
        block={block}
        index={index}
        handleChange={handleChange}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      <div className="flex-1">
        {/* Hidden input for image upload */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onFileChange}
        />

        {/* Unsplash Image Search */}
        {block.ui?.showUnsplashInput && (
          <UnsplashSearch
            block={block}
            index={index}
            handleChange={handleChange}
            handleUnsplashSelect={handleUnsplashSelect}
          />
        )}

        {/* Image Preview */}
        {block.preview && (
          <ImagePreview url={block.preview} onRemove={() => removeMedia("image")} />
        )}

        {/* YouTube Embed */}
        {block.youtubeEmbed && (
          <div className="mb-4">
            <iframe
              src={block.youtubeEmbed}
              className="rounded-lg shadow w-full aspect-video"
              allowFullScreen
              title={`youtube-${index}`}
            />
          </div>
        )}

        {/* YouTube Input Field */}
        {block.ui?.showVideoInput && !block.youtubeEmbed && (
          <VideoInput index={index} block={block} handleChange={handleChange} />
        )}

        {/* Text Editor */}
        <textarea
          value={block.content || ""}
          ref={(el) => (contentRefs.current[index] = el)}
          onChange={(e) => {
            handleChange(index, "content", e.target.value);
            autoResize(e.target);
          }}
          onKeyDown={handleKeyPress}
          placeholder="Write something..."
          className="w-full text-xl border-none outline-none resize-none overflow-hidden bg-transparent placeholder-gray-200"
          rows={1}
        />
      </div>
    </div>
  );
};

export const Block = memo(BlockComponent);
