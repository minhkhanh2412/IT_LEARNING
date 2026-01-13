'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined, SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined, UserAddOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { enrollmentService } from '@/services/enrollmentService';
import { userService } from '@/services/userService';
import { UserCourse } from '@/types/enrollment';
import styles from './user-enrollment.module.scss';

export default function UserCoursesPage() {
  const params = useParams();
  const router = useRouter();
  // Next.js tự động decode URL params, nhưng đảm bảo decode nếu cần
  const taiKhoan = decodeURIComponent(params.taiKhoan as string);

  // Thông tin người dùng
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Dữ liệu khóa học
  const [notEnrolledCourses, setNotEnrolledCourses] = useState<UserCourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<UserCourse[]>([]);
  const [pendingCourses, setPendingCourses] = useState<UserCourse[]>([]);

  // Trạng thái đang tải từng bảng
  const [loadingNotEnrolled, setLoadingNotEnrolled] = useState(false);
  const [loadingEnrolled, setLoadingEnrolled] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);

  // Tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // Thông báo
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Modal xác nhận
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: 'approve' | 'cancel' | 'direct-enroll';
    courseName: string;
    maKhoaHoc: string;
  }>({
    show: false,
    type: 'approve',
    courseName: '',
    maKhoaHoc: '',
  });

  // Trạng thái phân trang
  const [notEnrolledPage, setNotEnrolledPage] = useState(1);
  const [enrolledPage, setEnrolledPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  
  // Số item mỗi trang
  const itemsPerPage = {
    notEnrolled: 10,
    enrolled: 10,
    pending: 10,
  };

  // Kiểm tra quyền admin và load data
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    const isAdmin =
      user?.maLoaiNguoiDung === 'GV' ||
      user?.taiKhoan?.toLowerCase().includes('admin') ||
      user?.taiKhoan?.toLowerCase().includes('teacher') ||
      user?.taiKhoan?.toLowerCase().includes('gv');

    if (!isAdmin) {
      router.push('/');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin người dùng
        const users = await userService.getAllUsers();
        const currentUser = users.find((u) => u.taiKhoan === taiKhoan);
        if (currentUser) {
          setUserName(currentUser.hoTen);
        }

        // Lấy tất cả danh sách khóa học
        const [notEnrolled, enrolled, pending] = await Promise.all([
          enrollmentService.getUserCoursesNotEnrolled(taiKhoan),
          enrollmentService.getUserCoursesEnrolled(taiKhoan),
          enrollmentService.getUserCoursesPending(taiKhoan),
        ]);

        setNotEnrolledCourses(notEnrolled);
        setEnrolledCourses(enrolled);
        setPendingCourses(pending);
      } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('Có lỗi khi tải dữ liệu', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taiKhoan]);

  // Tải lại từng phần riêng lẻ
  const fetchNotEnrolledCourses = async () => {
    setLoadingNotEnrolled(true);
    try {
      const data = await enrollmentService.getUserCoursesNotEnrolled(taiKhoan);
      setNotEnrolledCourses(data);
    } catch (error) {
      console.error('Error fetching not enrolled courses:', error);
      setNotEnrolledCourses([]);
    } finally {
      setLoadingNotEnrolled(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    setLoadingEnrolled(true);
    try {
      const data = await enrollmentService.getUserCoursesEnrolled(taiKhoan);
      setEnrolledCourses(data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setEnrolledCourses([]);
    } finally {
      setLoadingEnrolled(false);
    }
  };

  const fetchPendingCourses = async () => {
    setLoadingPending(true);
    try {
      const data = await enrollmentService.getUserCoursesPending(taiKhoan);
      setPendingCourses(data);
    } catch (error) {
      console.error('Error fetching pending courses:', error);
      setPendingCourses([]);
    } finally {
      setLoadingPending(false);
    }
  };

  // Hiển thị thông báo
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Hàm lọc khóa học
  const filterCourses = useCallback(
    (courses: UserCourse[]) => {
      if (!searchTerm) return courses;
      const term = searchTerm.toLowerCase();
      return courses.filter(
        (c) =>
          c.tenKhoaHoc?.toLowerCase().includes(term) ||
          c.maKhoaHoc.toLowerCase().includes(term)
      );
    },
    [searchTerm]
  );

  const filteredNotEnrolled = filterCourses(notEnrolledCourses);
  const filteredEnrolled = filterCourses(enrolledCourses);
  const filteredPending = filterCourses(pendingCourses);

  // Phân trang dữ liệu
  const paginateData = <T,>(data: T[], page: number, perPage: number) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number, perPage: number) =>
    Math.ceil(totalItems / perPage);

  // Xử lý ghi danh trực tiếp từ danh sách chưa ghi danh
  const handleDirectEnroll = async () => {
    try {
      await enrollmentService.approveEnrollment(
        confirmModal.maKhoaHoc,
        taiKhoan
      );
      showNotification('Ghi danh trực tiếp thành công!', 'success');
      setConfirmModal({ show: false, type: 'direct-enroll', courseName: '', maKhoaHoc: '' });
      
      // Refresh data
      await Promise.all([fetchNotEnrolledCourses(), fetchEnrolledCourses()]);
    } catch (error) {
      console.error('Error direct enrolling:', error);
      showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
    }
  };

  // Xử lý duyệt khóa học từ danh sách chờ duyệt
  const handleApprovePending = async () => {
    try {
      await enrollmentService.approveEnrollment(
        confirmModal.maKhoaHoc,
        taiKhoan
      );
      showNotification('Duyệt khóa học thành công!', 'success');
      setConfirmModal({ show: false, type: 'approve', courseName: '', maKhoaHoc: '' });
      
      // Refresh data
      await Promise.all([fetchPendingCourses(), fetchEnrolledCourses()]);
    } catch (error) {
      console.error('Error approving enrollment:', error);
      showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
    }
  };

  // Xử lý hủy ghi danh từ danh sách đã ghi danh
  const handleCancelEnrollment = async () => {
    try {
      await enrollmentService.cancelEnrollment(
        confirmModal.maKhoaHoc,
        taiKhoan
      );
      showNotification('Hủy ghi danh thành công!', 'success');
      setConfirmModal({ show: false, type: 'cancel', courseName: '', maKhoaHoc: '' });
      
      // Refresh data
      await Promise.all([fetchEnrolledCourses(), fetchNotEnrolledCourses()]);
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
    }
  };

  const handleConfirm = () => {
    switch (confirmModal.type) {
      case 'direct-enroll':
        handleDirectEnroll();
        break;
      case 'approve':
        handleApprovePending();
        break;
      case 'cancel':
        handleCancelEnrollment();
        break;
    }
  };

  if (loading) {
    return <LoadingSpinner size={200} text="Đang tải dữ liệu..." />;
  }

  return (
    <>
      <Sidebar />
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      
      <div className="mainLayout">
        <main className={styles.main}>
          <div className="container">
            {/* Header */}
            <div className={styles.header}>
              <Link href="/admin/users" className={styles.backLink}>
                <ArrowLeftOutlined /> Quay lại
              </Link>
              <div className={styles.userInfo}>
                <h1 className={styles.title}>Quản lý khóa học của người dùng</h1>
                <div className={styles.userDetail}>
                  <div className={styles.avatar}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={styles.userName}>{userName}</p>
                    <p className={styles.userAccount}>@{taiKhoan}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className={styles.searchBar}>
              <SearchOutlined className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Statistics */}
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📙</div>
                <div>
                  <p className={styles.statValue}>{filteredNotEnrolled.length}</p>
                  <p className={styles.statLabel}>Chưa ghi danh</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📗</div>
                <div>
                  <p className={styles.statValue}>{filteredEnrolled.length}</p>
                  <p className={styles.statLabel}>Đã ghi danh</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📘</div>
                <div>
                  <p className={styles.statValue}>{filteredPending.length}</p>
                  <p className={styles.statLabel}>Chờ duyệt</p>
                </div>
              </div>
            </div>

            {/* Khóa học chưa ghi danh */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                📙 Khóa học chưa ghi danh ({filteredNotEnrolled.length})
              </h2>
              {loadingNotEnrolled ? (
                <div className={styles.loading}>Đang tải...</div>
              ) : filteredNotEnrolled.length === 0 ? (
                <p className={styles.empty}>Không có khóa học nào.</p>
              ) : (
                <>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã khóa học</th>
                          <th>Tên khóa học</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateData(filteredNotEnrolled, notEnrolledPage, itemsPerPage.notEnrolled).map(
                          (course, index) => (
                            <tr key={course.maKhoaHoc}>
                              <td>{(notEnrolledPage - 1) * itemsPerPage.notEnrolled + index + 1}</td>
                              <td>
                                <span className={styles.courseCode}>{course.maKhoaHoc}</span>
                              </td>
                              <td>{course.tenKhoaHoc}</td>
                              <td>
                                <div className={styles.actions}>
                                  <Link
                                    href={`/courses/${encodeURIComponent(course.maKhoaHoc)}`}
                                    className={styles.detailBtn}
                                    title="Xem chi tiết"
                                  >
                                    <EyeOutlined />
                                  </Link>
                                  <button
                                    className={styles.enrollBtn}
                                    title="Ghi danh trực tiếp"
                                    onClick={() =>
                                      setConfirmModal({
                                        show: true,
                                        type: 'direct-enroll',
                                        courseName: course.tenKhoaHoc,
                                        maKhoaHoc: course.maKhoaHoc,
                                      })
                                    }
                                  >
                                    <UserAddOutlined />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled) > 1 && (
                    <div className={styles.pagination}>
                      {Array.from(
                        { length: getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          className={`${styles.pageBtn} ${notEnrolledPage === page ? styles.active : ''}`}
                          onClick={() => setNotEnrolledPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Khóa học đã ghi danh */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                📗 Khóa học đã ghi danh ({filteredEnrolled.length})
              </h2>
              {loadingEnrolled ? (
                <div className={styles.loading}>Đang tải...</div>
              ) : filteredEnrolled.length === 0 ? (
                <p className={styles.empty}>Không có khóa học nào.</p>
              ) : (
                <>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã khóa học</th>
                          <th>Tên khóa học</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateData(filteredEnrolled, enrolledPage, itemsPerPage.enrolled).map(
                          (course, index) => (
                            <tr key={course.maKhoaHoc}>
                              <td>{(enrolledPage - 1) * itemsPerPage.enrolled + index + 1}</td>
                              <td>
                                <span className={styles.courseCode}>{course.maKhoaHoc}</span>
                              </td>
                              <td>{course.tenKhoaHoc}</td>
                              <td>
                                <div className={styles.actions}>
                                  <Link
                                    href={`/courses/${encodeURIComponent(course.maKhoaHoc)}`}
                                    className={styles.detailBtn}
                                    title="Xem chi tiết"
                                  >
                                    <EyeOutlined />
                                  </Link>
                                  <button
                                    className={styles.cancelBtn}
                                    title="Hủy ghi danh"
                                    onClick={() =>
                                      setConfirmModal({
                                        show: true,
                                        type: 'cancel',
                                        courseName: course.tenKhoaHoc,
                                        maKhoaHoc: course.maKhoaHoc,
                                      })
                                    }
                                  >
                                    <CloseOutlined />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {getTotalPages(filteredEnrolled.length, itemsPerPage.enrolled) > 1 && (
                    <div className={styles.pagination}>
                      {Array.from(
                        { length: getTotalPages(filteredEnrolled.length, itemsPerPage.enrolled) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          className={`${styles.pageBtn} ${enrolledPage === page ? styles.active : ''}`}
                          onClick={() => setEnrolledPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Khóa học chờ duyệt */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                📘 Khóa học chờ duyệt ({filteredPending.length})
              </h2>
              {loadingPending ? (
                <div className={styles.loading}>Đang tải...</div>
              ) : filteredPending.length === 0 ? (
                <p className={styles.empty}>Không có khóa học nào.</p>
              ) : (
                <>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã khóa học</th>
                          <th>Tên khóa học</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginateData(filteredPending, pendingPage, itemsPerPage.pending).map(
                          (course, index) => (
                            <tr key={course.maKhoaHoc}>
                              <td>{(pendingPage - 1) * itemsPerPage.pending + index + 1}</td>
                              <td>
                                <span className={styles.courseCode}>{course.maKhoaHoc}</span>
                              </td>
                              <td>{course.tenKhoaHoc}</td>
                              <td>
                                <div className={styles.actions}>
                                  <Link
                                    href={`/courses/${encodeURIComponent(course.maKhoaHoc)}`}
                                    className={styles.detailBtn}
                                    title="Xem chi tiết"
                                  >
                                    <EyeOutlined />
                                  </Link>
                                  <button
                                    className={styles.approveBtn}
                                    title="Duyệt khóa học"
                                    onClick={() =>
                                      setConfirmModal({
                                        show: true,
                                        type: 'approve',
                                        courseName: course.tenKhoaHoc,
                                        maKhoaHoc: course.maKhoaHoc,
                                      })
                                    }
                                  >
                                    <CheckOutlined />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {getTotalPages(filteredPending.length, itemsPerPage.pending) > 1 && (
                    <div className={styles.pagination}>
                      {Array.from(
                        { length: getTotalPages(filteredPending.length, itemsPerPage.pending) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          className={`${styles.pageBtn} ${pendingPage === page ? styles.active : ''}`}
                          onClick={() => setPendingPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              {confirmModal.type === 'direct-enroll' && '📝'}
              {confirmModal.type === 'approve' && '✅'}
              {confirmModal.type === 'cancel' && '⚠️'}
            </div>
            <h3 className={styles.modalTitle}>
              {confirmModal.type === 'direct-enroll' && 'Ghi danh trực tiếp'}
              {confirmModal.type === 'approve' && 'Duyệt khóa học'}
              {confirmModal.type === 'cancel' && 'Hủy ghi danh'}
            </h3>
            <p className={styles.modalMessage}>
              {confirmModal.type === 'direct-enroll' &&
                'Bạn có chắc chắn muốn ghi danh người dùng này vào khóa học?'}
              {confirmModal.type === 'approve' &&
                'Bạn có chắc chắn muốn duyệt đăng ký khóa học này?'}
              {confirmModal.type === 'cancel' &&
                'Bạn có chắc chắn muốn hủy ghi danh khóa học này?'}
            </p>
            <p className={styles.modalCourseName}>{confirmModal.courseName}</p>
            <div className={styles.modalActions}>
              <button
                onClick={() =>
                  setConfirmModal({ show: false, type: 'approve', courseName: '', maKhoaHoc: '' })
                }
                className={styles.modalCancelBtn}
              >
                Hủy
              </button>
              <button onClick={handleConfirm} className={styles.modalConfirmBtn}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
