'use client';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('zh-TW', { hour12: false }));
      setDate(now.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.breadcrumb}>
          <span className={styles.bcIcon}>⟐</span>
          <span>主動式邊緣運算防護網</span>
          <span className={styles.version}>v2.4.1</span>
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.connectionStatus}>
          <span className={styles.connDot} />
          <span>邊緣設備連線: 9/10</span>
        </div>
        <div className={styles.separator}>|</div>
        <div className={styles.alertBadge}>
          <span className={styles.alertDot} />
          <span>活躍警報: 3</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.datetime}>
          <span className={styles.time}>{time}</span>
          <span className={styles.date}>{date}</span>
        </div>
      </div>
    </header>
  );
}
