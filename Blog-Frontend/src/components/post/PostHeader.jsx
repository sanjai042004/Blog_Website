import { Link } from "react-router-dom";
import { calculateReadTime } from "../../utilis/calculateReadTime";
import { formatDate } from "../../utilis/utilis";
import { UserProfile } from "../author/UserProfile";
import { FollowButton } from "../follow/FollowButton";

export const PostHeader = ({
  post,
  currentUser,
  isFollowing,
  toggleFollow,
  followLoading,
}) => {
  if (!post) return null;

  const { author, title, blocks = [], createdAt } = post;

  const readTime = calculateReadTime(
    blocks.map((b) => b.content || "").join(" ")
  );

  const date = formatDate(createdAt);

  const isOwnPost =
    currentUser && author && currentUser._id === author._id;
    console.log("toggleFollow:", toggleFollow);

  return (
    <div className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 break-words">
        {title}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <Link to={author ? `/author/${author._id}` : "#"}>
            <UserProfile user={author} size="w-10 h-10" />
          </Link>

          <div className="flex items-center gap-2">
            <p className="font-semibold">
              {author?.name || "Unknown"}
            </p>

            {!isOwnPost && toggleFollow && (
              <FollowButton
                isFollowing={isFollowing}
                onToggle={toggleFollow}
                loading={followLoading}
              />
            )}

            {isOwnPost && (
              <span className="text-gray-500 text-xs border px-2 py-1 rounded-full">
                You
              </span>
            )}
          </div>
        </div>

        <p className="font-light text-xs text-gray-500">
          {readTime} • {date}
        </p>
      </div>
    </div>
  );
};