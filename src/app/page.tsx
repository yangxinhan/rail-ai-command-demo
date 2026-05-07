'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from './page.module.css';

const features = [
  {
    icon: '📡',
    title: '即時影像與點雲辨識',
    desc: '車載與沿線攝影機影像串流結合 LiDAR 點雲資料，即時鎖定並分類軌道上的異物，精確計算與列車的相對距離。',
    color: '#00d4ff',
  },
  {
    icon: '🚨',
    title: '預警與硬體連動',
    desc: '辨識高風險異物時自動觸發警報，推播至駕駛艙與行控中心。距離過近時透過 ATP 介接強制啟動煞車機制。',
    color: '#ff6b35',
  },
  {
    icon: '📊',
    title: '決策支援戰情室',
    desc: '收集偵測日誌、影像紀錄與設備狀態，視覺化儀表板呈現各路段風險指數，支援事後分析與防護加強。',
    color: '#00ff88',
  },
];

const advantages = [
  { icon: '🌐', title: '全天候感測融合', desc: 'LiDAR + AI 視覺雙模態，不受天候影響' },
  { icon: '🎯', title: '高準確度 AI', desc: '精準辨識障礙物，過濾無效干擾' },
  { icon: '⚡', title: '低延遲邊緣運算', desc: '毫秒級反應，不依賴雲端' },
  { icon: '🔍', title: '多源融合監控', desc: '動態+靜態雙重視角，消除死角' },
];

export default function HomePage() {
  const particleRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle { x: number; y: number; vx: number; vy: number; r: number; a: number; }
    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        a: Math.random() * 0.4 + 0.1,
      });
    }

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.a})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={styles.page}>
      <canvas ref={particleRef} className={styles.particleBg} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Proactive Edge-Computing Defense Network</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine}>軌道異物與</span>
            <span className={styles.titleGradient}>安全偵測系統</span>
          </h1>
          <p className={styles.heroDesc}>
            結合高解析度攝影機、光學雷達 (LiDAR) 與邊緣運算 AI，實現毫秒級別的
            <strong>「即時辨識、即時決策、即時連動煞車」</strong>閉環控制，將災害防範於未然。
          </p>
          <div className={styles.heroCta}>
            <Link href="/dashboard" className={styles.ctaPrimary}>
              進入戰情室 →
            </Link>
            <Link href="/monitoring" className={styles.ctaSecondary}>
              查看即時監控
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.statNum}>99.7%</span>
              <span className={styles.statLabel}>系統正常運行</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.heroStat}>
              <span className={styles.statNum}>&lt;50ms</span>
              <span className={styles.statLabel}>偵測反應延遲</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.heroStat}>
              <span className={styles.statNum}>24/7</span>
              <span className={styles.statLabel}>全天候監控</span>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.radarWrap}>
            <div className={styles.radarOuter} />
            <div className={styles.radarMiddle} />
            <div className={styles.radarInner} />
            <div className={styles.radarSweep} />
            <div className={styles.radarCenter} />
            <div className={styles.radarDot} style={{ top: '25%', left: '60%' }} />
            <div className={styles.radarDot} style={{ top: '45%', left: '35%' }} />
            <div className={styles.radarDot} style={{ top: '65%', left: '55%' }} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>三大核心模組</h2>
        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard} style={{ '--card-color': f.color } as React.CSSProperties}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureName}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
              <div className={styles.featureGlow} />
            </div>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className={styles.advantages}>
        <h2 className={styles.sectionTitle}>系統特色</h2>
        <div className={styles.advGrid}>
          {advantages.map((a, i) => (
            <div key={i} className={styles.advCard}>
              <span className={styles.advIcon}>{a.icon}</span>
              <div>
                <h4 className={styles.advTitle}>{a.title}</h4>
                <p className={styles.advDesc}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className={styles.techSection}>
        <h2 className={styles.sectionTitle}>開發技術</h2>
        <div className={styles.techGrid}>
          {[
            { label: 'AI 模型', items: ['YOLOv8/v10', 'PyTorch', 'TensorFlow'] },
            { label: '邊緣運算', items: ['Jetson Orin Nano', 'Jetson AGX Xavier'] },
            { label: '全端框架', items: ['Next.js', 'React', 'TypeScript'] },
            { label: '即時通訊', items: ['MQTT', 'Redis', 'WebRTC'] },
            { label: '資料庫', items: ['PostgreSQL', 'MongoDB'] },
          ].map((tech, i) => (
            <div key={i} className={styles.techCard}>
              <span className={styles.techLabel}>{tech.label}</span>
              <div className={styles.techItems}>
                {tech.items.map((item, j) => (
                  <span key={j} className={styles.techItem}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className={styles.footerCta}>
        <Link href="/dashboard" className={styles.ctaPrimary}>
          開始體驗 Demo →
        </Link>
      </section>
    </div>
  );
}
