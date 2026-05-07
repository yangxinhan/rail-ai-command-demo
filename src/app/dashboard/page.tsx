'use client';
import MainLayout from '@/components/Layout/MainLayout';
import TrainMap from '@/components/Dashboard/TrainMap';
import AlertFeed from '@/components/Dashboard/AlertFeed';
import StatsCard from '@/components/Dashboard/StatsCard';
import DeviceStatus from '@/components/Dashboard/DeviceStatus';
import DonutChart from '@/components/Charts/DonutChart';
import BarChart from '@/components/Charts/BarChart';
import { useSimulation } from '@/hooks/useSimulation';
import { stations, devices, objectDistribution, hourlyDetections } from '@/data/mockData';
import styles from './page.module.css';

export default function DashboardPage() {
  const { trainList, alerts, totalDetections, systemUptime } = useSimulation();

  const hourLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}`);
  const unresolvedCount = alerts.filter(a => !a.resolved).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        {/* Stats Row */}
        <div className={styles.statsRow}>
          <StatsCard title="今日偵測總數" value={totalDetections} icon="🔍" color="#00d4ff" trend={12} />
          <StatsCard title="活躍警報" value={unresolvedCount} icon="🚨" color="#ff6b35" trend={-5} />
          <StatsCard title="危急事件" value={criticalCount} icon="⚠️" color="#ff3366" />
          <StatsCard title="系統運行率" value={parseFloat(systemUptime.toFixed(1))} suffix="%" icon="✅" color="#00ff88" />
        </div>

        {/* Main Grid */}
        <div className={styles.mainGrid}>
          {/* Map */}
          <div className={styles.mapArea}>
            <TrainMap stations={stations} trains={trainList} />
          </div>

          {/* Alert Feed */}
          <div className={styles.alertArea}>
            <AlertFeed alerts={alerts} maxItems={10} />
          </div>
        </div>

        {/* Charts Row */}
        <div className={styles.chartsRow}>
          <div className={styles.chartCol}>
            <DonutChart data={objectDistribution} title="異物類別分布" />
          </div>
          <div className={styles.chartColWide}>
            <BarChart data={hourlyDetections} labels={hourLabels} title="24 小時偵測頻率" color="#00d4ff" />
          </div>
        </div>

        {/* Device Status */}
        <DeviceStatus devices={devices} />
      </div>
    </MainLayout>
  );
}
