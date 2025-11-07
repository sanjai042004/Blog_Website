import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { api } from "../../service/api";
import { UserProfile } from "../author/UserProfile";

export const CommentSection = ({ postId, comments, setComments, currentUser, navigate }) => {
  const [newComment, setNewComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [activeClap, setActiveClap] = useState(null);

  const addComment = async () => {
    if (!currentUser) return navigate("/login");
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      const res = await api.post(`/posts/${postId}/comments`, { text: newComment });
      setComments([res.data.comment, ...comments]);
      setNewComment("");
    } catch {
      alert("Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };

  const clapComment = async (id) => {
    try {
      setActiveClap(id);
      const res = await api.post(`/posts/${postId}/comments/${id}/clap`);
      setComments(comments.map(c => c._id === id ? { ...c, claps: res.data.totalClaps || 0 } : c));
    } catch {
      alert("Failed to clap");
    } finally {
      setActiveClap(null);
    }
  };

  const toggleShowMore = () =>
    setVisibleComments(visibleComments === 5 ? comments.length : 5);

  return (
    <div className="mt-10">
      {/* Current User Info */}
      {currentUser ? (
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/author/${currentUser._id}`}>
            <UserProfile user={currentUser} size="w-10 h-10" />
          </Link>
          <p className="font-bold">{currentUser.name}</p>
        </div>
      ) : (
        <p className="text-gray-500 mb-6">Login to comment</p>
      )}

      {/* Add Comment Input */}
      {currentUser && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
            disabled={isLoading}
            className="flex-grow bg-gray-100 rounded px-3 py-2 outline-none"
          />
          <button
            onClick={addComment}
            disabled={isLoading}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isLoading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      )}

      {/* Comment List */}
      <h3 className="text-lg font-semibold mb-3">
        Responses ({comments.length})
      </h3>

      <div className="space-y-6 max-h-96 overflow-y-auto px-1">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.slice(0, visibleComments).map((c) => (
            <div key={c._id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <UserProfile user={c.user} size="w-9 h-9" />
                <div>
                  <p className="font-semibold">{c.user?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-gray-800">{c.text}</p>

              <button
                onClick={() => clapComment(c._id)}
                disabled={activeClap === c._id}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mt-2"
              >
                <Heart className="size-4" />
                <span>{c.claps || 0}</span>
              </button>
            </div>
          ))
        )}

        {comments.length > 5 && (
          <button
            onClick={toggleShowMore}
            className="text-blue-600 text-sm mt-3 hover:underline"
          >
            {visibleComments === 5
              ? `Show More (${comments.length - 5})`
              : "Show Less"}
          </button>
        )}
      </div>
    </div>
  );
};
