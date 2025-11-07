import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Heart, MessageCircle, Share } from "lucide-react";
import { AuthorInfo } from "./AuthorInfo";
import { getPostImage, getPreviewText } from "../../utilis/postUtilis";

export const PostCard = ({ post, hideAuthor = false }) => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const author = post.author || {};

  const goToAuthor = (e) => {
    e.stopPropagation();
    if (author._id) navigate(`/home/author/${author._id}`);
  };

  const postImage = useMemo(
    () => getPostImage(post, BACKEND_URL),
    [post, BACKEND_URL]
  );
  const previewText = useMemo(() => getPreviewText(post), [post]);

  const openPost = () => navigate(`/home/post/${post._id}`);

  return (
    <div
      onClick={openPost}
      className="cursor-pointer w-full max-w-2xl mx-auto py-6 px-4"
    >
      {!hideAuthor && (
        <AuthorInfo
          author={author}
          onClick={goToAuthor}
          showDate
          date={post.createdAt ? new Date(post.createdAt) : null}
        />
      )}

      <Link to={`/home/post/${post._id}`} className="flex gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {post.title || "Untitled Post"}
          </h2>
          <p className="text-gray-700 mt-1 line-clamp-3 text-sm">
            {previewText}
          </p>
        </div>

        {postImage && (
          <img
            src={postImage}
            alt={post.title || "Post image"}
            className="w-32 h-24 object-cover rounded-md flex-shrink-0"
            loading="lazy"
          />
        )}
      </Link>

      <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart size={16} /> {post.likes || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={16} /> {post.comments?.length || 0}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Share post:", post._id);
          }}
          className="hover:text-gray-700"
        >
          <Share size={16} />
        </button>
      </div>
    </div>
  );
};
