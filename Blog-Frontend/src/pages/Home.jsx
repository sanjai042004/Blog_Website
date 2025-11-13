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
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 justify-center">

        {/* Main Post Section */}
        <div className="w-full lg:w-[900px]">
           <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">
           Latest Post
          </h2>
          {posts.length > 0 ? (
            <div className="space-y-6 sm:space-y-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} formatDate={formatDate} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">No posts found.</p>
          )}
        </div>

        {/* Sidebar (hidden on mobile & tablet) */}
        <aside className="hidden xl:block w-full max-w-xs">
          <TopicsSidebar />
        </aside>
      </div>
    </div>
  );
};
