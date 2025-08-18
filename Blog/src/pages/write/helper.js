export const newBlock = () => ({
  content: "",
  image: null,
  preview: null,
  showImageOptions: false,
  youtubeEmbed: null,
  showVideoInput: false,
  showUnsplashInput: false,
  unsplashQuery: "",
  unsplashResults: [],
});

export const parseYouTubeLink = (link) => {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = link.match(youtubeRegex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
};

export const prepareImage = (fileOrUrl, oldPreview) => {

  if (oldPreview && oldPreview.startsWith("blob:")) {
    URL.revokeObjectURL(oldPreview);
  }

  if (fileOrUrl instanceof File) {
    return {
      image: fileOrUrl,
      preview: URL.createObjectURL(fileOrUrl),
      showImageOptions: false,
    };
  }

  if (typeof fileOrUrl === "string") {
    return {
      image: fileOrUrl,
      preview: fileOrUrl,
      showImageOptions: false,
    };
  }

  return {
    image: null,
    preview: null,
    showImageOptions: true,
  };
};
