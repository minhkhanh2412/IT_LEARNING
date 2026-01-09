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
                    <div className={styles.illustration}>
                      <div className={styles.floatingScreens}>
                        <div className={styles.screen}>💻</div>
                        <div className={styles.screen}>📱</div>
                        <div className={styles.screen}>🎨</div>
                      </div>
                      <div className={styles.character}>🚀</div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.heroSlide} ${currentSlide === 1 ? styles.active : ''}`} data-gradient="orange">
                  <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>L9 trên Youtube</h1>
                    <p className={styles.heroText}>
                      L9 được nhắc tới ở mọi nơi, ở đâu có cơ hội việc làm cho nghề IT và có những con người yêu thích lập trình F8 sẽ ở đó.
                    </p>
                    <button className={styles.btnOutline}>
                      Truy cập kênh
                    </button>
                  </div>
                  <div className={styles.heroImage}>
                    <div className={styles.illustration}>
                      <div className={styles.youtubeIcon}>▶️</div>
                      <div className={styles.socialIcons}>
                        <span>👍</span>
                        <span>💬</span>
                        <span>📧</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.heroSlide} ${currentSlide === 2 ? styles.active : ''}`} data-gradient="green">
                  <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Học Lập Trình Để Đi Làm</h1>
                    <p className={styles.heroText}>
                      Với hơn 200.000 học viên, L9 là cộng đồng học lập trình lớn nhất Việt Nam. Tham gia ngay để cùng nhau phát triển.
                    </p>
                    <button className={styles.btnOutline}>
                      Tham gia ngay
                    </button>
                  </div>
                  <div className={styles.heroImage}>
                    <div className={styles.illustration}>
                      <div className={styles.codeIcon}>👨‍💻</div>
                      <div className={styles.techStack}>
                        <span>⚛️</span>
                        <span>📘</span>
                        <span>🎯</span>
                      </div>
                    </div>
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
                    
                    return (
                      <Link href={`/courses/${course.maKhoaHoc}`} key={course.maKhoaHoc} className={styles.courseCard}>
                        <div className={styles.courseImage}>
                          {hasImage ? (
                            <>
                              <Image 
                                src={course.hinhAnh} 
                                alt={course.tenKhoaHoc}
                                fill
                                style={{objectFit: 'cover'}}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.style.background = gradientBg;
                                    const fallback = parent.querySelector('.fallback');
                                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                  }
                                }}
                              />
                              <div className="fallback" style={{display: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', color: 'white'}}>
                                <div className={styles.courseIcon}>
                                  {course.tenKhoaHoc.includes('C++') && 'C++'}
                                  {course.tenKhoaHoc.includes('HTML') && '🎨'}
                                  {course.tenKhoaHoc.includes('CSS') && '🎨'}
                                  {course.tenKhoaHoc.includes('JavaScript') && '⚡'}
                                  {course.tenKhoaHoc.includes('React') && '⚛️'}
                                  {course.tenKhoaHoc.includes('Python') && '🐍'}
                                  {course.tenKhoaHoc.includes('Node') && '📗'}
                                  {!course.tenKhoaHoc.match(/C\+\+|HTML|CSS|JavaScript|React|Python|Node/) && '📚'}
                                </div>
                                <div className={styles.courseFallbackTitle}>{course.tenKhoaHoc}</div>
                              </div>
                            </>
                          ) : (
                            <div className={styles.courseFallback} style={{ background: gradientBg }}>
                              <div className={styles.courseIcon}>
                                {course.tenKhoaHoc.includes('C++') && 'C++'}
                                {course.tenKhoaHoc.includes('HTML') && '🎨'}
                                {course.tenKhoaHoc.includes('CSS') && '🎨'}
                                {course.tenKhoaHoc.includes('JavaScript') && '⚡'}
                                {course.tenKhoaHoc.includes('React') && '⚛️'}
                                {course.tenKhoaHoc.includes('Python') && '🐍'}
                                {course.tenKhoaHoc.includes('Node') && '📗'}
                                {!course.tenKhoaHoc.match(/C\+\+|HTML|CSS|JavaScript|React|Python|Node/) && '📚'}
                              </div>
                              <div className={styles.courseFallbackTitle}>{course.tenKhoaHoc}</div>
                            </div>
                          )}
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
