// src/services/profileService.js
import httpRequest from "../../utils/httpRequest";

// ✅ Hàm lấy profile theo username
export const getProfileByUserName = async (username) => {
  try {
    // Gọi API
    const response = await httpRequest.get(`/profile/${username}`);
    return response;
  } catch (error) {
    return { success: false, data: null };
  }
};

export const editProfile = async (formData, username) => {
  console.log("FormData:", formData);
  console.log("Username:", username);

  if (!username) {
    throw new Error("Username is required");
  }

  const res = await httpRequest.put(`/profile/${username}/edit`, formData);
  return res;
};

export default {
  getProfileByUserName,
  editProfile,
};
