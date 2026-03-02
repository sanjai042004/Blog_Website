import { useParams, useNavigate } from "react-router-dom";
import { AuthorProfile } from "../components/author/AuthorProfile";
import { Loading, ErrorMessage } from "../components/author/LoadingError";
import { AuthorPosts } from "../components/author/AuthorPost";
import { useAuthor } from "../hooks/useAuthor";
import { useFollow } from "../hooks/useFollow";
import { useAuth } from "../context/AuthContext";

export const AuthorPage = () => {
  const { authorId } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const { author, posts, loading, error } = useAuthor(authorId);

  const {
    isFollowing,
    followersCount,
    toggleFollow,
    loading: followLoading,
  } = useFollow(authorId, authUser);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const canFollow = authUser && author && authUser._id !== author._id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      
      <div className="md:order-2">
        <AuthorProfile
          author={author}
          isFollowing={isFollowing}
          followersCount={followersCount}
          toggleFollow={canFollow ? toggleFollow : null}
          currentUser={authUser}
          navigate={navigate}
          followLoading={followLoading}
        />
      </div>

      <AuthorPosts author={author} posts={posts} />
    </div>
  );
};