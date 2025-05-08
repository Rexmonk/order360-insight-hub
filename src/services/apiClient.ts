
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { acquireTokenSilent } from './authService';

// Base API URL - should be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Session ID that persists for the duration of the browser session
const sessionId = uuidv4();

// Request interceptor for adding auth token and tracking headers
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    try {
      // Add authorization header with MSAL token
      const token = await acquireTokenSilent();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      // Add tracking headers
      config.headers = {
        ...config.headers,
        'X-Request-Id': uuidv4(),
        'X-Request-Session-Id': sessionId,
        'X-Request-Tracking-Id': uuidv4(),
      };

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        console.error('Authentication error: Please login again');
        // Optionally trigger a logout or token refresh
      } else if (status === 403) {
        console.error('Authorization error: You do not have permission to perform this action');
      } else if (status === 500) {
        console.error('Server error: Please try again later');
      }
    } else if (error.request) {
      console.error('Network error: No response received from server');
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
