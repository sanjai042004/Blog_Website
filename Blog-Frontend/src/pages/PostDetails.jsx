import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { api } from "../service/api";
import {
  PostHeader,
  PostBlocks,
  PostActions,
  CommentSection,
} from "../components/post";
import { useAuthor } from "../hooks/useAuthor";
import { useAuth } from "../context/AuthContext";
import { useFollow } from "../hooks/useFollow";

export const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [clapCount, setClapCount] = useState(0);
  const [userClapped, setUserClapped] = useState(false);

  // 🔹 Fetch Post
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(`/posts/${id}`);
        const postData = data.post;

        setPost(postData);
        setComments(postData.comments || []);
        setClapCount(postData.claps?.length || 0);

        if (currentUser?._id) {
          setUserClapped(
            postData.claps?.some(
              (c) => c.user?.toString() === currentUser._id.toString()
            )
          );
        } else {
          setUserClapped(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 🔹 Clap Logic
  const handleClap = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await api.post(`/posts/${id}/clap`);
      setClapCount(data.totalClaps);
      setUserClapped(data.action === "added");
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to clap");
    }
  };

  // 🔹 Author Data (only fetch profile info)
  const { author } = useAuthor(post?.author?._id);

  // 🔹 Follow Logic (separate hook)
  const {
    isFollowing,
    toggleFollow,
    loading: followLoading,
  } = useFollow(post?.author?._id, currentUser);

  // 🔹 Can Follow?
  const canFollow = useMemo(() => {
    if (!currentUser || !author) return false;
    return currentUser._id !== author._id;
  }, [currentUser, author]);

  if (loading) {
    return <p className="text-center py-20">Loading post...</p>;
  }

  if (error) {
    return (
      <p className="text-center py-20 text-red-500">
        {error}
      </p>
    );
  }

  if (!post) {
    return <p className="text-center py-20">Post not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-4 mt-25">
      <PostHeader
        post={{ ...post, author }}
        currentUser={currentUser}
        isFollowing={isFollowing}
        toggleFollow={canFollow ? toggleFollow : undefined}
        followLoading={followLoading}
      />

      <PostActions
        postId={id}
        clapCount={clapCount}
        userClapped={userClapped}
        handleClap={handleClap}
        currentUser={currentUser}
        navigate={navigate}
      />

      <div className="prose max-w-full mt-6 mb-10">
        <PostBlocks blocks={post.blocks} />
      </div>

      <div className="border-t border-gray-200 pt-6 mt-8">
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