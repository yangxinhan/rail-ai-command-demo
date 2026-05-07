'use client';
import MainLayout from '@/components/Layout/MainLayout';
import CameraFeed from '@/components/Monitoring/CameraFeed';
import PointCloudView from '@/components/Monitoring/PointCloudView';
import { useSimulation } from '@/hooks/useSimulation';
import styles from './page.module.css';

const cameras = [
  { id: 'CAM-01', label: '車載前方攝影機 #1', location: 'T101 車頭' },
  { id: 'CAM-02', label: '沿線固定攝影機 #2', location: '苗栗三義段' },
  { id: 'CAM-03', label: '沿線固定攝影機 #3', location: '雲林斗六段' },
  { id: 'CAM-04', label: '車載前方攝影機 #4', location: 'T203 車頭' },
];

export default function MonitoringPage() {
  const { alerts } = useSimulation();
  const recentDetections = alerts.slice(0, 6);

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>即時監控</h1>
          <p className={styles.pageDesc}>多路攝影機即時影像與 LiDAR 3D 點雲資料融合分析</p>
        </div>

        {/* Camera Grid */}
        <div className={styles.cameraGrid}>
          {cameras.map(cam => (
            <CameraFeed key={cam.id} cameraId={cam.id} label={cam.label} location={cam.location} />
          ))}
        </div>

        {/* LiDAR + Detection Log */}
        <div className={styles.bottomGrid}>
          <div className={styles.lidarSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleIcon}>📡</span>
                LiDAR 3D 點雲視覺化
              </h2>
              <span className={styles.liveBadge}>LIVE</span>
            </div>
            <PointCloudView />
          </div>

          <div className={styles.detectionLog}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleIcon}>📋</span>
                偵測結果日誌
              </h2>
            </div>
            <div className={styles.logList}>
              {recentDetections.map((det, i) => (
                <div key={det.id} className={styles.logItem} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={styles.logDot} style={{
                    background: det.severity === 'critical' ? '#ff3366' : det.severity === 'warning' ? '#ff6b35' : '#00d4ff'
                  }} />
                  <div className={styles.logContent}>
                    <div className={styles.logTop}>
                      <span className={styles.logType}>{det.objectType}</span>
                      <span className={styles.logTime}>
                        {new Date(det.timestamp).toLocaleTimeString('zh-TW', { hour12: false })}
                      </span>
                    </div>
                    <div className={styles.logBottom}>
                      <span>{det.location}</span>
                      <span>距離: {det.distance}m</span>
                      <span>信心度: {(85 + Math.random() * 14).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
