import { Link } from "react-router-dom";
import { calculateReadTime } from "../../../utilis/calculateReadTime";

const userProfile = (user) => {
  if (!user?.profileImage) return "/placeholder-user.png"; 
  return user.profileImage.startsWith("http")
    ? user.profileImage
    : `${import.meta.env.VITE_API_URL}${user.profileImage}`;
};

const userName = (user) => user?.name || "";

export const PostHeader = ({ post }) => {
  return (
    <>
      <h1 className="text-5xl font-extrabold mb-12">{post?.title}</h1>

      <div className="flex items-center gap-3 mb-10">
        {post?.author ? (
          <Link to={`/author/${post.author._id}`}>
            <img
              src={userProfile(post.author)}
              alt={userName(post.author)}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
        ) : (
          <img
            src="/placeholder-user.png" 
            alt="Unknown Author"
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex items-center gap-2">
          <p className="font-bold">{userName(post?.author)}</p>
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
