import { useState, useRef } from "react";
import axios from "axios";
import { Block } from "./Block";
import { WriteNavbar } from "../../components/Navbars/WriteNavbar";
import { newBlock } from "./helper";
import { api } from "../../service/api/axios";

export const Write = () => {
  const [postTitle, setPostTitle] = useState("");
  const [blocks, setBlocks] = useState([newBlock()]);

  const contentRefs = useRef([]);
  const imageInputRefs = useRef([]);

  const handleChange = (index, field, value) => {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addBlock = () => setBlocks((prev) => [...prev, newBlock()]);
  const removeBlock = (index) => setBlocks((prev) => prev.filter((_, i) => i !== index));

 const handlePostClick = async () => {
  try {
    // sanitize blocks before sending to backend
    const sanitizedBlocks = blocks.map(({ content, image, youtubeEmbed }) => ({
      content,
      image,
      youtubeEmbed,
    }));

    const payload = {
      title: postTitle,
      blocks: sanitizedBlocks,
    };

    const res = await api.post("/posts/create", payload);
    console.log("Post created:", res.data);

    // reset
    setPostTitle("");
    setBlocks([newBlock()]);
  } catch (err) {
    console.error("Error submitting post:", err.response?.data || err);
  }
};



  const handleTitleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRefs.current[0]?.focus();
    }
  };

  return (
    <div>
      <WriteNavbar onPost={handlePostClick} loading={false} />

      <div className="max-w-5xl mt-8 mx-auto px-6 py-10">
        {/* Title */}
        <input
          type="text"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          onKeyDown={handleTitleKey}
          placeholder="Title"
          className="w-full text-5xl font-serif font-bold mb-6 border-none outline-none placeholder-gray-200"
        />

        {blocks.map((block, index) => (
          <Block
            key={index}
            index={index}
            block={block}
            blocks={blocks}
            handleChange={handleChange}
            removeBlock={removeBlock}
            addBlock={addBlock}
            contentRefs={contentRefs}
            imageInputRefs={imageInputRefs}
          />
        ))}
      </div>
    </div>
  );
};
