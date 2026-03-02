import { useState, useEffect } from "react";
import { api } from "../service/api";

export const useAuthor = (authorId) => {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authorId) return;

    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/users/author/${authorId}`);

        if (!data.success) throw new Error("Author not found");

        setAuthor(data.user);
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [authorId]);

  return { author, posts, loading, error };
};