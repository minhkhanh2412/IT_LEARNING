'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { enrollmentService } from '@/services/enrollmentService';
import { courseService } from '@/services/courseService';
import {
  EnrolledStudent,
  PendingStudent,
  NotEnrolledUser,
} from '@/types/enrollment';
import styles from './enrollment.module.scss';

export default function CourseEnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  // Decode URL param để xử lý mã khóa học có khoảng trắng hoặc ký tự đặc biệt
  const maKhoaHoc = decodeURIComponent(params.maKhoaHoc as string);

  // Thông tin khóa học
  const [courseName, setCourseName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Dữ liệu học viên
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
  const [notEnrolledUsers, setNotEnrolledUsers] = useState<NotEnrolledUser[]>([]);

  // Trạng thái đang tải
  const [loadingEnrolled, setLoadingEnrolled] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingNotEnrolled, setLoadingNotEnrolled] = useState(false);

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
    studentName: string;
    taiKhoan: string;
  }>({
    show: false,
    type: 'approve',
    studentName: '',
    taiKhoan: '',
  });

  // Trạng thái phân trang
  const [enrolledPage, setEnrolledPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [notEnrolledPage, setNotEnrolledPage] = useState(1);
  const [jumpPage, setJumpPage] = useState(''); // Ô nhập trang để nhảy
  
  // Số item mỗi trang (riêng cho từng bảng)
  const itemsPerPage = {
    enrolled: 10,
    pending: 10,
    notEnrolled: 10,
  };

  // Kiểm tra quyền admin
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

    // Tải dữ liệu trực tiếp trong useEffect để tránh vòng lặp vô hạn
    const loadData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin khóa học
        const courseData = await courseService.getCourseDetail(maKhoaHoc);
        setCourseName(courseData.tenKhoaHoc);

        // Lấy tất cả danh sách song song
        const [enrolled, pending, notEnrolled] = await Promise.all([
          enrollmentService.getEnrolledStudents(maKhoaHoc),
          enrollmentService.getPendingStudents(maKhoaHoc),
          enrollmentService.getNotEnrolledUsers(maKhoaHoc),
        ]);

        setEnrolledStudents(enrolled);
        setPendingStudents(pending);
        setNotEnrolledUsers(notEnrolled);
      } catch (error) {
        console.error('Error fetching data:', error);
        showNotification('Có lỗi khi tải dữ liệu', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maKhoaHoc]); // Chỉ chạy lại khi maKhoaHoc thay đổi

  // Tải lại tất cả dữ liệu (dùng để refresh sau khi thực hiện hành động)
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch course info
      const courseData = await courseService.getCourseDetail(maKhoaHoc);
      setCourseName(courseData.tenKhoaHoc);

      // Fetch all lists in parallel
      const [enrolled, pending, notEnrolled] = await Promise.all([
        enrollmentService.getEnrolledStudents(maKhoaHoc),
        enrollmentService.getPendingStudents(maKhoaHoc),
        enrollmentService.getNotEnrolledUsers(maKhoaHoc),
      ]);

      setEnrolledStudents(enrolled);
      setPendingStudents(pending);
      setNotEnrolledUsers(notEnrolled);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Có lỗi khi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Tải từng phần riêng lẻ (để refresh sau khi thực hiện hành động)
  const fetchEnrolledStudents = async () => {
    setLoadingEnrolled(true);
    try {
      const data = await enrollmentService.getEnrolledStudents(maKhoaHoc);
      setEnrolledStudents(data);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      setEnrolledStudents([]);
    } finally {
      setLoadingEnrolled(false);
    }
  };

  const fetchPendingStudents = async () => {
    setLoadingPending(true);
    try {
      const data = await enrollmentService.getPendingStudents(maKhoaHoc);
      setPendingStudents(data);
    } catch (error) {
      console.error('Error fetching pending students:', error);
      setPendingStudents([]);
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchNotEnrolledUsers = async () => {
    setLoadingNotEnrolled(true);
    try {
      const data = await enrollmentService.getNotEnrolledUsers(maKhoaHoc);
      setNotEnrolledUsers(data);
    } catch (error) {
      console.error('Error fetching not enrolled users:', error);
      setNotEnrolledUsers([]);
    } finally {
      setLoadingNotEnrolled(false);
    }
  };

  // Hiển thị thông báo
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Hàm lọc học viên
  const filterStudents = useCallback(
    <T extends { hoTen?: string; taiKhoan: string }>(students: T[]) => {
      if (!searchTerm) return students;
      const term = searchTerm.toLowerCase();
      return students.filter(
        (s) =>
          s.hoTen?.toLowerCase().includes(term) ||
          s.taiKhoan.toLowerCase().includes(term)
      );
    },
    [searchTerm]
  );

  const filteredEnrolled = filterStudents(enrolledStudents);
  const filteredPending = filterStudents(pendingStudents);
  const filteredNotEnrolled = filterStudents(notEnrolledUsers);

  // Phân trang dữ liệu
  const paginateData = <T,>(data: T[], page: number, perPage: number) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number, perPage: number) =>
    Math.ceil(totalItems / perPage);

  // Xử lý duyệt học viên
  const handleApprove = async () => {
    try {
      await enrollmentService.approveEnrollment(
        maKhoaHoc,
        confirmModal.taiKhoan
      );
      showNotification('Duyệt học viên thành công!', 'success');
      setConfirmModal({ show: false, type: 'approve', studentName: '', taiKhoan: '' });
      
      // Tải lại dữ liệu
      await Promise.all([fetchEnrolledStudents(), fetchPendingStudents()]);
    } catch (error) {
      console.error('Error approving enrollment:', error);
      showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
    }
  };

  // Xử lý hủy ghi danh
  const handleCancel = async () => {
    try {
      await enrollmentService.cancelEnrollment(
        maKhoaHoc,
        confirmModal.taiKhoan
      );
      showNotification('Hủy ghi danh thành công!', 'success');
      setConfirmModal({ show: false, type: 'cancel', studentName: '', taiKhoan: '' });
      
      // Refresh data
      await Promise.all([fetchEnrolledStudents(), fetchNotEnrolledUsers()]);
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
    }
  };

  // Xử lý ghi danh trực tiếp
  const handleDirectEnroll = async () => {
    try {
      await enrollmentService.approveEnrollment(
        maKhoaHoc,
        confirmModal.taiKhoan
      );
      showNotification('Ghi danh trực tiếp thành công!', 'success');
      setConfirmModal({ show: false, type: 'direct-enroll', studentName: '', taiKhoan: '' });
      
      // Refresh data
      await Promise.all([fetchEnrolledStudents(), fetchNotEnrolledUsers()]);
    } catch (error) {
      console.error('Error direct enrolling:', error);
      showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
    }
  };

  const handleConfirm = () => {
    switch (confirmModal.type) {
      case 'approve':
        handleApprove();
        break;
      case 'cancel':
        handleCancel();
        break;
      case 'direct-enroll':
        handleDirectEnroll();
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
              <div className={styles.headerLeft}>
                <Link href="/admin/courses" className={styles.backButton}>
                  <ArrowLeftOutlined /> Quay lại
                </Link>
                <h1 className={styles.title}>Quản lý ghi danh: {courseName}</h1>
              </div>
            </div>

            {/* Search bar */}
            <div className={styles.searchBar}>
              <SearchOutlined className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc tài khoản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* SECTION 1: Đã ghi danh */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                  📗 Đã ghi danh
                  <span className={styles.badge}>
                    {filteredEnrolled.length}/{enrolledStudents.length}
                  </span>
                </div>
              </div>

              {loadingEnrolled ? (
                <div className={styles.emptyState}>Đang tải...</div>
              ) : filteredEnrolled.length === 0 ? (
                <div className={styles.emptyState}>
                  {searchTerm
                    ? 'Không tìm thấy học viên nào'
                    : 'Chưa có học viên nào được ghi danh'}
                </div>
              ) : (
                <>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ảnh</th>
                        <th>Tài khoản</th>
                        <th>Họ tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginateData(filteredEnrolled, enrolledPage, itemsPerPage.enrolled).map(
                        (student, index) => (
                          <tr key={student.taiKhoan}>
                            <td>
                              {(enrolledPage - 1) * itemsPerPage.enrolled + index + 1}
                            </td>
                            <td>
                              <div className={styles.avatarWrapper}>
                                <UserOutlined className={styles.avatarIcon} />
                              </div>
                            </td>
                            <td>{student.taiKhoan}</td>
                            <td>{student.hoTen}</td>
                            <td>{student.soDT || '-'}</td>
                            <td>{student.email || '-'}</td>
                            <td>
                              <button
                                className={styles.cancelButton}
                                onClick={() =>
                                  setConfirmModal({
                                    show: true,
                                    type: 'cancel',
                                    studentName: student.hoTen,
                                    taiKhoan: student.taiKhoan,
                                  })
                                }
                              >
                                Hủy ghi danh
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {getTotalPages(filteredEnrolled.length, itemsPerPage.enrolled) > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.pageButton}
                        onClick={() => setEnrolledPage((p) => Math.max(1, p - 1))}
                        disabled={enrolledPage === 1}
                      >
                        ‹
                      </button>
                      {Array.from(
                        { length: getTotalPages(filteredEnrolled.length, itemsPerPage.enrolled) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          className={`${styles.pageButton} ${
                            page === enrolledPage ? styles.active : ''
                          }`}
                          onClick={() => setEnrolledPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        className={styles.pageButton}
                        onClick={() =>
                          setEnrolledPage((p) =>
                            Math.min(getTotalPages(filteredEnrolled.length, itemsPerPage.enrolled), p + 1)
                          )
                        }
                        disabled={
                          enrolledPage === getTotalPages(filteredEnrolled.length, itemsPerPage.enrolled)
                        }
                      >
                        ›
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* SECTION 2: Chờ xét duyệt */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                  📙 Chờ xét duyệt
                  <span className={styles.badge}>
                    {filteredPending.length}/{pendingStudents.length}
                  </span>
                </div>
              </div>

              {loadingPending ? (
                <div className={styles.emptyState}>Đang tải...</div>
              ) : filteredPending.length === 0 ? (
                <div className={styles.emptyState}>
                  {searchTerm
                    ? 'Không tìm thấy học viên nào'
                    : 'Không có học viên nào đang chờ xét duyệt'}
                </div>
              ) : (
                <>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ảnh</th>
                        <th>Tài khoản</th>
                        <th>Họ tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginateData(filteredPending, pendingPage, itemsPerPage.pending).map(
                        (student, index) => (
                          <tr key={student.taiKhoan}>
                            <td>
                              {(pendingPage - 1) * itemsPerPage.pending + index + 1}
                            </td>
                            <td>
                              <div className={styles.avatarWrapper}>
                                <UserOutlined className={styles.avatarIcon} />
                              </div>
                            </td>
                            <td>{student.taiKhoan}</td>
                            <td>{student.hoTen}</td>
                            <td>{student.soDT || '-'}</td>
                            <td>{student.email || '-'}</td>
                            <td>
                              <button
                                className={styles.approveButton}
                                onClick={() =>
                                  setConfirmModal({
                                    show: true,
                                    type: 'approve',
                                    studentName: student.hoTen,
                                    taiKhoan: student.taiKhoan,
                                  })
                                }
                              >
                                Duyệt
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {getTotalPages(filteredPending.length, itemsPerPage.pending) > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.pageButton}
                        onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                        disabled={pendingPage === 1}
                      >
                        ‹
                      </button>
                      {Array.from(
                        { length: getTotalPages(filteredPending.length, itemsPerPage.pending) },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          className={`${styles.pageButton} ${
                            page === pendingPage ? styles.active : ''
                          }`}
                          onClick={() => setPendingPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        className={styles.pageButton}
                        onClick={() =>
                          setPendingPage((p) =>
                            Math.min(getTotalPages(filteredPending.length, itemsPerPage.pending), p + 1)
                          )
                        }
                        disabled={
                          pendingPage === getTotalPages(filteredPending.length, itemsPerPage.pending)
                        }
                      >
                        ›
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* SECTION 3: Chưa ghi danh */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                  📘 Chưa ghi danh
                  <span className={styles.badge}>
                    {filteredNotEnrolled.length}/{notEnrolledUsers.length}
                  </span>
                </div>
              </div>

              {loadingNotEnrolled ? (
                <div className={styles.emptyState}>Đang tải...</div>
              ) : filteredNotEnrolled.length === 0 ? (
                <div className={styles.emptyState}>
                  {searchTerm
                    ? 'Không tìm thấy người dùng nào'
                    : 'Tất cả người dùng đã ghi danh'}
                </div>
              ) : (
                <>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Ảnh</th>
                        <th>Tài khoản</th>
                        <th>Họ tên</th>
                        <th>Số điện thoại</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginateData(filteredNotEnrolled, notEnrolledPage, itemsPerPage.notEnrolled).map(
                        (user, index) => (
                          <tr key={user.taiKhoan}>
                            <td>
                              {(notEnrolledPage - 1) * itemsPerPage.notEnrolled + index + 1}
                            </td>
                            <td>
                              <div className={styles.avatarWrapper}>
                                <UserOutlined className={styles.avatarIcon} />
                              </div>
                            </td>
                            <td>{user.taiKhoan}</td>
                            <td>{user.hoTen || user.biDanh}</td>
                            <td>{user.soDT || '-'}</td>
                            <td>
                              <button
                                className={styles.enrollButton}
                                onClick={() =>
                                  setConfirmModal({
                                    show: true,
                                    type: 'direct-enroll',
                                    studentName: user.hoTen || user.biDanh,
                                    taiKhoan: user.taiKhoan,
                                  })
                                }
                              >
                                Ghi danh trực tiếp
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled) > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.pageButton}
                        onClick={() =>
                          setNotEnrolledPage((p) => Math.max(1, p - 1))
                        }
                        disabled={notEnrolledPage === 1}
                      >
                        ‹‹
                      </button>
                      {(() => {
                        const totalPages = getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled);
                        const pages = [];
                        const showEllipsis = totalPages > 7;
                        
                        if (!showEllipsis) {
                          // Hiển thị tất cả nếu <= 7 trang
                          for (let i = 1; i <= totalPages; i++) {
                            pages.push(i);
                          }
                        } else {
                          // Logic hiển thị thông minh cho nhiều trang
                          if (notEnrolledPage <= 4) {
                            // Đầu: 1 2 3 4 5 ... last
                            pages.push(1, 2, 3, 4, 5, -1, totalPages);
                          } else if (notEnrolledPage >= totalPages - 3) {
                            // Cuối: 1 ... last-4 last-3 last-2 last-1 last
                            pages.push(1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                          } else {
                            // Giữa: 1 ... current-1 current current+1 ... last
                            pages.push(1, -1, notEnrolledPage - 1, notEnrolledPage, notEnrolledPage + 1, -2, totalPages);
                          }
                        }
                        
                        return pages.map((page, idx) => {
                          if (page === -1 || page === -2) {
                            return <span key={`ellipsis-${idx}`} className={styles.ellipsis}>...</span>;
                          }
                          return (
                            <button
                              key={page}
                              className={`${styles.pageButton} ${
                                page === notEnrolledPage ? styles.active : ''
                              }`}
                              onClick={() => setNotEnrolledPage(page)}
                            >
                              {page}
                            </button>
                          );
                        });
                      })()}
                      <button
                        className={styles.pageButton}
                        onClick={() =>
                          setNotEnrolledPage((p) =>
                            Math.min(
                              getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled),
                              p + 1
                            )
                          )
                        }
                        disabled={
                          notEnrolledPage ===
                          getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled)
                        }
                      >
                        ››
                      </button>
                      <div className={styles.jumpToPage}>
                        <span>Đến trang:</span>
                        <input
                          type="number"
                          min="1"
                          max={getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled)}
                          value={jumpPage}
                          onChange={(e) => setJumpPage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const page = parseInt(jumpPage);
                              const maxPage = getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled);
                              if (page >= 1 && page <= maxPage) {
                                setNotEnrolledPage(page);
                                setJumpPage('');
                              }
                            }
                          }}
                          placeholder="#"
                          className={styles.jumpInput}
                        />
                        <button
                          className={styles.jumpButton}
                          onClick={() => {
                            const page = parseInt(jumpPage);
                            const maxPage = getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled);
                            if (page >= 1 && page <= maxPage) {
                              setNotEnrolledPage(page);
                              setJumpPage('');
                            }
                          }}
                          disabled={!jumpPage || parseInt(jumpPage) < 1 || parseInt(jumpPage) > getTotalPages(filteredNotEnrolled.length, itemsPerPage.notEnrolled)}
                        >
                          Đi
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              {confirmModal.type === 'approve' ? '✅' : '⚠️'}
            </div>
            <h3 className={styles.modalTitle}>
              {confirmModal.type === 'approve' && 'Xác nhận duyệt học viên'}
              {confirmModal.type === 'cancel' && 'Xác nhận hủy ghi danh'}
              {confirmModal.type === 'direct-enroll' && 'Ghi danh trực tiếp'}
            </h3>
            <p className={styles.modalMessage}>
              {confirmModal.type === 'approve' &&
                `Bạn có chắc muốn duyệt học viên "${confirmModal.studentName}" vào khóa học này?`}
              {confirmModal.type === 'cancel' &&
                `Bạn có chắc muốn hủy ghi danh học viên "${confirmModal.studentName}" khỏi khóa học này?`}
              {confirmModal.type === 'direct-enroll' &&
                `Học viên "${confirmModal.studentName}" chưa đăng ký khóa học. Bạn có chắc muốn ghi danh trực tiếp?`}
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    type: 'approve',
                    studentName: '',
                    taiKhoan: '',
                  })
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
