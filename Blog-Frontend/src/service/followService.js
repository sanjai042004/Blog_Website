import { api } from "./api";

export const followService = {
  follow: async (userId) => {
    const { data } = await api.post(`/follow/${userId}`);
    return {
      success: data.success,
      isFollowed: data.isFollowed,
      followersCount: data.followersCount,
      message: data.message,
    };
  },

  unfollow: async (userId) => {
    const { data } = await api.delete(`/follow/${userId}`);
    return {
      success: data.success,
      isFollowed: data.isFollowed,
      followersCount: data.followersCount,
      message: data.message,
    };
  },

  getFollowers: async (userId, page = 1, limit = 10) => {
    const { data } = await api.get(
      `/follow/${userId}/followers?page=${page}&limit=${limit}`
    );
    return data;
  },

  getFollowing: async (userId) => {
    const { data } = await api.get(`/follow/${userId}/following`);
    return data;
  },

  getFollowStatus: async (userId) => {
    const { data } = await api.get(`/follow/${userId}/follow-status`);
    return {
      success: data.success,
      isFollowed: data.isFollowed,
      followersCount: data.followersCount,
    };
  },
};