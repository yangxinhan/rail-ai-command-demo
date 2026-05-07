'use client';
import { useEffect, useRef } from 'react';
import { StationInfo, TrainInfo } from '@/data/mockData';
import styles from './TrainMap.module.css';

interface Props {
  stations: StationInfo[];
  trains: TrainInfo[];
}

export default function TrainMap({ stations, trains }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Build route path
    const pts = stations.map(s => ({
      x: (s.x / 100) * w,
      y: (s.y / 100) * h,
    }));

    // Draw route glow
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Draw route line
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Draw stations
    stations.forEach((s, i) => {
      const sx = pts[i].x;
      const sy = pts[i].y;
      const risk = s.riskLevel;
      const color = risk > 50 ? '#ff3366' : risk > 30 ? '#ff6b35' : '#00ff88';

      // Station circle
      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Risk ring
      if (risk > 30) {
        ctx.beginPath();
        ctx.arc(sx, sy, 12, 0, Math.PI * 2);
        ctx.strokeStyle = color.replace(')', ',0.3)').replace('rgb', 'rgba');
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = '#8892a8';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(s.name, sx + 14, sy + 4);
    });

    // Draw trains
    const totalLen = pts.reduce((acc, p, i) => {
      if (i === 0) return 0;
      return acc + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y);
    }, 0);

    trains.forEach(train => {
      const targetDist = (train.position / 100) * totalLen;
      let traveled = 0;
      let tx = pts[0].x, ty = pts[0].y;

      for (let i = 1; i < pts.length; i++) {
        const segLen = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        if (traveled + segLen >= targetDist) {
          const ratio = (targetDist - traveled) / segLen;
          tx = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * ratio;
          ty = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * ratio;
          break;
        }
        traveled += segLen;
      }

      const trainColor = train.status === 'braking' ? '#ff6b35' : train.status === 'stopped' ? '#ff3366' : '#00d4ff';

      // Train glow
      const gradient = ctx.createRadialGradient(tx, ty, 0, tx, ty, 20);
      gradient.addColorStop(0, trainColor.replace(')', ',0.3)').replace('#', 'rgba(').replace(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/, (_, r, g, b) => `${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)}`));
      gradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(tx, ty, 20, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Train dot
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fillStyle = trainColor;
      ctx.fill();

      // Train label
      ctx.fillStyle = trainColor;
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(train.id, tx, ty - 12);
      ctx.fillStyle = '#8892a8';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`${Math.round(train.speed)} km/h`, tx, ty + 18);
    });
  }, [stations, trains]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>◈</span>
          軌道路線即時態勢
        </h3>
        <span className={styles.badge}>LIVE</span>
      </div>
      <div className={styles.mapWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  );
}
