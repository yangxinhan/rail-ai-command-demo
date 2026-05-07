'use client';
import { useEffect, useRef } from 'react';
import styles from './PointCloudView.module.css';

export default function PointCloudView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 640 * dpr;
    canvas.height = 360 * dpr;
    ctx.scale(dpr, dpr);
    const w = 640;
    const h = 360;

    // Generate point cloud data (bird's eye view of track)
    interface Point { x: number; y: number; z: number; type: string; }
    const points: Point[] = [];

    // Track surface points
    for (let i = 0; i < 500; i++) {
      const y = Math.random() * h;
      const trackWidth = 40 + (y / h) * 80;
      const cx = w / 2;
      points.push({
        x: cx + (Math.random() - 0.5) * trackWidth,
        y,
        z: Math.random() * 0.3,
        type: 'track',
      });
    }

    // Surrounding ground points
    for (let i = 0; i < 800; i++) {
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.5 - 0.1,
        type: 'ground',
      });
    }

    // Obstacle cluster (simulated rock)
    const obstX = w * 0.48;
    const obstY = h * 0.4;
    for (let i = 0; i < 60; i++) {
      points.push({
        x: obstX + (Math.random() - 0.5) * 40,
        y: obstY + (Math.random() - 0.5) * 30,
        z: 0.5 + Math.random() * 1.5,
        type: 'obstacle',
      });
    }

    let frame = 0;
    let animFrame: number;

    const draw = () => {
      frame++;
      ctx.fillStyle = 'rgba(6, 10, 20, 0.15)';
      ctx.fillRect(0, 0, w, h);

      // Draw points
      points.forEach(p => {
        const jx = p.x + Math.sin(frame * 0.02 + p.y * 0.01) * 0.5;
        const jy = p.y + Math.cos(frame * 0.02 + p.x * 0.01) * 0.5;

        let color: string;
        let size: number;
        if (p.type === 'obstacle') {
          color = `rgba(255, 51, 102, ${0.6 + Math.sin(frame * 0.05) * 0.3})`;
          size = 2.5;
        } else if (p.type === 'track') {
          color = 'rgba(0, 212, 255, 0.5)';
          size = 1.5;
        } else {
          const heightColor = Math.floor(p.z * 255);
          color = `rgba(${heightColor}, ${180 + heightColor * 0.3}, ${100}, 0.3)`;
          size = 1;
        }

        ctx.fillStyle = color;
        ctx.fillRect(jx, jy, size, size);
      });

      // Obstacle bounding box
      ctx.strokeStyle = 'rgba(255, 51, 102, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(obstX - 25, obstY - 20, 50, 40);
      ctx.setLineDash([]);

      // Distance line
      ctx.strokeStyle = 'rgba(255, 204, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, h);
      ctx.lineTo(obstX, obstY);
      ctx.stroke();

      // Distance label
      const dist = Math.floor(150 + Math.sin(frame * 0.01) * 5);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(obstX + 30, obstY - 8, 80, 16);
      ctx.fillStyle = '#ffcc00';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(`距離: ${dist}m`, obstX + 34, obstY + 4);

      // HUD
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, w, 20);
      ctx.fillStyle = '#00e5c8';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(`LiDAR 3D 點雲鳥瞰圖 | ${points.length} points | ${new Date().toLocaleTimeString('zh-TW', { hour12: false })}`, 8, 14);

      // Scan sweep line
      const sweepY = (frame * 2) % h;
      ctx.strokeStyle = 'rgba(0, 229, 200, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, sweepY);
      ctx.lineTo(w, sweepY);
      ctx.stroke();

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.dot} style={{ background: '#00d4ff' }} /> 軌道</span>
        <span className={styles.legendItem}><span className={styles.dot} style={{ background: '#ff3366' }} /> 異物</span>
        <span className={styles.legendItem}><span className={styles.dot} style={{ background: '#4a7' }} /> 地面</span>
      </div>
    </div>
  );
}
