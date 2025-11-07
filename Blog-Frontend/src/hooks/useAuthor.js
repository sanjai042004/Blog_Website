import { useState, useEffect, useCallback } from "react";
import { api } from "../service/api";

export const useAuthor = (authorId, authUser, initialAuthor = null) => {
  const [author, setAuthor] = useState(initialAuthor); 
  const [posts, setPosts] = useState([]);              
  const [loading, setLoading] = useState(!initialAuthor);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchAuthor = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (initialAuthor) {
        setAuthor(initialAuthor);
        const userId = String(authUser?._id || authUser?.id || "");
        const followed = initialAuthor.followers?.some(f => String(f._id) === userId);
        setIsFollowing(followed || false);
        return;
      }
      const res = await api.get(`/users/author/${authorId}`);
      if (!res.data.success) throw new Error("Author not found");

      const fetchedAuthor = res.data.user;
      const userId = String(authUser?._id || authUser?.id || "");

      setAuthor(fetchedAuthor);
      setPosts(res.data.posts || []);
      setIsFollowing(
        fetchedAuthor.followers?.some(f => String(f._id) === userId) || false
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [authorId, authUser, initialAuthor]);

  useEffect(() => {
    fetchAuthor();
  }, [fetchAuthor]);

  const toggleFollow = async () => {
    if (!authUser) return alert("Please log in to follow authors.");
    if (!author) return;

    const action = isFollowing ? "unfollow" : "follow";

    try {
      const res = await api.post(`/follow/${action}/${authorId}`);
      if (!res.data.success) throw new Error(res.data.message);

      setIsFollowing(res.data.isFollowed);

      setAuthor(prev => {
        if (!prev) return prev;

        const userId = String(authUser._id || authUser.id);
        const followers = prev.followers ? [...prev.followers] : [];

        if (res.data.isFollowed) {
          if (!followers.some(f => String(f._id) === userId)) {
            followers.push({
              _id: userId,
              name: authUser.name,
              profileImage: authUser.profileImage || "",
            });
          }
        } else {
          const index = followers.findIndex(f => String(f._id) === userId);
          if (index > -1) followers.splice(index, 1);
        }

        return { ...prev, followers };
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return { author, posts, loading, error, isFollowing, toggleFollow };
};
