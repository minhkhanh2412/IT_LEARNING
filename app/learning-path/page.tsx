'use client';
import Link from 'next/link';
import Image from 'next/image';
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
                    <Image
                      src="/assets/roadmap/fe.png"
                      alt="Front-end"
                      width={120}
                      height={100}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.pathInfo}>
                    <h2 className={styles.pathTitle}>Lộ trình học Front-end</h2>
                    <p className={styles.pathDescription}>
                      Lập trình viên Front-end là người xây dựng ra giao diện websites. Trong phần này IT sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.
                    </p>
                  </div>
                </div>
                
                <div className={styles.techIcons}>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/1.png"
                      alt="Tech 1"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/2.png"
                      alt="Tech 2"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/3.png"
                      alt="Tech 3"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/4.png"
                      alt="Tech 4"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/5.png"
                      alt="Tech 5"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
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
                    <Image
                      src="/assets/roadmap/be.png"
                      alt="Back-end"
                      width={120}
                      height={100}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.pathInfo}>
                    <h2 className={styles.pathTitle}>Lộ trình học Back-end</h2>
                    <p className={styles.pathDescription}>
                      Trái với Front-end thì lập trình viên Back-end là người làm việc với dữ liệu, công việc thường nặng tính logic hơn. Chúng ta sẽ cùng tìm hiểu thêm về lộ trình học Back-end nhé.
                    </p>
                  </div>
                </div>
                
                <div className={styles.techIcons}>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/1.png"
                      alt="Tech 1"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/2.png"
                      alt="Tech 2"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/3.png"
                      alt="Tech 3"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/4.png"
                      alt="Tech 4"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/5.png"
                      alt="Tech 5"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/6.png"
                      alt="Tech 6"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
                  </div>
                  <div className={styles.techIcon}>
                    <Image
                      src="/assets/roadmap/7.png"
                      alt="Tech 7"
                      width={48}
                      height={48}
                      style={{objectFit: 'contain'}}
                    />
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
                  <Image
                    src="/assets/learning-path/lrnpath.png"
                    alt="Cộng đồng học viên IT"
                    width={400}
                    height={400}
                    style={{objectFit: 'contain', maxWidth: '100%', height: 'auto'}}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
