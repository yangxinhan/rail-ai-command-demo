'use client';
import styles from './LineChart.module.css';

interface Props {
  data: number[];
  title: string;
  color?: string;
  height?: number;
}

export default function LineChart({ data, title, color = '#00d4ff', height = 200 }: Props) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 30;
  const w = 600;
  const h = height;
  const plotW = w - padding * 2;
  const plotH = h - padding * 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * plotW;
    const y = padding + plotH - ((v - min) / range) * plotH;
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - padding} L ${padding} ${h - padding} Z`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>◫</span>
          {title}
        </h3>
      </div>
      <div className={styles.chart}>
        <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg}>
          <defs>
            <linearGradient id={`lineGrad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding + plotH * (1 - pct);
            const label = Math.round(min + range * pct);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={w - padding} y2={y} stroke="rgba(0,212,255,0.06)" strokeWidth="1" />
                <text x={padding - 6} y={y + 3} textAnchor="end" fill="#4a5568" fontSize="10" fontFamily="JetBrains Mono">{label}</text>
              </g>
            );
          })}
          {/* Area fill */}
          <path d={areaD} fill={`url(#lineGrad-${title})`} className={styles.area} />
          {/* Line */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.line} />
          {/* Dots */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="var(--bg-primary)" strokeWidth="1.5" className={styles.dot} />
          ))}
        </svg>
      </div>
    </div>
  );
}
