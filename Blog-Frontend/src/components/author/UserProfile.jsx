import { useState, useEffect } from "react";
import { getProfileImage } from "../../utilis/utilis";

export const UserProfile = ({
  user,
  size = "w-10 h-10",
  fontSize = "text-sm",
  onClick,
  src,
  bgColor = "bg-gray-600",
}) => {
  const [imgError, setImgError] = useState(false);

  const profileImage = src || getProfileImage(user?.profileImage);

  useEffect(() => {
    setImgError(false);
  }, [profileImage]);

  const clickable = onClick ? "cursor-pointer" : "";

  const getFirstLetter = (name = "") => {
    if (!name) return "U";
    return name.trim()[0].toUpperCase();
  };

  const firstLetter = getFirstLetter(user?.name);

  if (!imgError && profileImage) {
    return (
      <img
        key={profileImage}
        src={profileImage}
        alt={user?.name || "User Avatar"}
        className={`${size} rounded-full object-cover ${clickable}`}
        onClick={onClick}
        onError={() => {
          console.warn("Profile image failed:", profileImage);
          setImgError(true);
        }}
        loading="lazy"
        referrerPolicy="no-referrer" 
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
      {firstLetter}
    </div>
  );
};
