import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { baseUrl } from "./constants";

// Create the Axios instance
const api = axios.create({
  baseURL: baseUrl, // Replace with your actual backend URL
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Only show toast for non-GET requests
    if (response?.data?.message && response.config.method !== "get") {
      toast.success(response.data.message);
    }
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    const message =
      (error.response?.data as { message?: string })?.message ||
      "Something went wrong";
    // toast.error(message);
    return Promise.reject(error);
  }
);

// bulkUpdateEmails function हटा दिया गया है


export default api;
