import React, { useRef, useCallback, memo } from "react";
import { UnsplashSearch } from "./UnsplashSearch";
import { VideoInput } from "./VideoInput";
import { ImagePreview } from "./ImagePreview";
import { BlockOptions } from "./BlockOptions";

const BlockComponent = ({index,block,blocks,handleChange,removeBlock,addBlock,contentRefs,handleFileChange,handleUnsplashSelect}) => {
  const fileInputRef = useRef();


  const focusNext = useCallback(
    (nextIndex) => {
      if (nextIndex < 0) return;
      setTimeout(() => contentRefs.current[nextIndex]?.focus(), 50);
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

//  Keyboard Handlers 

  const handleEnter = useCallback(() => {
    if (index === blocks.length - 1 && !block.content?.trim()) return;
    if (index < blocks.length - 1) {
      focusNext(index + 1);
    } else {
      addBlock();
      focusNext(index + 1);
    }
  }, [block.content, blocks.length, index, addBlock, focusNext]);

  const handleBackspace = useCallback(() => {
    if (block.preview || block.media) {
      removeMedia("image");
      return;
    }
    if (block.youtubeEmbed) {
      removeMedia("youtube");
      return;
    }
    if (block.unsplashResults?.length > 0 || block.unsplashQuery) {
      removeMedia("unsplash");
      return;
    }
    if (blocks.length > 1) {
      removeBlock(index);
      focusNext(index - 1);
    }
  }, [block, blocks.length, index, removeBlock, focusNext, removeMedia]);

  const handleContentKey = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleEnter();
      }
      if (e.key === "Backspace" && !block.content?.trim()) {
        e.preventDefault();
        handleBackspace();
      }
    },
    [block.content, handleEnter, handleBackspace]
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
            handleUnsplashSelect={handleUnsplashSelect}
          />
        )}

        {/* Image Preview */}
        {block.preview && <ImagePreview url={block.preview} onRemove={() => removeMedia("image")} />}

        {/* YouTube upload */}
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
            autoResize(e.target);
          }}
          autoFocus
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
