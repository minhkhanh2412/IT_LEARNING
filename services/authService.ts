import axiosInstance from './axiosConfig';
import { LoginRequest, LoginResponse } from '@/types/user';
import { API_ENDPOINTS } from '@/constants/config';

interface RegisterData {
  [key: string]: unknown;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },
};
