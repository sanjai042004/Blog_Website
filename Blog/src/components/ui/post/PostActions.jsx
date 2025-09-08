import { FaRegCommentDots } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import { BsBookmark, BsShare, BsThreeDots } from "react-icons/bs";
import { api } from "../../../service/api";
import socket from "../../../service/comment.socket";

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
      navigate("/login");
      return;
    }

    try {
      const res = await api.post(`/posts/${postId}/clap`);
      setClapCount(res.data.totalClaps);
      setUserClapped(res.data.action === "added");

      socket.emit("newClap", {
        postId,
        action: res.data.action,
        userId: currentUser?._id,
        totalClaps: res.data.totalClaps,
      });
    } catch (err) {
      console.error("Clap error:", err);
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-12">
      {/* Left actions (clap + comments) */}
      <div className="flex items-center gap-8 text-gray-600">
        {/* Clap */}
        <button
          onClick={handleClap}
          className="flex items-center gap-2 hover:text-orange-500 transition-colors"
        >
          <FaHandsClapping
            className={`size-5 ${userClapped ? "text-orange-500" : ""}`}
          />
          <span className="text-sm font-medium">{clapCount}</span>
        </button>

        {/* Comment */}
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
          <FaRegCommentDots className="size-5" />
          <span className="text-sm font-medium">Comment</span>
        </button>
      </div>

      {/* Right actions (bookmark, share, more) */}
      <div className="flex items-center gap-6 text-gray-600">
        <button className="hover:text-black transition-colors">
          <BsBookmark className="size-5" />
        </button>
        <button className="hover:text-black transition-colors">
          <BsShare className="size-5" />
        </button>
        <button className="hover:text-black transition-colors">
          <BsThreeDots className="size-5" />
        </button>
      </div>
    </div>
  );
};
