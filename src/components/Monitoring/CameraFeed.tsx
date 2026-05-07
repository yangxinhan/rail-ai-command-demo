'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './CameraFeed.module.css';

interface DetectionBox {
  x: number; y: number; w: number; h: number;
  label: string; confidence: number; color: string;
}

interface Props {
  cameraId: string;
  label: string;
  location: string;
}

export default function CameraFeed({ cameraId, label, location }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detections, setDetections] = useState<DetectionBox[]>([]);

  // Simulated camera feed + AI detection boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 640;
    canvas.height = 360;

    let animFrame: number;
    let tick = 0;

    const draw = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      // Draw simulated rail track scene
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      sky.addColorStop(0, '#0a1628');
      sky.addColorStop(1, '#1a2a44');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.5);

      // Ground
      const ground = ctx.createLinearGradient(0, h * 0.4, 0, h);
      ground.addColorStop(0, '#1a2a3a');
      ground.addColorStop(1, '#0f1a28');
      ctx.fillStyle = ground;
      ctx.fillRect(0, h * 0.4, w, h * 0.6);

      // Rail tracks (perspective)
      ctx.strokeStyle = 'rgba(150, 170, 200, 0.5)';
      ctx.lineWidth = 2;
      // Left rail
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h);
      ctx.lineTo(w * 0.48, h * 0.4);
      ctx.stroke();
      // Right rail
      ctx.beginPath();
      ctx.moveTo(w * 0.7, h);
      ctx.lineTo(w * 0.52, h * 0.4);
      ctx.stroke();

      // Sleepers
      for (let i = 0; i < 15; i++) {
        const t = i / 15;
        const y = h * 0.4 + (h * 0.6) * t;
        const spread = 0.2 * t;
        const lx = w * (0.48 - spread * 0.9);
        const rx = w * (0.52 + spread * 0.9);
        ctx.strokeStyle = `rgba(100, 120, 150, ${0.15 + t * 0.25})`;
        ctx.lineWidth = 1 + t * 2;
        ctx.beginPath();
        ctx.moveTo(lx, y);
        ctx.lineTo(rx, y);
        ctx.stroke();
      }

      // Mountains/hills silhouette
      ctx.fillStyle = '#0f1f2f';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.45);
      ctx.quadraticCurveTo(w * 0.15, h * 0.3, w * 0.25, h * 0.4);
      ctx.quadraticCurveTo(w * 0.35, h * 0.28, w * 0.5, h * 0.38);
      ctx.quadraticCurveTo(w * 0.65, h * 0.25, w * 0.75, h * 0.35);
      ctx.quadraticCurveTo(w * 0.9, h * 0.28, w, h * 0.4);
      ctx.lineTo(w, h * 0.45);
      ctx.fill();

      // Simulate noise/grain
      if (tick % 3 === 0) {
        for (let i = 0; i < 100; i++) {
          const nx = Math.random() * w;
          const ny = Math.random() * h;
          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`;
          ctx.fillRect(nx, ny, 1, 1);
        }
      }

      // Simulated detection boxes (every ~3 seconds change)
      if (tick % 90 === 1) {
        const newDetections: DetectionBox[] = [];
        if (Math.random() < 0.6) {
          newDetections.push({
            x: 200 + Math.random() * 100,
            y: 160 + Math.random() * 60,
            w: 80 + Math.random() * 40,
            h: 60 + Math.random() * 30,
            label: ['落石', '倒塌樹木', '不明物體'][Math.floor(Math.random() * 3)],
            confidence: 0.85 + Math.random() * 0.14,
            color: '#ff3366',
          });
        }
        if (Math.random() < 0.3) {
          newDetections.push({
            x: 400 + Math.random() * 80,
            y: 200 + Math.random() * 50,
            w: 50 + Math.random() * 30,
            h: 70 + Math.random() * 30,
            label: '誤闖人員',
            confidence: 0.9 + Math.random() * 0.09,
            color: '#ff6b35',
          });
        }
        setDetections(newDetections);
      }

      // Draw detection boxes
      detections.forEach(det => {
        // Box
        ctx.strokeStyle = det.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(det.x, det.y, det.w, det.h);
        ctx.setLineDash([]);

        // Corner markers
        const cornerLen = 8;
        ctx.lineWidth = 3;
        // Top-left
        ctx.beginPath(); ctx.moveTo(det.x, det.y + cornerLen); ctx.lineTo(det.x, det.y); ctx.lineTo(det.x + cornerLen, det.y); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(det.x + det.w - cornerLen, det.y); ctx.lineTo(det.x + det.w, det.y); ctx.lineTo(det.x + det.w, det.y + cornerLen); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(det.x, det.y + det.h - cornerLen); ctx.lineTo(det.x, det.y + det.h); ctx.lineTo(det.x + cornerLen, det.y + det.h); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(det.x + det.w - cornerLen, det.y + det.h); ctx.lineTo(det.x + det.w, det.y + det.h); ctx.lineTo(det.x + det.w, det.y + det.h - cornerLen); ctx.stroke();

        // Label background
        const labelText = `${det.label} ${(det.confidence * 100).toFixed(1)}%`;
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        const tw = ctx.measureText(labelText).width + 10;
        ctx.fillStyle = det.color;
        ctx.fillRect(det.x, det.y - 18, tw, 16);
        ctx.fillStyle = '#fff';
        ctx.fillText(labelText, det.x + 5, det.y - 5);
      });

      // HUD overlay - timestamp
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, w, 24);
      ctx.fillStyle = '#00d4ff';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(`${cameraId} | ${new Date().toLocaleTimeString('zh-TW', { hour12: false })} | REC ●`, 8, 16);
      ctx.fillStyle = '#8892a8';
      ctx.textAlign = 'right';
      ctx.fillText(`AI YOLOv8 | 30fps | 1080p`, w - 8, 16);
      ctx.textAlign = 'left';

      // Crosshair in center
      const cx = w / 2, cy = h * 0.55;
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy + 20); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.stroke();

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [cameraId, detections]);

  return (
    <div className={styles.feed}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.overlay}>
        <span className={styles.label}>{label}</span>
        <span className={styles.location}>{location}</span>
      </div>
      {detections.length > 0 && (
        <div className={styles.detectionBanner}>
          ⚠ 偵測到 {detections.length} 個異物
        </div>
      )}
    </div>
  );
}
