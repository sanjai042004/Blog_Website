import { useParams, useNavigate } from "react-router-dom";
import { PostCard } from "../components/ui/PostCard";
import { useAuth } from "../context/AuthContext";
import { useAuthor } from "./hooks/useAuthor";
import { formatDate, getProfileImage } from "../utilis/utilis";

export const AuthorPage = () => {
  const { authorId } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const { author, posts, loading, error, isFollowing, toggleFollow } =
    useAuthor(authorId, authUser);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  const profileImageSrc = getProfileImage(author?.profileImage);
  const authUserId = String(authUser?._id || authUser?.id || "");
  const authorIdStr = String(author?._id || "");
  const showFollowButton = authUser && author && authorIdStr !== authUserId;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Profile Section */}
      <div className="md:row-span-1 order-1 md:order-2">
        <div className="p-6 border-l md:min-h-screen border-gray-200 sticky top-20 bg-white">
          {profileImageSrc ? (
            <img
              src={profileImageSrc}
              alt={author?.name || "Unknown Author"}
              className="w-28 h-28 rounded-full object-cover mx-auto mb-4"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center font-bold text-2xl text-gray-500 mx-auto mb-4">
              {author?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}

          <h1 className="text-xl font-bold text-center">
            {author?.name || "Unknown Author"}
          </h1>

          {author?.bio && (
            <p className="text-gray-600 text-sm mt-2 text-center">{author.bio}</p>
          )}

          <p className="text-sm text-gray-500 text-center mt-2">
            <button
              onClick={() => author?._id && navigate(`/followers/${author._id}`)}
              className="underline hover:text-black"
            >
              {author?.followers?.length || 0} Followers
            </button>
          </p>

          {showFollowButton && (
            <button
              onClick={toggleFollow}
              className={`mt-4 w-full py-2 rounded-md text-sm font-medium transition ${
                isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="flex md:col-span-2 order-2 md:order-1 flex-col space-y-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
          Posts by {author?.name || "Author"}
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} formatDate={formatDate} hideAuthor />
          ))
        )}
      </div>
    </div>
  );
};
