'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import styles from '../login/login.module.scss';
import { 
  validateField, 
  validateAllFields, 
  hasErrors
} from '@/utils/validation/commonValidation';

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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate field on blur
  const handleBlur = (fieldName: string) => {
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData], formData);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Handle input change with validation
  const handleChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error on change
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const fieldsToValidate = ['taiKhoan', 'matKhau', 'hoTen', 'soDT', 'email'];
    const errors = validateAllFields(formData, fieldsToValidate);
    
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      setError('Vui lòng kiểm tra lại các trường thông tin');
      return;
    }

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
              className={`${styles.input} ${fieldErrors.taiKhoan ? styles.inputError : ''}`}
              placeholder="Nhập tài khoản (4-20 ký tự)"
              value={formData.taiKhoan}
              onChange={(e) => handleChange('taiKhoan', e.target.value)}
              onBlur={() => handleBlur('taiKhoan')}
              required
            />
            {fieldErrors.taiKhoan && (
              <span className={styles.errorText}>{fieldErrors.taiKhoan}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mật khẩu *</label>
            <input
              type="password"
              className={`${styles.input} ${fieldErrors.matKhau ? styles.inputError : ''}`}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              value={formData.matKhau}
              onChange={(e) => handleChange('matKhau', e.target.value)}
              onBlur={() => handleBlur('matKhau')}
              required
            />
            {fieldErrors.matKhau && (
              <span className={styles.errorText}>{fieldErrors.matKhau}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Họ tên *</label>
            <input
              type="text"
              className={`${styles.input} ${fieldErrors.hoTen ? styles.inputError : ''}`}
              placeholder="Nhập họ tên đầy đủ"
              value={formData.hoTen}
              onChange={(e) => handleChange('hoTen', e.target.value)}
              onBlur={() => handleBlur('hoTen')}
              required
            />
            {fieldErrors.hoTen && (
              <span className={styles.errorText}>{fieldErrors.hoTen}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Số điện thoại *</label>
            <input
              type="tel"
              className={`${styles.input} ${fieldErrors.soDT ? styles.inputError : ''}`}
              placeholder="Nhập số điện thoại (VD: 0901234567)"
              value={formData.soDT}
              onChange={(e) => handleChange('soDT', e.target.value)}
              onBlur={() => handleBlur('soDT')}
              required
            />
            {fieldErrors.soDT && (
              <span className={styles.errorText}>{fieldErrors.soDT}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email *</label>
            <input
              type="email"
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
              placeholder="Nhập email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              required
            />
            {fieldErrors.email && (
              <span className={styles.errorText}>{fieldErrors.email}</span>
            )}
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
