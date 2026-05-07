'use client';
import MainLayout from '@/components/Layout/MainLayout';
import DonutChart from '@/components/Charts/DonutChart';
import BarChart from '@/components/Charts/BarChart';
import LineChart from '@/components/Charts/LineChart';
import { objectDistribution, hourlyDetections, riskTrend, stations } from '@/data/mockData';
import styles from './page.module.css';

export default function AnalyticsPage() {
  const hourLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}`);

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>數據分析</h1>
          <p className={styles.pageDesc}>路段風險分析、偵測趨勢與設備效能報表</p>
        </div>

        {/* Risk Heatmap */}
        <div className={styles.heatmapSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>🗺️</span>
              路段風險指數
            </h2>
          </div>
          <div className={styles.heatmapGrid}>
            {stations.map((station, i) => {
              const risk = station.riskLevel;
              const color = risk > 50 ? '#ff3366' : risk > 30 ? '#ff6b35' : risk > 15 ? '#ffcc00' : '#00ff88';
              const bgColor = risk > 50 ? 'rgba(255,51,102,0.12)' : risk > 30 ? 'rgba(255,107,53,0.12)' : risk > 15 ? 'rgba(255,204,0,0.12)' : 'rgba(0,255,136,0.12)';
              return (
                <div key={i} className={styles.heatCell} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={styles.heatBar}>
                    <div className={styles.heatFill} style={{ height: `${risk}%`, background: `linear-gradient(to top, ${color}40, ${color})` }} />
                  </div>
                  <div className={styles.heatInfo}>
                    <span className={styles.heatName}>{station.name}</span>
                    <span className={styles.heatVal} style={{ color, background: bgColor }}>
                      {risk}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.heatLegend}>
            <span style={{ color: '#00ff88' }}>● 低風險 (0-15)</span>
            <span style={{ color: '#ffcc00' }}>● 中風險 (16-30)</span>
            <span style={{ color: '#ff6b35' }}>● 高風險 (31-50)</span>
            <span style={{ color: '#ff3366' }}>● 極高風險 (&gt;50)</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className={styles.chartsGrid}>
          <div className={styles.chartFull}>
            <LineChart data={riskTrend} title="30 日風險趨勢" color="#ff6b35" height={220} />
          </div>
          <div className={styles.chartHalf}>
            <BarChart data={hourlyDetections} labels={hourLabels} title="24 小時偵測頻率" color="#00d4ff" />
          </div>
          <div className={styles.chartHalf}>
            <DonutChart data={objectDistribution} title="異物類別分布" />
          </div>
        </div>

        {/* Performance Table */}
        <div className={styles.perfSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>📊</span>
              AI 模型效能指標
            </h2>
          </div>
          <div className={styles.perfGrid}>
            {[
              { label: '偵測準確率', value: '97.3%', trend: '+0.8%', color: '#00ff88' },
              { label: '誤報率', value: '2.1%', trend: '-0.3%', color: '#00d4ff' },
              { label: '漏報率', value: '0.6%', trend: '-0.1%', color: '#ffcc00' },
              { label: '平均推論延遲', value: '23ms', trend: '-2ms', color: '#00e5c8' },
              { label: 'FPS (邊緣設備)', value: '30.2', trend: '+0.5', color: '#a855f7' },
              { label: '模型版本', value: 'YOLOv8-L', trend: 'stable', color: '#8892a8' },
            ].map((m, i) => (
              <div key={i} className={styles.perfCard}>
                <span className={styles.perfLabel}>{m.label}</span>
                <span className={styles.perfValue} style={{ color: m.color }}>{m.value}</span>
                <span className={styles.perfTrend}>{m.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
