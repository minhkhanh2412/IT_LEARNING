import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo & Info */}
          <div className={styles.column}>
            <div className={styles.logo}>IT</div>
            <p className={styles.info}>
              <strong>Address:</strong> Việt Nam
            </p>
            <p className={styles.info}>
              <strong>Phone:</strong> +(12)234-11-24
            </p>
            <p className={styles.info}>
              <strong>Email:</strong> example@mail.com
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="Google"><i className="fab fa-google"></i></a>
            </div>
          </div>

          {/* Trợ giúp */}
          <div className={styles.column}>
            <h3>TRỢ GIÚP</h3>
            <ul>
              <li><Link href="#">Các câu hỏi thường gặp</Link></li>
              <li><Link href="#">Trung tâm đa phương tiện</Link></li>
              <li><Link href="#">Các cách xem</Link></li>
              <li><Link href="#">Tùy chọn cookie</Link></li>
              <li><Link href="#">Kiểm tra tốc độ</Link></li>
            </ul>
          </div>

          {/* Thông tin */}
          <div className={styles.column}>
            <h3>THÔNG TIN</h3>
            <ul>
              <li><Link href="#">Trung tâm trợ giúp</Link></li>
              <li><Link href="#">Quan hệ với nhà đầu tư</Link></li>
              <li><Link href="#">Điều khoản sử dụng</Link></li>
              <li><Link href="#">Thông tin doanh nghiệp</Link></li>
              <li><Link href="#">Thông báo pháp lý</Link></li>
            </ul>
          </div>

          {/* Kết nối */}
          <div className={styles.column}>
            <h3>KẾT NỐI</h3>
            <ul>
              <li><Link href="#">Tài khoản</Link></li>
              <li><Link href="#">Việc làm</Link></li>
              <li><Link href="#">Quyền riêng tư</Link></li>
              <li><Link href="#">Liên hệ với chúng tôi</Link></li>
              <li><Link href="#">Chỉ có trên IT</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        © 2026 LeMinhKhanh/NguyenHuynhKhoiNguyen ~. All Rights Reserved.
      </div>
    </footer>
  );
}
