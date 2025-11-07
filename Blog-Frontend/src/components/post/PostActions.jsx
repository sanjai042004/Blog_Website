import { Heart, MessageCircle, Bookmark, Share, Ellipsis } from "lucide-react";
import { api } from "../../service/api";

export const PostActions = ({
  postId,
  clapCount,
  userClapped,
  setClapCount,
  setUserClapped,
  currentUser,
  navigate,
}) => {
  const handleClap = async () => {
    if (!currentUser) {
      navigate("/");
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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-b border-gray-200 py-4 mb-12 w-full gap-4 relative">
      <div className="flex flex-row flex-wrap items-center gap-6 text-gray-600">
        <button
          onClick={handleClap}
          className="flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer"
        >
          <Heart
            size={16}
            className={`text-xl ${userClapped ? "text-orange-500" : ""}`}
          />
          <span className="text-sm font-medium">{clapCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer"
        >
          <MessageCircle size={16} />
          <span className="text-sm font-medium">Comment</span>
        </button>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-6 text-gray-600">
        <button className="hover:text-black transition-colors cursor-pointer">
          <Bookmark size={16} />
        </button>
        <button className="hover:text-black transition-colors cursor-pointer">
          <Share size={16} />
        </button>
        <button className="hover:text-black transition-colors cursor-pointer">
          <Ellipsis size={16} />
        </button>
      </div>
    </div>
  );
};
