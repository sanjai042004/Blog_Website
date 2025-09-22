export const getProfileImage = (img, bustCache = false) => {
  if (!img) return null;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("//")) return `https:${img}`;
  
  const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
  return `${baseURL}/${img.replace(/^\//, "")}${bustCache ? `?t=${Date.now()}` : ""}`;
};

export const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "";
  }
};
