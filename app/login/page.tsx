'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import styles from './login.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    taiKhoan: '',
    matKhau: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Thử với tài khoản admin có sẵn trước
    const loginData = formData.taiKhoan === 'admin' 
      ? { taiKhoan: 'admin', matKhau: '123456' }
      : formData;

    try {
      console.log('Đang đăng nhập với:', loginData);
      const response = await authService.login(loginData);
      console.log('Đăng nhập thành công:', response);
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('ACCESS_TOKEN', response.accessToken);
      
      // Show success modal
      setModalContent({
        title: 'Đăng nhập thành công! ✅',
        message: `Chào mừng ${response.hoTen}!`,
        type: 'success'
      });
      setShowModal(true);
      
      // Chuyển hướng sau 1 giây
      setTimeout(() => {
        router.push('/');
        window.location.href = '/';
      }, 1000);
    } catch (err: unknown) {
      console.error('Lỗi đăng nhập:', err);
      const error = err as { response?: { data?: string | { message?: string } } };
      console.error('Response data:', error.response?.data);
      
      // Hiển thị modal lỗi
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response?.data 
        : (error.response?.data as { message?: string })?.message || 'Đăng nhập thất bại';
      
      if (errorMsg.includes('không đúng') || errorMsg.includes('không tồn tại')) {
        setModalContent({
          title: 'Lỗi đăng nhập ⚠️',
          message: 'Tài khoản chưa tồn tại. Vui lòng tạo tài khoản demo bằng cách click vào nút bên dưới.',
          type: 'error'
        });
      } else {
        setModalContent({
          title: 'Lỗi đăng nhập ⚠️',
          message: errorMsg,
          type: 'error'
        });
      }
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (type: 'user' | 'admin') => {
    const account = type === 'admin' 
      ? { taiKhoan: 'giaovien01', matKhau: '123456' }
      : { taiKhoan: 'userhv', matKhau: 'user123' };
    
    setFormData(account);
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(account);
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('ACCESS_TOKEN', response.accessToken);
      
      // Show success modal
      setModalContent({
        title: 'Đăng nhập thành công! ✅',
        message: `Chào mừng ${response.hoTen}!`,
        type: 'success'
      });
      setShowModal(true);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch {
      try {
        await authService.register({
          taiKhoan: account.taiKhoan,
          matKhau: account.matKhau,
          hoTen: type === 'admin' ? 'Giáo Viên Test' : 'User HV',
          soDT: type === 'admin' ? '0909123456' : '0987654321',
          email: type === 'admin' ? 'giaovien01@edu.vn' : 'user.hv@edu.vn',
          maNhom: 'GP01',
          maLoaiNguoiDung: type === 'admin' ? 'GV' : 'HV',
        });
        const loginResponse = await authService.login(account);
        localStorage.setItem('user', JSON.stringify(loginResponse));
        localStorage.setItem('ACCESS_TOKEN', loginResponse.accessToken);
        
        setModalContent({
          title: 'Tạo tài khoản thành công! ✅',
          message: 'Đang chuyển hướng...',
          type: 'success'
        });
        setShowModal(true);
        
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } catch (err: unknown) {
        const error = err as { response?: { data?: string } };
        setModalContent({
          title: 'Lỗi ⚠️',
          message: error.response?.data || 'Không thể tạo tài khoản',
          type: 'error'
        });
        setShowModal(true);
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>IT</div>
          <h1 className={styles.title}>Đăng nhập</h1>
          <p className={styles.subtitle}>Chào mừng bạn quay lại với IT Learning!</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Tài khoản</label>
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
            <label className={styles.label}>Mật khẩu</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Nhập mật khẩu"
              value={formData.matKhau}
              onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <div className={styles.footer}>
            <p>Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link></p>
          </div>
        </form>

        <div className={styles.testAccounts}>
          <p className={styles.testTitle}>Đăng nhập nhanh:</p>
          <div className={styles.quickLogin}>
            <button 
              type="button"
              onClick={() => handleQuickLogin('user')}
              className={styles.userBtn}
              disabled={loading}
            >
              👤 Khách hàng
            </button>
            <button 
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className={styles.adminBtn}
              disabled={loading}
            >
              👨‍💼 Quản trị
            </button>
          </div>
          <p className={styles.testSubtitle}>
            Hoặc <Link href="/register">đăng ký tài khoản mới</Link>
          </p>
        </div>
      </div>

      {/* Modal thông báo */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              {modalContent.type === 'success' ? '✅' : '⚠️'}
            </div>
            <h3 className={styles.modalTitle}>{modalContent.title}</h3>
            <p className={styles.modalMessage}>{modalContent.message}</p>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setShowModal(false)} 
                className={modalContent.type === 'success' ? styles.confirmBtn : styles.cancelBtn}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
