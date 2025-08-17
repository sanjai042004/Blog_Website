import { useRef } from "react";
import { BlockOptions } from "./BlockOptions";
import { UnsplashSearch } from "./UnsplashSearch";
import { VideoInput } from "./VideoInput";

export const Block = ({index,block,blocks,handleChange,removeBlock,addBlock,contentRefs,
  imageInputRefs,}) => {


  const handleContentKey = (e) => {

    //Enter 

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (index === blocks.length - 1 && !block.content) return;

      if (index < blocks.length - 1) contentRefs.current[index + 1]?.focus();
      else {
        addBlock();
        setTimeout(() => contentRefs.current[index + 1]?.focus(), 50);
      }
    }

    //BackSpace 

    if (e.key === "Backspace") {
      if (block.content?.length > 0) return;

      if (block.preview) {
        e.preventDefault();
        handleChange(index, "preview", null);
        return;
      }

      if (block.youtubeEmbed) {
        e.preventDefault();
        handleChange(index, "youtubeEmbed", null);
        return;
      }

      if (!block.content && !block.preview && !block.youtubeEmbed && blocks.length > 1) {
        e.preventDefault();
        removeBlock(index);
        setTimeout(() => {
          if (index > 0) contentRefs.current[index - 1]?.focus();
          else contentRefs.current[0]?.focus();
        }, 0);
      }
    }
  };

  const safeHandleChange = (index, field, value) => {
    handleChange(index, field, value);

    const b = { ...blocks[index], [field]: value };
    if (!b.content && !b.preview && !b.youtubeEmbed && blocks.length > 1 && index !== blocks.length - 1) {
      removeBlock(index);
    }
  };

  return (
    <div className="flex items-start gap-3 mt-6">
      
      <div>
        <BlockOptions
          block={block}
          index={index}
          handleChange={handleChange}
          imageInputRefs={imageInputRefs}
        />
      </div>

    
      <div className="flex-1">
        {block.showUnsplashInput && (
          <UnsplashSearch block={block} index={index} handleChange={handleChange} />
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
          <VideoInput index={index} handleChange={handleChange} />
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
          className="w-full text-2xl  border-none outline-none placeholder-gray-200 resize-none overflow-hidden"
          rows={1}
        />
      </div>
    </div>
  );
};
