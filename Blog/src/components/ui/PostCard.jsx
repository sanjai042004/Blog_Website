import React from "react";
import { useNavigate } from "react-router-dom";

export const PostCard = ({ post, formatDate }) => {
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:5000"; 

  // Get first image / YouTube thumbnail / fallback
  const getPostCardImage = (post) => {
    // 1️⃣ Main image
    if (post.image) {
      return post.image.startsWith("http") ? post.image : `${BACKEND_URL}${post.image}`;
    }

    // 2️⃣ First image block (including Unsplash)
    const firstImageBlock = post.blocks?.find((b) => b.type === "image" && b.media);
    if (firstImageBlock) {
      return firstImageBlock.media.startsWith("http")
        ? firstImageBlock.media
        : `${BACKEND_URL}${firstImageBlock.media}`;
    }

    // 3️⃣ Any block with YouTube embed
    const firstYoutubeBlock = post.blocks?.find((b) => b.youtubeEmbed);
    if (firstYoutubeBlock) {
      const videoIdMatch = firstYoutubeBlock.youtubeEmbed.match(
        /(?:youtube\.com\/embed\/|youtu\.be\/)([\w-]+)/
      );
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    // 4️⃣ Fallback
    return "/placeholder.jpg";
  };

  // Get first text block for preview =====
  const getTextPreview = (post) => {
    const textBlock = post.blocks?.find((b) => b.type === "text" && b.content);
    if (!textBlock?.content) return "";
    const content = textBlock.content;
    if (content.length <= 150) return content;
    const truncated = content.slice(0, 150);
    const lastSpace = truncated.lastIndexOf(" ");
    return truncated.slice(0, lastSpace) + "...";
  };

  const postImage = getPostCardImage(post);
  const postPreview = getTextPreview(post);

  // Author info
  const author = post.author || {};
  const authorName = author.name || "Unknown";
  const authorAvatar = author.profileImage || "/default-avatar.png";
  const authorId = author._id || null;

  return (
    <div
      onClick={() => navigate(`/home/post/${post._id}`)}
      className="cursor-pointer outline-none rounded hover:shadow-md transition-shadow duration-300"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/home/post/${post._id}`)}
    >
      <div className="flex flex-col sm:flex-row gap-8 p-6 bg-white rounded-lg">
        {/* Post Image / YouTube Thumbnail / Unsplash */}
        <div className="flex-shrink-0 w-full sm:w-72 h-44 overflow-hidden rounded-lg">
          <img
            src={postImage}
            alt={post.title || "Post image"}
            loading="lazy"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Post Content */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 hover:underline">
              {post.title || "Untitled Post"}
            </h2>
            <p className="text-gray-700 leading-relaxed">{postPreview}</p>
          </div>

          {/* Author & Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-6">
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover cursor-pointer border border-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  if (authorId) navigate(`/author/${authorId}`);
                }}
              />
            )}
            <span
              role="link"
              onClick={(e) => {
                e.stopPropagation();
                if (authorId) navigate(`/author/${authorId}`);
              }}
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
