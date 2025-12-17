import { formatDate } from "../../utilis/utilis";
import { UserProfile } from "../author/UserProfile";

export const AuthorInfo = ({
  author,
  followersCount,
  isFollowing,
  toggleFollow,
  onClick,
  showDate = false,
  date,
}) => {
  if (!author) return null;

  return (
    <div className="flex items-center gap-2 mb-2 text-sm">
      <UserProfile user={author} size="w-7 h-7 text-xs" onClick={onClick} />

      <div className="flex flex-col">
        <span
          className="font-medium text-gray-700 hover:underline cursor-pointer"
          onClick={onClick}
          title={author.name || "Unknown"}
        >
          {author.name || "Unknown"}
        </span>

        {showDate && date && (
          <span className="text-xs text-gray-500">{formatDate(date)}</span>
        )}
      </div>

      {toggleFollow && (
        <button
          className={`ml-auto px-2 py-1 text-xs font-medium rounded ${
            isFollowing ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white"
          }`}
          onClick={toggleFollow}
        >
          {isFollowing ? "Following" : "Follow"} ({followersCount})
        </button>
      )}
    </div>
  );
};
