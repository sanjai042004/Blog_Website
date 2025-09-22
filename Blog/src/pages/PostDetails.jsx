import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../service/api";
import { useAuth } from "../context/AuthContext";

import {PostHeader,CommentSection,PostActions,PostBlocks,} from "../components/ui/post";
import { useAuthor } from "./hooks/useAuthor";

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

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
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

  // Handle post clap
  const handlePostClap = async () => {
    if (!currentUser) return navigate("/login");

    try {
      const res = await api.post(`/posts/${id}/clap`);
      setClapCount(res.data.totalClaps);
      setUserClapped(res.data.action === "added");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clap");
    }
  };

  // Author hook
  const { author, isFollowing, toggleFollow } = useAuthor(
    post?.author?._id,
    currentUser,
    post?.author
  );

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link to="/home" className="block text-gray-500 hover:text-gray-700 text-sm mb-4">
        ← Back
      </Link>

      {/* Post header */}
      <PostHeader
        post={{ ...post, author }}
        currentUser={currentUser}
        isFollowing={isFollowing}
        toggleFollow={currentUser?._id !== author?._id ? toggleFollow : undefined}
      />

      {/* Post actions */}
      <PostActions
        postId={id}
        clapCount={clapCount}
        userClapped={userClapped}
        setClapCount={setClapCount}
        setUserClapped={setUserClapped}
        handleClap={handlePostClap}
        currentUser={currentUser}
        navigate={navigate}
      />

      {/* Post content */}
      <div className="prose max-w-none mb-10">
        <PostBlocks blocks={post.blocks} />
      </div>

      {/* Comments section */}
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
