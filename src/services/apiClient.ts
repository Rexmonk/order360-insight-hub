import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { v4 as uuidv4 } from "uuid";
import { acquireTokenSilent } from "./authService";

// Base API URL - should be configured based on environment
console.log("test env", import.meta.env.VITE_BASEPATH);
const API_BASE_URL = import.meta.env.VITE_BASEPATH || "https://api.example.com";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for adding auth token and tracking headers
apiClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    // Add authorization header with MSAL token
    const token = localStorage.getItem("token") || (await acquireTokenSilent());
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tracking headers
    config.headers["X-Request-Id"] = uuidv4();
    config.headers["X-Request-Session-Id"] = uuidv4();
    config.headers["X-Request-Tracking-Id"] = uuidv4();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error responses
    const errorResponse = {
      message: error.message || "An unexpected error occurred",
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };

    // Log errors to console
    console.error("API Error:", errorResponse);

    return Promise.reject(errorResponse);
  }
);

export default apiClient;
