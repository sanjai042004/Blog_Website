import placeholder from "../assets/placeholder.jpg";

export const getPostImage = (post, BACKEND_URL) => {
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
};

export const getPreviewText = (post) => {
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
};
