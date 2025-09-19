import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../service/api";
import { PostCard } from "../components/ui/PostCard";
import { useAuth } from "../context/AuthContext";

export const AuthorPage = () => {
  const { authorId } = useParams();
  const { user: authUser } = useAuth();

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  // Helper to get full profile image URL
  const getProfileImage = useCallback((img) => {
    if (!img) return null;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (img.startsWith("//")) return `https:${img}`;
    return `${import.meta.env.VITE_API_URL}/${img.replace(/^\//, "")}`;
  }, []);

  // Fetch author data
  const fetchAuthor = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/author/${authorId}`);
      if (!res.data.success) throw new Error(res.data.message || "Author not found");

      const fetchedAuthor = res.data.user;
      setAuthor(fetchedAuthor);
      setPosts(res.data.posts || []);
      setIsFollowing(
        authUser
          ? fetchedAuthor.followers?.some(f => f._id === authUser._id)
          : false
      );

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [authorId, authUser]);

  // Toggle follow/unfollow
  const toggleFollow = async () => {
    if (!authUser) return alert("Please log in to follow users.");
    if (!author) return;

    const action = isFollowing ? "unfollow" : "follow";

    try {
      const res = await api.post(`/follow/${action}/${authorId}`);
      if (!res.data.success) throw new Error(res.data.message || "Something went wrong");

      setIsFollowing(!isFollowing);

      setAuthor(prev => {
        if (!prev) return prev;
        const followers = prev.followers ? [...prev.followers] : [];

        if (action === "follow") {
          if (!followers.some(f => f._id === authUser._id)) {
            followers.push({
              _id: authUser._id,
              name: authUser.name,
              profileImage: authUser.profileImage || "",
            });
          }
        } else {
          const index = followers.findIndex(f => f._id === authUser._id);
          if (index > -1) followers.splice(index, 1);
        }

        return { ...prev, followers };
      });

    } catch (err) {
      console.error("Follow error:", err);
      alert(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, [fetchAuthor]);

  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  const profileImageSrc = getProfileImage(author?.profileImage);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Author Info */}
      <div className="flex items-center gap-4 mb-4">
        {profileImageSrc ? (
          <img
            src={profileImageSrc}
            alt={author?.name || "Author"}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 border">
            {author?.name?.charAt(0) || "?"}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{author.name}</h1>
          {author.bio && <p className="text-gray-600 mt-1">{author.bio}</p>}
          <p className="text-sm text-gray-500 mt-1">
            Followers: {author.followers?.length || 0} | Following: {author.following?.length || 0}
          </p>
        </div>

        {authUser && author._id !== authUser._id && (
          <button
            onClick={toggleFollow}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              isFollowing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Posts */}
      <h2 className="text-xl font-semibold mb-4">Posts by {author.name}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} formatDate={formatDate} hideAuthor />
          ))}
        </div>
      )}
    </div>
  );
};
