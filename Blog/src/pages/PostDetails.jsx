import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { api } from "../service/api";
import { useAuth } from "../context/AuthContext";
import socket, { connectSocket, disconnectSocket } from "../service/comment.socket";
import { PostHeader,CommentSection,PostActions,PostBlocks } from "../components/ui/post";


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

  const fetchPost = useCallback(async () => {
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
  }, [id, currentUser]);

  useEffect(() => { fetchPost(); }, [fetchPost]);


  useEffect(() => {
    if (!currentUser) return;
    connectSocket();

    const handleNewComment = (comment) => {
      if (comment.post?._id === id) {
        setComments(prev => prev.some(c => c._id === comment._id) ? prev : [...prev, comment]);
      }
    };

    const handleNewClap = (data) => {
      if (data.postId === id) {
        setClapCount(data.totalClaps);
        if (currentUser?._id === data.userId) {
          setUserClapped(data.action === "added");
        }
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/home" className="text-gray-500 hover:text-gray-700 text-sm mb-4 inline-block">
        ← Back
      </Link>

      <PostHeader post={post} />
      <PostActions
        postId={id}
        clapCount={clapCount}
        userClapped={userClapped}
        setClapCount={setClapCount}
        setUserClapped={setUserClapped}
        currentUser={currentUser}
        navigate={navigate}
      />
      <PostBlocks blocks={post.blocks} />
      <CommentSection
        postId={id}
        comments={comments}
        setComments={setComments}
        currentUser={currentUser}
        navigate={navigate}
      />
    </div>
  );
};
