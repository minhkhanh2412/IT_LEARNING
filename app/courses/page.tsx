'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { courseService } from '@/services/courseService';
import { Course, CourseCategory } from '@/types/course';
import styles from './courses.module.scss';

const gradients = [
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

function CoursesContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Lọc courses theo search query
    if (searchQuery) {
      const filtered = courses.filter(course =>
        course.tenKhoaHoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.moTa?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData, categoriesData] = await Promise.all([
        courseService.getCoursesByGroup(),
        courseService.getCourseCategories(),
      ]);
      setCourses(coursesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    try {
      setLoading(true);
      if (categoryId === 'all') {
        const data = await courseService.getCoursesByGroup();
        setCourses(data);
      } else {
        const data = await courseService.getCoursesByCategory(categoryId);
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Nhóm khóa học theo danh mục
  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const categoryName = course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || 'Khác';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <>
      <Sidebar />
      <div className="mainLayout">
        <main className={styles.main}>
          <div className="container">
            <h1 className={styles.pageTitle}>Khoá học</h1>
            <p className={styles.pageSubtitle}>
              Các khóa học được thiết kế phù hợp cho cả người mới, nhiều khóa học miễn phí, chất lượng, nội dung dễ hiểu.
            </p>
            {searchQuery && (
              <p className={styles.searchResult}>
                Kết quả tìm kiếm cho: <strong>&ldquo;{searchQuery}&rdquo;</strong> ({filteredCourses.length} khóa học)
              </p>
            )}

            {/* Filter */}
            <div className={styles.filterSection}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Danh mục:</label>
                <select 
                  className={styles.filterSelect}
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                      {cat.tenDanhMuc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>Đang tải khóa học...</div>
            ) : (
              <>
                {Object.entries(groupedCourses).map(([categoryName, coursesInCategory], catIndex) => (
                  <div key={categoryName} className={styles.categorySection}>
                    <h2 className={styles.categoryTitle}>{categoryName}</h2>
                    <div className={styles.coursesGrid}>
                      {coursesInCategory.map((course, index) => {
                        const gradientBg = gradients[(catIndex * 3 + index) % gradients.length];
                        
                        return (
                          <Link 
                            href={`/courses/${course.maKhoaHoc}`} 
                            key={course.maKhoaHoc} 
                            className={styles.courseCard}
                          >
                            <div className={styles.courseImage} style={{ background: gradientBg }}>
                              <div className={styles.courseIcon}>
                                {course.tenKhoaHoc.includes('C++') && 'C++'}
                                {course.tenKhoaHoc.includes('HTML') && 'HTML'}
                                {course.tenKhoaHoc.includes('CSS') && 'CSS'}
                                {course.tenKhoaHoc.includes('JavaScript') && 'JS'}
                                {course.tenKhoaHoc.includes('React') && '⚛️'}
                                {course.tenKhoaHoc.includes('Python') && '🐍'}
                                {course.tenKhoaHoc.includes('Node') && '📗'}
                                {!course.tenKhoaHoc.match(/C\+\+|HTML|CSS|JavaScript|React|Python|Node/) && '📚'}
                              </div>
                              <div className={styles.courseTitle}>{course.tenKhoaHoc}</div>
                              <div className={styles.courseOverlay}>
                                <span className={styles.viewBtn}>Xem khóa học</span>
                              </div>
                            </div>
                            <div className={styles.courseBody}>
                              <h3 className={styles.courseName}>{course.tenKhoaHoc}</h3>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
