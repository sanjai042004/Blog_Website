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

//Parse YouTube link → return embed URL
export const parseYouTubeLink = (link) => {
  if (!link) return null;
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = link.match(regex);
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
};

export const prepareImage = (fileOrUrl, existingMedia = null) => {
  let preview = "";
  let media = "";
  let imageFile = null;

  // If File (local upload)
  if (fileOrUrl instanceof File) {
    preview = URL.createObjectURL(fileOrUrl);
    media = fileOrUrl;
    imageFile = fileOrUrl;
  }
  // If string (Unsplash URL)
  else if (typeof fileOrUrl === "string") {
    preview = fileOrUrl;
    media = fileOrUrl;
    imageFile = null;
  }
  // fallback: use existing media
  else if (existingMedia) {
    preview = existingMedia;
    media = existingMedia;
    imageFile = null;
  }

  return { preview, media, imageFile };
};
