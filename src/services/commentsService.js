import httpRequest from "../../utils/httpRequest";
import { getBySlug } from "./topicsService";

export const getAll = async () => {
  const res = await httpRequest.get("/comments");
  console.log(res);

  return res;
};

export const getById = async (id) => {
  const res = await httpRequest.get(`/comments/${id}`);
  return res;
};

export const getPostComment = async (id) => {
  const result = await httpRequest.get(`/comments/post/${id}`);
  console.log(result.data);

  return result;
};

export const toggleLikeComment = async (id) => {
  const result = await httpRequest.post(`/comments/${id}/like`);
  return result;
};

export const create = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const res = await httpRequest.post("/comments", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    console.error("Error in comments service create:", error);
    throw error;
  }
};

export const update = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await httpRequest.put(`/comments/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error in posts service create:", error);
    throw error;
  }
};

export const destroy = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await httpRequest.del(`/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Error in posts service create:", error);
    throw error;
  }
};

export default {
  getAll,
  getById,
  getPostComment,
  toggleLikeComment,
  create,
  update,
  destroy,
};
