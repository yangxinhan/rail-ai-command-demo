'use client';
import { useEffect, useRef } from 'react';
import { TrainInfo, westernStations, easternStations, southlinkStations } from '@/data/mockData';
import styles from './TrainMap.module.css';

interface Props {
  trains: TrainInfo[];
}

type LineKey = 'western' | 'eastern' | 'southlink';

const LINE_CONFIG: Record<LineKey, { color: string; label: string; glowColor: string }> = {
  western:   { color: 'rgba(0, 212, 255, 0.9)',   glowColor: 'rgba(0, 212, 255, 0.15)',  label: '縱貫線' },
  eastern:   { color: 'rgba(0, 255, 136, 0.9)',   glowColor: 'rgba(0, 255, 136, 0.15)',  label: '花東線' },
  southlink: { color: 'rgba(168, 85, 247, 0.9)',  glowColor: 'rgba(168, 85, 247, 0.15)', label: '南迴線' },
};

const ALL_STATIONS = {
  western:   westernStations,
  eastern:   easternStations,
  southlink: southlinkStations,
};

// Taiwan island silhouette as % coords [x, y] (west coast + east coast + southern tip)
// Approximated from real geography; x=0 is far left, y=0 is top
const TAIWAN_OUTLINE: [number, number][] = [
  // North tip
  [60, 3], [65, 4], [70, 6], [74, 9],
  // Northeast coast → east coast heading south
  [78, 14], [80, 18], [80, 22], [79, 28], [79, 35],
  [79, 42], [78, 50], [77, 58], [76, 65],
  // Southeast → southern tip
  [74, 71], [71, 76], [66, 83], [58, 90],
  [48, 95], [38, 97], [28, 95],
  // Southwest coast heading north
  [22, 91], [17, 87], [13, 81], [10, 75],
  [9, 68], [10, 60], [12, 52], [15, 44],
  [18, 36], [22, 28], [27, 20], [33, 13],
  [40, 7], [48, 4], [55, 3],
  [60, 3], // close
];

export default function TrainMap({ trains }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // — Grid —
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // — Taiwan island silhouette —
    const toCanvas = (px: number, py: number) => ({ x: (px / 100) * w, y: (py / 100) * h });
    ctx.beginPath();
    TAIWAN_OUTLINE.forEach(([px, py], i) => {
      const { x, y } = toCanvas(px, py);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle   = 'rgba(0, 30, 50, 0.55)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.18)';
    ctx.lineWidth   = 1;
    ctx.stroke();

    // — Draw a route line + its stations —
    const drawLine = (lineKey: LineKey) => {
      const stData = ALL_STATIONS[lineKey];
      const cfg    = LINE_CONFIG[lineKey];
      const pts    = stData.map(s => toCanvas(s.x, s.y));

      // Glow
      ctx.strokeStyle = cfg.glowColor;
      ctx.lineWidth   = 12;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Line
      ctx.strokeStyle = cfg.color;
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Stations
      stData.forEach((s, i) => {
        const { x: sx, y: sy } = pts[i];
        const risk      = s.riskLevel;
        const dotColor  = risk > 50 ? '#ff3366' : risk > 30 ? '#ff6b35' : '#00ff88';

        // Risk ring
        if (risk > 30) {
          ctx.beginPath();
          ctx.arc(sx, sy, 10, 0, Math.PI * 2);
          ctx.strokeStyle = risk > 50 ? 'rgba(255,51,102,0.3)' : 'rgba(255,107,53,0.3)';
          ctx.lineWidth   = 1;
          ctx.stroke();
        }

        // Dot
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fillStyle   = dotColor;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth   = 1;
        ctx.stroke();

        // Label — eastern line labels go left to avoid clipping
        const onEast   = lineKey === 'eastern';
        const onSouth  = lineKey === 'southlink';
        ctx.fillStyle  = '#8892a8';
        ctx.font       = '10px Inter, sans-serif';
        ctx.textAlign  = onEast ? 'left' : 'right';
        const offsetX  = onEast ? 8 : (onSouth ? -8 : -8);
        const offsetY  = onSouth ? -6 : 4;
        ctx.fillText(s.name, sx + offsetX, sy + offsetY);
      });
    };

    (['western', 'eastern', 'southlink'] as LineKey[]).forEach(drawLine);

    // — Draw trains —
    trains.forEach(train => {
      const lineKey  = (train.line as LineKey) in ALL_STATIONS ? (train.line as LineKey) : 'western';
      const stData   = ALL_STATIONS[lineKey];
      const pts      = stData.map(s => toCanvas(s.x, s.y));

      const totalLen = pts.reduce((acc, p, i) =>
        i === 0 ? 0 : acc + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y), 0);

      const targetDist = (train.position / 100) * totalLen;
      let traveled = 0, tx = pts[0].x, ty = pts[0].y;

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

      const baseCfgColor = LINE_CONFIG[lineKey].color;
      const trainColor   =
        train.status === 'stopped' ? '#ff3366' :
        train.status === 'braking' ? '#ff6b35' :
        baseCfgColor.replace(/[\d.]+\)$/, '1)');

      // Halo
      const grad = ctx.createRadialGradient(tx, ty, 0, tx, ty, 16);
      grad.addColorStop(0, trainColor.replace(/[\d.]+\)$/, '0.45)'));
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(tx, ty, 16, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fillStyle   = trainColor;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = trainColor;
      ctx.font      = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(train.id, tx, ty - 12);
      ctx.fillStyle = '#8892a8';
      ctx.font      = '9px JetBrains Mono, monospace';
      ctx.fillText(`${Math.round(train.speed)}km/h`, tx, ty + 20);
    });

    // — Legend (bottom-left) —
    const lx = 8;
    let ly = h - 10;
    ctx.font      = '9px Inter, sans-serif';
    ctx.textAlign = 'left';
    (['southlink', 'eastern', 'western'] as LineKey[]).forEach(key => {
      const cfg = LINE_CONFIG[key];
      ctx.fillStyle = cfg.color;
      ctx.fillRect(lx, ly - 7, 14, 3);
      ctx.fillStyle = '#8892a8';
      ctx.fillText(cfg.label, lx + 18, ly);
      ly -= 16;
    });

  }, [trains]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>◈</span>
          台鐵路線即時態勢
        </h3>
        <span className={styles.badge}>LIVE</span>
      </div>
      <div className={styles.mapWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  );
}
