import React, { useRef, useCallback, memo } from "react";
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
}) => {
  const fileInputRef = useRef();

  // Helpers
  const focusNext = useCallback(
    (nextIndex) => {
      if (nextIndex < 0) return;
      setTimeout(() => {
        contentRefs.current[nextIndex]?.focus();
      }, 50);
    },
    [contentRefs]
  );

  const removeImage = useCallback(() => {
    handleChange(index, "preview", null);
    handleChange(index, "media", null);
    handleChange(index, "imageFile", null);
    handleChange(index, "type", "text");
  }, [handleChange, index]);

  const removeYoutube = useCallback(() => {
    handleChange(index, "youtubeEmbed", null);
  }, [handleChange, index]);

  const removeUnsplash = useCallback(() => {
    handleChange(index, "unsplashResults", []);
    handleChange(index, "unsplashQuery", "");
  }, [handleChange, index]);

  const onFileChange = useCallback(
    (e) => {
      if (e.target.files?.[0]) {
        handleFileChange(index, e.target.files[0]);
      }
    },
    [handleFileChange, index]
  );

  // Keyboard Shortcuts
  const handleContentKey = useCallback(
    (e) => {
      // ENTER: move to next block or create new
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        if (index === blocks.length - 1 && !block.content?.trim()) return;

        if (index < blocks.length - 1) {
          focusNext(index + 1);
        } else {
          addBlock();
          focusNext(index + 1);
        }
      }

      // BACKSPACE: remove media / video / Unsplash / block
      if (e.key === "Backspace" && !block.content?.trim()) {
        e.preventDefault();

        if (block.preview || block.media) {
          removeImage();
          return;
        }

        if (block.youtubeEmbed) {
          removeYoutube();
          return;
        }

        if (block.unsplashResults?.length > 0 || block.unsplashQuery) {
          removeUnsplash();
          return;
        }

        if (blocks.length > 1) {
          removeBlock(index);
          focusNext(index - 1);
        }
      }
    },
    [
      block,
      blocks,
      index,
      addBlock,
      removeBlock,
      focusNext,
      removeImage,
      removeYoutube,
      removeUnsplash,
    ]
  );

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
          onChange={onFileChange}
        />

        {/* Unsplash Search */}
        {block.ui?.showUnsplashInput && (
          <UnsplashSearch
            block={block}
            index={index}
            handleChange={handleChange}
          />
        )}

        {/* Image Preview */}
        {block.preview && <ImagePreview url={block.preview} onRemove={removeImage} />}

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
          <VideoInput index={index} block={block} handleChange={handleChange} />
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

export const Block = memo(BlockComponent);
