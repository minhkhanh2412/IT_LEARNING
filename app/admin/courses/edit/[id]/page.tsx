'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import { courseService } from '@/services/courseService';
import { CourseCategory } from '@/types/course';
import styles from '../../add/add-course.module.scss';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [notification, setNotification] = useState<{ show: boolean; title: string; message: string; type: 'success' | 'error' }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });
  const [formData, setFormData] = useState({
    maKhoaHoc: '',
    tenKhoaHoc: '',
    moTa: '',
    luotXem: 0,
    danhGia: 0,
    hinhAnh: null as File | null,
    maNhom: 'GP01',
    ngayTao: new Date().toLocaleDateString('en-GB'),
    maDanhMucKhoaHoc: '',
    taiKhoanNguoiTao: '',
  });

  const [learningPoints, setLearningPoints] = useState<string[]>(['']);
  const [chapters, setChapters] = useState<Array<{
    title: string;
    lessons: Array<{ name: string; url: string }>;
  }>>([{ title: '', lessons: [{ name: '', url: '' }] }]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await courseService.getCourseCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchCourseDetail = useCallback(async () => {
    try {
      setLoadingData(true);
      console.log('Fetching course detail for:', courseId);
      
      if (!courseId) {
        throw new Error('Course ID is missing');
      }
      
      const course = await courseService.getCourseDetail(courseId);
      console.log('Course detail loaded:', course);
      console.log('Course data structure:', {
        maKhoaHoc: course.maKhoaHoc,
        tenKhoaHoc: course.tenKhoaHoc,
        hinhAnh: course.hinhAnh,
        danhMucKhoaHoc: course.danhMucKhoaHoc,
        nguoiTao: course.nguoiTao
      });
      
      setFormData({
        maKhoaHoc: course.maKhoaHoc,
        tenKhoaHoc: course.tenKhoaHoc,
        moTa: course.moTa,
        luotXem: course.luotXem,
        danhGia: course.danhGia || 0,
        hinhAnh: null,
        maNhom: course.maNhom || 'GP01',
        ngayTao: course.ngayTao,
        maDanhMucKhoaHoc: course.danhMucKhoaHoc?.maDanhMucKhoahoc || '',
        taiKhoanNguoiTao: course.nguoiTao?.taiKhoan || '',
      });

      if (course.hinhAnh) {
        console.log('Setting image preview:', course.hinhAnh);
        setImagePreview(course.hinhAnh);
      }
    } catch (error) {
      console.error('Error fetching course detail:', error);
      const err = error as { response?: { data?: unknown; status?: number }; message?: string };
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      setNotification({
        show: true,
        title: 'Lỗi! ⚠️',
        message: `Không thể tải thông tin khóa học! ${err.message || 'Unknown error'}`,
        type: 'error'
      });
      
      setTimeout(() => {
        router.push('/admin/courses');
      }, 2000);
    } finally {
      setLoadingData(false);
    }
  }, [courseId, router]);

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

    console.log('Edit page - Course ID:', courseId);

    // Set taiKhoanNguoiTao
    setFormData(prev => ({ ...prev, taiKhoanNguoiTao: user.taiKhoan }));

    // Fetch categories and course detail
    if (courseId) {
      fetchCategories();
      fetchCourseDetail();
    }
  }, [router, courseId, fetchCategories, fetchCourseDetail]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, hinhAnh: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLearningPoint = () => {
    setLearningPoints([...learningPoints, '']);
  };

  const removeLearningPoint = (index: number) => {
    setLearningPoints(learningPoints.filter((_, i) => i !== index));
  };

  const updateLearningPoint = (index: number, value: string) => {
    const newPoints = [...learningPoints];
    newPoints[index] = value;
    setLearningPoints(newPoints);
  };

  const addChapter = () => {
    setChapters([...chapters, { title: '', lessons: [{ name: '', url: '' }] }]);
  };

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const updateChapterTitle = (index: number, value: string) => {
    const newChapters = [...chapters];
    newChapters[index].title = value;
    setChapters(newChapters);
  };

  const addLesson = (chapterIndex: number) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].lessons.push({ name: '', url: '' });
    setChapters(newChapters);
  };

  const removeLesson = (chapterIndex: number, lessonIndex: number) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].lessons = newChapters[chapterIndex].lessons.filter((_, i) => i !== lessonIndex);
    setChapters(newChapters);
  };

  const updateLesson = (chapterIndex: number, lessonIndex: number, field: 'name' | 'url', value: string) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].lessons[lessonIndex][field] = value;
    setChapters(newChapters);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.hinhAnh) {
        // Có ảnh mới - dùng FormData và API upload
        console.log('Image file:', formData.hinhAnh.name, formData.hinhAnh.size, 'bytes');
        const submitData = new FormData();
        submitData.append('maKhoaHoc', formData.maKhoaHoc);
        submitData.append('biDanh', formData.tenKhoaHoc.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
        submitData.append('tenKhoaHoc', formData.tenKhoaHoc);
        submitData.append('moTa', formData.moTa);
        submitData.append('luotXem', formData.luotXem.toString());
        submitData.append('danhGia', formData.danhGia.toString());
        submitData.append('maNhom', formData.maNhom);
        submitData.append('ngayTao', formData.ngayTao);
        submitData.append('maDanhMucKhoaHoc', formData.maDanhMucKhoaHoc);
        submitData.append('taiKhoanNguoiTao', formData.taiKhoanNguoiTao);
        submitData.append('File', formData.hinhAnh, formData.hinhAnh.name);

        console.log('Updating course with new image...');
        await courseService.updateCourseWithImage(submitData);
      } else {
        // Không có ảnh mới - dùng JSON và API không upload
        console.log('No new image selected, using existing image');
        const updateData = {
          maKhoaHoc: formData.maKhoaHoc,
          biDanh: formData.tenKhoaHoc.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          tenKhoaHoc: formData.tenKhoaHoc,
          moTa: formData.moTa,
          luotXem: formData.luotXem,
          danhGia: formData.danhGia,
          hinhAnh: imagePreview, // Giữ nguyên URL ảnh cũ
          maNhom: formData.maNhom,
          ngayTao: formData.ngayTao,
          maDanhMucKhoaHoc: formData.maDanhMucKhoaHoc,
          taiKhoanNguoiTao: formData.taiKhoanNguoiTao,
        };

        console.log('Update data:', updateData);
        await courseService.updateCourseWithoutImage(updateData);
      }
      
      setNotification({
        show: true,
        title: 'Cập nhật thành công! ✅',
        message: 'Thông tin khóa học đã được cập nhật.',
        type: 'success'
      });
      
      setTimeout(() => {
        router.push('/admin/courses');
      }, 1500);
    } catch (error: unknown) {
      console.error('Error updating course:', error);
      const err = error as { response?: { data?: unknown } };
      const errorMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : JSON.stringify(err.response?.data) || 'Cập nhật khóa học thất bại!';
      
      setNotification({
        show: true,
        title: 'Cập nhật thất bại! ⚠️',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <Sidebar />
        <div className="mainLayout">
          <main className={styles.main}>
            <div className="container">
              <div style={{ textAlign: 'center', padding: '60px' }}>Đang tải...</div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="mainLayout">
        <main className={styles.main}>
          <div className="container">
            <div className={styles.header}>
              <h1 className={styles.title}>Chỉnh sửa khoá học</h1>
              <Link href="/admin/courses" className={styles.backButton}>
                Quay lại
              </Link>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.required}>*</span> Tên khoá học
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Giới Thiệu Ngành Kiểm Thử"
                  value={formData.tenKhoaHoc}
                  onChange={(e) => setFormData({ ...formData, tenKhoaHoc: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.required}>*</span> Mô tả
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="Để có cơ cấu kiến thức và quản lý, chúng tôi có một mục danh sách bài học và danh sách video cho từng khoá học, một khóa học."
                  rows={4}
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.required}>*</span> Giá khoá học
                </label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="0"
                  value={formData.luotXem}
                  onChange={(e) => setFormData({ ...formData, luotXem: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.required}>*</span> Danh mục khoá học
                </label>
                <select
                  className={styles.select}
                  value={formData.maDanhMucKhoaHoc}
                  onChange={(e) => setFormData({ ...formData, maDanhMucKhoaHoc: e.target.value })}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                      {cat.tenDanhMuc}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Sẽ học được gì?</label>
                {learningPoints.map((point, index) => (
                  <div key={index} className={styles.dynamicInput}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Các bài học của khóa luyện thi kiến thức về các lĩnh vực thực tập"
                      value={point}
                      onChange={(e) => updateLearningPoint(index, e.target.value)}
                    />
                    {learningPoints.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeLearningPoint(index)}
                      >
                        <CloseOutlined />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={addLearningPoint}
                >
                  <PlusOutlined /> Thêm trường
                </button>
              </div>

              {/* Chapters Section */}
              <div className={styles.chaptersSection}>
                {chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex} className={styles.chapterBlock}>
                    <div className={styles.chapterHeader}>
                      <label className={styles.label}>
                        Tiêu đề chương {chapterIndex + 1}
                      </label>
                      {chapters.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeChapterBtn}
                          onClick={() => removeChapter(chapterIndex)}
                        >
                          <CloseOutlined /> Xóa chương
                        </button>
                      )}
                    </div>
                    
                    <input
                      type="text"
                      className={styles.input}
                      placeholder={`${chapterIndex + 1}. Khái niệm và thuật ngữ IT`}
                      value={chapter.title}
                      onChange={(e) => updateChapterTitle(chapterIndex, e.target.value)}
                    />

                    <div className={styles.lessonsGroup}>
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className={styles.lessonRow}>
                          <div className={styles.lessonNumber}>{lessonIndex + 1}</div>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="Khái niệm về kiểm thử phần mềm"
                            value={lesson.name}
                            onChange={(e) => updateLesson(chapterIndex, lessonIndex, 'name', e.target.value)}
                          />
                          <input
                            type="url"
                            className={styles.input}
                            placeholder="https://www.youtube.com/watch?v=r-"
                            value={lesson.url}
                            onChange={(e) => updateLesson(chapterIndex, lessonIndex, 'url', e.target.value)}
                          />
                          {chapter.lessons.length > 1 && (
                            <button
                              type="button"
                              className={styles.removeLessonBtn}
                              onClick={() => removeLesson(chapterIndex, lessonIndex)}
                            >
                              <CloseOutlined />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={styles.addLessonBtn}
                      onClick={() => addLesson(chapterIndex)}
                    >
                      <PlusOutlined /> Thêm trường
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.addChapterBtn}
                  onClick={addChapter}
                >
                  <PlusOutlined /> Thêm Chương
                </button>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Hình ảnh</label>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    id="imageUpload"
                    className={styles.fileInput}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="imageUpload" className={styles.uploadLabel}>
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Preview" className={styles.preview} />
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <PlusOutlined style={{ fontSize: '24px' }} />
                        <p>Upload</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Đang cập nhật...' : 'Chỉnh sửa khoá học'}
              </button>
            </form>
          </div>
        </main>
      </div>

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
    </>
  );
}
