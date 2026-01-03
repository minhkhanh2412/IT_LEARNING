import axiosInstance from './axiosConfig';
import { LoginRequest, LoginResponse, User } from '@/types/user';
import { API_CONFIG, API_ENDPOINTS } from '@/constants/config';

interface RegisterData {
  [key: string]: unknown;
}

interface UserData {
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

export const userService = {
  // Lấy danh sách người dùng
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.GET_ALL_USERS);
    return response.data;
  },

  // Lấy danh sách người dùng phân trang
  getUsersPagination: async (page: number = 1, pageSize: number = 10, maNhom: string = API_CONFIG.MA_NHOM) => {
    const response = await axiosInstance.get('/api/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang', {
      params: { page, pageSize, MaNhom: maNhom }
    });
    return response.data;
  },

  // Tìm kiếm người dùng
  searchUsers: async (keyword: string, maNhom: string = API_CONFIG.MA_NHOM): Promise<User[]> => {
    const response = await axiosInstance.get('/api/QuanLyNguoiDung/TimKiemNguoiDung', {
      params: { tuKhoa: keyword, MaNhom: maNhom }
    });
    return response.data;
  },

  // Thêm người dùng
  addUser: async (data: UserData): Promise<User> => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.ADD_USER, data);
    return response.data;
  },

  // Cập nhật người dùng
  updateUser: async (data: UserData): Promise<User> => {
    const response = await axiosInstance.put(API_ENDPOINTS.AUTH.UPDATE_USER, data);
    return response.data;
  },

  // Xóa người dùng
  deleteUser: async (taiKhoan: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.AUTH.DELETE_USER, {
      params: { TaiKhoan: taiKhoan }
    });
    return response.data;
  },

  // Lấy thông tin người dùng
  getUserInfo: async (): Promise<User> => {
    const response = await axiosInstance.post('/api/QuanLyNguoiDung/ThongTinNguoiDung');
    return response.data;
  },

  // Lấy danh sách khóa học mà người dùng đã đăng ký
  getUserCourses: async (taiKhoan: string): Promise<Array<{ maKhoaHoc: string; tenKhoaHoc: string; hinhAnh: string }>> => {
    try {
      // Thử nhiều endpoint để tìm đúng
      console.log('=== Trying ThongTinTaiKhoan endpoint...');
      const response1 = await axiosInstance.post('/api/QuanLyNguoiDung/ThongTinTaiKhoan');
      console.log('=== ThongTinTaiKhoan response:', response1.data);
      
      if (response1.data.chiTietKhoaHocGhiDanh && response1.data.chiTietKhoaHocGhiDanh.length > 0) {
        return response1.data.chiTietKhoaHocGhiDanh;
      }
      
      // Thử endpoint khác
      console.log('=== Trying LayDanhSachKhoaHocChoXetDuyet endpoint...');
      const response2 = await axiosInstance.post('/api/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet', {
        taiKhoan
      });
      console.log('=== LayDanhSachKhoaHocChoXetDuyet response:', response2.data);
      
      return response2.data || [];
    } catch (error) {
      console.error('Error in getUserCourses:', error);
      return [];
    }
  },
};
