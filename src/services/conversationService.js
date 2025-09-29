// src/services/profileService.js
import httpRequest from "../../utils/httpRequest";

export const getCoversation = async () => {
  try {
    const response = await httpRequest.get("/conversations");
    console.log(response.data);

    return response;
  } catch (error) {
    return { success: false, data: null };
  }
};

export default {
  getCoversation,
};
