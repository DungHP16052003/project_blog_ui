import httpRequest from "../../utils/httpRequest";

export const follow = async (followedId) => {
  try {
    const res = await httpRequest.post("/follows/follow", { followedId });
    console.log("Follow response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Follow error:", error);
    throw error;
  }
};

export const unfollow = async (followedId) => {
  try {
    // ✅ FIXED: Bỏ dấu "/" thừa ở cuối
    const res = await httpRequest.post("/follows/unfollow", { followedId });
    console.log("Unfollow response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Unfollow error:", error);
    throw error;
  }
};

// ✅ FIXED: Đổi tên function và route cho đúng với backend
export const checkFollow = async (followedId) => {
  try {
    // Sử dụng route đã sửa trong backend: /check/:followedId
    const result = await httpRequest.get(`/follows/check/${followedId}`);
    return result.data;
  } catch (error) {
    console.error("Check follow error:", error);
    throw error;
  }
};

// ✅ THÊM: Get followers list
export const getFollowers = async (userId) => {
  try {
    const result = await httpRequest.get(`/follows/followers/${userId}`);
    return result.data;
  } catch (error) {
    console.error("Get followers error:", error);
    throw error;
  }
};

// ✅ THÊM: Get following list
export const getFollowing = async (userId) => {
  try {
    const result = await httpRequest.get(`/follows/following/${userId}`);
    return result.data;
  } catch (error) {
    console.error("Get following error:", error);
    throw error;
  }
};

// ✅ THÊM: Get follow stats
export const getFollowStats = async (userId) => {
  try {
    const result = await httpRequest.get(`/follows/stats/${userId}`);
    return result.data;
  } catch (error) {
    console.error("Get follow stats error:", error);
    throw error;
  }
};

export default {
  follow,
  unfollow,
  checkFollow,
  getFollowers,
  getFollowing,
  getFollowStats,
};
