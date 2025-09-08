import { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import { PostCard } from "../components/ui/PostCard";
import { useDebounce } from "../customHooks/UseDebounce";
import { api } from "../service/api";


export const Home = () => {
  const { searchTerm } = useSearch();
  const debouncedTerm = useDebounce(searchTerm.trim(), 200);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/posts");
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term
  const filteredPosts = posts.filter((post) => {
    const term = debouncedTerm.toLowerCase();
    if (!term) return true;

    const searchable = [
      post.title,
      post.blocks?.map(b => b.content).join(" "), 
      post.author?.name
    ].join(" ").toLowerCase();

    return searchable.includes(term);
  });

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString || "";
    }
  };

  if (loading) return <p className="text-center mt-20">Loading posts...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Latest Posts</h2>

        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500">
            {debouncedTerm ? `No matching posts found for "${debouncedTerm}"` : "No posts available"}
          </p>
        ) : (
          <div className="space-y-12">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
