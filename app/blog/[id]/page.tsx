'use client';
import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined, ClockCircleOutlined, TagOutlined } from '@ant-design/icons';
import Sidebar from '@/components/Sidebar';
import styles from './blogDetail.module.scss';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  // Mock data - trong thực tế sẽ fetch từ API
  const post = useMemo<BlogPost>(() => ({
    id: postId,
    title: 'Roadmap học lập trình Web từ Zero đến Hero',
    content: `
        <h2>1. Nền tảng HTML & CSS</h2>
        <p>Đây là bước đầu tiên và quan trọng nhất trong hành trình trở thành web developer. HTML (HyperText Markup Language) là ngôn ngữ đánh dấu cơ bản để tạo cấu trúc trang web, trong khi CSS (Cascading Style Sheets) giúp trang web trở nên đẹp mắt và chuyên nghiệp.</p>
        
        <h3>Kiến thức cần học:</h3>
        <ul>
          <li>HTML5 semantic tags (header, nav, main, section, article, footer)</li>
          <li>CSS3: Flexbox, Grid Layout</li>
          <li>Responsive Design với Media Queries</li>
          <li>CSS Animations & Transitions</li>
          <li>Sass/SCSS preprocessor</li>
        </ul>

        <h3>Thời gian học: 2-3 tuần</h3>
        <p>Thực hành bằng cách clone các landing page từ các website nổi tiếng.</p>

        <h2>2. JavaScript Cơ Bản</h2>
        <p>JavaScript là ngôn ngữ lập trình chính để làm web tương tác. Đây là giai đoạn bạn chuyển từ static sang dynamic website.</p>

        <h3>Kiến thức cần học:</h3>
        <ul>
          <li>Biến, kiểu dữ liệu, operators</li>
          <li>Functions, Arrow Functions</li>
          <li>Arrays, Objects và các methods</li>
          <li>DOM Manipulation</li>
          <li>Events & Event Handling</li>
          <li>ES6+ features (let/const, destructuring, spread operator, async/await)</li>
        </ul>

        <h3>Thời gian học: 3-4 tuần</h3>
        <p>Làm các mini projects: Todo List, Calculator, Quiz App...</p>

        <h2>3. Git & GitHub</h2>
        <p>Version control là kỹ năng bắt buộc cho mọi developer. Git giúp bạn quản lý code hiệu quả và làm việc nhóm tốt hơn.</p>

        <h3>Kiến thức cần học:</h3>
        <ul>
          <li>Git cơ bản: init, add, commit, push, pull</li>
          <li>Branching & Merging</li>
          <li>GitHub: Issues, Pull Requests</li>
          <li>Git workflow trong team</li>
        </ul>

        <h3>Thời gian học: 1 tuần</h3>

        <h2>4. Frontend Framework: React</h2>
        <p>React là thư viện JavaScript phổ biến nhất hiện nay để xây dựng Single Page Applications (SPA). Nó giúp code dễ maintain và tái sử dụng.</p>

        <h3>Kiến thức cần học:</h3>
        <ul>
          <li>JSX & Components</li>
          <li>Props & State</li>
          <li>Hooks (useState, useEffect, useContext, custom hooks)</li>
          <li>React Router</li>
          <li>State Management (Context API, Redux/Zustand)</li>
          <li>API integration với Axios/Fetch</li>
        </ul>

        <h3>Thời gian học: 4-6 tuần</h3>
        <p>Projects: Blog Website, E-commerce Frontend, Social Media App...</p>

        <h2>5. Backend với Node.js</h2>
        <p>Để trở thành full-stack developer, bạn cần học backend. Node.js cho phép dùng JavaScript ở backend.</p>

        <h3>Kiến thức cần học:</h3>
        <ul>
          <li>Node.js fundamentals & NPM</li>
          <li>Express.js framework</li>
          <li>RESTful API design</li>
          <li>Authentication & Authorization (JWT, OAuth)</li>
          <li>Database: MongoDB hoặc PostgreSQL</li>
          <li>ORM/ODM: Prisma hoặc Mongoose</li>
        </ul>

        <h3>Thời gian học: 4-6 tuần</h3>

        <h2>6. Advanced Topics</h2>
        <p>Sau khi nắm vững cơ bản, bạn nên học thêm:</p>
        <ul>
          <li>TypeScript</li>
          <li>Next.js (React framework)</li>
          <li>Testing (Jest, React Testing Library)</li>
          <li>Docker & CI/CD</li>
          <li>Cloud deployment (Vercel, Netlify, AWS)</li>
        </ul>

        <h2>Lời khuyên cuối cùng</h2>
        <p>Đừng cố học quá nhiều thứ cùng lúc. Hãy tập trung vào một công nghệ, thực hành nhiều, làm projects thực tế và đừng ngại đọc documentation.</p>
        <p><strong>Thời gian tổng: 4-6 tháng</strong> nếu học full-time, hoặc <strong>8-12 tháng</strong> nếu học part-time.</p>
        <p>Chúc bạn thành công trên con đường trở thành Web Developer! 🚀</p>
      `,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
      author: 'Nguyễn Văn A',
      date: '15/12/2025',
      category: 'tutorial',
      tags: ['JavaScript', 'React', 'Web Development', 'Roadmap'],
      readTime: '10 phút'
    }),  [postId]);

  // Mock related posts
  const relatedPosts = useMemo<BlogPost[]>(() => [
    {
      id: '2',
      title: '10 Tips để code JavaScript hiệu quả hơn',
      content: '',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
      author: 'Trần Thị B',
      date: '12/12/2025',
      category: 'tutorial',
      tags: ['JavaScript'],
      readTime: '8 phút'
    },
    {
      id: '6',
      title: 'TypeScript cho người mới: Hướng dẫn toàn tập',
      content: '',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
      author: 'Đặng Thị F',
      date: '03/12/2025',
      category: 'tutorial',
      tags: ['TypeScript'],
      readTime: '15 phút'
    },
  ], []);

  if (!post) {
    return (
      <>
        <Sidebar />
        <div className="mainLayout">
          <div className={styles.loading}>Đang tải...</div>
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
            {/* Back button */}
            <button 
              className={styles.backBtn}
              onClick={() => router.push('/blog')}
            >
              <ArrowLeftOutlined /> Quay lại Blog
            </button>

            {/* Article */}
            <article className={styles.article}>
              {/* Header */}
              <header className={styles.articleHeader}>
                <div className={styles.categoryBadge}>{post.category}</div>
                <h1 className={styles.articleTitle}>{post.title}</h1>
                
                <div className={styles.articleMeta}>
                  <div className={styles.metaItem}>
                    <UserOutlined />
                    <span>{post.author}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <CalendarOutlined />
                    <span>{post.date}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <ClockCircleOutlined />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className={styles.articleTags}>
                  {post.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      <TagOutlined /> {tag}
                    </span>
                  ))}
                </div>
              </header>

              {/* Featured Image */}
              <div className={styles.featuredImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} />
              </div>

              {/* Content */}
              <div 
                className={styles.articleContent}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className={styles.relatedSection}>
                <h2 className={styles.relatedTitle}>Bài viết liên quan</h2>
                <div className={styles.relatedGrid}>
                  {relatedPosts.map(related => (
                    <div 
                      key={related.id} 
                      className={styles.relatedCard}
                      onClick={() => router.push(`/blog/${related.id}`)}
                    >
                      <div className={styles.relatedImage}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={related.image} alt={related.title} />
                      </div>
                      <div className={styles.relatedContent}>
                        <h3 className={styles.relatedCardTitle}>{related.title}</h3>
                        <div className={styles.relatedMeta}>
                          <span>{related.author}</span>
                          <span>•</span>
                          <span>{related.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
