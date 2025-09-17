import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../../../service/api";
import { FaHandsClapping } from "react-icons/fa6";
import socket from "../../../service/comment.socket";

const userProfile = (user) => {
  if (!user?.profileImage) return "/placeholder-user.png";
  return user.profileImage.startsWith("http")
    ? user.profileImage
    : `${import.meta.env.VITE_API_URL}${user.profileImage}`;
};

const userName = (user) => user?.name || "Unknown";

export const CommentSection = ({
  postId,
  comments,
  setComments,
  currentUser,
  navigate,
}) => {
  const [newComment, setNewComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(5);

  // ✅ Join socket room & listen for new comments
  useEffect(() => {
    socket.emit("joinPost", postId);

    socket.on("newComment", (comment) => {
      setComments((prev) =>
        prev.some((c) => c._id === comment._id) ? prev : [comment, ...prev]
      );
    });

    return () => {
      socket.off("newComment");
    };
  }, [postId, setComments]);

  const handleAddComment = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        text: newComment.trim(),
      });
      setNewComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    }
  };

  const handleClap = async (commentId) => {
    try {
      const res = await api.post(`/posts/${postId}/comments/${commentId}/clap`);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, claps: Array(res.data.totalClaps).fill("x") }
            : c
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clap");
    }
  };

  const handleShowMore = () => {
    setVisibleComments((prev) => (prev === 5 ? comments.length : 5));
  };

  return (
    <div className="mt-12">
      {currentUser ? (
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/author/${currentUser._id}`}>
            <img
              src={userProfile(currentUser)}
              alt={userName(currentUser)}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <p className="font-bold">{userName(currentUser)}</p>
        </div>
      ) : (
        <p className="text-gray-500 mb-6">Login to comment</p>
      )}

      <h3 className="text-xl font-bold mb-4">Responses ({comments.length})</h3>

      {currentUser && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            className="flex-grow border-none bg-gray-100 outline-none rounded px-3 py-2"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAddComment}
          >
            Respond
          </button>
        </div>
      )}

      <div className="space-y-6 max-h-96 overflow-y-auto px-2">
        {comments.length === 0 ? (
          <p className="text-gray-500">No responses yet.</p>
        ) : (
          comments.slice(0, visibleComments).map((c, index) => (
            <div
              key={c._id || `${c.user?._id || "nouser"}-${index}`}
              className="border-b border-gray-200 pb-4"
            >
              {/* User row */}
              <div className="flex items-center gap-3">
                <img
                  src={userProfile(c.user)}
                  alt={userName(c.user)}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {userName(c.user)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </p>
                </div>
              </div>

              {/* Comment text */}
              <p className="mt-5 text-gray-800 leading-relaxed">{c.text}</p>

              {/* Actions (clap, reply) */}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <button
                  className="flex items-center gap-1 hover:text-black"
                  onClick={() => handleClap(c._id)}
                >
                  <FaHandsClapping className="size-4" />
                  <span>{c.claps?.length || 0}</span>
                </button>
              </div>
            </div>
          ))
        )}

        {/* Show More button */}
        {comments.length > 5 && (
          <button
            onClick={handleShowMore}
            className="text-blue-600 text-sm mt-4 hover:underline"
          >
            {visibleComments === 5
              ? `Show More (${comments.length - 5} more)`
              : "Show Less"}
          </button>
        )}
      </div>
    </div>
  );
};
