
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dummyPosts } from "../constant/data";
import { useSearch } from "../context/SearchContext";

export const Home = () => {
  const { searchTerm } = useSearch();
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const navigate = useNavigate();

  
 useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedTerm(prev => {
      const trimmed = searchTerm.trim();
      return prev === trimmed ? prev : trimmed;
    });
  }, 200);
  return () => clearTimeout(handler);
}, [searchTerm]);


 const filteredPosts = useMemo(() => {
  const term = debouncedTerm.toLowerCase();
  if (!term) return dummyPosts;

  return dummyPosts.filter((post) =>
    [post.title, post.subtitle, post.content, post.author]
      .some(field => field?.toLowerCase().includes(term))
  );
}, [debouncedTerm]);


  const getPreview = (content) => {
    if (!content) return "";

    if (content.length <= 150) return content;
    const truncated = content.slice(0, 150);

    const lastSpace = truncated.lastIndexOf(" ");

    return truncated.slice(0, lastSpace) + "...";
  };

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

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <section>
          <h2 className="text-3xl font-bold mb-12 text-center">Latest Posts</h2>

          {filteredPosts.length === 0 ? (
            <p className="text-center text-gray-500">No matching posts found</p>
          ) : (
            <div className="space-y-12">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  type="button"
                  onClick={() => navigate(`/home/post/${post._id}`)}
                  className="cursor-pointer outline-none rounded">
                    
                  <div className="flex flex-col sm:flex-row gap-8 p-6">
                    <div className="flex-shrink-0 w-full sm:w-72 h-44 overflow-hidden rounded-lg">
                      <img
                        src={post.image || "/placeholder.jpg"}
                        alt={post.title}
                        loading="lazy"
                        className=" w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold mb-2 text-gray-900 hover:underline">
                          {post.title}
                        </h2>
                        <p className="text-md text-gray-700 mb-4">
                          {post.subtitle}
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {getPreview(post.content)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-6">
                        {post.authorAvatar && (
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            type="button"
                            className="w-8 h-8 rounded-full object-cover cursor-pointer border border-gray-300"
                          />
                        )}
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/author/${post.authorId || post.author}`);
                          }}
                          className="font-medium text-blue-600 hover:underline cursor-pointer"
                        >
                          By {post.author}
                        </span>{" "}
                        <span>on {formatDate(post.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
