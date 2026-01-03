export const API_CONFIG = {
  BASE_URL: 'https://elearningnew.cybersoft.edu.vn',
  TOKEN_CYBERSOFT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NiIsIkhldEhhblN0cmluZyI6IjMwLzA0LzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3NzUwNzIwMDAwMCIsIm5iZiI6MTc0OTkyMDQwMCwiZXhwIjoxNzc3NjU0ODAwfQ.GVFThE6gKR0iLystNcnByNEvenUzv2DP5TtmJhk2mvI',
  MA_NHOM: 'GP01',
};

export const STORAGE_KEYS = {
  USER_INFO: 'USER_INFO',
  ACCESS_TOKEN: 'ACCESS_TOKEN',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Quản lý khóa học
  COURSES: {
    GET_ALL: '/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc',
    GET_BY_GROUP: '/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc',
    GET_CATEGORIES: '/api/QuanLyKhoaHoc/LayDanhMucKhoaHoc',
    GET_BY_CATEGORY: '/api/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc',
    GET_DETAIL: '/api/QuanLyKhoaHoc/LayThongTinKhoaHoc',
    GET_PAGINATED: '/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang',
    GET_ENROLLED_STUDENTS: '/api/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc',
    ADD: '/api/QuanLyKhoaHoc/ThemKhoaHocUploadHinh',
    UPDATE_WITH_IMAGE: '/api/QuanLyKhoaHoc/CapNhatKhoaHocUpload',
    UPDATE_WITHOUT_IMAGE: '/api/QuanLyKhoaHoc/CapNhatKhoaHoc',
    DELETE: '/api/QuanLyKhoaHoc/XoaKhoaHoc',
    ENROLL: '/api/QuanLyKhoaHoc/DangKyKhoaHoc',
    UNENROLL: '/api/QuanLyKhoaHoc/HuyGhiDanh',
  },
  
  // Quản lý người dùng
  AUTH: {
    LOGIN: '/api/QuanLyNguoiDung/DangNhap',
    REGISTER: '/api/QuanLyNguoiDung/DangKy',
    GET_ALL_USERS: '/api/QuanLyNguoiDung/LayDanhSachNguoiDung',
    GET_USER_COURSES: '/api/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh',
    GET_USER_INFO: '/api/QuanLyNguoiDung/ThongTinTaiKhoan',
    DELETE_USER: '/api/QuanLyNguoiDung/XoaNguoiDung',
    UPDATE_USER: '/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung',
    ADD_USER: '/api/QuanLyNguoiDung/ThemNguoiDung',
  },
};
