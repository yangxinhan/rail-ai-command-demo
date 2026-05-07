'use client';
import styles from './DonutChart.module.css';

interface DataItem {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DataItem[];
  title: string;
  size?: number;
}

export default function DonutChart({ data, title, size = 180 }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = 70;
  const stroke = 22;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>◫</span>
          {title}
        </h3>
      </div>
      <div className={styles.chartArea}>
        <svg width={size} height={size} viewBox="0 0 200 200" className={styles.svg}>
          {data.map((item, i) => {
            const pct = item.value / total;
            const dashLen = circumference * pct;
            const dashOffset = -offset;
            offset += dashLen;
            return (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={stroke}
                strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className={styles.segment}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            );
          })}
          <text x="100" y="92" textAnchor="middle" fill="#e8edf5" fontSize="28" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            {total}
          </text>
          <text x="100" y="116" textAnchor="middle" fill="#8892a8" fontSize="12">
            偵測總數
          </text>
        </svg>
        <div className={styles.legend}>
          {data.map((item, i) => (
            <div key={i} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: item.color }} />
              <span className={styles.legendLabel}>{item.label}</span>
              <span className={styles.legendVal}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
