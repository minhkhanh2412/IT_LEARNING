'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeOutlined, BookOutlined, ReadOutlined, FileTextOutlined } from '@ant-design/icons';
import styles from './Sidebar.module.scss';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: <HomeOutlined />, label: 'Home', href: '/' },
    { icon: <BookOutlined />, label: 'Lộ trình', href: '/learning-path' },
    { icon: <ReadOutlined />, label: 'Học', href: '/courses' },
    { icon: <FileTextOutlined />, label: 'Blog', href: '/blog' },
  ];

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        <div className={styles.logoIcon}>IT</div>
        <span className={styles.logoText}>Học Lập Trình Để Đi Làm</span>
      </Link>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
