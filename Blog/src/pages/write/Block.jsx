import { useRef, useCallback } from "react";
import { UnsplashSearch } from "./UnsplashSearch";
import { VideoInput } from "./VideoInput";
import { ImagePreview } from "./ImagePreview";
import { BlockOptions } from "./BlockOptions";

export const Block = ({
  index,
  block,
  blocks,
  handleChange,
  removeBlock,
  addBlock,
  contentRefs,
  handleFileChange,
}) => {
  const fileInputRef = useRef();

  // ---- Helpers ----
  const focusNext = useCallback(
    (nextIndex) => {
      setTimeout(() => {
        if (contentRefs.current[nextIndex]) {
          contentRefs.current[nextIndex].focus();
        }
      }, 50);
    },
    [contentRefs]
  );

  const removeImage = useCallback(() => {
    handleChange(index, "type", "text");     
    handleChange(index, "media", null);
    handleChange(index, "preview", null);
    handleChange(index, "imageFile", null);
  }, [handleChange, index]);

  const removeYoutube = useCallback(() => {
    handleChange(index, "youtubeEmbed", null);
  }, [handleChange, index]);

  // ---- Keyboard Shortcuts ----
  const handleContentKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // prevent creating empty block at end
      if (index === blocks.length - 1 && !block.content?.trim()) return;

      if (index < blocks.length - 1) {
        focusNext(index + 1);
      } else {
        addBlock();
        focusNext(index + 1);
      }
    }

    if (e.key === "Backspace" && !block.content) {
      if (block.preview) {
        e.preventDefault();
        removeImage();
        return;
      }
      if (block.youtubeEmbed) {
        e.preventDefault();
        removeYoutube();
        return;
      }
      if (!block.preview && !block.youtubeEmbed && blocks.length > 1) {
        e.preventDefault();
        removeBlock(index);
        focusNext(index - 1);
      }
    }
  };

  return (
    <div className="flex items-start gap-3 mt-10">
      {/* Left Options */}
      <BlockOptions
        block={block}
        index={index}
        handleChange={handleChange}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      {/* Right Content */}
      <div className="flex-1">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(index, e.target.files[0])}
        />

        {/* Unsplash Search */}
        {block.ui?.showUnsplashInput && (
          <UnsplashSearch block={block} index={index} handleChange={handleChange} />
        )}

        {/* Image Preview */}
        {block.preview && (
          <ImagePreview url={block.preview} onRemove={removeImage} />
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

        {/* Video Input */}
        {block.ui?.showVideoInput && !block.youtubeEmbed && (
          <VideoInput index={index} handleChange={handleChange} />
        )}

        {/* Textarea */}
        <textarea
          value={block.content || ""}
          ref={(el) => (contentRefs.current[index] = el)}
          onChange={(e) => {
            handleChange(index, "content", e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={handleContentKey}
          placeholder="Tell your story..."
          className="w-full text-2xl border-none outline-none placeholder-gray-400 resize-none overflow-hidden bg-transparent"
          rows={1}
        />
      </div>
    </div>
  );
};
