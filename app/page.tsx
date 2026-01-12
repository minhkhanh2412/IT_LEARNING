'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import styles from './page.module.scss';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';

const gradients = [
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  // Auto-play banner slider
  useEffect(() => {
    const autoPlay = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000); // Chuyển slide mỗi 5 giây

    return () => clearInterval(autoPlay);
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const startTime = Date.now();
      const data = await courseService.getCoursesByGroup();
      setCourses(data);
      
      // Đảm bảo loading hiển thị tối thiểu 2.5 giây
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 2500;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

  if (loading) {
    return <LoadingSpinner size={200} text="Đang tải khóa học..." />;
  }

  return (
    <>
      <Sidebar />
      <div className="mainLayout">
        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroSlider}>
              <button className={styles.sliderBtn} onClick={prevSlide}>
                <LeftOutlined />
              </button>
              
              {/* Banner chạy */}
              <div className={styles.slidesWrapper}>
                <div className={`${styles.heroSlide} ${currentSlide === 0 ? styles.active : ''}`} data-gradient="blue">
                  <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Thành Quả của Học Viên</h1>
                    <p className={styles.heroText}>
                      Để đạt được kết quả tốt trong mọi việc ta cần xác định mục tiêu rõ ràng cho việc đó. Học lập trình cũng không là ngoại lệ.
                    </p>
                    <button className={styles.btnOutline}>
                      Xem thành quả
                    </button>
                  </div>
                  <div className={styles.heroImage}>
                    <Image
                      src="/assets/banner/banner1.png"
                      alt="Thành Quả của Học Viên"
                      fill
                      style={{objectFit: 'contain'}}
                      priority
                    />
                  </div>
                </div>

                <div className={`${styles.heroSlide} ${currentSlide === 1 ? styles.active : ''}`} data-gradient="orange">
                  <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Môi trường học tập tại IT</h1>
                    <p className={styles.heroText}>
                      Tại đây môi trường học tập được quan tâm hàng đầu. Cáo kênh học tập đa dạng và mỗi cá nhân học viên đều được hỗ trợ tối đa.
                    </p>
                    <button className={styles.btnOutline}>
                      Xem chi tiết
                    </button>
                  </div>
                  <div className={styles.heroImage}>
                    <Image
                      src="/assets/banner/banner2.png"
                      alt="Môi trường học tập tại IT"
                      fill
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                </div>

                <div className={`${styles.heroSlide} ${currentSlide === 2 ? styles.active : ''}`} data-gradient="green">
                  <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Học Lập Trình Để Đi Làm</h1>
                    <p className={styles.heroText}>
                      Với hơn 200.000 học viên, IT là cộng đồng học lập trình lớn nhất Việt Nam. Tham gia ngay để cùng nhau phát triển.
                    </p>
                    <button className={styles.btnOutline}>
                      Tham gia ngay
                    </button>
                  </div>
                  <div className={styles.heroImage}>
                    <Image
                      src="/assets/banner/banner3.png"
                      alt="Học Lập Trình Để Đi Làm"
                      fill
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                </div>
              </div>

              <button className={styles.sliderBtn} onClick={nextSlide}>
                <RightOutlined />
              </button>
            </div>

            <div className={styles.sliderDots}>
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </section>

          <section className={styles.coursesSection}>
            <div className="container">
              <h2 className={styles.sectionTitle}>Tất cả khoá học</h2>
              
              {loading ? (
                <div className={styles.loading}>Đang tải khóa học...</div>
              ) : (
                <div className={styles.coursesGrid}>
                  {courses.map((course, index) => {
                    const gradientBg = gradients[index % gradients.length];
                    const hasImage = course.hinhAnh && course.hinhAnh.trim() !== '';
                    const hasError = imageErrors[course.maKhoaHoc];
                    const imageToShow = hasError || !hasImage ? '/assets/img_error.png' : course.hinhAnh;
                    
                    return (
                      <Link href={`/courses/${course.maKhoaHoc}`} key={course.maKhoaHoc} className={styles.courseCard}>
                        <div className={styles.courseImage}>
                          <Image 
                            src={imageToShow} 
                            alt={course.tenKhoaHoc}
                            fill
                            style={{objectFit: 'cover'}}
                            onError={() => {
                              setImageErrors(prev => ({ ...prev, [course.maKhoaHoc]: true }));
                            }}
                          />
                          <div className={styles.courseOverlay}>
                            <span className={styles.courseCategory}>{course.danhMucKhoaHoc.tenDanhMucKhoaHoc}</span>
                          </div>
                          <div className={styles.hoverOverlay}>
                            <span className={styles.viewButton}>Xem khóa học</span>
                          </div>
                        </div>
                        <div className={styles.courseBody}>
                          <h3 className={styles.courseName}>{course.tenKhoaHoc}</h3>
                          <p className={styles.courseDesc}>{course.moTa?.substring(0, 80)}...</p>
                          <div className={styles.courseFooter}>
                            <span className={styles.courseViews}>👁️ {course.luotXem}</span>
                            <span className={styles.courseStudents}>🎓 {course.soLuongHocVien}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
