'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/', label: '系統總覽', icon: '◈' },
  { href: '/dashboard', label: '戰情室', icon: '◉' },
  { href: '/monitoring', label: '即時監控', icon: '◎' },
  { href: '/alerts', label: '警報歷史', icon: '⚠' },
  { href: '/analytics', label: '數據分析', icon: '◫' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="url(#logoGrad)" strokeWidth="2" fill="none" />
            <path d="M8 16 L16 8 L24 16 L16 24 Z" stroke="url(#logoGrad)" strokeWidth="1.5" fill="rgba(0,212,255,0.1)" />
            <circle cx="16" cy="16" r="3" fill="#00d4ff" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#00ff88" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>RAIL AI</span>
          <span className={styles.logoSub}>軌道安全偵測</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {pathname === item.href && <span className={styles.activeIndicator} />}
          </Link>
        ))}
      </nav>

      <div className={styles.systemInfo}>
        <div className={styles.statusDot} />
        <span className={styles.statusText}>系統運行中</span>
      </div>
    </aside>
  );
}
