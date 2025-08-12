import { data } from "react-router-dom";
import httpRequest from "../../utils/httpRequest";

export const register = async (data) => {
  const res = await httpRequest.post("/auth/register", data);
  return res;
};

export const login = async (data) => {
  try {
    const res = await httpRequest.post("/auth/login", data);
    const { access_token, refresh_token } = res.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    return res;
  } catch (error) {
    console.log(error);
    throw new Error("Thông tin đăng nhập không hợp lệ.");
  }
};

export const getUser = async () => {
  const res = await httpRequest.get("/auth/me");
  return res.data;
};

export const forgotPassword = async (data) => {
  try {
    const res = await httpRequest.post("/auth/forgot", data);
    return res;
  } catch (error) {
    throw new Error(error.message || "Lỗi reset password");
  }
};

export const verifyEmail = async (token) => {
  try {
    const res = await httpRequest.post(`/auth/verify-email?token=${token}`);
    return res;
  } catch (error) {
    throw new Error(error.message || "Lỗi verify email");
  }
};

export const verifyToken = async (token) => {
  try {
    const res = await httpRequest.get(`/auth/verify-token?token=${token}`);
    return res;
  } catch (error) {
    throw new Error(error.message || "Token không hợp lệ");
  }
};

export const resetPassword = async (data) => {
  const res = await httpRequest.post("/auth/reset", data);
  return res;
};

export default {
  register,
  login,
  getUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyToken,
};
