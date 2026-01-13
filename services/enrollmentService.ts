import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@/constants/config';
import {
  EnrolledStudent,
  PendingStudent,
  NotEnrolledUser,
  EnrollmentRequest,
  EnrollmentResponse,
} from '@/types/enrollment';

export const enrollmentService = {
  /**
   * Lấy danh sách học viên đã ghi danh vào khóa học
   * (Sau khi admin đã duyệt hoặc ghi danh trực tiếp)
   */
  getEnrolledStudents: async (maKhoaHoc: string): Promise<EnrolledStudent[]> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ENROLLMENT.GET_ENROLLED_STUDENTS,
        { MaKhoaHoc: maKhoaHoc }
      );
      console.log(' Học viên đã ghi danh:', response.data);
      return response.data || [];
    } catch (error) {
      console.error(' Lỗi khi lấy danh sách học viên đã ghi danh:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách học viên đang chờ xét duyệt
   * (Sau khi user nhấn "Đăng ký khóa học")
   */
  getPendingStudents: async (maKhoaHoc: string): Promise<PendingStudent[]> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ENROLLMENT.GET_PENDING_STUDENTS,
        { MaKhoaHoc: maKhoaHoc }
      );
      console.log(' Học viên chờ xét duyệt:', response.data);
      return response.data || [];
    } catch (error) {
      console.error(' Lỗi khi lấy danh sách học viên chờ xét duyệt:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách người dùng chưa ghi danh vào khóa học
   */
  getNotEnrolledUsers: async (maKhoaHoc: string): Promise<NotEnrolledUser[]> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ENROLLMENT.GET_NOT_ENROLLED_USERS,
        { MaKhoaHoc: maKhoaHoc }
      );
      console.log(' Người dùng chưa ghi danh:', response.data);
      return response.data || [];
    } catch (error) {
      console.error(' Lỗi khi lấy danh sách người dùng chưa ghi danh:', error);
      throw error;
    }
  },

  /**
   * Xác thực/Duyệt học viên vào khóa học
   * Hành động của Admin: Chuyển học viên từ "Chờ xét duyệt" sang "Đã ghi danh"
   * Hoặc ghi danh trực tiếp người dùng chưa đăng ký
   */
  approveEnrollment: async (
    maKhoaHoc: string,
    taiKhoan: string
  ): Promise<EnrollmentResponse> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ENROLLMENT.APPROVE_ENROLLMENT,
        { maKhoaHoc, taiKhoan }
      );
      console.log(' Đã duyệt ghi danh:', response.data);
      return response.data;
    } catch (error) {
      console.error(' Lỗi khi duyệt ghi danh:', error);
      throw error;
    }
  },

  /**
   * Hủy ghi danh khóa học
   * Hành động của Admin: Xóa học viên khỏi khóa học
   * Yêu cầu: Authorization Bearer token
   */
  cancelEnrollment: async (
    maKhoaHoc: string,
    taiKhoan: string
  ): Promise<EnrollmentResponse> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ENROLLMENT.CANCEL_ENROLLMENT,
        { maKhoaHoc, taiKhoan }
      );
      console.log(' Đã hủy ghi danh:', response.data);
      return response.data;
    } catch (error) {
      console.error(' Lỗi khi hủy ghi danh:', error);
      throw error;
    }
  },
  /**
   * =====Quản lý ghi danh theo người dùng (xem các khóa học của 1 user)=====
   */

  /**
   * Lấy danh sách khóa học mà người dùng CHƯA ghi danh
   */
  getUserCoursesNotEnrolled: async (taiKhoan: string): Promise<{ maKhoaHoc: string; biDanh: string; tenKhoaHoc: string }[]> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ENROLLMENT.GET_USER_COURSES_NOT_ENROLLED,
        { taiKhoan }
      );
      console.log('📋 Khóa học người dùng chưa ghi danh:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách khóa học chưa ghi danh:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách khóa học mà người dùng ĐÃ ghi danh (đã được duyệt)
   */
  getUserCoursesEnrolled: async (taiKhoan: string): Promise<{ maKhoaHoc: string; tenKhoaHoc: string }[]> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ENROLLMENT.GET_USER_COURSES_ENROLLED,
        { taiKhoan }
      );
      console.log('✅ Khóa học người dùng đã ghi danh:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách khóa học đã ghi danh:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách khóa học mà người dùng ĐANG CHỜ xét duyệt
   */
  getUserCoursesPending: async (taiKhoan: string): Promise<{ maKhoaHoc: string; tenKhoaHoc: string }[]> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ENROLLMENT.GET_USER_COURSES_PENDING,
        { taiKhoan }
      );
      console.log('⏳ Khóa học người dùng chờ xét duyệt:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách khóa học chờ xét duyệt:', error);
      throw error;
    }
  },};
