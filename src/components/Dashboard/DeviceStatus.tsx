'use client';
import { DeviceInfo } from '@/data/mockData';
import styles from './DeviceStatus.module.css';

interface Props {
  devices: DeviceInfo[];
}

export default function DeviceStatus({ devices }: Props) {
  const statusConfig = {
    online: { label: '正常', color: '#00ff88' },
    offline: { label: '離線', color: '#ff3366' },
    warning: { label: '異常', color: '#ff6b35' },
  };

  const typeIcon: Record<string, string> = {
    '攝影機': '📷',
    'LiDAR': '📡',
    '邊緣主機': '🖥️',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>◎</span>
          邊緣設備狀態
        </h3>
        <span className={styles.summary}>
          {devices.filter(d => d.status === 'online').length}/{devices.length} 在線
        </span>
      </div>
      <div className={styles.grid}>
        {devices.map(device => {
          const cfg = statusConfig[device.status];
          return (
            <div key={device.id} className={styles.device}>
              <div className={styles.deviceHeader}>
                <span className={styles.deviceIcon}>{typeIcon[device.type]}</span>
                <span className={styles.deviceId}>{device.id}</span>
                <span className={styles.statusDot} style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}60` }} />
              </div>
              <div className={styles.deviceName}>{device.name}</div>
              <div className={styles.deviceMeta}>
                <span>{device.location}</span>
                <span>Ping: {device.lastPing}</span>
              </div>
              {device.cpu !== undefined && device.cpu > 0 && (
                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>CPU</span>
                    <div className={styles.bar}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${device.cpu}%`,
                          background: device.cpu > 80 ? '#ff3366' : device.cpu > 60 ? '#ff6b35' : '#00d4ff',
                        }}
                      />
                    </div>
                    <span className={styles.metricVal}>{device.cpu}%</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>溫度</span>
                    <div className={styles.bar}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${Math.min((device.temp || 0) / 100 * 100, 100)}%`,
                          background: (device.temp || 0) > 70 ? '#ff3366' : (device.temp || 0) > 55 ? '#ff6b35' : '#00d4ff',
                        }}
                      />
                    </div>
                    <span className={styles.metricVal}>{device.temp}°C</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
