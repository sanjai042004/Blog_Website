import { useParams, useNavigate } from "react-router-dom";
import { AuthorProfile } from "../components/author/AuthorProfile";
import { Loading, ErrorMessage } from "../components/author/LoadingError";
import { AuthorPosts } from "../components/author/AuthorPost";
import { useAuth } from "../hooks/useAuth";
import { useAuthor } from "../hooks/useAuthor";

export const AuthorPage = () => {
  const { authorId } = useParams(); 
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const {
    author,
    posts,
    loading,
    error,
    isFollowing,
    toggleFollow,
  } = useAuthor(authorId, authUser);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      
      <div className="md:row-span-1 order-1 md:order-2">
        <AuthorProfile
          author={author}
          authUser={authUser}
          isFollowing={isFollowing}
          toggleFollow={toggleFollow}
          navigate={navigate}
        />
      </div>
      <AuthorPosts author={author} posts={posts} />
    </div>
  );
};
