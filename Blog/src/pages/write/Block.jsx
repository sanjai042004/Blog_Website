import { useRef } from "react";
import { BlockOptions } from "./BlockOptions";
import { UnsplashSearch } from "./UnsplashSearch";
import { VideoInput } from "./VideoInput";

export const Block = ({
  index,
  block,
  blocks,
  handleChange,
  removeBlock,
  addBlock,
  contentRefs,
  imageInputRefs,
}) => {
  const handleContentKey = (e) => {
    // Enter → new block
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (index === blocks.length - 1 && !block.content) return;

      if (index < blocks.length - 1) {
        contentRefs.current[index + 1]?.focus();
      } else {
        addBlock();
        setTimeout(() => contentRefs.current[index + 1]?.focus(), 50);
      }
    }

    // Backspace → delete block / clear media
    if (e.key === "Backspace") {
      if (block.content?.length > 0) return;

      if (block.preview) {
        e.preventDefault();
        safeHandleChange(index, "preview", null);
        return;
      }

      if (block.youtubeEmbed) {
        e.preventDefault();
        safeHandleChange(index, "youtubeEmbed", null);
        return;
      }

      if (
        !block.content &&
        !block.preview &&
        !block.youtubeEmbed &&
        blocks.length > 1
      ) {
        e.preventDefault();
        removeBlock(index);
        setTimeout(() => {
          if (index > 0) contentRefs.current[index - 1]?.focus();
          else contentRefs.current[0]?.focus();
        }, 0);
      }
    }
  };

  // ✅ sanitize values before passing to Mongo
  const safeHandleChange = (index, field, value) => {
    let newValue = value;

    // Convert File → string URL
    if (field === "image" || field === "preview") {
      if (value instanceof File) {
        newValue = URL.createObjectURL(value);
      }
      if (typeof value === "object" && value !== null) {
        newValue = "";
      }
    }

    handleChange(index, field, newValue);

    // Auto-remove empty block
    const b = { ...blocks[index], [field]: newValue };
    if (
      !b.content &&
      !b.preview &&
      !b.youtubeEmbed &&
      blocks.length > 1 &&
      index !== blocks.length - 1
    ) {
      removeBlock(index);
    }
  };

  return (
    <div className="flex items-start gap-3 mt-10">
      <div>
        <BlockOptions
          block={block}
          index={index}
          handleChange={safeHandleChange}
          imageInputRefs={imageInputRefs}
        />
      </div>

      <div className="flex-1">
        {block.showUnsplashInput && (
          <UnsplashSearch
            block={block}
            index={index}
            handleChange={safeHandleChange} 
          />
        )}

        {block.preview && (
          <img
            src={block.preview}
            alt="preview"
            className="max-w-xl w-full rounded-lg shadow mb-2"
          />
        )}

        {block.youtubeEmbed && (
          <iframe
            width="560"
            height="315"
            src={block.youtubeEmbed}
            className="rounded-lg shadow mb-4"
          />
        )}

        {block.showVideoInput && !block.youtubeEmbed && (
          <VideoInput index={index} handleChange={safeHandleChange} /> 
        )}

        <textarea
          value={block.content}
          ref={(el) => (contentRefs.current[index] = el)}
          onChange={(e) => {
            safeHandleChange(index, "content", e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={handleContentKey}
          placeholder="Tell your story..."
          className="w-full text-2xl border-none outline-none placeholder-gray-200 resize-none overflow-hidden"
          rows={1}
        />
      </div>
    </div>
  );
};
