import axios from 'axios';
import { API_CONFIG } from '@/constants/config';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
});

// Interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm TokenCybersoft vào header
    config.headers['TokenCybersoft'] = API_CONFIG.TOKEN_CYBERSOFT;
    
    // Thêm token user nếu có
    const userToken = localStorage.getItem('ACCESS_TOKEN');
    if (userToken) {
      config.headers['Authorization'] = `Bearer ${userToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Chỉ redirect về login nếu không phải là request xóa khóa học
      const isDeleteCourse = error.config?.url?.includes('XoaKhoaHoc');
      
      if (!isDeleteCourse) {
        // Xử lý unauthorized
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
