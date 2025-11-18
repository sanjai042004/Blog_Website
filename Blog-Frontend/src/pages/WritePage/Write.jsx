import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { WriteNavbar } from "../../components/Navbars/WriteNavbar";
import { Block } from "./Block";
import { newBlock } from "../../constant/helper";
import { api } from "../../service/api";

export const Write = () => {
  const [title, setTitle] = useState("");
  const [subtitle , setSubtitle] = useState("");
  const [blocks, setBlocks] = useState([newBlock()]);
  const [loading, setLoading] = useState(false);

  const contentRefs = useRef([]);
  const navigate = useNavigate();

  // Update block field
  const updateBlock = (index, field, value) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  // Add new block
  const addBlock = () => setBlocks((prev) => [...prev, newBlock()]);

  // Remove block
  const removeBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle image upload
  const handleImageChange = (index, file) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setBlocks((prev) =>
      prev.map((b, i) =>
        i === index
          ? { ...b, type: "image", preview, media: preview, imageFile: file }
          : b
      )
    );
  };

  // Handle Unsplash image selection
  const handleUnsplashSelect = (url) => {
    if (!url) return;
    setBlocks((prev) => [
      ...prev,
      { ...newBlock(), type: "image", preview: url, media: url },
    ]);
  };

  // Validate before posting
  const isValid = () => {
    if (!title.trim()) {
      alert("Title is required!");
      return false;
    }

    const hasContent = blocks.some(
      (b) =>
        (b.type === "text" && b.content?.trim()) ||
        (b.type === "image" && b.media) ||
        b.youtubeEmbed
    );

    if (!hasContent) {
      alert("Post content is empty!");
      return false;
    }

    return true;
  };

  // Submit post to backend
  const handlePost = async () => {
    if (!isValid()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);

      const cleanedBlocks = blocks.map(({ preview, ...rest }) => rest);
      formData.append("blocks", JSON.stringify(cleanedBlocks));

      blocks.forEach((b) => {
        if (b.imageFile instanceof File) {
          formData.append("images", b.imageFile);
        }
      });

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setTitle("");
      setBlocks([newBlock()]);
      navigate(`/home/post/${res.data.post._id}`);
    } catch (err) {
      console.error("Post failed:", err.response?.data || err);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter on title
  const handleTitleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRefs.current[0]?.focus();
    }
  };

  // Auto-resize title field
  const handleAutoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <WriteNavbar onPost={handlePost} loading={loading} />

      <div className="w-full max-w-5xl mx-auto mt-6 sm:mt-8 md:mt-10 px-4 sm:px-6 md:px-10 py-8 sm:py-10">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleTitleKey}
          onInput={handleAutoResize}
          placeholder="Title"
          rows={1}
          className="w-full text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 border-none outline-none resize-none overflow-hidden placeholder-gray-300"
          autoFocus
        />

        {/* Content Blocks */}
        <div className="space-y-8 sm:space-y-10">
          {blocks.map((block, index) => (
            <Block
              key={index}
              index={index}
              block={block}
              blocks={blocks}
              handleChange={updateBlock}
              removeBlock={removeBlock}
              addBlock={addBlock}
              contentRefs={contentRefs}
              handleFileChange={handleImageChange}
              handleUnsplashSelect={handleUnsplashSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
