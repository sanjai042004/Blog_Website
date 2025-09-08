export const newBlock = () => ({
  type: "text",
  content: "",
  media: null,
  preview: null,
  youtubeEmbed: null,
  unsplashQuery: "",
  unsplashResults: [],
  ui: { showOptions: false, showVideoInput: false, showUnsplashInput: false },
  imageFile: null,
});

// Parse a YouTube URL and return the embed link
export const parseYouTubeLink = (link) => {
  if (!link) return null;
  const match = link.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
};

// Prepare image for block: handle File uploads or URLs
export const prepareImage = (fileOrUrl, existingMedia = null) => {
  if (!fileOrUrl && !existingMedia) return { preview: null, media: null, imageFile: null };

  // Normal uploaded File
  if (fileOrUrl instanceof File) {
    const preview = URL.createObjectURL(fileOrUrl);
    return { preview, media: preview, imageFile: fileOrUrl }; 
  }

  // String URL (Unsplash or direct URL)
  if (typeof fileOrUrl === "string" && fileOrUrl.startsWith("http")) {
    return { preview: fileOrUrl, media: fileOrUrl, imageFile: null }; 
  }

  // fallback: existingMedia
  if (existingMedia) {
    return { preview: existingMedia, media: existingMedia, imageFile: null };
  }

  return { preview: null, media: null, imageFile: null };
};
