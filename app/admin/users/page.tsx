'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import { userService } from '@/services/userService';
import { User } from '@/types/user';
import styles from './admin-users.module.scss';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<{ taiKhoan: string; hoTen: string } | null>(null);
  const [viewingUser, setViewingUser] = useState<{ taiKhoan: string; hoTen: string } | null>(null);
  const [userCourses, setUserCourses] = useState<Array<{ maKhoaHoc: string; tenKhoaHoc: string; hinhAnh: string }>>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    hoTen: '',
    taiKhoan: '',
    matKhau: '',
    email: '',
    soDT: '',
    maLoaiNguoiDung: 'HV',
  });
  const [notification, setNotification] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });
  const usersPerPage = 10;

  useEffect(() => {
    // Kiểm tra nếu user là admin
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    const isAdmin = user?.maLoaiNguoiDung === 'GV' || user?.taiKhoan?.toLowerCase().includes('admin') || user?.taiKhoan?.toLowerCase().includes('teacher') || user?.taiKhoan?.toLowerCase().includes('gv');
    
    if (!isAdmin) {
      router.push('/');
      return;
    }

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.taiKhoan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = (user: User) => {
    setDeletingUser({ taiKhoan: user.taiKhoan, hoTen: user.hoTen });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    try {
      await userService.deleteUser(deletingUser.taiKhoan);
      setShowDeleteModal(false);
      setDeletingUser(null);
      await fetchUsers();
      
      setNotification({
        show: true,
        title: 'Xóa thành công! ✅',
        message: 'Người dùng đã được xóa khỏi hệ thống.',
        type: 'success'
      });
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? ((error as { response?: { data?: string } }).response?.data || 'Xóa người dùng thất bại!')
        : 'Xóa người dùng thất bại!';
      
      setShowDeleteModal(false);
      setDeletingUser(null);
      
      setNotification({
        show: true,
        title: 'Xóa thất bại! ⚠️',
        message: errorMessage,
        type: 'error'
      });
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const handleViewCourses = async (user: User) => {
    setViewingUser({ taiKhoan: user.taiKhoan, hoTen: user.hoTen });
    setShowCoursesModal(true);
    setLoadingCourses(true);
    try {
      const courses = await userService.getUserCourses(user.taiKhoan);
      setUserCourses(courses);
    } catch (error) {
      console.error('Error fetching user courses:', error);
      setUserCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const closeCoursesModal = () => {
    setShowCoursesModal(false);
    setViewingUser(null);
    setUserCourses([]);
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      hoTen: '',
      taiKhoan: '',
      matKhau: '',
      email: '',
      soDT: '',
      maLoaiNguoiDung: 'HV',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      hoTen: user.hoTen,
      taiKhoan: user.taiKhoan,
      matKhau: '', // Không hiển thị mật khẩu cũ
      email: user.email,
      soDT: user.soDT || user.soDt || '', // Xử lý cả soDT và soDt
      maLoaiNguoiDung: user.maLoaiNguoiDung,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setShowPassword(false);
    setFormData({
      hoTen: '',
      taiKhoan: '',
      matKhau: '',
      email: '',
      soDT: '',
      maLoaiNguoiDung: 'HV',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser && !formData.matKhau) {
        setNotification({
          show: true,
          title: 'Thiếu mật khẩu!',
          message: 'API cập nhật yêu cầu mật khẩu. Vui lòng nhập mật khẩu mới để cập nhật người dùng.',
          type: 'error'
        });
        return;
      }

      const submitData: { [key: string]: string } = {
        hoTen: formData.hoTen,
        taiKhoan: formData.taiKhoan,
        email: formData.email,
        soDT: formData.soDT,
        maLoaiNguoiDung: formData.maLoaiNguoiDung,
        maNhom: 'GP01',
      };

      // Chỉ thêm mật khẩu nếu có giá trị (khi thêm mới hoặc khi sửa và nhập mật khẩu mới)
      if (formData.matKhau) {
        submitData.matKhau = formData.matKhau;
      }

      if (editingUser) {
        // Cập nhật người dùng
        await userService.updateUser(submitData);
        setNotification({
          show: true,
          title: 'Cập nhật thành công! ✅',
          message: 'Thông tin người dùng đã được cập nhật.',
          type: 'success'
        });
      } else {
        // Thêm người dùng mới
        await userService.addUser(submitData);
        setNotification({
          show: true,
          title: 'Thêm thành công! ✅',
          message: 'Người dùng mới đã được thêm vào hệ thống.',
          type: 'success'
        });
      }

      handleCloseModal();
      await fetchUsers();
    } catch (error: unknown) {
      console.error('Error submitting user:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? ((error as { response?: { data?: string } }).response?.data || 'Thao tác thất bại!')
        : 'Thao tác thất bại!';
      
      setNotification({
        show: true,
        title: editingUser ? 'Cập nhật thất bại! ⚠️' : 'Thêm thất bại! ⚠️',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="mainLayout">
        <main className={styles.main}>
          <div className="container">
            <div className={styles.header}>
              <h1 className={styles.title}>Quản lý người dùng</h1>
              <button 
                onClick={handleOpenAddModal} 
                className={styles.addButton}
                title="Thêm người dùng mới"
              >
                <PlusOutlined />
              </button>
            </div>

            <div className={styles.searchBar}>
              <SearchOutlined className={styles.searchIcon} />
              <input 
                type="text"
                placeholder="Tìm kiếm người dùng"
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className={styles.loading}>Đang tải...</div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>
                        STT
                        <span className={styles.sortIcons}>
                          <CaretUpOutlined />
                          <CaretDownOutlined />
                        </span>
                      </th>
                      <th>
                        Ảnh
                        <span className={styles.sortIcons}>
                          <CaretUpOutlined />
                          <CaretDownOutlined />
                        </span>
                      </th>
                      <th>
                        Tài khoản
                        <span className={styles.sortIcons}>
                          <CaretUpOutlined />
                          <CaretDownOutlined />
                        </span>
                      </th>
                      <th>
                        Họ tên
                        <span className={styles.sortIcons}>
                          <CaretUpOutlined />
                          <CaretDownOutlined />
                        </span>
                      </th>
                      <th>
                        Số điện thoại
                        <span className={styles.sortIcons}>
                          <CaretUpOutlined />
                          <CaretDownOutlined />
                        </span>
                      </th>
                      <th>
                        Email
                        <span className={styles.sortIcons}>
                          <CaretUpOutlined />
                          <CaretDownOutlined />
                        </span>
                      </th>
                      <th>
                        Hành động
                        <span className={styles.sortIcons}>
                          <CaretUpOutlined />
                          <CaretDownOutlined />
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={user.taiKhoan}>
                        <td>{indexOfFirstUser + index + 1}</td>
                        <td>
                          <div className={styles.avatar}>
                            {user.hoTen.charAt(0).toUpperCase()}
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${user.maLoaiNguoiDung === 'GV' ? styles.badgeAdmin : styles.badgeUser}`}>
                            {user.taiKhoan}
                          </span>
                        </td>
                        <td>{user.hoTen}</td>
                        <td>{user.soDT}</td>
                        <td>{user.email}</td>
                        <td>
                          <div className={styles.actions}>
                            <button 
                              className={styles.viewBtn} 
                              title="Xem khóa học đã đăng ký"
                              onClick={() => handleViewCourses(user)}
                            >
                              <EyeOutlined />
                            </button>
                            <button 
                              className={styles.editBtn} 
                              title="Sửa"
                              onClick={() => handleOpenEditModal(user)}
                            >
                              <EditOutlined />
                            </button>
                            <button 
                              className={styles.deleteBtn} 
                              title="Xóa"
                              onClick={() => handleDelete(user)}
                            >
                              <DeleteOutlined />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleCloseModal}>×</button>
            <h2 className={styles.modalTitle}>
              {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
            </h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input 
                  type="text" 
                  placeholder="Họ và tên" 
                  className={styles.input}
                  value={formData.hoTen}
                  onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <input 
                  type="text" 
                  placeholder="Tài khoản" 
                  className={styles.input}
                  value={formData.taiKhoan}
                  onChange={(e) => setFormData({ ...formData, taiKhoan: e.target.value })}
                  disabled={!!editingUser}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.passwordWrapper}>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder={editingUser ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
                    className={styles.input}
                    value={formData.matKhau}
                    onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                    required={!editingUser}
                  />
                  <button 
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className={styles.input}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <input 
                  type="tel" 
                  placeholder="Số điện thoại" 
                  className={styles.input}
                  value={formData.soDT}
                  onChange={(e) => setFormData({ ...formData, soDT: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <select 
                  className={styles.input}
                  value={formData.maLoaiNguoiDung}
                  onChange={(e) => setFormData({ ...formData, maLoaiNguoiDung: e.target.value })}
                >
                  <option value="HV">Học viên (HV)</option>
                  <option value="GV">Giáo viên (GV)</option>
                </select>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : (editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3 className={styles.modalTitle}>Xóa người dùng</h3>
            <p className={styles.modalMessage}>
              Bạn có chắc chắn muốn xóa người dùng này không?
            </p>
            <p className={styles.modalCourseName}>{deletingUser.hoTen}</p>
            <div className={styles.modalActions}>
              <button onClick={cancelDelete} className={styles.cancelBtn}>
                Không
              </button>
              <button onClick={confirmDelete} className={styles.confirmBtn}>
                Xóa
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

      {/* Courses Modal */}
      {showCoursesModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.coursesModal}`}>
            <div className={styles.modalIcon}>📚</div>
            <h3 className={styles.modalTitle}>Khóa học đã đăng ký</h3>
            {viewingUser && (
              <p className={styles.modalUserName}>
                Người dùng: <strong>{viewingUser.hoTen}</strong> ({viewingUser.taiKhoan})
              </p>
            )}
            
            {loadingCourses ? (
              <div className={styles.loadingCourses}>Đang tải...</div>
            ) : (
              <>
                {userCourses.length === 0 ? (
                  <p className={styles.noCourses}>Người dùng chưa đăng ký khóa học nào</p>
                ) : (
                  <div className={styles.coursesList}>
                    <table className={styles.coursesTable}>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã khóa học</th>
                          <th>Tên khóa học</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userCourses.map((course, index) => (
                          <tr key={course.maKhoaHoc || index}>
                            <td>{index + 1}</td>
                            <td>{course.maKhoaHoc}</td>
                            <td>{course.tenKhoaHoc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className={styles.totalCourses}>
                      Tổng số: <strong>{userCourses.length}</strong> khóa học
                    </p>
                  </div>
                )}
              </>
            )}
            
            <div className={styles.modalActions}>
              <button onClick={closeCoursesModal} className={styles.confirmBtn}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
