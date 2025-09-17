import { IoIosContact } from "react-icons/io";

export const Avatar = ({ user, size = "w-10 h-10" }) => {
  if (!user) {
    return (
      <div className={`${size} flex items-center justify-center rounded-full bg-gray-200 text-gray-600`}>
        <IoIosContact size={20} />
      </div>
    );
  }

  if (user.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.name}
        className={`${size} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${size} flex items-center justify-center rounded-full bg-green-500 text-white font-bold`}>
      {user.name?.[0]?.toUpperCase()}
    </div>
  );
};