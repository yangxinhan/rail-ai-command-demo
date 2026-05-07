'use client';
import { useEffect, useState } from 'react';
import styles from './StatsCard.module.css';

interface Props {
  title: string;
  value: number;
  suffix?: string;
  icon: string;
  color: string;
  trend?: number;
}

export default function StatsCard({ title, value, suffix = '', icon, color, trend }: Props) {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * value);
      setDisplayVal(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className={styles.card} style={{ '--card-color': color } as React.CSSProperties}>
      <div className={styles.iconWrap}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <div className={styles.valueRow}>
          <span className={styles.value}>{displayVal.toLocaleString()}{suffix}</span>
          {trend !== undefined && (
            <span className={`${styles.trend} ${trend >= 0 ? styles.up : styles.down}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      <div className={styles.glow} />
    </div>
  );
}
