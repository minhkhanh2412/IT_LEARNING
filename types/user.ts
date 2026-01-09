export interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  soDt?: string; // API có thể trả về soDt (chữ t thường)
  matKhau?: string;
  maLoaiNguoiDung: string; // "GV" = admin, "HV" = student
  tenLoaiNguoiDung?: string;
  accessToken?: string;
  hinhAnh?: string;
}

export interface LoginRequest {
  taiKhoan: string;
  matKhau: string;
}

export interface LoginResponse {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maLoaiNguoiDung: string;
  accessToken: string;
  matKhau?: string;
}
