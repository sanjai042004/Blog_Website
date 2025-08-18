import { Link } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { ProfileDropdown } from "../ui";

export const WriteNavbar = ({ onPost, isPublishing = false }) => {
  return (
    <nav className="flex items-center justify-around px-6 py-3 mt-2">
      
      <div className="flex items-center gap-6">
        <Link
          to="/home"
          className="text-3xl font-extrabold text-black hover:text-blue-900"
        >
          CodeVerse
        </Link>
        <h3 className="text-gray-600">Draft in user</h3>
      </div>



      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onPost}
          disabled={isPublishing}
          className={`px-4 py-1 rounded-2xl text-white cursor-pointer transition ${
            isPublishing
              ? "bg-green-200 "
              : "bg-green-500 hover:bg-green-800"
          }`}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>

        <Link to="/notify">
          <IoNotificationsOutline className="size-6" />
        </Link>
        <ProfileDropdown />
      </div>
    </nav>
  );
};

