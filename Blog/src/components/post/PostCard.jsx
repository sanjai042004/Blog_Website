import { Link, useNavigate } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import { MdSaveAlt } from "react-icons/md";
import { useMemo } from "react";
import { AuthorInfo } from "./AuthorInfo";
import { getPostImage, getPreviewText } from "../../utilis/postUtilis";

export const PostCard = ({ post, formatDate, hideAuthor = false }) => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const author = post.author || {};
  const authorId = author._id;

  const goToAuthor = (e) => {
    e.stopPropagation();
    if (authorId) navigate(`/home/author/${authorId}`);
  };

  const postImage = useMemo(
    () => getPostImage(post, BACKEND_URL),
    [post, BACKEND_URL]
  );
  const previewText = useMemo(() => getPreviewText(post), [post]);

  return (
    <div
      className="cursor-pointer w-full max-w-xl mx-auto py-6 px-4"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/home/post/${post._id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/home/post/${post._id}`)}
    >
      {!hideAuthor && (
        <AuthorInfo
          author={author}
          onClick={goToAuthor}
          showDate={true}
          date={post.createdAt ? new Date(post.createdAt) : null}
        />
      )}

      {/* Post Body */}
      <Link to={`/home/post/${post._id}`} className="flex flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 line-clamp-2">
            {post.title || "Untitled Post"}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mt-1 line-clamp-3">
            {previewText}
          </p>
        </div>

        {postImage && (
          <div className="w-28 h-20 sm:w-36 sm:h-24 overflow-hidden flex-shrink-0 rounded-md">
            <img
              src={postImage}
              alt={post.title || "Post image"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </Link>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mt-4 gap-2 sm:gap-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FaHandsClapping /> 
          </span>
          <span className="flex items-center gap-1">
            <FaRegComment /> {post.comments?.length || 0}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Saved post:", post._id);
            }}
            className="hover:text-gray-700"
            aria-label="Save post"
          >
            <MdSaveAlt size={18} />
          </button>
          <div className="text-gray-400">•••</div>
        </div>
      </div>
    </div>
  );
};
