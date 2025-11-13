import { Heart, MessageCircle, Bookmark, Share, Ellipsis } from "lucide-react";
import { api } from "../../service/api";
import { useState } from "react";

export const PostActions = ({
  postId,
  clapCount,
  userClapped,
  setClapCount,
  setUserClapped,
  currentUser,
  navigate,
}) => {
  const [showComments, setShowComments] = useState(false);

  const handleClap = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await api.post(`/posts/${postId}/clap`);
      setClapCount(res.data.totalClaps);
      setUserClapped(res.data.action === "added");
    } catch (err) {
      console.error("Clap error:", err);
      alert(err.response?.data?.message || "Failed to clap");
    }
  };

  return (
    <div className="flex justify-between items-center flex-wrap border-t border-b border-gray-200 py-4 mb-12 w-full gap-4 sm:gap-6 text-gray-600">
      {/* Left side actions */}
      <div className="flex items-center flex-wrap gap-6 sm:gap-8">
        {/* Clap */}
        <button
          onClick={handleClap}
          className="flex items-center gap-2 hover:text-orange-500 transition-colors"
        >
          <Heart
            size={18}
            className={`${
              userClapped ? "text-orange-500 fill-orange-500" : ""
            }`}
          />
          <span className="text-sm font-medium">{clapCount}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">Comment</span>
        </button>
      </div>

      {/* Right side icons */}
      <div className="flex items-center flex-wrap gap-6 sm:gap-8">
        <button className="hover:text-black transition-colors">
          <Bookmark size={18} />
        </button>
        <button className="hover:text-black transition-colors">
          <Share size={18} />
        </button>
        <button className="hover:text-black transition-colors">
          <Ellipsis size={18} />
        </button>
      </div>
    </div>
  );
};
