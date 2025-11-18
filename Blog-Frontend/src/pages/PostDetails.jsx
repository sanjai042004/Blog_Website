import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../service/api";
import {PostHeader,PostBlocks,PostActions,CommentSection,} from "../components/post";
import { useAuth } from "../hooks/useAuth";
import { useAuthor } from "../hooks/useAuthor";

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        const data = res.data.post;

        setPost(data);
        setComments(data.comments || []);
        setClapCount(data.claps?.length || 0);
        setUserClapped(data.claps?.some((c) => c.user === currentUser?._id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUser]);

  const handleClap = async () => {
    if (!currentUser) return navigate("/login");

    try {
      const res = await api.post(`/posts/${id}/clap`);
      setClapCount(res.data.totalClaps);
      setUserClapped(res.data.action === "added");
    } catch {
      alert("Failed to clap the post");
    }
  };

  const { author, isFollowing, toggleFollow } = useAuthor(
    post?.author?._id,
    currentUser,
    post?.author
  );

  if (loading) return <p className="text-center py-20">Loading post...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-4 mt-25">

      <PostHeader
        post={{ ...post, author }}
        currentUser={currentUser}
        isFollowing={isFollowing}
        toggleFollow={
          currentUser?._id !== author?._id ? toggleFollow : undefined
        }
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
