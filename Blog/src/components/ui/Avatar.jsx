import { useState } from "react";
import { IoIosContact } from "react-icons/io";
import { Link } from "react-router-dom";

export const Avatar = ({ user, size = "w-10 h-10 text-sm", onClick, to }) => {
  const [imgError, setImgError] = useState(false);

  const profileImage = user?.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `${import.meta.env.VITE_API_URL}/${user.profileImage}`
    : user?.photoURL || null;

  const fallback = user?.name
    ? user.name.charAt(0).toUpperCase()
    : <IoIosContact size={20} aria-hidden="true" />;

  const getColor = (name = "") => {
    const colors = ["bg-blue-600", "bg-green-600", "bg-purple-600", "bg-pink-600", "bg-orange-600"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const Wrapper = to ? Link : "div";

  return (
    <Wrapper
      to={to}
      onClick={onClick}
      className={`rounded-full overflow-hidden flex items-center justify-center border text-white ${getColor(user?.name)} ${size}`}
      aria-label={user?.name || "User avatar"}
    >
      {profileImage && !imgError ? (
        <img
          src={profileImage}
          alt={`${user?.name || "User"}'s avatar`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </Wrapper>
  );
};
