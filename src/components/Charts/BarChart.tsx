'use client';
import styles from './BarChart.module.css';

interface Props {
  data: number[];
  labels?: string[];
  title: string;
  color?: string;
}

export default function BarChart({ data, labels, title, color = '#00d4ff' }: Props) {
  const max = Math.max(...data);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>◫</span>
          {title}
        </h3>
      </div>
      <div className={styles.chart}>
        <div className={styles.bars}>
          {data.map((val, i) => {
            const height = (val / max) * 100;
            return (
              <div key={i} className={styles.barGroup}>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(to top, ${color}40, ${color})`,
                      animationDelay: `${i * 0.03}s`,
                    }}
                  >
                    <span className={styles.barVal}>{val}</span>
                  </div>
                </div>
                {labels && <span className={styles.barLabel}>{labels[i]}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
