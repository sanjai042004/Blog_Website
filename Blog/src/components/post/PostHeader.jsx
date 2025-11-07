import { Link } from "react-router-dom";
import { calculateReadTime } from "../../utilis/calculateReadTime";
import { formatDate } from "../../utilis/utilis";
import { UserProfile } from "../author/UserProfile";

export const PostHeader = ({
  post,
  currentUser,
  isFollowing,
  toggleFollow,
}) => {
  if (!post) return null;

  const { author, title, blocks, createdAt } = post;
  const authorName = author?.name || "Unknown";

  const canFollow = currentUser && author && currentUser._id !== author._id;

  const readTime = calculateReadTime(
    Array.isArray(blocks) ? blocks.map((b) => b.content).join(" ") : ""
  );

  const date = formatDate(createdAt);

  return (
    <div className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 break-words">
        {title}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to={author ? `/author/${author._id}` : "#"}>
            <UserProfile user={author} size="w-10 h-10" />
          </Link>

          <div className="flex items-center gap-2">
            <p className="font-semibold">{authorName}</p>

            {canFollow && (
              <button
                onClick={toggleFollow}
                className="text-blue-500 text-sm hover:underline"
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}

            {currentUser && author && currentUser._id === author._id && (
              <span className="text-gray-500 text-xs border px-2 py-1 rounded-full">
                You
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          {readTime} · {date}
        </p>
      </div>
    </div>
  );
};
