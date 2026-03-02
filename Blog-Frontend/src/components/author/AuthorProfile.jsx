import { UserProfile } from "./UserProfile";
import { FollowButton } from "../follow/FollowButton";

export const AuthorProfile = ({
  author,
  isFollowing,
  followersCount,
  toggleFollow,
  currentUser,
  navigate,
  followLoading,
}) => {
  if (!author) return null;

  const isOwnProfile =
    currentUser && currentUser._id === author._id;

  return (
    <div className="p-6  md:min-h-screen border-gray-200 sticky top-20 bg-white">
      
      <div className="flex justify-center mb-4">
        <UserProfile user={author} size="w-28 h-28" />
      </div>

      <h1 className="text-xl font-bold text-center">
        {author.name || "Unknown Author"}
      </h1>

      <p className="text-sm text-gray-500 text-center mt-2">
        <button
          onClick={() => navigate(`/followers/${author._id}`)}
          className="underline hover:text-black"
        >
          {followersCount} Followers
        </button>
      </p>

      {!isOwnProfile && toggleFollow && (
        <div className="mt-4">
          <FollowButton
            isFollowing={isFollowing}
            onToggle={toggleFollow}
            loading={followLoading}
            size="lg"
          />
        </div>
      )}
    </div>
  );
};