import React, { useEffect, useRef, useState } from 'react';

interface HeroViewProps {
  onEnter: () => void;
}

export const HeroView: React.FC<HeroViewProps> = ({ onEnter }) => {
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
    }

    const particles: SmokeParticle[] = [];
    const maxParticles = Math.min(30, Math.floor(width / 30));

    const createParticle = (initialRandomY = false): SmokeParticle => {
      const maxLife = 240 + Math.random() * 200;
      return {
        x: width * 0.15 + Math.random() * (width * 0.7),
        y: initialRandomY ? height * 0.3 + Math.random() * (height * 0.5) : height * 0.65 + Math.random() * (height * 0.25),
        radius: 70 + Math.random() * 130,
        alpha: 0,
        maxAlpha: 0.05 + Math.random() * 0.08,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(0.25 + Math.random() * 0.4),
        life: initialRandomY ? Math.floor(Math.random() * maxLife) : 0,
        maxLife,
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

        if (p.life >= p.maxLife || p.y < height * 0.1) {
          particles[i] = createParticle(false);
          continue;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(180, 205, 230, ${p.alpha.toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(140, 170, 200, ${(p.alpha * 0.5).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(10, 14, 20, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
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
      {/* Full-bleed Car Background Image - fills entire screen with zero side gaps */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <img
          src="/images/colapinto-hero.jpg"
          alt="Franco Colapinto #43 F1"
          className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-[1.02] select-none"
          loading="eager"
          decoding="async"
        />

        {/* Bottom ground blending gradient to ensure seamless merge with button background */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05070A] via-[#05070A]/85 to-transparent" />

        {/* Top subtle vignette */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#05070A] via-[#05070A]/60 to-transparent" />
      </div>

      {/* Dynamic Animated Smoke Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 mix-blend-screen opacity-75"
      />

      {/* Atmospheric Overhead Studio Light / Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-72 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12)_0%,_rgba(0,156,222,0.06)_40%,_transparent_75%)] pointer-events-none z-10" />

      {/* Ambient Moving Fog Waves (CSS keyframe drift) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-30">
        <div className="absolute -bottom-24 -left-1/4 w-[150%] h-96 bg-[radial-gradient(ellipse_at_center,_rgba(200,225,255,0.08)_0%,_transparent_70%)] animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      {/* Minimal Top Brand Bar */}
      <header className="relative z-20 w-full px-6 pt-6 sm:pt-8 flex items-center justify-start max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#E10600] flex items-center justify-center font-black text-white text-[11px] italic tracking-tighter shadow-[0_0_12px_rgba(225,6,0,0.4)]">
            D
          </div>
          <span className="font-extrabold tracking-widest text-zinc-300 text-xs uppercase italic font-sans">
            DELTA
          </span>
        </div>
      </header>

      {/* Spacer to keep layout balanced */}
      <div className="flex-1" />

      {/* Bottom CTA: Simple, Bold, Clean text only */}
      <footer className="relative z-20 w-full px-6 pb-8 sm:pb-12 flex flex-col items-center max-w-md mx-auto gap-3">
        <button
          type="button"
          onClick={handleEnterClick}
          className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-800/80 to-zinc-900/90 hover:from-zinc-850 hover:to-zinc-800 border border-white/15 hover:border-white/30 text-white font-chakra font-bold text-sm sm:text-base uppercase tracking-widest flex items-center justify-center transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(255,255,255,0.04)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(0,156,222,0.15)] active:scale-[0.98] cursor-pointer"
        >
          {/* Subtle button accent line glow */}
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:via-white/70 transition-opacity" />

          <span>Ingresar a Delta</span>
        </button>

        <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase text-center">
          Telemetría · Fechas · Historial · F1 / F2 / F3
        </p>
      </footer>
    </div>
  );
};
