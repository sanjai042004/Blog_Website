import { useReducer, useRef, useState } from "react";
import { Block } from "./Block";
import { WriteNavbar } from "../../components/Navbars/WriteNavbar";
import { newBlock } from "../../constant/helper";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";

// Initial State
const initialState = {
  postTitle: "",
  blocks: [newBlock()],
  loading: false,
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, postTitle: action.payload };
    case "ADD_BLOCK": {
      const type = action.payload?.type || "text";
      return { ...state, blocks: [...state.blocks, { ...newBlock(), type }] };
    }
    case "REMOVE_BLOCK":
      return { ...state, blocks: state.blocks.filter((_, i) => i !== action.payload) };
    case "UPDATE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.map((b, i) =>
          i === action.payload.index ? { ...b, [action.payload.field]: action.payload.value } : b
        ),
      };
    case "RESET":
      return { ...initialState, blocks: [newBlock()] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const Write = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { postTitle, blocks, loading } = state;

  const contentRefs = useRef([]);
  const imageInputRefs = useRef([]);
  const navigate = useNavigate();

  // Handlers
  const handleChange = (index, field, value) => {
    dispatch({ type: "UPDATE_BLOCK", payload: { index, field, value } });
  };

  const addBlock = (type = "text") => dispatch({ type: "ADD_BLOCK", payload: { type } });
  const removeBlock = (index) => dispatch({ type: "REMOVE_BLOCK", payload: index });

  // File / Unsplash Handling
  const handleFileChange = (index, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    handleChange(index, "type", "image");
    handleChange(index, "preview", preview);
    handleChange(index, "media", preview);     
    handleChange(index, "imageFile", file);    
  };

  const handleUnsplashSelect = (index, unsplashUrl) => {
    handleChange(index, "type", "image");
    handleChange(index, "preview", unsplashUrl);
    handleChange(index, "media", unsplashUrl);
    handleChange(index, "imageFile", undefined); 
  };

  // Validation
  const validatePost = () => {
    if (!postTitle.trim()) { alert("Post title is required!"); return false; }
    const hasContent = blocks.some(
      (b) => (b.type === "text" && b.content?.trim()) || (b.type === "image" && b.media) || b.youtubeEmbed
    );
    if (!hasContent) { alert("Post content is empty!"); return false; }
    return true;
  };

  // Submit to backend
  const handlePostClick = async () => {
    if (!validatePost()) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const formData = new FormData();
      formData.append("title", postTitle);

      // Remove temporary fields for clean submission
      const cleanBlocks = blocks.map(({ preview, imageFile, ...rest }) => rest);
      formData.append("blocks", JSON.stringify(cleanBlocks));

      // Append local image files only
      blocks.forEach((b) => {
        if (b.imageFile instanceof File) formData.append("images", b.imageFile);
      });

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Post created successfully!");
      dispatch({ type: "RESET" });
      navigate(`/home/post/${res.data.post._id}`);
    } catch (err) {
      console.error("Post creation failed:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create post.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Title enter key focus
  const handleTitleKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); contentRefs.current[0]?.focus(); }
  };


  return (
    <div>
      <WriteNavbar onPost={handlePostClick} loading={loading} />

      <div className="max-w-5xl mt-8 mx-auto px-6 py-10">
        <input
          type="text"
          value={postTitle}
          onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
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
            handleFileChange={handleFileChange}
            handleUnsplashSelect={handleUnsplashSelect}
          />
        ))}
      </div>
    </div>
  );
};
