import { Link } from "react-router-dom";
import { calculateReadTime } from "../../../utilis/calculateReadTime";
import { Avatar } from "../Avatar";


const userName = (user) => user?.name || "Unknown";

export const PostHeader = ({ post }) => {
  const author = post?.author;

  return (
    <>
      <h1 className="text-5xl font-extrabold mb-12">{post?.title}</h1>

      <div className="flex items-center gap-3 mb-10">
        {author ? (
          <Link to={`/author/${author._id}`}>
            <Avatar user={author} size="w-10 h-10 text-sm" />
          </Link>
        ) : (
          <Avatar user={null} size="w-10 h-10 text-sm" />
        )}

        <div className="flex items-center gap-2">
          <p className="font-bold">{userName(author)}</p>
          <button className="border px-3 py-1 rounded-full text-sm hover:bg-gray-100">
            Follow
          </button>
          <p className="text-sm text-gray-500">
            {calculateReadTime(
              post?.blocks?.map((b) => b.content).join(" ") || ""
            )}{" "}
            ·{" "}
            {post?.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ""}
          </p>
        </div>
      </div>
    </>
  );
};
