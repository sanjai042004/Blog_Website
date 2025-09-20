export const getProfileImage = (img) => {
  if (!img) return null;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("//")) return `https:${img}`;
  return `${import.meta.env.VITE_API_URL}/${img.replace(/^\//, "")}`;
};

// Format date for posts
export const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "";
  }
};
