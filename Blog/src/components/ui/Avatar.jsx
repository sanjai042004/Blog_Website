import { useState, useEffect } from "react";
import { getProfileImage } from "../../utilis/utilis";

export const Avatar = ({user,size = "w-10 h-10 text-sm",onClick,fallback = null,}) => {
  const [imgError, setImgError] = useState(false);

  const profileImage = getProfileImage(user?.profileImage);

  useEffect(() => {
    setImgError(false);
  }, [profileImage]);


  const getInitials = (name) => {
    if (!name) return "U"; 
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user?.name);


  if (profileImage && !imgError) {
    return (
      <img
        src={profileImage}
        alt={user?.name || "User Avatar"}
        className={`${size} rounded-full cursor-pointer object-cover`}
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
        className={`${size} rounded-full cursor-pointer object-cover`}
        onClick={onClick}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full flex items-center justify-center bg-gray-300 text-gray-700 font-semibold cursor-pointer`}
      onClick={onClick}
      title={user?.name || "Unknown User"}>
      {initials}
    </div>
  );
};
