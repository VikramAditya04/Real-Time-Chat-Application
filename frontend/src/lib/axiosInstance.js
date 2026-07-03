import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
export const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("chatzy_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

export default axiosInstance;
