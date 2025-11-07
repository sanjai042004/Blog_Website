export const newBlock = () => ({
  type: "text",
  content: "",
  media: null,
  preview: null,
  youtubeEmbed: null,
  unsplashQuery: "",
  unsplashResults: [],
  ui: {
    showOptions: false,
    showVideoInput: false,
    showUnsplashInput: false,
  },
  imageFile: null,
});

export const parseYouTubeLink = (link) => {
  if (!link) return null;

  const match = link.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

export const prepareImage = (input, existingMedia = null) => {
  if (!input && !existingMedia)
    return { preview: null, media: null, imageFile: null };

  if (input instanceof File) {
    const preview = URL.createObjectURL(input);
    return { preview, media: preview, imageFile: input };
  }

  if (typeof input === "string" && input.startsWith("http")) {
    return { preview: input, media: input, imageFile: null };
  }

  if (existingMedia) {
    return { preview: existingMedia, media: existingMedia, imageFile: null };
  }

  return { preview: null, media: null, imageFile: null };
};
