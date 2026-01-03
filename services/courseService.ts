import axiosInstance from './axiosConfig';
import { Course, CourseCategory } from '@/types/course';
import { API_CONFIG, API_ENDPOINTS } from '@/constants/config';

export const courseService = {
  // Lấy danh sách tất cả khóa học
  getAllCourses: async (): Promise<Course[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_ALL);
    return response.data;
  },

  // Lấy danh sách khóa học theo mã nhóm
  getCoursesByGroup: async (maNhom: string = API_CONFIG.MA_NHOM): Promise<Course[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_BY_GROUP, {
      params: { MaNhom: maNhom }
    });
    return response.data;
  },

  // Lấy danh mục khóa học
  getCourseCategories: async (): Promise<CourseCategory[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_CATEGORIES);
    return response.data;
  },

  // Lấy khóa học theo danh mục
  getCoursesByCategory: async (maDanhMuc: string, maNhom: string = API_CONFIG.MA_NHOM): Promise<Course[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_BY_CATEGORY, {
      params: { maDanhMuc, MaNhom: maNhom }
    });
    return response.data;
  },

  // Lấy thông tin chi tiết khóa học
  getCourseDetail: async (maKhoaHoc: string): Promise<Course> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_DETAIL, {
      params: { maKhoaHoc }
    });
    return response.data;
  },

  // Lấy danh sách khóa học phân trang
  getCoursesPagination: async (page: number = 1, pageSize: number = 8, maNhom: string = API_CONFIG.MA_NHOM) => {
    const response = await axiosInstance.get(API_ENDPOINTS.COURSES.GET_PAGINATED, {
      params: { page, pageSize, MaNhom: maNhom }
    });
    return response.data;
  },

  // Thêm khóa học
  addCourse: async (data: FormData): Promise<Course> => {
    const response = await axiosInstance.post(API_ENDPOINTS.COURSES.ADD, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Cập nhật khóa học với hình ảnh
  updateCourseWithImage: async (data: FormData): Promise<Course> => {
    const response = await axiosInstance.post(API_ENDPOINTS.COURSES.UPDATE_WITH_IMAGE, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Cập nhật khóa học không có hình ảnh
  updateCourseWithoutImage: async (data: {
    maKhoaHoc: string;
    biDanh: string;
    tenKhoaHoc: string;
    moTa: string;
    luotXem: number;
    danhGia: number;
    hinhAnh: string;
    maNhom: string;
    ngayTao: string;
    maDanhMucKhoaHoc: string;
    taiKhoanNguoiTao: string;
  }): Promise<Course> => {
    const response = await axiosInstance.put(API_ENDPOINTS.COURSES.UPDATE_WITHOUT_IMAGE, data);
    return response.data;
  },

  // Cập nhật khóa học (tự động chọn API phù hợp)
  updateCourse: async (data: FormData): Promise<Course> => {
    const response = await axiosInstance.post(API_ENDPOINTS.COURSES.UPDATE_WITH_IMAGE, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Xóa khóa học
  deleteCourse: async (maKhoaHoc: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.COURSES.DELETE, {
      params: { MaKhoaHoc: maKhoaHoc }
    });
    return response.data;
  },

  // Lấy danh sách học viên đã đăng ký khóa học
  getEnrolledStudents: async (maKhoaHoc: string): Promise<Array<{ taiKhoan: string; hoTen: string; biDanh: string }>> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.COURSES.GET_ENROLLED_STUDENTS, {
        maKhoaHoc
      });
      console.log('=== getEnrolledStudents API response:', response.data);
      // Ensure biDanh exists
      const students = (response.data || []).map((s: { taiKhoan: string; hoTen: string; biDanh?: string }) => ({
        ...s,
        biDanh: s.biDanh || s.taiKhoan
      }));
      return students;
    } catch (error) {
      console.error('=== getEnrolledStudents API error:', error);
      return [];
    }
  },

  // Đăng ký khóa học
  enrollCourse: async (maKhoaHoc: string, taiKhoan: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post(API_ENDPOINTS.COURSES.ENROLL, {
      maKhoaHoc,
      taiKhoan
    });
    return response.data;
  },

  // Hủy đăng ký khóa học
  unenrollCourse: async (maKhoaHoc: string, taiKhoan: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post(API_ENDPOINTS.COURSES.UNENROLL, {
      maKhoaHoc,
      taiKhoan
    });
    return response.data;
  },
};
