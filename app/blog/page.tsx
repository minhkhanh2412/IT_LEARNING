'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SearchOutlined, CalendarOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import styles from './blog.module.scss';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
}

export default function BlogPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [blogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Roadmap học lập trình Web từ Zero đến Hero',
      excerpt: 'Hướng dẫn chi tiết lộ trình học lập trình web cho người mới bắt đầu, từ HTML/CSS cơ bản đến React, Node.js nâng cao...',
      content: '',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      author: 'Nguyễn Văn A',
      date: '15/12/2025',
      category: 'tutorial',
      tags: ['JavaScript', 'React', 'Web Development'],
      readTime: '10 phút'
    },
    {
      id: '2',
      title: '10 Tips để code JavaScript hiệu quả hơn',
      excerpt: 'Những mẹo và kỹ thuật giúp bạn viết code JavaScript sạch hơn, nhanh hơn và dễ maintain hơn...',
      content: '',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
      author: 'Trần Thị B',
      date: '12/12/2025',
      category: 'tutorial',
      tags: ['JavaScript', 'Tips', 'Best Practices'],
      readTime: '8 phút'
    },
    {
      id: '3',
      title: 'React vs Vue vs Angular: So sánh chi tiết 2025',
      excerpt: 'Phân tích ưu nhược điểm của 3 framework phổ biến nhất hiện nay để giúp bạn lựa chọn công nghệ phù hợp...',
      content: '',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      author: 'Lê Văn C',
      date: '10/12/2025',
      category: 'web',
      tags: ['React', 'Vue', 'Angular'],
      readTime: '12 phút'
    },
    {
      id: '4',
      title: 'Cách xây dựng Portfolio ấn tượng cho Developer',
      excerpt: 'Hướng dẫn thiết kế và xây dựng portfolio website chuyên nghiệp để thu hút nhà tuyển dụng...',
      content: '',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      author: 'Phạm Thị D',
      date: '08/12/2025',
      category: 'career',
      tags: ['Portfolio', 'Career', 'Tips'],
      readTime: '7 phút'
    },
    {
      id: '5',
      title: 'Next.js 15: Những tính năng mới và cải tiến',
      excerpt: 'Khám phá các tính năng mới trong Next.js 15 và cách chúng cải thiện hiệu suất ứng dụng...',
      content: '',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      author: 'Hoàng Văn E',
      date: '05/12/2025',
      category: 'news',
      tags: ['Next.js', 'React', 'Framework'],
      readTime: '9 phút'
    },
    {
      id: '6',
      title: 'TypeScript cho người mới: Hướng dẫn toàn tập',
      excerpt: 'Bắt đầu với TypeScript từ những kiến thức cơ bản nhất, phù hợp cho người chuyển từ JavaScript...',
      content: '',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      author: 'Đặng Thị F',
      date: '03/12/2025',
      category: 'tutorial',
      tags: ['TypeScript', 'JavaScript', 'Tutorial'],
      readTime: '15 phút'
    },
    {
      id: '7',
      title: 'Xu hướng phát triển Mobile App năm 2025',
      excerpt: 'Tổng quan về các công nghệ và xu hướng phát triển ứng dụng di động đang được ưa chuộng...',
      content: '',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      author: 'Vũ Văn G',
      date: '01/12/2025',
      category: 'mobile',
      tags: ['Mobile', 'React Native', 'Flutter'],
      readTime: '11 phút'
    },
    {
      id: '8',
      title: 'Git và GitHub: Từ cơ bản đến nâng cao',
      excerpt: 'Hướng dẫn sử dụng Git và GitHub hiệu quả, từ các lệnh cơ bản đến các kỹ thuật nâng cao...',
      content: '',
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800',
      author: 'Bùi Thị H',
      date: '28/11/2025',
      category: 'tutorial',
      tags: ['Git', 'GitHub', 'Version Control'],
      readTime: '13 phút'
    },
  ]);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Dev' },
    { id: 'career', name: 'Sự nghiệp' },
    { id: 'tutorial', name: 'Hướng dẫn' },
    { id: 'news', name: 'Tin tức' },
  ];

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, blogPosts]);

  return (
    <>
      <Sidebar />
      <div className="mainLayout">
        <main className={styles.main}>
          {/* Hero Section */}
          <div className={styles.hero}>
            <div className={styles.heroGradient}></div>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Blog IT</h1>
              <p className={styles.heroSubtitle}>
                Chia sẻ kiến thức, kinh nghiệm và xu hướng công nghệ mới nhất
              </p>
            </div>
          </div>

          <div className="container">
            {/* Search and Filter */}
            <div className={styles.controls}>
              <div className={styles.searchBox}>
                <SearchOutlined className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.categories}>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`${styles.categoryBtn} ${selectedCategory === category.id ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            {searchQuery && (
              <p className={styles.resultCount}>
                Tìm thấy <strong>{filteredPosts.length}</strong> bài viết
              </p>
            )}

            {/* Blog Grid */}
            {filteredPosts.length > 0 ? (
              <div className={styles.blogGrid}>
                {filteredPosts.map(post => (
                  <article key={post.id} className={styles.blogCard}>
                    <div className={styles.cardImage}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.image} alt={post.title} />
                      <div className={styles.categoryBadge}>{categories.find(c => c.id === post.category)?.name}</div>
                    </div>
                    <div className={styles.cardContent}>
                      <h2 className={styles.cardTitle}>{post.title}</h2>
                      <p className={styles.cardExcerpt}>{post.excerpt}</p>
                      
                      <div className={styles.cardMeta}>
                        <div className={styles.metaItem}>
                          <UserOutlined />
                          <span>{post.author}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <CalendarOutlined />
                          <span>{post.date}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <div className={styles.cardTags}>
                        {post.tags.map(tag => (
                          <span key={tag} className={styles.tag}>
                            <TagOutlined /> {tag}
                          </span>
                        ))}
                      </div>

                      <button 
                        className={styles.readMore}
                        onClick={() => router.push(`/blog/${post.id}`)}
                      >
                        Đọc tiếp →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <h3>Không tìm thấy bài viết nào</h3>
                <p>Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
