import { useState, useEffect } from "react";
import { getProfileImage } from "../../utilis/utilis";

export const Avatar = ({
  user,
  size = "w-10 h-10",
  fontSize = "text-sm",
  onClick,
  fallback = null,
    src,
}) => {
  const [imgError, setImgError] = useState(false);

  const profileImage = src || getProfileImage(user?.profileImage);

  useEffect(() => {
    setImgError(false);
  }, [profileImage]);

  // Get initials from user name
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (!parts[0]) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0]).toUpperCase();
  };

  const initials = getInitials(user?.name);

  const colors = [
    "bg-red-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-orange-400",
    "bg-gray-600",
  ];
  const charCode = user?.name?.charCodeAt(0) || 0;
  const bgColor = colors[charCode % colors.length];

  const clickable = onClick ? "cursor-pointer" : "";
  if (profileImage && !imgError) {
    return (
      <img
        key={profileImage}
        src={profileImage}
        alt={user?.name || "User Avatar"}
        className={`${size} rounded-full object-cover ${clickable}`}
        onClick={onClick}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }

  if (fallback) {
    return (
      <img
        src={fallback}
        alt={user?.name || "User Avatar"}
        className={`${size} rounded-full object-cover ${clickable}`}
        onClick={onClick}
        loading="lazy"
      />
    );
  }


  return (
    <div
      role="img"
      aria-label={user?.name || "Unknown User"}
      className={`${size} ${fontSize} ${bgColor} text-white font-semibold flex items-center justify-center rounded-full ${clickable}`}
      onClick={onClick}
      title={user?.name || "Unknown User"}
    >
      {initials}
    </div>
  );
};
