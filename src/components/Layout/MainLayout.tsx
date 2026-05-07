'use client';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      {/* Scan line effect */}
      <div className={styles.scanLine} />
    </div>
  );
}
