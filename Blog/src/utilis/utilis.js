export const getProfileImage = (img, bustCache = false) => {
  if (!img) return null;

  if (img.startsWith("http://") || img.startsWith("https://")) return img;

  if (img.startsWith("//")) return `https:${img}`;

  const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

  const cleanPath = img.replace(/^\//, "");
  const cacheBuster = bustCache ? `?t=${Date.now()}` : "";

  return `${baseURL}/${cleanPath}${cacheBuster}`;
};

export const formatDate = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};
