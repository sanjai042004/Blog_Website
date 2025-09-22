import { Link } from "react-router-dom";
import { Avatar } from "../Avatar";
import { calculateReadTime } from "../../../utilis/calculateReadTime";

export const PostHeader = ({ post, currentUser, isFollowing, toggleFollow }) => {
  const author = post?.author;

  const showFollowButton = currentUser && author && currentUser._id !== author._id;

  const authorName = author?.name || "Unknown";

  const readTime = calculateReadTime(
    post?.blocks?.map((b) => b.content).join(" ") || ""
  );

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : "";

  return (
    <>
      <h1 className="text-5xl font-extrabold mb-12">{post?.title}</h1>

      <div className="flex items-center gap-3 mb-10">
        <Link to={author ? `/author/${author._id}` : "#"}>
          <Avatar user={author || null} size="w-10 h-10 text-sm" />
        </Link>

        <div className="flex items-center gap-2">
          <p className="font-bold">{authorName}</p>

          {showFollowButton ? (
            <button
              className={`border px-3 py-1 rounded-full text-sm ${
                isFollowing ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={toggleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          ) : currentUser?._id === author?._id ? (
            <span className="text-sm text-gray-500 px-3 py-1 border rounded-full">
              You
            </span>
          ) : null}

          <p className="text-sm text-gray-500">
            {readTime} · {formattedDate}
          </p>
        </div>
      </div>
    </>
  );
};
