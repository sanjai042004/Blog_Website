// hooks/useAuthor.js
import { useState, useCallback, useEffect } from "react";
import { api } from "../../service/api";


export const useAuthor = (authorId, authUser) => {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchAuthor = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/author/${authorId}`);
      if (!res.data.success) throw new Error("Author not found");

      const fetchedAuthor = res.data.user;
      setAuthor(fetchedAuthor);
      setPosts(res.data.posts || []);

      const authUserId = String(authUser?._id || authUser?.id || "");
      setIsFollowing(
        authUser
          ? fetchedAuthor.followers?.some((f) => String(f._id) === authUserId)
          : false
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [authorId, authUser]);

  useEffect(() => {
    fetchAuthor();
  }, [fetchAuthor]);

  const toggleFollow = async () => {
    if (!authUser) return alert("Please log in to follow users.");
    if (!author) return;

    const action = isFollowing ? "unfollow" : "follow";

    try {
      const res = await api.post(`/follow/${action}/${authorId}`);
      if (!res.data.success) throw new Error(res.data.message);

      setIsFollowing(res.data.isFollowed);
      setAuthor((prev) => {
        if (!prev) return prev;
        const followers = prev.followers ? [...prev.followers] : [];
        const authUserId = String(authUser._id || authUser.id);

        if (res.data.isFollowed) {
          if (!followers.some((f) => String(f._id) === authUserId)) {
            followers.push({
              _id: authUserId,
              name: authUser.name,
              profileImage: authUser.profileImage || "",
            });
          }
        } else {
          const index = followers.findIndex((f) => String(f._id) === authUserId);
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
