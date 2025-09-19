import { useState } from "react";
import { IoIosContact } from "react-icons/io";

export const Avatar = ({ user, size = "w-10 h-10 text-sm" }) => {
  const [imgError, setImgError] = useState(false);
  const profileImage = user?.profileImage || user?.photoURL || null;

  const fallback = user?.name?.charAt(0)?.toUpperCase() || <IoIosContact size={20} />;

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center border bg-indigo-600  text-white ${size}`}
    >
      {profileImage && !imgError ? (
        <img
          src={profileImage}
          alt={user?.name || "User"}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
};
