import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface HeroViewProps {
  onEnter: () => void;
}

export const HeroView: React.FC<HeroViewProps> = ({ onEnter }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleEnterClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 320);
  };

  // Smoke / Fog atmospheric particle animation on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle definition
    interface SmokeParticle {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      maxAlpha: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      colorType: 'mist' | 'accent';
    }

    const particles: SmokeParticle[] = [];
    const isDesktop = width >= 768;
    const maxParticles = isDesktop ? 65 : 30;

    const createParticle = (initialRandomY = false): SmokeParticle => {
      const maxLife = isDesktop ? 280 + Math.random() * 220 : 240 + Math.random() * 200;
      const isAccent = Math.random() < 0.18; // 18% subtle cold cyan/blue accent
      return {
        x: isDesktop
          ? width * 0.05 + Math.random() * (width * 0.9)
          : width * 0.15 + Math.random() * (width * 0.7),
        y: initialRandomY
          ? height * 0.4 + Math.random() * (height * 0.5)
          : isDesktop
            ? height * 0.72 + Math.random() * (height * 0.24)
            : height * 0.65 + Math.random() * (height * 0.25),
        radius: isDesktop ? 90 + Math.random() * 150 : 70 + Math.random() * 120,
        alpha: 0,
        maxAlpha: isDesktop ? 0.055 + Math.random() * 0.075 : 0.05 + Math.random() * 0.08,
        vx: (Math.random() - 0.5) * (isDesktop ? 0.55 : 0.45),
        vy: -(0.2 + Math.random() * (isDesktop ? 0.4 : 0.35)),
        life: initialRandomY ? Math.floor(Math.random() * maxLife) : 0,
        maxLife,
        colorType: isAccent ? 'accent' : 'mist',
      };
    };

    // Pre-populate particles so smoke is visible immediately on load
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.alpha = (p.life / halfLife) * p.maxAlpha;
        } else {
          p.alpha = ((p.maxLife - p.life) / halfLife) * p.maxAlpha;
        }

        if (p.life >= p.maxLife || p.y < height * 0.12) {
          particles[i] = createParticle(false);
          continue;
        }

        const currentRadius = p.radius * (1 + (p.life / p.maxLife) * 0.55);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);

        if (p.colorType === 'accent') {
          grad.addColorStop(0, `rgba(160, 210, 255, ${p.alpha.toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(110, 170, 230, ${(p.alpha * 0.5).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(5, 8, 14, 0)');
        } else {
          grad.addColorStop(0, `rgba(195, 215, 235, ${p.alpha.toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(145, 175, 205, ${(p.alpha * 0.5).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(5, 8, 14, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#05070A] text-white flex flex-col justify-between select-none overflow-hidden transition-all duration-300 ${
        isExiting ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ height: '100dvh' }}
    >
      {/* Responsive Full-bleed Car Background: Mobile gets Colapinto portrait, PC gets Widescreen Alpine */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <picture className="w-full h-full">
          <source media="(min-width: 768px)" srcSet="/images/hero-desktop.jpg" />
          <img
            src="/images/colapinto-hero.jpg"
            alt="Delta F1 Hero"
            className="w-full h-full object-cover object-center md:object-center filter contrast-[1.04] brightness-[1.02] select-none"
            loading="eager"
            decoding="async"
          />
        </picture>

        {/* Bottom ground blending gradient to ensure seamless merge with button background */}
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-52 bg-gradient-to-t from-[#05070A] via-[#05070A]/85 to-transparent" />

        {/* Top subtle vignette for crisp DELTA wordmark contrast */}
        <div className="absolute inset-x-0 top-0 h-32 sm:h-40 bg-gradient-to-b from-[#05070A]/95 via-[#05070A]/65 to-transparent" />
      </div>

      {/* Dynamic Animated Smoke Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 mix-blend-screen opacity-80"
      />

      {/* Atmospheric Overhead Studio Light / Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12)_0%,_rgba(0,156,222,0.06)_40%,_transparent_75%)] pointer-events-none z-10" />

      {/* Ambient Moving Ground Mist Waves (CSS drift) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-35">
        <div
          className="absolute -bottom-20 -left-1/4 w-[150%] h-96 bg-[radial-gradient(ellipse_at_center,_rgba(190,220,250,0.1)_0%,_transparent_70%)] animate-pulse"
          style={{ animationDuration: '7s' }}
        />
        <div
          className="absolute -bottom-16 right-0 w-[80%] h-80 bg-[radial-gradient(ellipse_at_center,_rgba(170,200,240,0.08)_0%,_transparent_65%)] animate-pulse"
          style={{ animationDuration: '9s' }}
        />
      </div>

      {/* Top Header: F1 Vibes DELTA Wordmark positioned cleanly at the top */}
      <header className="relative z-20 w-full pt-8 sm:pt-10 md:pt-12 px-4 flex flex-col items-center justify-center select-none">
        <div className="flex flex-col items-center">
          {/* Main Racing DELTA Typography */}
          <div className="relative flex items-center justify-center">
            {/* Ambient Red Racing Glow behind letters */}
            <div className="absolute inset-0 blur-2xl bg-[#E10600]/30 rounded-full scale-150 pointer-events-none" />

            <h1
              className="relative text-5xl sm:text-6xl md:text-7xl font-black italic tracking-[0.24em] sm:tracking-[0.28em] uppercase select-none transition-transform"
              style={{
                fontFamily: '"Titillium Web", "Barlow Condensed", sans-serif',
                transform: 'skewX(-10deg)',
                background: 'linear-gradient(180deg, #FFFFFF 15%, #F1F5F9 55%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.95))',
              }}
            >
              DELTA
            </h1>
          </div>

          {/* Sleek F1 Underline Speed Slash */}
          <div className="flex items-center gap-1.5 mt-2 opacity-95" style={{ transform: 'skewX(-10deg)' }}>
            <div className="w-8 sm:w-14 h-[2.5px] bg-gradient-to-r from-transparent to-[#E10600]" />
            <div className="w-20 sm:w-32 h-[3px] bg-[#E10600] shadow-[0_0_12px_#E10600]" />
            <div className="w-8 sm:w-14 h-[2.5px] bg-gradient-to-l from-transparent to-[#E10600]" />
          </div>
        </div>
      </header>

      {/* Spacer so the car is completely open and unobstructed in the center */}
      <div className="flex-1" />

      {/* Bottom CTA: Sleek, Centered Ingresar Button */}
      <footer className="relative z-20 w-full px-6 pb-8 sm:pb-10 md:pb-12 flex flex-col items-center max-w-md mx-auto gap-3">
        <button
          type="button"
          onClick={handleEnterClick}
          className="group relative w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-800/80 to-zinc-900/90 hover:from-zinc-850 hover:to-zinc-800 border border-white/20 hover:border-white/40 text-white font-chakra font-bold text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(255,255,255,0.04)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(0,156,222,0.2)] active:scale-[0.98] cursor-pointer"
        >
          {/* Subtle button accent line glow */}
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-white/80 transition-opacity" />

          <span className="tracking-[0.2em]">{t.hero.enter}</span>
          <span className="text-[#E10600] group-hover:translate-x-1 transition-transform font-mono font-bold">→</span>
        </button>

        <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase text-center">
          {t.hero.subtitle}
        </p>
      </footer>
    </div>
  );
};
