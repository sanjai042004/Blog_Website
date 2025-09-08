import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../service/api";
import { PostCard } from "../components/ui/PostCard";

export const AuthorPage = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAuthor = async () => {
  try {
    setLoading(true);
    const res = await api.get(`/users/author/${authorId}`);
    if (!res.data.success) throw new Error(res.data.message || "Author not found");

    setAuthor(res.data.user);
    setPosts(res.data.posts || []);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAuthor();
  }, [authorId]);

  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Author Info */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={author.profileImage}
          alt={author.name}
          className="w-16 h-16 rounded-full border"
        />
        <div>
          <h1 className="text-2xl font-bold">{author.name}</h1>
          {author.bio && <p className="text-gray-600 mt-1">{author.bio}</p>}
        </div>
      </div>

      {/* Author's Posts */}
      <h2 className="text-xl font-semibold mb-4">Posts by {author.name}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} formatDate={formatDate} />
          ))}
        </div>
      )}
    </div>
  );
};
