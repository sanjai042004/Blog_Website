import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../service/api";
import { useAuth } from "../context/AuthContext";
import socket, { connectSocket, disconnectSocket } from "../service/comment.socket";
import { PostHeader, CommentSection, PostActions, PostBlocks } from "../components/ui/post";

export const PostDetail = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [clapCount, setClapCount] = useState(0);
  const [userClapped, setUserClapped] = useState(false);

  // fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        if (!res.data.success) throw new Error(res.data.message || "Post not found");

        const fetchedPost = res.data.post;
        setPost(fetchedPost);
        setComments(fetchedPost.comments || []);
        setClapCount(fetchedPost.claps?.length || 0);
        setUserClapped(fetchedPost.claps?.some(c => c.user === currentUser?._id));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUser]);

  // socket listeners
  useEffect(() => {
    if (!currentUser) return;
    connectSocket();

    const handleNewComment = (comment) => {
      if (comment.post?._id === id) {
        setComments(prev => prev.some(c => c._id === comment._id) ? prev : [...prev, comment]);
      }
    };

    const handleNewClap = ({ postId, totalClaps, userId, action }) => {
      if (postId === id) {
        setClapCount(totalClaps);
        if (currentUser?._id === userId) setUserClapped(action === "added");
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

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/home"
        className="block text-gray-500 hover:text-gray-700 text-sm mb-4"
      >
        ← Back
      </Link>

      {/* Post header */}
      <div className="mb-6">
        <PostHeader post={post} />
      </div>

      {/* Post actions */}
      <div className="mb-6">
        <PostActions
          postId={id}
          clapCount={clapCount}
          userClapped={userClapped}
          setClapCount={setClapCount}
          setUserClapped={setUserClapped}
          currentUser={currentUser}
          navigate={navigate}
        />
      </div>

      {/* Post Content */}
      <div className="prose max-w-none mb-10">
        <PostBlocks blocks={post.blocks} />
      </div>

      {/* Comments */}
      <div className="mt-8 border-t pt-6">
        <CommentSection
          postId={id}
          comments={comments}
          setComments={setComments}
          currentUser={currentUser}
          navigate={navigate}
        />
      </div>
    </div>
  );
};
