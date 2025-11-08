import { useState, useEffect } from "react";
import { PostCard } from "../components/post/PostCard";
import { TopicsSidebar } from "../components/ui";
import { api } from "../service/api";
import { formatDate } from "../utilis/utilis";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-lg">Loading posts...</p>;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Main Post Section */}
        <div className="flex-1 max-w-4xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Latest Posts
          </h2>

          {posts.length > 0 ? (
            <div className="space-y-8 sm:space-y-12">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} formatDate={formatDate} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">No posts found.</p>
          )}
        </div>

        {/* Sidebar (hidden on mobile) */}
        <aside className="hidden lg:block w-full max-w-xs">
          <TopicsSidebar />
        </aside>
      </div>
    </div>
  );
};
