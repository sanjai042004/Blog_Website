import placeholder from "../../assets/placeholder.jpg";
import { useNavigate } from "react-router-dom";

export const PostCard = ({ post, formatDate }) => {
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:5000";

  const author = post.author || {};
  const authorId = author._id;
  const authorName = author.name || "Unknown";
  const authorAvatar = author.profileImage || "/default-avatar.png";

  // Navigate to author page
  const goToAuthor = (e) => {
    e.stopPropagation();
    if (authorId) navigate(`/home/author/${authorId}`);
  };

  // Determine post image
  const getPostImage = () => {
    if (post.image) return post.image.startsWith("http") ? post.image : BACKEND_URL + post.image;

    const imgBlock = post.blocks?.find((b) => b.type === "image" && b.media);
    if (imgBlock) return imgBlock.media.startsWith("http") ? imgBlock.media : BACKEND_URL + imgBlock.media;

    const ytBlock = post.blocks?.find((b) => b.youtubeEmbed);
    if (ytBlock) {
      const match = ytBlock.youtubeEmbed.match(/(?:embed\/|youtu\.be\/)([\w-]+)/);
      if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }

    return placeholder;
  };

  // Generate post preview text
  const getPreview = () => {
  const text = post.blocks?.find((b) => b.type === "text" && b.content)?.content || "";
  if (text.length <= 150) return text;

  // Slice up to 150 chars but avoid cutting in the middle of a word
  const slice = text.slice(0, 120);
  const lastSpace = slice.lastIndexOf(" ");
  return slice.slice(0, lastSpace) + "...";
};


  return (
    <div
      onClick={() => navigate(`/home/post/${post._id}`)}
      className="cursor-pointer rounded-lg bg-white p-6"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/home/post/${post._id}`)}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Post Image */}
        <div className="w-full sm:w-68 h-40 flex-shrink-0 overflow-hidden">
          <img
            src={getPostImage()}
            alt={post.title || "Post image"}
            className="w-full h-full object-cover hover:scale-101 transition-transform"
            loading="lazy"
          />
        </div>

        {/* Post Content */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 hover:underline">
              {post.title || "Untitled Post"}
            </h2>
            <p className="text-gray-700 mt-2">{getPreview()}</p>
          </div>

          {/* Author & Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-8 h-8 rounded-full border cursor-pointer"
              onClick={goToAuthor}
            />
            <span
              onClick={goToAuthor}
              className="font-medium text-blue-600 hover:underline cursor-pointer"
            >
              By {authorName}
            </span>
            <span>{post.createdAt ? formatDate(post.createdAt) : "Unknown Date"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
