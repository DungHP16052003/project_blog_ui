import httpRequest from "../../utils/httpRequest";

export const getAll = async () => {
  const res = await httpRequest.get("/topics");
  return res;
};

export const getBySlug = async (slug) => {
  const res = await httpRequest.get(`/topics/${slug}`);
  return res;
};

const getPostsBySlug = async (slug, page = 1, limit = 10) => {
  const res = await httpRequest.get(`/topics/${slug}/posts`, {
    params: { page, limit },
  });
  return res.data;
};

export const getById = async (id) => {
  const res = await httpRequest.get(`/topics/id/${id}`);
  return res;
};

export const create = async (formData) => {
  try {
    const res = await httpRequest.post("/topics", formData);
  } catch (error) {
    console.error("Error in posts service create:", error);
    throw error;
  }
};

export const update = async (id, formData) => {
  try {
    const res = await httpRequest.put(`/topics/${id}`, formData);
  } catch (error) {
    console.error("Error in posts service create:", error);
    throw error;
  }
};

export const destroy = async (id) => {
  try {
    const res = await httpRequest.del(`/topics/${id}`);
  } catch (error) {
    console.error("Error in posts service create:", error);
    throw error;
  }
};

export default {
  getAll,
  getBySlug,
  getById,
  getPostsBySlug,
  create,
  update,
  destroy,
};
