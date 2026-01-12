'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import { courseService } from '@/services/courseService';
import { Course, EnrolledStudent } from '@/types/course';
import styles from './admin-courses.module.scss';

const gradients = [
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; courseId: string; courseName: string }>({
    show: false,
    courseId: '',
    courseName: ''
  });
  const [viewStudentsModal, setViewStudentsModal] = useState<{ show: boolean; courseId: string; courseName: string }>({
    show: false,
    courseId: '',
    courseName: ''
  });
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const coursesPerPage = 12;

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

    fetchCourses();
  }, [router]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCoursesByGroup('GP01');
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate
  const filteredCourses = courses.filter(course => 
    course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.maKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handleDelete = (courseId: string, courseName: string) => {
    setDeleteModal({ show: true, courseId, courseName });
  };

  const confirmDelete = async () => {
    try {
      console.log('Deleting course:', deleteModal.courseId);
      
      // Kiểm tra token
      const token = localStorage.getItem('ACCESS_TOKEN');
      console.log('Token exists:', !!token);
      
      await courseService.deleteCourse(deleteModal.courseId);
      setDeleteModal({ show: false, courseId: '', courseName: '' });
      
      setNotification({
        show: true,
        title: 'Xóa thành công! ✅',
        message: 'Khóa học đã được xóa khỏi hệ thống.',
        type: 'success'
      });
      
      fetchCourses();
    } catch (error: unknown) {
      console.error('Error deleting course:', error);
      const err = error as { response?: { status?: number; data?: unknown } };
      
      // Lấy message chi tiết từ API response
      let errorMsg = '';
      const apiMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : '';
      
      if (err.response?.status === 401) {
        errorMsg = apiMessage || 'Bạn không có quyền xóa khóa học này! Chỉ người tạo khóa học hoặc admin mới có thể xóa.';
      } else if (err.response?.status === 403) {
        // Hiển thị message từ API nếu có, nếu không thì dùng message mặc định
        if (apiMessage) {
          errorMsg = `Không thể xóa khóa học!\n\n${apiMessage}`;
        } else {
          errorMsg = 'Không thể xóa khóa học này!\n\nLý do: Khóa học đang có học viên đăng ký hoặc bạn không phải là người tạo khóa học.\n\nChỉ có thể xóa khóa học nếu:\n• Bạn là người tạo khóa học\n• Khóa học chưa có học viên nào đăng ký';
        }
      } else if (err.response?.status === 400) {
        errorMsg = apiMessage || 'Không thể xóa khóa học này! Khóa học đang có học viên đăng ký.';
      } else {
        errorMsg = apiMessage || `Xóa khóa học thất bại! Mã lỗi: ${err.response?.status || 'Unknown'}`;
      }
      
      setNotification({
        show: true,
        title: 'Xóa thất bại! ⚠️',
        message: errorMsg,
        type: 'error'
      });
      setDeleteModal({ show: false, courseId: '', courseName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, courseId: '', courseName: '' });
  };

  const handleViewStudents = async (courseId: string, courseName: string) => {
    setViewStudentsModal({ show: true, courseId, courseName });
    setLoadingStudents(true);
    try {
      const students = await courseService.getEnrolledStudents(courseId);
      setEnrolledStudents(students);
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      setEnrolledStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const closeStudentsModal = () => {
    setViewStudentsModal({ show: false, courseId: '', courseName: '' });
    setEnrolledStudents([]);
  };

  return (
    <>
      <Sidebar />
      <div className="mainLayout">
        <main className={styles.main}>
          <div className="container">
            <div className={styles.header}>
              <h1 className={styles.title}>Quản lý khóa học</h1>
              <Link 
                href="/admin/courses/add" 
                className={styles.addButton}
                title="Thêm khóa học mới"
              >
                <PlusOutlined /> Thêm khóa học
              </Link>
            </div>

            <div className={styles.searchBar}>
              <input 
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {loading ? (
              <div className={styles.loading}>Đang tải...</div>
            ) : (
              <>
                <div className={styles.coursesGrid}>
                  {currentCourses.map((course, index) => {
                  const gradientBg = gradients[index % gradients.length];
                  // const userStr = localStorage.getItem('user');
                  // const currentUser = userStr ? JSON.parse(userStr) : null;
                  // Check if user can delete this course
                  // const canDelete = currentUser && (
                  //   course.nguoiTao?.taiKhoan === currentUser.taiKhoan ||
                  //   currentUser.maLoaiNguoiDung === 'GV'
                  // );
                  
                  return (
                    <div key={course.maKhoaHoc} className={styles.courseCard}>
                      <div className={styles.courseImage}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={imageErrors[course.maKhoaHoc] || !course.hinhAnh ? '/assets/img_error.png' : course.hinhAnh}
                          alt={course.tenKhoaHoc}
                          className={styles.courseImg}
                          onError={() => {
                            setImageErrors(prev => ({ ...prev, [course.maKhoaHoc]: true }));
                          }}
                        />
                        <div className={styles.courseOverlay}>
                          <h3 className={styles.courseTitle}>{course.tenKhoaHoc}</h3>
                        </div>
                      </div>
                      <div className={styles.courseBody}>
                        <h4 className={styles.courseName}>{course.tenKhoaHoc}</h4>
                        <p className={styles.courseDesc}>{course.moTa}</p>
                        <div className={styles.actions}>
                          <button 
                            onClick={() => handleViewStudents(course.maKhoaHoc, course.tenKhoaHoc)} 
                            className={styles.viewBtn}
                            title="Xem danh sách học viên"
                          >
                            <EyeOutlined /> 
                          </button>
                          <Link 
                            href={`/admin/courses/edit/${course.maKhoaHoc}`} 
                            className={styles.editBtn}
                            title="Chỉnh sửa khóa học"
                          >
                            <EditOutlined /> 
                          </Link>
                          <button 
                            onClick={() => handleDelete(course.maKhoaHoc, course.tenKhoaHoc)} 
                            className={styles.deleteBtn}
                            title="Xóa khóa học"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
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
              )}
            </>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3 className={styles.modalTitle}>Xóa khóa học</h3>
            <p className={styles.modalMessage}>
              Bạn có chắc chắn xóa khóa học này không?
            </p>
            <p className={styles.modalCourseName}>{deleteModal.courseName}</p>
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
            <p className={styles.modalMessage} style={{ whiteSpace: 'pre-line' }}>{notification.message}</p>
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

      {/* View Students Modal */}
      {viewStudentsModal.show && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.studentsModal}`}>
            <div className={styles.modalIcon}>👥</div>
            <h3 className={styles.modalTitle}>Danh sách học viên</h3>
            <p className={styles.modalCourseName}>{viewStudentsModal.courseName}</p>
            
            {loadingStudents ? (
              <div className={styles.loadingStudents}>Đang tải...</div>
            ) : (
              <>
                {enrolledStudents.length === 0 ? (
                  <p className={styles.noStudents}>Chưa có học viên nào đăng ký khóa học này</p>
                ) : (
                  <div className={styles.studentsList}>
                    <table className={styles.studentsTable}>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Tài khoản</th>
                          <th>Họ tên</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrolledStudents.map((student, index) => (
                          <tr key={student.taiKhoan}>
                            <td>{index + 1}</td>
                            <td>{student.taiKhoan}</td>
                            <td>{student.hoTen}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className={styles.totalStudents}>
                      Tổng số: <strong>{enrolledStudents.length}</strong> học viên
                    </p>
                  </div>
                )}
              </>
            )}
            
            <div className={styles.modalActions}>
              <button onClick={closeStudentsModal} className={styles.confirmBtn}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
