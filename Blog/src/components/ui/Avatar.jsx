import { useState, useEffect } from "react";
import { getProfileImage } from "../../utilis/utilis";

export const Avatar = ({
  user,
  size = "w-10 h-10",
  fontSize = "text-sm",
  onClick,
  fallback = null,
}) => {
  const [imgError, setImgError] = useState(false);

  // Always use the final profileImage from AuthContext
  const profileImage = getProfileImage(user?.profileImage);

  useEffect(() => {
    setImgError(false);
  }, [profileImage]);

  // Get initials from user name
  const getInitial = (name) => {
  if (!name) return "U";
  return name.trim()[0].toUpperCase();
};

const initials = getInitial(user?.name);

const colors = ["bg-red-400","bg-green-400","bg-blue-400","bg-yellow-400","bg-purple-400"];
const bgColor = colors[user?.name?.charCodeAt(0) % colors.length] || "bg-gray-300";



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

  // 2️⃣ Fallback image
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

  // 3️⃣ Show initials if no image
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
