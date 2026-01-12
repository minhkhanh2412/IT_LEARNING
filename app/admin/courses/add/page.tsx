'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import { courseService } from '@/services/courseService';
import { CourseCategory } from '@/types/course';
import styles from './add-course.module.scss';

export default function AddCoursePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(false);
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
    luotXem: 2004,
    danhGia: 10,
    gia: 1980000,
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

    // Set taiKhoanNguoiTao
    setFormData(prev => ({ ...prev, taiKhoanNguoiTao: user.taiKhoan }));

    // Fetch categories
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const data = await courseService.getCourseCategories();
      setCategories(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, maDanhMucKhoaHoc: data[0].maDanhMuc }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
      
      if (formData.hinhAnh) {
        console.log('Image file:', formData.hinhAnh.name, formData.hinhAnh.size, 'bytes');
        submitData.append('File', formData.hinhAnh, formData.hinhAnh.name);
      } else {
        console.log('WARNING: No image selected!');
      }

      // Log tất cả các entry của FormData
      console.log('FormData contents:');
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Submitting course data...');
      const result = await courseService.addCourse(submitData);
      console.log('Course added:', result);
      
      setNotification({
        show: true,
        title: 'Thêm thành công! ',
        message: 'Khóa học mới đã được thêm vào hệ thống.',
        type: 'success'
      });
      
      setTimeout(() => {
        router.push('/admin/courses');
      }, 1500);
    } catch (error: unknown) {
      console.error('Error adding course:', error);
      const err = error as { response?: { data?: string } };
      
      setNotification({
        show: true,
        title: 'Thêm thất bại! ',
        message: err.response?.data || 'Không thể thêm khóa học. Vui lòng thử lại!',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="mainLayout">
        <main className={styles.main}>
          <div className="container">
            <div className={styles.header}>
              <h1 className={styles.title}>Thêm khóa học</h1>
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
                  onChange={(e) => {
                    const newName = e.target.value;
                    // Tự động tạo mã khóa học từ tên (URL-safe)
                    const generateCourseCode = (name: string) => {
                      // Loại bỏ dấu tiếng Việt
                      const withoutDiacritics = name
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D');
                      
                      // Chỉ giữ chữ cái và số, loại bỏ tất cả ký tự khác (bao gồm cả dấu cách)
                      const alphanumeric = withoutDiacritics.replace(/[^a-zA-Z0-9]/g, '');
                      
                      // Lấy 10 ký tự đầu + 3 ký tự random
                      const prefix = alphanumeric.substring(0, 10).toUpperCase();
                      const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
                      
                      return prefix + suffix;
                    };
                    
                    const generatedCode = generateCourseCode(newName);
                    setFormData({ ...formData, tenKhoaHoc: newName, maKhoaHoc: generatedCode });
                  }}
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
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="1.980.000"
                    value={formData.gia.toLocaleString('vi-VN')}
                    onChange={(e) => {
                      // Loại bỏ tất cả ký tự không phải số
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      const price = parseInt(numericValue) || 0;
                      setFormData({ ...formData, gia: price });
                    }}
                    style={{ paddingRight: '50px' }}
                  />
                  <span style={{ 
                    position: 'absolute', 
                    right: '15px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#666',
                    pointerEvents: 'none'
                  }}>
                    VNĐ
                  </span>
                </div>
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
                      placeholder="Các kiến thức cơ bản, nền móng của ngành IT"
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
                <label className={styles.label}>Chương học</label>
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
                      placeholder={`${chapterIndex + 1}. Mô trường con người IT`}
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
                            placeholder="Mô hình Client - Server là gì?"
                            value={lesson.name}
                            onChange={(e) => updateLesson(chapterIndex, lessonIndex, 'name', e.target.value)}
                          />
                          <input
                            type="url"
                            className={styles.input}
                            placeholder="https://www.youtube.com/watch?v=c2BLAruMkxY"
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
                {loading ? 'Đang thêm...' : 'Thêm khoá học'}
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
