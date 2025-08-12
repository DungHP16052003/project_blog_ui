import axios from "axios";

const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

let isRefreshing = false;
let tokenListeners = [];

httpRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = localStorage.getItem("refresh_token");
    const originalRequest = error.config;

    const shouldRenewToken = error.response?.status === 401 && refreshToken;

    if (shouldRenewToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
            {
              refresh_token: refreshToken,
            }
          );

          const data = res.data.data;

          // Lưu lại token mới
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);

          // Gọi lại các request bị chờ
          tokenListeners.forEach((listener) => listener());
          tokenListeners = [];

          isRefreshing = false;

          // 👉 Gắn token mới vào request gốc
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

          return httpRequest(originalRequest);
        } catch (err) {
          isRefreshing = false;
          tokenListeners = [];

          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");

          // 👉 Redirect nếu refresh thất bại
          window.location.href = "/login";
        }
      } else {
        return new Promise((resolve) => {
          tokenListeners.push(() => {
            const newToken = localStorage.getItem("token");
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(httpRequest(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

// Hàm chung gửi request
const send = async (method, url, data, config) => {
  try {
    const res = await httpRequest.request({
      method: method,
      url: url,
      ...(method.toLowerCase() === "get" ? { params: data } : { data }),
      ...config,
    });

    return res.data;
  } catch (error) {
    throw error?.response?.data?.message || "An error occurred";
  }
};

// Exports
export const get = async (url, data, config) => send("get", url, data, config);
export const post = async (url, data, config) =>
  send("post", url, data, config);
export const put = async (url, data, config) => send("put", url, data, config);
export const patch = async (url, data, config) =>
  send("patch", url, data, config);
export const del = async (url, config) => send("delete", url, null, config);

export default { get, post, put, patch, del };
