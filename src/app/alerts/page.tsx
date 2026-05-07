'use client';
import { useState, useMemo } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { generateAlerts, type AlertSeverity } from '@/data/mockData';
import styles from './page.module.css';

const allAlerts = generateAlerts(40);

export default function AlertsPage() {
  const [filter, setFilter] = useState<'all' | AlertSeverity>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return allAlerts;
    return allAlerts.filter(a => a.severity === filter);
  }, [filter]);

  const selected = allAlerts.find(a => a.id === selectedId);

  const severityConfig: Record<string, { label: string; color: string; bg: string }> = {
    critical: { label: '危急', color: '#ff3366', bg: 'rgba(255,51,102,0.12)' },
    warning: { label: '警告', color: '#ff6b35', bg: 'rgba(255,107,53,0.12)' },
    info: { label: '通知', color: '#00d4ff', bg: 'rgba(0,212,255,0.12)' },
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>警報歷史</h1>
          <p className={styles.pageDesc}>所有異物偵測事件紀錄與詳情</p>
        </div>

        {/* Summary cards */}
        <div className={styles.summaryRow}>
          {[
            { label: '總事件', count: allAlerts.length, color: '#00d4ff' },
            { label: '危急', count: allAlerts.filter(a => a.severity === 'critical').length, color: '#ff3366' },
            { label: '警告', count: allAlerts.filter(a => a.severity === 'warning').length, color: '#ff6b35' },
            { label: '已排除', count: allAlerts.filter(a => a.resolved).length, color: '#00ff88' },
          ].map((s, i) => (
            <div key={i} className={styles.summaryCard}>
              <span className={styles.summaryCount} style={{ color: s.color }}>{s.count}</span>
              <span className={styles.summaryLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          {(['all', 'critical', 'warning', 'info'] as const).map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '全部' : severityConfig[f].label}
              <span className={styles.filterCount}>
                {f === 'all' ? allAlerts.length : allAlerts.filter(a => a.severity === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Table + Detail */}
        <div className={styles.content}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>等級</th>
                  <th>類型</th>
                  <th>位置</th>
                  <th>距離</th>
                  <th>列車</th>
                  <th>時間</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((alert, i) => {
                  const cfg = severityConfig[alert.severity];
                  return (
                    <tr
                      key={alert.id}
                      className={`${styles.row} ${selectedId === alert.id ? styles.rowSelected : ''}`}
                      onClick={() => setSelectedId(alert.id)}
                      style={{ animationDelay: `${i * 0.02}s` }}
                    >
                      <td className={styles.mono}>{alert.id}</td>
                      <td>
                        <span className={styles.badge} style={{ color: cfg.color, background: cfg.bg }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td>{alert.objectType}</td>
                      <td className={styles.locationCell}>{alert.location}</td>
                      <td className={styles.mono}>{alert.distance}m</td>
                      <td className={styles.mono}>{alert.trainId}</td>
                      <td className={styles.mono}>
                        {new Date(alert.timestamp).toLocaleTimeString('zh-TW', { hour12: false })}
                      </td>
                      <td>
                        {alert.resolved
                          ? <span className={styles.resolved}>已排除</span>
                          : <span className={styles.unresolved}>處理中</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className={styles.detailPanel}>
              <h3 className={styles.detailTitle}>事件詳情</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>事件 ID</span>
                  <span className={styles.detailValue}>{selected.id}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>嚴重等級</span>
                  <span className={styles.detailValue} style={{ color: severityConfig[selected.severity].color }}>
                    {severityConfig[selected.severity].label}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>異物類型</span>
                  <span className={styles.detailValue}>{selected.objectType}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>偵測位置</span>
                  <span className={styles.detailValue}>{selected.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>距離</span>
                  <span className={styles.detailValue}>{selected.distance}m</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>關聯列車</span>
                  <span className={styles.detailValue}>{selected.trainId}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>攝影機</span>
                  <span className={styles.detailValue}>{selected.cameraId}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>描述</span>
                  <span className={styles.detailValue}>{selected.description}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>時間戳記</span>
                  <span className={styles.detailValue}>
                    {new Date(selected.timestamp).toLocaleString('zh-TW')}
                  </span>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedId(null)}>關閉</button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
