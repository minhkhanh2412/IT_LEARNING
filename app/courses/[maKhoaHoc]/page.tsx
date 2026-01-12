'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookOutlined, UserOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { courseService } from '@/services/courseService';
import { userService } from '@/services/userService';
import { User } from '@/types/user';
import styles from './courseDetail.module.scss';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const maKhoaHoc = params.maKhoaHoc as string;
  
  const [course, setCourse] = useState<{ maKhoaHoc: string; tenKhoaHoc: string; moTa: string; hinhAnh: string; luotXem: number; soLuongHocVien: number; ngayTao: string; danhMucKhoaHoc: { tenDanhMucKhoaHoc: string }; nguoiTao?: { taiKhoan: string; hoTen: string } } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledStudentsCount, setEnrolledStudentsCount] = useState(0);
  const [notification, setNotification] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({show: false, message: '', type: 'success'});
  const [imageError, setImageError] = useState(false);

  const fetchCourseDetail = useCallback(async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      const courseData = await courseService.getCourseDetail(maKhoaHoc);
      console.log('=== COURSE DETAIL: Full course data:', courseData);
      setCourse(courseData);

      // Lấy số học viên - ưu tiên từ course.soLuongHocVien
      const initialCount = courseData.soLuongHocVien || 0;
      console.log('=== Initial student count from course.soLuongHocVien:', initialCount);
      setEnrolledStudentsCount(initialCount);

      // Check if user is enrolled
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined') {
          const userData = JSON.parse(userStr);
          try {
            const userCourses = await userService.getUserCourses(userData.taiKhoan);
            console.log('=== DETAIL: User courses:', userCourses);
            const enrolled = userCourses.some((c) => c.maKhoaHoc === maKhoaHoc);
            console.log('=== DETAIL: Is enrolled in', maKhoaHoc, ':', enrolled);
            setIsEnrolled(enrolled);
          } catch (error) {
            console.error('=== DETAIL: Error checking enrollment:', error);
            setIsEnrolled(false);
          }
        }
      }
      
      // Đảm bảo loading hiển thị tối thiểu 2.5 giây
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 2500;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
    } catch (error) {
      console.error('Error fetching course detail:', error);
    } finally {
      setLoading(false);
    }
  }, [maKhoaHoc]);

  useEffect(() => {
    // Load user from localStorage
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined') {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }

    fetchCourseDetail();

    // Listen for course updates (when someone enrolls/unenrolls)
    const handleCourseUpdate = async () => {
      console.log('=== DETAIL: Course updated event received');
      // Giảm số học viên 1 (khi hủy đăng ký từ profile)
      setEnrolledStudentsCount(prev => Math.max(0, prev - 1));
      console.log('=== DETAIL: Decreased student count by 1');
    };

    // Listen for visibility change (when user comes back to this tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('=== DETAIL: Tab became visible, checking for updates...');
        handleCourseUpdate();
      }
    };

    window.addEventListener('coursesUpdated', handleCourseUpdate);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('coursesUpdated', handleCourseUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [maKhoaHoc, fetchCourseDetail]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setEnrolling(true);
      console.log('=== ENROLL: Enrolling user', user.taiKhoan, 'in course', maKhoaHoc);
      await courseService.enrollCourse(maKhoaHoc, user.taiKhoan);
      setIsEnrolled(true);
      console.log('=== ENROLL: Success!');
      
      // Tăng số học viên lên 1
      setEnrolledStudentsCount(prev => prev + 1);
      console.log('=== ENROLL: Increased student count by 1');
      
      // Dispatch event để profile page reload courses
      window.dispatchEvent(new Event('coursesUpdated'));
      
      setNotification({show: true, message: 'Đăng ký khóa học thành công!', type: 'success'});
      setTimeout(() => setNotification({show: false, message: '', type: 'success'}), 3000);
    } catch (error) {
      console.error('=== ENROLL: Error enrolling course:', error);
      const err = error as { response?: { data?: string } };
      console.error('=== ENROLL: Error response:', err.response?.data);
      
      // Nếu đã đăng ký rồi thì chỉ update state
      if (err.response?.data?.includes('Đã đăng ký')) {
        setIsEnrolled(true);
        console.log('User đã đăng ký khóa học này rồi');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleContinue = () => {
    // Navigate to learning page (you can implement this later)
    alert('Tính năng học tập đang được phát triển!');
  };

  if (loading) {
    return <LoadingSpinner size={200} text="Đang tải thông tin khóa học..." />;
  }

  if (!course) {
    return (
      <>
        <Sidebar />
        <div className="mainLayout">
          <main className={styles.main}>
            <div className={styles.error}>Không tìm thấy khóa học</div>
          </main>
        </div>
      </>
    );
  }

  const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

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
          {/* Hero Section */}
          <div className={styles.hero}>
            <div className={styles.heroBackground} style={{ background: gradient }}></div>
            <div className={styles.heroContent}>
              <div className="container">
                <div className={styles.heroGrid}>
                  <div className={styles.heroInfo}>
                    <div className={styles.category}>
                      {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || 'Lập trình'}
                    </div>
                    <h1 className={styles.title}>{course.tenKhoaHoc}</h1>
                    <p className={styles.description}>{course.moTa}</p>
                    
                    <div className={styles.stats}>
                      <div className={styles.stat}>
                        <UserOutlined />
                        <span>{enrolledStudentsCount} học viên</span>
                      </div>
                      <div className={styles.stat}>
                        <StarOutlined />
                        <span>{course.luotXem || 0} lượt xem</span>
                      </div>
                      <div className={styles.stat}>
                        <ClockCircleOutlined />
                        <span>Học mọi lúc</span>
                      </div>
                    </div>

                    <div className={styles.priceSection}>
                      <div className={styles.price}>369.000 ₫</div>
                    </div>

                    <div className={styles.actions}>
                      {isEnrolled ? (
                        <button 
                          className={`${styles.btn} ${styles.btnPrimary}`}
                          onClick={handleContinue}
                        >
                          <BookOutlined /> Tiếp tục học
                        </button>
                      ) : (
                        <button 
                          className={`${styles.btn} ${styles.btnPrimary}`}
                          onClick={handleEnroll}
                          disabled={enrolling}
                        >
                          {enrolling ? 'Đang đăng ký...' : 'ĐĂNG KÝ HỌC'}
                        </button>
                      )}
                    </div>

                    <div className={styles.courseFeatures}>
                      <div className={styles.feature}>📚 Mã KH: {course.maKhoaHoc}</div>
                      <div className={styles.feature}>📁 {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || 'Lập trình'}</div>
                      <div className={styles.feature}>👨‍🏫 {course.nguoiTao?.hoTen || 'Giáo viên'}</div>
                      <div className={styles.feature}>🌐 Học mọi lúc mọi nơi</div>
                    </div>
                  </div>

                  <div className={styles.heroImage}>
                    <div className={styles.videoWrapper}>
                      <Image
                        src={imageError || !course.hinhAnh ? '/assets/img_error.png' : course.hinhAnh}
                        alt={course.tenKhoaHoc}
                        fill
                        style={{ objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                      />
                      <div className={styles.playButton}>
                        <div className={styles.playIcon}>▶</div>
                      </div>
                      <div className={styles.videoOverlay}>
                        <p>Xem giới thiệu khóa học</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="container">
            <div className={styles.content}>
              <div className={styles.mainContent}>
                <h2>Nội dung khóa học</h2>
                <div className={styles.curriculum}>
                  <div className={styles.courseDescription}>
                    <h3>Mô tả khóa học</h3>
                    <p>{course.moTa}</p>
                  </div>

                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3>📁 1. Giới thiệu</h3>
                      <span>1 bài học</span>
                    </div>
                    <div className={styles.lesson}>
                      <span>▶ Giới thiệu về {course.tenKhoaHoc}</span>
                      <span>Xem ngay</span>
                    </div>
                  </div>

                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3>📁 2. Kiến thức cơ bản</h3>
                      <span>Nhiều bài học</span>
                    </div>
                    <div className={styles.lesson}>
                      <span>▶ Các khái niệm cơ bản</span>
                      <span>Xem ngay</span>
                    </div>
                  </div>

                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3>📁 3. Thực hành nâng cao</h3>
                      <span>Nhiều bài học</span>
                    </div>
                    <div className={styles.lesson}>
                      <span>▶ Bài tập thực hành</span>
                      <span>Xem ngay</span>
                    </div>
                  </div>

                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3>📁 4. Dự án thực tế</h3>
                      <span>Dự án cuối khóa</span>
                    </div>
                    <div className={styles.lesson}>
                      <span>▶ Hoàn thiện dự án</span>
                      <span>Xem ngay</span>
                    </div>
                  </div>

                  <div className={styles.courseStats}>
                    <div className={styles.statBox}>
                      <strong>Mã khóa học:</strong>
                      <span>{course.maKhoaHoc}</span>
                    </div>
                    <div className={styles.statBox}>
                      <strong>Lượt xem:</strong>
                      <span>{course.luotXem || 0}</span>
                    </div>
                    <div className={styles.statBox}>
                      <strong>Học viên:</strong>
                      <span>{enrolledStudentsCount}</span>
                    </div>
                    <div className={styles.statBox}>
                      <strong>Ngày tạo:</strong>
                      <span>{course.ngayTao || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
