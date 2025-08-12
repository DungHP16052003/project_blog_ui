import httpRequest from "../../utils/httpRequest";
import { getBySlug } from "./topicsService";

export const getAll = async () => {
  const res = await httpRequest.get("/posts");

  return res;
};

export const getListByTopicId = async (topic_id) => {
  const res = await httpRequest.get(`/posts/topic/${topic_id}`);
  return res;
};

export const getPostBySlug = async (slug) => {
  const result = await httpRequest.get(`/posts/slug/${slug}`);

  return result;
};

export const getByUserId = async (userId) => {
  try {
    const res = await httpRequest.get(`/posts/user/${userId}`);
    console.log(res);

    return res;
  } catch (error) {
    throw error;
  }
};

export const getBookMarkPost = async () => {
  const res = await httpRequest.get(`/posts/user/bookmarks`);
  console.log(res);

  return res;
};

export const getListMyPost = async () => {
  const res = await httpRequest.get("/posts/me");
  console.log(res);

  return res;
};

export const getRelatedPosts = async (currentPostId) => {
  const result = await httpRequest.get(`/posts/${currentPostId}/related`);
  console.log(currentPostId);

  return result;
};

export const toggleBookmarkPost = async (id) => {
  try {
    console.log("🚀 Starting bookmark request for ID:", id);

    const res = await httpRequest.post(`/posts/${id}/bookmark`);
    return res;
  } catch (error) {
    if (error.response) {
      console.error("Full error response:", error.response);
    }

    throw error;
  }
};

export const toggleLikePost = async (id) => {
  const result = await httpRequest.post(`/posts/${id}/like`);
  return result;
};

export const create = async (formData) => {
  try {
    const res = await httpRequest.post("/posts", formData);
    console.log(res);
  } catch (error) {
    console.error("Error in posts service create:", error);
    throw error;
  }
};

export const update = async (id, formData) => {
  try {
    const res = await httpRequest.put(`/posts/${id}`, formData);
  } catch (error) {
    console.error("Error in posts service create:", error);
    throw error;
  }
};

export const destroy = async (id) => {
  try {
    const res = await httpRequest.del(`/posts/${id}`);
  } catch (error) {
    console.error("Error in posts service create:", error);
    throw error;
  }
};

export default {
  getAll,
  getListByTopicId,
  getBySlug,
  getByUserId,
  getBookMarkPost,
  getPostBySlug,
  getRelatedPosts,
  getListMyPost,
  toggleBookmarkPost,
  toggleLikePost,
  create,
  update,
  destroy,
};
