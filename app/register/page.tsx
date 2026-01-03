'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import styles from '../login/login.module.scss';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    taiKhoan: '',
    matKhau: '',
    hoTen: '',
    soDT: '',
    email: '',
    maNhom: 'GP01',
    maLoaiNguoiDung: 'HV', // Luôn là HV cho đăng ký công khai
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Đang đăng ký với:', formData);
      const response = await authService.register(formData);
      console.log('Đăng ký thành công:', response);
      
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/login');
    } catch (err: unknown) {
      console.error('Lỗi đăng ký:', err);
      const error = err as { response?: { data?: string } };
      console.error('Response data:', error.response?.data);
      setError(error.response?.data || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>IT</div>
          <h1 className={styles.title}>Đăng ký</h1>
          <p className={styles.subtitle}>Tạo tài khoản học viên để bắt đầu học!</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Tài khoản *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Nhập tài khoản"
              value={formData.taiKhoan}
              onChange={(e) => setFormData({ ...formData, taiKhoan: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mật khẩu *</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Nhập mật khẩu"
              value={formData.matKhau}
              onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Họ tên *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Nhập họ tên"
              value={formData.hoTen}
              onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Số điện thoại *</label>
            <input
              type="tel"
              className={styles.input}
              placeholder="Nhập số điện thoại"
              value={formData.soDT}
              onChange={(e) => setFormData({ ...formData, soDT: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email *</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Nhập email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          <div className={styles.footer}>
            <p>Đã có tài khoản? <Link href="/login">Đăng nhập ngay</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
