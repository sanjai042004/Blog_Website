import { UserProfile } from "./UserProfile";

export const AuthorProfile = ({ author, authUser, isFollowing, toggleFollow, navigate }) => {
  const authUserId = authUser ? String(authUser._id || authUser.id) : null;
  const authorIdStr = author ? String(author._id) : null;
  const showFollowButton = authUser && author && authorIdStr !== authUserId;

  return (
    <div className="p-6 border-l md:min-h-screen border-gray-200 sticky top-20 bg-white">
      <div className="flex justify-center mb-4">
        <UserProfile user={author} size="w-28 h-28" fontSize="text-2xl" />
      </div>
      <h1 className="text-xl font-bold text-center">{author?.name || "Unknown Author"}</h1>

      {author?.bio && <p className="text-gray-600 text-sm mt-2 text-center">{author.bio}</p>}

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
          className={`mt-4 w-full py-2 rounded-md text-sm font-medium transition
            ${isFollowing ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-black text-white hover:bg-gray-800"}`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};
