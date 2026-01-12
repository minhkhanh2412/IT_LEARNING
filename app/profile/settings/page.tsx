'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import { userService } from '@/services/userService';
import styles from './settings.module.scss';
import { 
  validateField, 
  VALIDATION_MESSAGES 
} from '@/utils/validation/commonValidation';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [user, setUser] = useState<{ hoTen: string; taiKhoan: string; email: string; soDT: string; matKhau?: string; hinhAnh?: string; maLoaiNguoiDung: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    hoTen: '',
    taiKhoan: '',
    email: '',
    soDT: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [editFieldError, setEditFieldError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });
  const [notifications, setNotifications] = useState({
    emailNewCourse: true,
    notifyComment: true,
    notifyReply: true,
    notifyLike: true,
    notifyBlogComment: true,
    notifyBlogLike: true,
    notifyQuestion: true,
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
    setFormData({
      hoTen: userData.hoTen || '',
      taiKhoan: userData.taiKhoan || '',
      email: userData.email || '',
      soDT: userData.soDT || '',
    });
  }, [router]);

  const handleOpenEditModal = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditFieldError('');
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditField('');
    setEditValue('');
    setEditFieldError('');
  };

  const handleEditValueChange = (value: string) => {
    setEditValue(value);
    // Clear error khi user typing
    if (editFieldError) {
      setEditFieldError('');
    }
  };

  const handleEditBlur = () => {
    // Validate khi blur
    const error = validateField(editField, editValue, {});
    setEditFieldError(error);
  };

  const handleSaveEdit = async () => {
    if (!user) return;

    // Validate field trước khi submit
    const error = validateField(editField, editValue, {});
    if (error) {
      setEditFieldError(error);
      return;
    }

    // API CapNhatThongTinNguoiDung yêu cầu matKhau; nếu thiếu có thể bị set null
    if (!user.matKhau) {
      setNotification({
        show: true,
        title: 'Lỗi!',
        message: 'Thiếu mật khẩu trong phiên đăng nhập. Vui lòng đăng nhập lại để cập nhật thông tin.',
        type: 'error'
      });
      return;
    }
    
    try {
      const updateData: Record<string, string> = {
        hoTen: formData.hoTen,
        taiKhoan: formData.taiKhoan,
        email: formData.email,
        soDT: formData.soDT,
        matKhau: user.matKhau,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
        maNhom: 'GP01',
      };

      // Cập nhật giá trị mới
      updateData[editField] = editValue;

      await userService.updateUser(updateData);

      // Cập nhật state và localStorage
      const updatedUser = { ...user, [editField]: editValue };
      const updatedFormData = { ...formData, [editField]: editValue };
      
      setUser(updatedUser);
      setFormData(updatedFormData);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setNotification({
        show: true,
        title: 'Cập nhật thành công! ✅',
        message: 'Thông tin của bạn đã được cập nhật.',
        type: 'success'
      });

      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating user:', error);
      setNotification({
        show: true,
        title: 'Cập nhật thất bại! ⚠️',
        message: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
        type: 'error'
      });
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    
    // Validate tất cả các trường
    const errors: { [key: string]: string } = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = VALIDATION_MESSAGES.required;
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = VALIDATION_MESSAGES.required;
    } else {
      const passwordError = validateField('matKhau', passwordData.newPassword, {});
      if (passwordError) {
        errors.newPassword = passwordError;
      }
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = VALIDATION_MESSAGES.required;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = VALIDATION_MESSAGES.passwordConfirm;
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setNotification({
        show: true,
        title: 'Lỗi! ⚠️',
        message: 'Vui lòng kiểm tra lại các trường mật khẩu.',
        type: 'error'
      });
      return;
    }

    try {
      // Verify mật khẩu cũ trước bằng cách thử đăng nhập
      const { authService } = await import('@/services/userService');
      try {
        await authService.login({
          taiKhoan: formData.taiKhoan,
          matKhau: passwordData.currentPassword
        });
      } catch (loginError) {
        // Nếu đăng nhập thất bại = mật khẩu cũ sai
        console.error('Login verification failed:', loginError);
        throw new Error('WRONG_PASSWORD');
      }

      // Nếu verify thành công, đổi mật khẩu
      const updateData = {
        hoTen: formData.hoTen,
        taiKhoan: formData.taiKhoan,
        email: formData.email,
        soDT: formData.soDT,
        matKhau: passwordData.newPassword,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
        maNhom: 'GP01',
      };

      await userService.updateUser(updateData);

      // Cập nhật lại user/password trong localStorage để các lần update sau không bị null
      const updatedUser = { ...user, matKhau: passwordData.newPassword };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setNotification({
        show: true,
        title: 'Đổi mật khẩu thành công! ✅',
        message: 'Mật khẩu của bạn đã được thay đổi.',
        type: 'success'
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (error) {
      console.error('Error changing password:', error);
      
      let errorMessage = 'Không thể đổi mật khẩu. Vui lòng thử lại.';
      const err = error as { message?: string; response?: { status?: number; data?: string } };
      
      // Kiểm tra xem có phải lỗi mật khẩu sai không
      if (err.message === 'WRONG_PASSWORD') {
        errorMessage = 'Mật khẩu hiện tại không đúng!';
      } else if (err.response?.status === 400 || err.response?.status === 401) {
        errorMessage = 'Mật khẩu hiện tại không đúng!';
      }
      
      setNotification({
        show: true,
        title: 'Đổi mật khẩu thất bại! ⚠️',
        message: errorMessage,
        type: 'error'
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setNotification({
          show: true,
          title: 'Lỗi! ⚠️',
          message: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP).',
          type: 'error'
        });
        return;
      }
      
      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setNotification({
          show: true,
          title: 'Lỗi! ⚠️',
          message: 'Kích thước file không được vượt quá 2MB.',
          type: 'error'
        });
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile || !user) {
      setNotification({
        show: true,
        title: 'Lỗi! ⚠️',
        message: 'Vui lòng chọn ảnh để upload.',
        type: 'error'
      });
      return;
    }

    if (!user.matKhau) {
      setNotification({
        show: true,
        title: 'Lỗi! ⚠️',
        message: 'Thiếu mật khẩu trong phiên đăng nhập. Vui lòng đăng nhập lại để cập nhật ảnh đại diện.',
        type: 'error'
      });
      return;
    }

    try {
      // Gọi API cập nhật thông tin (không bao gồm hinhAnh vì API không hỗ trợ)
      const updateData = {
        taiKhoan: formData.taiKhoan,
        hoTen: formData.hoTen,
        email: formData.email,
        soDT: formData.soDT,
        matKhau: user.matKhau,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
        maNhom: 'GP01',
      };

      console.log('Đang cập nhật thông tin lên server...');
      await userService.updateUser(updateData);
      
      // Lấy lại thông tin user từ server
      const updatedUserData = await userService.getUserInfo();
      console.log('Data user mới từ server:', updatedUserData);
      
      // Merge hinhAnh vào user data (vì API không lưu ảnh)
      const finalUserData = {
        ...updatedUserData,
        hinhAnh: avatarPreview, // Thêm avatar từ localStorage
        matKhau: user.matKhau,
      };
      
      console.log('Lưu user data với avatar vào localStorage:', finalUserData);
      
      // Cập nhật state và localStorage
      setUser(finalUserData);
      localStorage.setItem('user', JSON.stringify(finalUserData));
      
      setNotification({
        show: true,
        title: 'Cập nhật thành công! ✅',
        message: 'Ảnh đại diện đã được cập nhật.',
        type: 'success'
      });
      
      // Reset avatar file
      setAvatarFile(null);
      
      // Reload page sau 1 giây để cập nhật avatar ở mọi nơi
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setNotification({
        show: true,
        title: 'Upload thất bại! ⚠️',
        message: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
        type: 'error'
      });
    }
  };


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    
    // Clear error khi user typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordBlur = (fieldName: string) => {
    const errors: { [key: string]: string } = {};
    
    if (fieldName === 'newPassword' && passwordData.newPassword) {
      const error = validateField('matKhau', passwordData.newPassword, {});
      if (error) errors.newPassword = error;
    }
    
    if (fieldName === 'confirmPassword' && passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        errors.confirmPassword = VALIDATION_MESSAGES.passwordConfirm;
      }
    }
    
    setPasswordErrors(prev => ({ ...prev, ...errors }));
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  return (
    <>
      <Sidebar />
      <div className="mainLayout">
        <main className={styles.main}>
          <div className="container">
            <h1 className={styles.pageTitle}>Cài đặt</h1>

            <div className={styles.settingsContainer}>
              {/* Sidebar Menu */}
              <div className={styles.settingsSidebar}>
                <button
                  className={`${styles.menuItem} ${activeTab === 'account' ? styles.active : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  <UserOutlined /> Cài đặt tài khoản
                </button>
                <button
                  className={`${styles.menuItem} ${activeTab === 'security' ? styles.active : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <LockOutlined /> Bảo mật và đăng nhập
                </button>
                <button
                  className={`${styles.menuItem} ${activeTab === 'notifications' ? styles.active : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <BellOutlined /> Cài đặt thông báo
                </button>
              </div>

              {/* Content Area */}
              <div className={styles.settingsContent}>
                {/* Account Settings */}
                {activeTab === 'account' && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Họ tên</label>
                      <div className={styles.inputWithButton}>
                        <div className={styles.valueDisplay}>
                          <p className={styles.value}>{formData.hoTen}</p>
                          <p className={styles.hint}>Tên của bạn xuất hiện trên trang cá nhân và bên cạnh các bình luận của bạn.</p>
                        </div>
                        <button 
                          className={styles.editBtn}
                          onClick={() => handleOpenEditModal('hoTen', formData.hoTen)}
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tài khoản</label>
                      <div className={styles.valueDisplay}>
                        <p className={styles.value}>{formData.taiKhoan}</p>
                        <p className={styles.hint}>Tài khoản để đăng nhập (không thể thay đổi).</p>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email</label>
                      <div className={styles.inputWithButton}>
                        <div className={styles.valueDisplay}>
                          <p className={styles.value}>{formData.email}</p>
                          <p className={styles.hint}>Nhận thông tin qua trong từ IT.</p>
                        </div>
                        <button 
                          className={styles.editBtn}
                          onClick={() => handleOpenEditModal('email', formData.email)}
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Số điện thoại</label>
                      <div className={styles.inputWithButton}>
                        <div className={styles.valueDisplay}>
                          <p className={styles.value}>{formData.soDT}</p>
                          <p className={styles.hint}>Điện thoại liên kết với IT.</p>
                        </div>
                        <button 
                          className={styles.editBtn}
                          onClick={() => handleOpenEditModal('soDT', formData.soDT)}
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Hình đại diện</label>
                      <div className={styles.avatarSection}>
                        <div className={styles.avatarPreview}>
                          {avatarPreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarPreview} alt="Avatar" className={styles.avatarImg} />
                          ) : (
                            user?.hoTen?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <input
                          type="file"
                          id="avatarUpload"
                          className={styles.fileInput}
                          accept="image/*"
                          onChange={handleAvatarChange}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="avatarUpload" className={styles.uploadBtn}>
                          + Upload
                        </label>
                        {avatarFile && (
                          <button 
                            className={styles.saveBtn}
                            onClick={handleUploadAvatar}
                            type="button"
                          >
                            Lưu ảnh
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Mật khẩu</h2>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Thay đổi mật khẩu</label>
                      <div className={styles.passwordInputs}>
                        <div className={styles.passwordField}>
                          <input
                            type="password"
                            placeholder="Mật khẩu hiện tại của bạn"
                            className={`${styles.input} ${passwordErrors.currentPassword ? styles.inputError : ''}`}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                          />
                          {passwordErrors.currentPassword && (
                            <span className={styles.errorText}>{passwordErrors.currentPassword}</span>
                          )}
                        </div>
                        
                        <div className={styles.passwordField}>
                          <input
                            type="password"
                            placeholder="Mật khẩu mới của bạn"
                            className={`${styles.input} ${passwordErrors.newPassword ? styles.inputError : ''}`}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            onBlur={() => handlePasswordBlur('newPassword')}
                          />
                          {passwordErrors.newPassword && (
                            <span className={styles.errorText}>{passwordErrors.newPassword}</span>
                          )}
                        </div>
                        
                        <div className={styles.passwordField}>
                          <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            className={`${styles.input} ${passwordErrors.confirmPassword ? styles.inputError : ''}`}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            onBlur={() => handlePasswordBlur('confirmPassword')}
                          />
                          {passwordErrors.confirmPassword && (
                            <span className={styles.errorText}>{passwordErrors.confirmPassword}</span>
                          )}
                        </div>
                        
                        <button 
                          className={styles.saveBtn}
                          onClick={handleChangePassword}
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Liên kết tài khoản đăng nhập</h2>

                    <div className={styles.linkSection}>
                      <div className={styles.linkItem}>
                        <div>
                          <h4>Liên kết Google</h4>
                          <p className={styles.linkHint}>Chưa liên kết tài khoản Google</p>
                        </div>
                        <button className={styles.linkBtn}>
                          <span>G</span> Liên kết google
                        </button>
                      </div>

                      <div className={styles.linkItem}>
                        <div>
                          <h4>Liên kết Facebook</h4>
                          <p className={styles.linkHint}>Chưa liên kết tài khoản Facebook</p>
                        </div>
                        <button className={styles.linkBtn}>
                          <span>f</span> Liên kết Facebook
                        </button>
                      </div>

                      <div className={styles.linkItem}>
                        <div>
                          <h4>Liên kết số điện thoại</h4>
                          <p className={styles.linkHint}>Chưa liên kết số điện thoại nào</p>
                        </div>
                        <button className={styles.linkBtn}>
                          <span></span> Liên kết số điện thoại
                        </button>
                      </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Mạng xã hội</h2>

                    <div className={styles.socialSection}>
                      <div className={styles.socialItem}>
                        <div>
                          <h4>Facebook</h4>
                          <p className={styles.linkHint}>Chưa liên kết tài khoản Facebook</p>
                        </div>
                        <button className={styles.editBtn}>Chỉnh sửa</button>
                      </div>

                      <div className={styles.socialItem}>
                        <div>
                          <h4>Youtube</h4>
                          <p className={styles.linkHint}>Chưa liên kết tài khoản Youtube</p>
                        </div>
                        <button className={styles.editBtn}>Chỉnh sửa</button>
                      </div>

                      <div className={styles.socialItem}>
                        <div>
                          <h4>Linkedin</h4>
                          <p className={styles.linkHint}>Chưa liên kết tài khoản Linkedin</p>
                        </div>
                        <button className={styles.editBtn}>Chỉnh sửa</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Email</h2>
                    <p className={styles.sectionDesc}>Gửi email cho tôi khi có:</p>

                    <div className={styles.notificationItem}>
                      <span>Bài học mới</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.emailNewCourse}
                          onChange={() => handleNotificationToggle('emailNewCourse')}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <h2 className={styles.sectionTitle}>Thông báo</h2>
                    <p className={styles.sectionDesc}>Gửi thông báo cho tôi khi có:</p>

                    <div className={styles.notificationItem}>
                      <span>Bài học mới</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.notifyComment}
                          onChange={() => handleNotificationToggle('notifyComment')}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.notificationItem}>
                      <span>Nhắc đến trong bình luận</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.notifyReply}
                          onChange={() => handleNotificationToggle('notifyReply')}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.notificationItem}>
                      <span>Trả lời bình luận</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.notifyLike}
                          onChange={() => handleNotificationToggle('notifyLike')}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.notificationItem}>
                      <span>Cảm xúc trong bình luận</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.notifyBlogComment}
                          onChange={() => handleNotificationToggle('notifyBlogComment')}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.notificationItem}>
                      <span>Bình luận trong bài blog</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.notifyBlogLike}
                          onChange={() => handleNotificationToggle('notifyBlogLike')}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.notificationItem}>
                      <span>Cảm xúc trong bài blog</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.notifyQuestion}
                          onChange={() => handleNotificationToggle('notifyQuestion')}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.notificationItem}>
                      <span>Câu trả lời được chọn trong màn thảo luận</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={notifications.notifyQuestion}
                          onChange={() => handleNotificationToggle('notifyQuestion')}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              Chỉnh sửa {editField === 'hoTen' ? 'Họ tên' : 
                         editField === 'taiKhoan' ? 'Tài khoản' :
                         editField === 'email' ? 'Email' : 'Số điện thoại'}
            </h3>
            <input
              type={editField === 'email' ? 'email' : 'text'}
              className={`${styles.modalInput} ${editFieldError ? styles.inputError : ''}`}
              value={editValue}
              onChange={(e) => handleEditValueChange(e.target.value)}
              onBlur={handleEditBlur}
              placeholder={`Nhập ${editField === 'hoTen' ? 'họ tên' : 
                                   editField === 'taiKhoan' ? 'tài khoản' :
                                   editField === 'email' ? 'email' : 'số điện thoại'} mới`}
            />
            {editFieldError && (
              <span className={styles.errorText}>{editFieldError}</span>
            )}
            <div className={styles.modalActions}>
              <button onClick={handleCloseEditModal} className={styles.cancelBtn}>
                Hủy
              </button>
              <button onClick={handleSaveEdit} className={styles.confirmBtn}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              {notification.type === 'success' ? '✅' : '⚠️'}
            </div>
            <h3 className={styles.modalTitle}>{notification.title}</h3>
            <p className={styles.modalMessage}>{notification.message}</p>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setNotification({ show: false, title: '', message: '', type: 'success' })} 
                className={notification.type === 'success' ? styles.confirmBtn : styles.cancelBtn}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
