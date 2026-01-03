'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import styles from './page.module.scss';
import Sidebar from '@/components/Sidebar';
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

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCoursesByGroup();
      setCourses(data);
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
              
              <div className={styles.heroSlide} style={{ display: currentSlide === 0 ? 'flex' : 'none' }}>
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>Học ReactJS Miễn Phí!</h1>
                  <p className={styles.heroText}>
                    Khóa học ReactJS từ cơ bản tới nâng cao. Kết quả của khóa học này là bạn có thể
                    làm hầu hết các dự án thường gặp với ReactJS.
                  </p>
                  <button className="btn btn-white">
                    Đăng ký ngay
                  </button>
                </div>
                <div className={styles.heroImage}>
                  <div className={styles.reactLogo}>
                    <svg width="180" height="180" viewBox="0 0 256 256">
                      <circle cx="128" cy="128" r="30" fill="#61DAFB"/>
                      <ellipse cx="128" cy="128" rx="110" ry="40" fill="none" stroke="#61DAFB" strokeWidth="10"/>
                      <ellipse cx="128" cy="128" rx="110" ry="40" fill="none" stroke="#61DAFB" strokeWidth="10" transform="rotate(60 128 128)"/>
                      <ellipse cx="128" cy="128" rx="110" ry="40" fill="none" stroke="#61DAFB" strokeWidth="10" transform="rotate(120 128 128)"/>
                    </svg>
                    <div className={styles.logoText}>React JS</div>
                    <div className={styles.logoSubtext}>Learn once, write anywhere</div>
                  </div>
                </div>
              </div>

              <div className={styles.heroSlide} style={{ display: currentSlide === 1 ? 'flex' : 'none' }}>
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>HTML CSS từ Zero đến Hero</h1>
                  <p className={styles.heroText}>
                    Đây là khóa học đầy đủ và chi tiết nhất bạn có thể tìm thấy được ở trên Internet!
                  </p>
                  <button className="btn btn-white">
                    Tìm hiểu thêm
                  </button>
                </div>
                <div className={styles.heroImage}>
                  <div className={styles.reactLogo}>
                    <div style={{fontSize: '72px'}}>🎨</div>
                    <div className={styles.logoText}>HTML & CSS</div>
                    <div className={styles.logoSubtext}>From Zero to Hero</div>
                  </div>
                </div>
              </div>

              <div className={styles.heroSlide} style={{ display: currentSlide === 2 ? 'flex' : 'none' }}>
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>JavaScript Cơ Bản</h1>
                  <p className={styles.heroText}>
                    Nắm vững JavaScript để trở thành lập trình viên Front-end chuyên nghiệp.
                  </p>
                  <button className="btn btn-white">
                    Học ngay
                  </button>
                </div>
                <div className={styles.heroImage}>
                  <div className={styles.reactLogo}>
                    <div style={{fontSize: '72px'}}>⚡</div>
                    <div className={styles.logoText}>JavaScript</div>
                    <div className={styles.logoSubtext}>Programming Language</div>
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
                    
                    return (
                      <Link href={`/courses/${course.maKhoaHoc}`} key={course.maKhoaHoc} className={styles.courseCard}>
                        <div className={styles.courseImage} style={{ background: gradientBg }}>
                          <div className={styles.courseIcon}>
                            {course.tenKhoaHoc.includes('C++') && 'C++'}
                            {course.tenKhoaHoc.includes('HTML') && 'HTML'}
                            {course.tenKhoaHoc.includes('CSS') && 'CSS'}
                            {course.tenKhoaHoc.includes('JavaScript') && 'JS'}
                            {course.tenKhoaHoc.includes('React') && '⚛️'}
                            {!course.tenKhoaHoc.match(/C\+\+|HTML|CSS|JavaScript|React/) && '📚'}
                          </div>
                          <div className={styles.courseTitle}>{course.tenKhoaHoc}</div>
                        </div>
                        <div className={styles.courseBody}>
                          <h3 className={styles.courseName}>{course.tenKhoaHoc}</h3>
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
