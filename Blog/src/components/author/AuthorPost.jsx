import { PostCard } from "../post/PostCard";
import { formatDate } from "../../utilis/utilis";

export const AuthorPosts = ({ author, posts }) => {
  return (
    <div className="flex md:col-span-2 order-2 md:order-1 flex-col space-y-8">
      <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
        Posts by {author?.name || "Author"}
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} formatDate={formatDate} hideAuthor />
        ))
      )}
    </div>
  );
};
