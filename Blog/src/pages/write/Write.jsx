import { useState, useRef, useCallback } from "react";
import { Block } from "./Block";
import { WriteNavbar } from "../../components/Navbars/WriteNavbar";
import { newBlock } from "../../constant/helper";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";

export const Write = () => {
  const [postTitle, setPostTitle] = useState("");
  const [blocks, setBlocks] = useState([newBlock()]);
  const [loading, setLoading] = useState(false);

  const contentRefs = useRef([]);
  const imageInputRefs = useRef([]);
  const navigate = useNavigate();

  // Block Management 
  const updateBlock = useCallback((index, field, value) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  }, []);

  const addBlock = useCallback((type = "text") => {
    setBlocks((prev) => [...prev, { ...newBlock(), type }]);
  }, []);

  const removeBlock = useCallback((index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleImageChange = useCallback((index, file) => {
    if (!file) return;

    setBlocks((prev) =>
      prev.map((b, i) => {
        if (i !== index) return b;
        if (b.preview && b.imageFile instanceof File) URL.revokeObjectURL(b.preview);

        const preview = URL.createObjectURL(file);
        return { ...b, type: "image", preview, media: preview, imageFile: file };
      })
    );
  }, []);

  const handleUnsplashSelect = useCallback((url) => {
    if (!url) return;
    setBlocks((prev) => [
      ...prev,
      { ...newBlock(), type: "image", preview: url, media: url, imageFile: undefined },
    ]);
  }, []);

//  Validation 
  const isValid = useCallback(() => {
    if (!postTitle.trim()) return alert("Title is required!"), false;

    const hasContent = blocks.some(
      (b) => (b.type === "text" && b.content?.trim()) || (b.type === "image" && b.media) || b.youtubeEmbed
    );

    if (!hasContent) return alert("Post content is empty!"), false;
    return true;
  }, [postTitle, blocks]);

  // Submit Post 
  const handlePostClick = useCallback(async () => {
    if (!isValid()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", postTitle);

      // Remove preview before sending
      const cleanBlocks = blocks.map(({ preview, ...rest }) => rest);
      formData.append("blocks", JSON.stringify(cleanBlocks));

      blocks.forEach((b) => {
        if (b.imageFile instanceof File) formData.append("images", b.imageFile);
      });

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // Reset
      setPostTitle("");
      setBlocks([newBlock()]);
      navigate(`/home/post/${res.data.post._id}`);
    } catch (err) {
      console.error("Post failed:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [blocks, postTitle, navigate, isValid]);

  //  Title Keyboard Handling 
  const handleTitleKey = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        contentRefs.current[0]?.focus();
      }
    },
    []
  );

  //  Auto-resize for Textarea 
  const handleAutoResize = useCallback((e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }, []);

  return (
    <div>
      <WriteNavbar onPost={handlePostClick} loading={loading} />

      <div className="max-w-5xl mt-8 mx-auto px-6 py-10">
        {/* Title */}
        <textarea
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          onKeyDown={handleTitleKey}
          placeholder="Title"
          rows={1}
          onInput={handleAutoResize}
          className="w-full text-5xl font-serif font-bold mb-6 border-none outline-none resize-none overflow-hidden placeholder-gray-200"
          autoFocus
        />

        {/* Blocks */}
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
            imageInputRefs={imageInputRefs}
            handleFileChange={handleImageChange}
            handleUnsplashSelect={handleUnsplashSelect}
          />
        ))}
      </div>
    </div>
  );
};
