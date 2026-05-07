'use client';
import { AlertEvent } from '@/data/mockData';
import styles from './AlertFeed.module.css';

interface Props {
  alerts: AlertEvent[];
  maxItems?: number;
}

export default function AlertFeed({ alerts, maxItems = 8 }: Props) {
  const severityConfig = {
    critical: { label: '危急', color: '#ff3366', bg: 'rgba(255,51,102,0.12)' },
    warning: { label: '警告', color: '#ff6b35', bg: 'rgba(255,107,53,0.12)' },
    info: { label: '通知', color: '#00d4ff', bg: 'rgba(0,212,255,0.12)' },
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>⚠</span>
          即時警報
        </h3>
        <span className={styles.count}>{alerts.filter(a => !a.resolved).length} 活躍</span>
      </div>
      <div className={styles.feed}>
        {alerts.slice(0, maxItems).map((alert, i) => {
          const cfg = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={`${styles.alertItem} ${i === 0 ? styles.latest : ''}`}
              style={{ animationDelay: `${i * 0.05}s`, borderLeftColor: cfg.color }}
            >
              <div className={styles.alertHeader}>
                <span className={styles.severity} style={{ color: cfg.color, background: cfg.bg }}>
                  {cfg.label}
                </span>
                <span className={styles.alertId}>{alert.id}</span>
                <span className={styles.alertTime}>{formatTime(alert.timestamp)}</span>
              </div>
              <div className={styles.alertBody}>
                <span className={styles.objType}>{alert.objectType}</span>
                <span className={styles.location}>{alert.location}</span>
              </div>
              <div className={styles.alertFooter}>
                <span className={styles.distance}>距離: {alert.distance}m</span>
                <span className={styles.train}>列車: {alert.trainId}</span>
                {alert.resolved && <span className={styles.resolved}>已排除</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
