import { useEffect, useState } from "react";
import { followService } from "../service/followService";

export const useFollow = (authorId, authUser) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch follow status
  useEffect(() => {
    if (!authUser || !authorId) return;

    const fetchStatus = async () => {
      try {
        const data = await followService.getFollowStatus(authorId);

        if (data.success) {
          setIsFollowing(data.isFollowed);
          setFollowersCount(data.followersCount);
        }
      } catch (err) {
        console.error("Follow status error:", err.message);
      }
    };

    fetchStatus();
  }, [authorId, authUser]);

  const toggleFollow = async () => {
    if (!authUser) return;

    try {
      setLoading(true);

      const data = isFollowing
        ? await followService.unfollow(authorId)
        : await followService.follow(authorId);

      if (!data.success) throw new Error(data.message);

      setIsFollowing(data.isFollowed);
      setFollowersCount(data.followersCount);
    } catch (err) {
      console.error("Toggle follow error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    isFollowing,
    followersCount,
    toggleFollow,
    loading,
  };
};