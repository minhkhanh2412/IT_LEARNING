'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import { User } from '@/types/user';
import { Course } from '@/types/course';
import styles from './profile.module.scss';

const gradients = [
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [notification, setNotification] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({show: false, message: '', type: 'success'});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToUnenroll, setCourseToUnenroll] = useState<string | null>(null);

  useEffect(() => {
    // Tải thông tin user từ localStorage
    const loadUserData = () => {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined') {
          try {
            const userData = JSON.parse(userStr);
            // Move setState to avoid cascading renders
            Promise.resolve().then(() => setUser(userData));
          } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      }
    };

    loadUserData();

    // Lắng nghe sự thay đổi của localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        loadUserData();
      }
    };

    // Lắng nghe custom event để reload user data
    const handleUserUpdate = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, [router]);

  // Fetch enrolled courses từ API
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user) {
        try {
          console.log('=== PROFILE: Fetching courses for user:', user.taiKhoan);
          const { userService } = await import('@/services/userService');
          const courses = await userService.getUserCourses(user.taiKhoan);
          console.log('=== PROFILE: Courses from API:', courses);
          console.log('=== PROFILE: Number of courses:', courses?.length || 0);
          Promise.resolve().then(() => setEnrolledCourses((courses || []) as Course[]));
        } catch (error) {
          console.error('=== PROFILE: Error fetching enrolled courses:', error);
          // Fallback to empty array if error
          setEnrolledCourses([]);
        }
      }
    };

    fetchEnrolledCourses();

    // Listen for courses update event
    const handleCoursesUpdate = () => {
      console.log('=== PROFILE: coursesUpdated event received, reloading...');
      fetchEnrolledCourses();
    };

    window.addEventListener('coursesUpdated', handleCoursesUpdate);

    return () => {
      window.removeEventListener('coursesUpdated', handleCoursesUpdate);
    };
  }, [user]);

  const handleUnenroll = (maKhoaHoc: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCourseToUnenroll(maKhoaHoc);
    setShowConfirmModal(true);
  };

  const confirmUnenroll = async () => {
    if (!user || !courseToUnenroll) return;
    
    setShowConfirmModal(false);
    
    try {
      const { courseService } = await import('@/services/courseService');
      await courseService.unenrollCourse(courseToUnenroll, user.taiKhoan);
      
      // Reload courses
      const { userService } = await import('@/services/userService');
      const courses = await userService.getUserCourses(user.taiKhoan);
      setEnrolledCourses(courses as Course[]);
      
      // Dispatch event để course detail page reload số học viên
      window.dispatchEvent(new Event('coursesUpdated'));
      
      setNotification({show: true, message: 'Hủy đăng ký thành công!', type: 'success'});
      setTimeout(() => setNotification({show: false, message: '', type: 'success'}), 3000);
    } catch (error) {
      console.error('Error unenrolling course:', error);
      setNotification({show: true, message: 'Hủy đăng ký thất bại. Vui lòng thử lại.', type: 'error'});
      setTimeout(() => setNotification({show: false, message: '', type: 'error'}), 3000);
    } finally {
      setCourseToUnenroll(null);
    }
  };

  const handleContinue = (maKhoaHoc: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert('Tính năng học tập đang được phát triển!');
  };

  if (!user) {
    return null;
  }

  const joinDate = new Date(new Date().getTime() - 365 * 2 * 24 * 60 * 60 * 1000); // 2 years ago
  const timeAgo = Math.floor((new Date().getTime() - joinDate.getTime()) / (365 * 24 * 60 * 60 * 1000));

  return (
    <>
      <Sidebar />
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận hủy khóa học"
        message="Bạn có chắc chắn muốn hủy đăng ký khóa học này không?"
        confirmText="Hủy khóa học"
        cancelText="Không, giữ lại"
        onConfirm={confirmUnenroll}
        onCancel={() => setShowConfirmModal(false)}
      />
      <div className="mainLayout">
        <main className={styles.main}>
          {/* Hero Section */}
          <div className={styles.hero}>
            <div className={styles.heroGradient}></div>
            <div className={styles.heroContent}>
              <div className={styles.avatar}>
                {user.hinhAnh ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={user.hinhAnh} 
                    alt={user.hoTen}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  user.hoTen.charAt(0).toUpperCase()
                )}
              </div>
              <h1 className={styles.userName}>{user.hoTen}</h1>
              <p className={styles.userMeta}>
                Đã đăng ký {enrolledCourses.length} khóa học
              </p>
            </div>
          </div>

          <div className="container">
            <div className={styles.content}>
              {/* User Info */}
              <div className={styles.sidebar}>
                <div className={styles.infoCard}>
                  <h3 className={styles.infoTitle}>Giới thiệu</h3>
                  <div className={styles.infoItem}>
                    <UserOutlined className={styles.infoIcon} />
                    <span>Thành viên của <strong>IT - Học lập trình để đi làm</strong> từ {timeAgo} năm trước</span>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3 className={styles.infoTitle}>Hoạt động gần đây</h3>
                  <p className={styles.emptyText}>Chưa có hoạt động gần đây</p>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className={styles.mainContent}>
                <h2 className={styles.sectionTitle}>
                  <BookOutlined style={{ marginRight: '12px' }} />
                  Các khóa học đã tham gia
                </h2>
                
                <div className={styles.coursesGrid}>
                  {enrolledCourses.map((course, index) => {
                    const gradientBg = gradients[index % gradients.length];
                    
                    return (
                      <Link 
                        href={`/courses/${encodeURIComponent(course.maKhoaHoc)}`} 
                        key={course.maKhoaHoc}
                        className={styles.courseCard}
                      >
                        <div className={styles.courseImage} style={{ background: gradientBg }}>
                          <div className={styles.courseIcon}>
                            {course.tenKhoaHoc.includes('C++') && 'C++'}
                            {course.tenKhoaHoc.includes('HTML') && 'HTML'}
                            {course.tenKhoaHoc.includes('IT') && '💻'}
                            {course.tenKhoaHoc.includes('Responsive') && '📱'}
                            {!course.tenKhoaHoc.match(/C\+\+|HTML|IT|Responsive/) && '📚'}
                          </div>
                          <div className={styles.courseOverlay}>
                            <h3 className={styles.courseTitle}>{course.tenKhoaHoc}</h3>
                          </div>
                          <div className={styles.hoverActions}>
                            <button 
                              className={`${styles.actionBtn} ${styles.continueBtn}`}
                              onClick={(e) => handleContinue(course.maKhoaHoc, e)}
                            >
                              Tiếp tục học
                            </button>
                            <button 
                              className={`${styles.actionBtn} ${styles.unenrollBtn}`}
                              onClick={(e) => handleUnenroll(course.maKhoaHoc, e)}
                            >
                              Hủy khóa học
                            </button>
                          </div>
                        </div>
                        <div className={styles.courseBody}>
                          <h4 className={styles.courseName}>{course.tenKhoaHoc}</h4>
                          <p className={styles.courseDesc}>{course.moTa}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
