'use client';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import styles from './learning-path.module.scss';

export default function LearningPath() {
  return (
    <>
      <Sidebar />
      <div className="mainLayout">
        <main className={styles.main}>
          <div className="container">
            <h1 className={styles.pageTitle}>Lộ trình học</h1>
            <p className={styles.pageSubtitle}>
              Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học. Ví dụ: Để đi làm với vị trí &ldquo;Lập trình viên Front-end&rdquo; bạn nên tập trung vào lộ trình &ldquo;Front-end&rdquo;.
            </p>

            {/* Learning Paths */}
            <div className={styles.pathsGrid}>
              {/* Front-end Path */}
              <div className={styles.pathCard}>
                <div className={styles.pathHeader}>
                  <div className={styles.pathIcon}>
                    <svg width="80" height="80" viewBox="0 0 100 100">
                      <rect x="10" y="15" width="80" height="60" rx="4" fill="#4caf50" opacity="0.2"/>
                      <rect x="15" y="20" width="70" height="10" rx="2" fill="#4caf50"/>
                      <rect x="15" y="35" width="30" height="30" rx="2" fill="#4caf50" opacity="0.6"/>
                      <rect x="50" y="35" width="35" height="10" rx="2" fill="#4caf50" opacity="0.6"/>
                      <rect x="50" y="50" width="35" height="15" rx="2" fill="#4caf50" opacity="0.6"/>
                    </svg>
                  </div>
                  <div className={styles.pathInfo}>
                    <h2 className={styles.pathTitle}>Lộ trình học Front-end</h2>
                    <p className={styles.pathDescription}>
                      Lập trình viên Front-end là người xây dựng ra giao diện websites. Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.
                    </p>
                  </div>
                </div>
                
                <div className={styles.techIcons}>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'}}>
                    <span>JS</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
                    <span>📱</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                    <span>CSS</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'}}>
                    <span>📦</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                    <span>⚙️</span>
                  </div>
                </div>

                <Link href="/learning-path/frontend" className={styles.pathButton}>
                  Xem chi tiết
                </Link>
              </div>

              {/* Back-end Path */}
              <div className={styles.pathCard}>
                <div className={styles.pathHeader}>
                  <div className={styles.pathIcon}>
                    <svg width="80" height="80" viewBox="0 0 100 100">
                      <circle cx="50" cy="30" r="15" fill="#2196F3" opacity="0.6"/>
                      <circle cx="30" cy="60" r="15" fill="#2196F3" opacity="0.6"/>
                      <circle cx="70" cy="60" r="15" fill="#2196F3" opacity="0.6"/>
                      <line x1="50" y1="45" x2="35" y2="50" stroke="#2196F3" strokeWidth="3"/>
                      <line x1="50" y1="45" x2="65" y2="50" stroke="#2196F3" strokeWidth="3"/>
                      <rect x="20" y="75" width="60" height="15" rx="3" fill="#2196F3"/>
                    </svg>
                  </div>
                  <div className={styles.pathInfo}>
                    <h2 className={styles.pathTitle}>Lộ trình học Back-end</h2>
                    <p className={styles.pathDescription}>
                      Trái với Front-end thì lập trình viên Back-end là người làm việc với dữ liệu, công việc thường nặng tính logic hơn. Chúng ta sẽ cùng tìm hiểu thêm về lộ trình học Back-end nhé.
                    </p>
                  </div>
                </div>
                
                <div className={styles.techIcons}>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'}}>
                    <span>JS</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
                    <span>📗</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                    <span>💾</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
                    <span>🔧</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                    <span>⚛️</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'}}>
                    <span>🌐</span>
                  </div>
                  <div className={styles.techIcon} style={{background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'}}>
                    <span>🎨</span>
                  </div>
                </div>

                <Link href="/learning-path/backend" className={styles.pathButton}>
                  Xem chi tiết
                </Link>
              </div>
            </div>

            {/* Community Section */}
            <div className={styles.communitySection}>
              <div className={styles.communityContent}>
                <h2 className={styles.communityTitle}>Tham gia cộng đồng học viên IT trên Facebook</h2>
                <p className={styles.communityText}>
                  Hàng nghìn người khác đang học lộ trình giống như bạn. Hãy tham gia hỏi đáp, chia sẻ và hỗ trợ nhau trong quá trình học nhé.
                </p>
                <button className={styles.communityButton}>Tham gia nhóm</button>
              </div>
              <div className={styles.communityImage}>
                <div className={styles.mockupContainer}>
                  <div className={styles.mockupCard}>💡</div>
                  <div className={styles.mockupCard}>📱</div>
                  <div className={styles.mockupCard}>❤️</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
