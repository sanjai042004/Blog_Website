export const AuthorInfo = ({ author, onClick, showDate = false, date }) => {
  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  if (!author) return null;

  const avatar = author.profileImage
    ? author.profileImage.startsWith("http")
      ? author.profileImage
      : `${BACKEND_URL}/${author.profileImage.replace(/^\//, "")}`
    : "/placeholder.png"; 

  return (
    <div className="flex items-center gap-2 mb-2 text-sm">
      {/* Avatar */}
      <img
        src={avatar}
        alt={author.name || "Author"}
        className="w-7 h-7 rounded-full cursor-pointer object-cover"
        onClick={onClick}
      />

  
      <div className="flex flex-col">
        <span
          className="font-medium text-gray-700 hover:underline cursor-pointer"
          onClick={onClick}
        >
          {author.name || "Unknown"}
        </span>
        {showDate && <span className="text-xs text-gray-500">{date}</span>}
      </div>
    </div>
  );
};
