import { FaRegCommentDots } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import { BsBookmark, BsShare, BsThreeDots } from "react-icons/bs";
import { api } from "../../../service/api";

export const PostActions = ({postId,clapCount,userClapped,setClapCount,setUserClapped,currentUser,navigate,}) => {
  const handleClap = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await api.post(`/posts/${postId}/clap`);
      setClapCount(res.data.totalClaps);
      setUserClapped(res.data.action === "added");
    } catch (err) {
      console.error("Clap error:", err);
      alert(err.response?.data?.message || "Failed to clap");
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-12">
    
      <div className="flex items-center gap-8 text-gray-600">
        {/* Clap */}
        <button
          onClick={handleClap}
          className="flex items-center gap-2 hover:text-orange-500 transition-colors"
        >
          <FaHandsClapping
            className={`size-5 ${userClapped ? "text-orange-500" : ""}`}
          />
          <span className="text-sm font-medium">{clapCount}</span>
        </button>

        {/* Comment */}
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
          <FaRegCommentDots className="size-5" />
          <span className="text-sm font-medium">Comment</span>
        </button>
      </div>

      
      <div className="flex items-center gap-6 text-gray-600">
        <button className="hover:text-black transition-colors">
          <BsBookmark className="size-5" />
        </button>
        <button className="hover:text-black transition-colors">
          <BsShare className="size-5" />
        </button>
        <button className="hover:text-black transition-colors">
          <BsThreeDots className="size-5" />
        </button>
      </div>
    </div>
  );
};
