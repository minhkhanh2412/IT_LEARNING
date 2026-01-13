// Các kiểu dữ liệu cho Quản lý Ghi danh Khóa học

// Học viên đã ghi danh vào khóa học
export interface EnrolledStudent {
  taiKhoan: string;
  hoTen: string;
  biDanh: string;
  maLoaiNguoiDung?: string;
  email?: string;
  soDT?: string;
}

// Học viên đang chờ xét duyệt
export interface PendingStudent {
  taiKhoan: string;
  hoTen: string;
  biDanh: string;
  email?: string;
  soDT?: string;
}

// Người dùng chưa ghi danh vào khóa học
export interface NotEnrolledUser {
  taiKhoan: string;
  hoTen: string;
  biDanh: string;
  email?: string;
  soDT?: string;
}

// Dữ liệu gửi lên API để ghi danh/hủy ghi danh
export interface EnrollmentRequest {
  maKhoaHoc: string;
  taiKhoan: string;
}

// Dữ liệu trả về từ API
export interface EnrollmentResponse {
  message?: string;
  statusCode?: number;
}

// Khóa học của người dùng (dùng cho trang quản lý theo user)
export interface UserCourse {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  biDanh?: string;
}
