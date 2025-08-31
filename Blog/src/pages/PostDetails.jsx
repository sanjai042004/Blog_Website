import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { BsBookmark, BsShare, BsThreeDots } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { calculateReadTime } from "../utilis/calculateReadTime";

export const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const foundPost = find((p) => p._id === id);
        if (!foundPost) {
          setError("Post not found");
          return;
        }
        setPost(foundPost);
        setComments(foundPost.comments || []);
      } catch {
        setError("Error loading post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      text: newComment.trim(),
      date: new Date().toLocaleString(),
    };
    setComments((prev) => [...prev, commentObj]);
    setNewComment("");
  };

  const handleClap = () => {
    setPost((prev) => ({ ...prev, claps: (prev.claps || 0) + 1 }));
  };

  if (loading)
    return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="text-gray-500 hover:text-gray-700 text-sm mb-4 inline-block"
      >
        ← Back
      </Link>

      <h1 className="text-5xl font-extrabold mb-12">{post.title}</h1>

      {/* Author Info */}
      <div className="flex items-center gap-3 mb-10">
        <Link to={`/author/${post.authorId || post.author}`}>
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div className="flex items-center gap-2">
          <p className="font-bold">{post.author}</p>
          <button className="border px-3 py-1 rounded-full text-sm hover:bg-gray-100">
            Follow
          </button>
          <p className="text-sm text-gray-500">
            {calculateReadTime(post.content)} · {post.date}
          </p>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-gray-200 border-t border-b p-6 mb-12">
        <div className="flex items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <AiOutlineLike onClick={handleClap} className="cursor-pointer" />
            <span>{post.claps || 0}</span>
          </div>
          <FaRegCommentDots className="cursor-pointer" />
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <BsBookmark className="cursor-pointer" />
          <BsShare className="cursor-pointer" />
          <BsThreeDots className="cursor-pointer" />
        </div>
      </div>

      {/* Post Image & Content */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-80 mb-12 object-cover rounded"
        />
      )}
      {post.subtitle && <h2 className="text-2xl font-bold mb-8">{post.subtitle}</h2>}
      <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line mb-8">
        {post.content}
      </p>

      {/* Comment Section */}
      <div className="mt-15">
        <h3 className="text-xl font-bold mb-4">Response ({comments.length})</h3>

        {/* Add Comment */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow border outline-none rounded px-3 py-2"
          />
          <button
            onClick={handleAddComment}
            className="bg-gray-400 text-white px-4 rounded hover:bg-gray-200"
          >
            Add
          </button>
        </div>

        {/* Comment List */}
        <div className="space-y-4 max-h-60 overflow-y-auto pt-4">
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="border p-3 rounded">
                <p>{c.text}</p>
                <p className="text-xs text-gray-500 mt-1">{c.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
