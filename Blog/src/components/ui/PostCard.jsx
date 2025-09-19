import placeholder from "../../assets/placeholder.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import { MdSaveAlt } from "react-icons/md";
import { useMemo } from "react";

export const PostCard = ({ post, formatDate, hideAuthor = false }) => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  const author = post.author || {};
  const authorId = author._id;
  const authorName = author.name || "Unknown";

  const authorAvatar = author.profileImage
    ? author.profileImage.startsWith("http")
      ? author.profileImage
      : `${BACKEND_URL}${author.profileImage}`
    : placeholder; 

  const goToAuthor = (e) => {
    e.stopPropagation();
    if (authorId) navigate(`/home/author/${authorId}`);
  };

 
  const postImage = useMemo(() => {
    if (!post.blocks?.length) return placeholder;

    for (let block of post.blocks) {
      if (block.youtubeEmbed) {
        const match = block.youtubeEmbed.match(/(?:embed\/|youtu\.be\/)([\w-]+)/);
        if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
      if (block.type === "image" && block.media) {
        return block.media.startsWith("http")
          ? block.media
          : BACKEND_URL + block.media;
      }
    }
    return placeholder;
  }, [post, BACKEND_URL]);


  const previewText = useMemo(() => {
    if (!post.blocks?.length) return "";
    for (let block of post.blocks) {
      const text = (block.content || block.text)?.trim();
      if (text) {
        if (text.length <= 150) return text;
        const slice = text.slice(0, 100);
        const lastSpace = slice.lastIndexOf(" ");
        return lastSpace > 0 ? slice.slice(0, lastSpace) + "..." : slice + "...";
      }
    }
    return "";
  }, [post]);

  return (
    <div
      className="cursor-pointer w-full max-w-xl mx-auto py-6 px-4"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/home/post/${post._id}`)}
    >
      {/* Author */}
      {!hideAuthor && (
        <div className="flex items-center gap-3 text-sm mb-2">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-6 h-6 rounded-full cursor-pointer"
            onClick={goToAuthor}
          />
          <span
            onClick={goToAuthor}
            className="font-medium text-gray-500 hover:underline hover:text-gray-700 cursor-pointer"
          >
            {authorName}
          </span>
        </div>
      )}

      {/* Post Content (wrapped in Link) */}
      <Link to={`/home/post/${post._id}`} className="flex flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 line-clamp-2">
            {post.title || "Untitled Post"}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mt-1 line-clamp-3">
            {previewText}
          </p>
        </div>

        <div className="w-28 h-20 sm:w-36 sm:h-24 overflow-hidden flex-shrink-0">
          <img
            src={postImage}
            alt={post.title || "Post image"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mt-4 gap-2 sm:gap-0">
        <div className="flex items-center gap-4">
          <span>
            {post.createdAt ? formatDate(new Date(post.createdAt)) : "Unknown Date"}
          </span>
          <span className="flex items-center gap-1">
            <FaHandsClapping /> {post.claps || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaRegComment /> {post.comments?.length || 0}
          </span>
        </div>

        {/* Save + Options */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: integrate save post API here
              console.log("Saved post:", post._id);
            }}
            className="hover:text-gray-700"
          >
            <MdSaveAlt size={18} />
          </button>
          <div className="text-gray-400">•••</div>
        </div>
      </div>
    </div>
  );
};
