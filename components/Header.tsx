'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BookOutlined,
  DownOutlined,
  SunOutlined,
  MoonOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { User } from '@/types/user';
import styles from './Header.module.scss';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        return true;
      }
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tải thông tin user từ localStorage
    const loadUserData = () => {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined') {
          try {
            const userData = JSON.parse(userStr);
            console.log('=== HEADER DEBUG ===');
            console.log('Header loaded user:', userData);
            console.log('maLoaiNguoiDung:', userData.maLoaiNguoiDung);
            console.log('maLoaiNguoiDung type:', typeof userData.maLoaiNguoiDung);
            console.log('Is GV?', userData.maLoaiNguoiDung === 'GV');
            console.log('All user keys:', Object.keys(userData));
            // Move setState to next microtask to avoid cascading renders
            Promise.resolve().then(() => setUser(userData));
          } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user');
          }
        }
      }
    };

    loadUserData();

    // Lắng nghe sự thay đổi của localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        loadUserData();
      }
    };

    // Lắng nghe custom event
    const handleUserUpdate = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleUserUpdate);

    // Handle click outside dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
    setShowDropdown(false);
    router.push('/');
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isAdmin = user?.maLoaiNguoiDung === 'GV' || 
                  user?.tenLoaiNguoiDung?.toLowerCase().includes('giáo viên') ||
                  user?.tenLoaiNguoiDung?.toLowerCase().includes('admin') ||
                  user?.taiKhoan?.toLowerCase().includes('admin') ||
                  user?.taiKhoan?.toLowerCase().includes('teacher') ||
                  user?.taiKhoan?.toLowerCase().includes('gv');

  console.log('Current user:', user);
  console.log('maLoaiNguoiDung:', user?.maLoaiNguoiDung);
  console.log('tenLoaiNguoiDung:', user?.tenLoaiNguoiDung);
  console.log('taiKhoan:', user?.taiKhoan);
  console.log('Is admin check:', isAdmin);

  // Ẩn header ở trang login/register
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className={styles.header}>
      <form className={styles.searchContainer} onSubmit={handleSearch}>
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder="Tìm kiếm khóa học"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          <SearchOutlined />
        </button>
      </form>

      <div className={styles.rightSection}>
        <button 
          className={styles.themeToggle}
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        >
          {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        </button>

        {user ? (
          <div className={styles.userMenu} ref={dropdownRef}>
            <button 
              className={styles.userButton}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className={styles.userAvatar}>
                {isAdmin && <span className={styles.adminBadge}>admin</span>}
                {user.hinhAnh ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={user.hinhAnh} 
                    alt={user.hoTen}
                    className={styles.avatarImage}
                  />
                ) : (
                  user.hoTen.charAt(0).toUpperCase()
                )}
              </div>
              <span className={styles.userName}>{user.hoTen}</span>
              <DownOutlined className={styles.dropdownIcon} />
            </button>

            {showDropdown && (
              <div className={styles.dropdown}>
                <Link href="/profile" className={styles.dropdownItem}>
                  <UserOutlined className={styles.dropdownIcon} />
                  <span>Trang cá nhân</span>
                </Link>
                
                <Link href="/courses" className={styles.dropdownItem}>
                  <BookOutlined className={styles.dropdownIcon} />
                  <span>Khóa học</span>
                </Link>

                {isAdmin && (
                  <>
                    <div className={styles.divider}></div>
                    
                    <Link href="/admin/courses" className={styles.dropdownItem}>
                      <AppstoreOutlined className={styles.dropdownIcon} />
                      <span>Quản lý khóa học</span>
                    </Link>

                    <Link href="/admin/users" className={styles.dropdownItem}>
                      <TeamOutlined className={styles.dropdownIcon} />
                      <span>Quản lý người dùng</span>
                    </Link>
                  </>
                )}

                <div className={styles.divider}></div>

                <Link href="/profile/settings" className={styles.dropdownItem}>
                  <SettingOutlined className={styles.dropdownIcon} />
                  <span>Cài đặt</span>
                </Link>

                <button 
                  className={`${styles.dropdownItem} ${styles.danger}`}
                  onClick={handleLogout}
                >
                  <LogoutOutlined className={styles.dropdownIcon} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className={styles.loginButton}
            onClick={() => router.push('/login')}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
