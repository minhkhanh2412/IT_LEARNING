export interface Course {
  maKhoaHoc: string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  soLuongHocVien: number;
  danhGia?: number;
  nguoiTao: {
    taiKhoan: string;
    hoTen: string;
    maLoaiNguoiDung: string;
    tenLoaiNguoiDung: string;
  };
  danhMucKhoaHoc: {
    maDanhMucKhoahoc: string;
    tenDanhMucKhoaHoc: string;
  };
}

export interface CourseCategory {
  maDanhMuc: string;
  tenDanhMuc: string;
}

export interface EnrolledStudent {
  taiKhoan: string;
  hoTen: string;
  biDanh: string;
  maLoaiNguoiDung?: string;
}
