import { formatDate } from "../../../utilis/utilis";
import { Avatar } from "../Avatar";


export const AuthorInfo = ({ author, onClick, showDate = false, date }) => {
  if (!author) return null;

  return (
    <div className="flex items-center gap-2 mb-2 text-sm">
    
      <Avatar
        user={author}
        size="w-7 h-7 text-xs"
        onClick={onClick}
      />

      {/* Author Info */}
      <div className="flex flex-col">
        <span
          className="font-medium text-gray-700 hover:underline cursor-pointer"
          onClick={onClick}
          title={author.name || "Unknown"}
        >
          {author.name || "Unknown"}
        </span>

        {showDate && date && (
          <span className="text-xs text-gray-500">
            {formatDate(date)}
          </span>
        )}
      </div>
    </div>
  );
};
