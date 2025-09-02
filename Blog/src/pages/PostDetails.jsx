import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { BsBookmark, BsShare, BsThreeDots } from "react-icons/bs";
import { FaHandsClapping } from "react-icons/fa6";
import { calculateReadTime } from "../utilis/calculateReadTime";
import { api } from "../service/api";
import { useAuth } from "../context/AuthContext";
import socket, {connectSocket,disconnectSocket,} from "../service/comment.socket";


export const PostDetail = () => {
  const { user: currentUser } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [clapCount, setClapCount] = useState(0);
  const [userClapped, setUserClapped] = useState(false);

  // Fetch post data 
  const fetchPost = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      if (!res.data.success)
        throw new Error(res.data.message || "Post not found");

      const fetchedPost = res.data.post;

      setPost(fetchedPost);
      setComments(fetchedPost.comments || []);
      setClapCount(fetchedPost.claps?.length || 0);
      setUserClapped(
        fetchedPost.claps?.some((c) => c.user === currentUser?._id) || false
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  //  Socket setup 

  useEffect(() => {
    if (!currentUser) return;
    connectSocket();

    const handleNewComment = (comment) => {
      if (comment.post?._id === id || comment.postId === id) {
        setComments((prev) => [...prev, comment]);
      }
    };

    const handleNewClap = (data) => {
      if (data.postId === id) {
        setClapCount(data.totalClaps);
        if (currentUser?._id === data.userId)
          setUserClapped(data.action === "added");
      }
    };

    socket.on("newComment", handleNewComment);
    socket.on("newClap", handleNewClap);

    return () => {
      socket.off("newComment", handleNewComment);
      socket.off("newClap", handleNewClap);
      disconnectSocket();
    };
  }, [id, currentUser]);

  //  Add new comment 
const handleAddComment = async () => {
  if (!newComment.trim()) return;
  try {
    const res = await api.post(`/posts/${id}/comments`, { text: newComment.trim() });
    let addedComment = res.data.comment;

    setNewComment("");
    setComments((prev) => [addedComment, ...prev]);

    socket.emit("newComment", addedComment);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to add comment");
  }
};


  //  Clap handler
  const handleClap = async () => {
    try {
      const res = await api.post(`/posts/${id}/clap`);
      setClapCount(res.data.totalClaps);
      setUserClapped(res.data.action === "added");
      socket.emit("newClap", {
        postId: id,
        action: res.data.action,
        userId: currentUser?._id,
        totalClaps: res.data.totalClaps,
      });
    } catch (err) {
      console.error("Clap error:", err);
    }
  };

  const handleShowMore = () => {
    setVisibleComments((prev) => (prev === 5 ? comments.length : 5));
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  const renderUserImage = (user) =>
    user?.profileImage?.startsWith("http")
      ? user.profileImage
      : user?.profileImage || DEFAULT_USER.profileImage;

  const renderUserName = (user) => user?.name || DEFAULT_USER.name;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="text-gray-500 hover:text-gray-700 text-sm mb-4 inline-block"
      >
        ← Back
      </Link>
      <h1 className="text-5xl font-extrabold mb-12">{post.title}</h1>

      {/* Author */}
      <div className="flex items-center gap-3 mb-10">
        <Link to={`/author/${post.author?._id}`}>
          <img
            src={renderUserImage(post.author)}
            alt={renderUserName(post.author)}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div className="flex items-center gap-2">
          <p className="font-bold">{renderUserName(post.author)}</p>
          <button className="border px-3 py-1 rounded-full text-sm hover:bg-gray-100">
            Follow
          </button>
          <p className="text-sm text-gray-500">
            {calculateReadTime(
              post.blocks?.map((b) => b.content).join(" ") || ""
            )}{" "}
            · {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-gray-200 border-t border-b p-6 mb-12">
        <div className="flex items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <FaHandsClapping
              onClick={handleClap}
              className={`size-5 cursor-pointer ${
                userClapped ? "text-orange-500" : ""
              }`}
            />
            <span>{clapCount}</span>
          </div>
          <FaRegCommentDots className="size-5 cursor-pointer" />
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <BsBookmark className="cursor-pointer size-5" />
          <BsShare className="cursor-pointer size-5" />
          <BsThreeDots className="cursor-pointer size-5" />
        </div>
      </div>

      {/* Post Blocks */}
      {post.blocks?.map((block) => (
        <div key={block._id || Math.random()} className="mb-6">
          {block.youtubeEmbed && (
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
              }}>
              <iframe
                src={block.youtubeEmbed}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          )}
          {block.type === "image" && block.media && (
            <img
              src={block.media.startsWith("http")? block.media: `http://localhost:5000${block.media}`}
              alt={block.content || "Post media"}
              className="w-full h-80 object-cover rounded mb-6"
            />
          )}
          {block.type === "subtitle" && (
            <h2 className="text-2xl font-bold mb-4">{block.content}</h2>
          )}
          {block.content && (
            <p className="break-words text-xl text-gray-900 leading-8 whitespace-pre-line mb-10 max-w-[70ch] mx-auto">
              {block.content}
            </p>
          )}
        </div>
      ))}

      {/* Comments */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/author/${currentUser._id}`}>
            <img
              src={renderUserImage(currentUser)}
              alt={renderUserName(currentUser)}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <p className="font-bold">{renderUserName(currentUser)}</p>
        </div>

        <h3 className="text-xl font-bold mb-4">
          Responses ({comments.length})
        </h3>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow border-none bg-gray-100 outline-none rounded px-3 py-2"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAddComment}
          >
            Respond
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-gray-500">No responses yet.</p>
          ) : (
            comments.slice(0, visibleComments).map((c, index) => (
              <div
                key={c._id ||`${c.user?._id}-${index}-${c.createdAt || Date.now()}`}
                className="flex items-start gap-4 p-4 rounded-lg hover:shadow-sm transition-shadow"> 
                <img
                  src={renderUserImage(c.user)}
                  alt={renderUserName(c.user)}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">
                      {renderUserName(c.user)}
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt || c.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-800 whitespace-pre-line">
                    {c.text}
                  </p>
                </div>
              </div>
            ))
          )}

          {comments.length > 5 && (
            <button
              onClick={handleShowMore}
              className="text-blue-600 text-sm mt-2 hover:underline"
            >
              {visibleComments === 5
                ? `Show More (${comments.length - 5} more)`
                : "Show Less"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
