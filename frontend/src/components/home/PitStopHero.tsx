import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';

interface PitStopHeroProps {
  onEnterDelta: () => void;
}

type PitPhase = 'approach' | 'service' | 'burnout' | 'reveal';

export const PitStopHero: React.FC<PitStopHeroProps> = ({ onEnterDelta }) => {
  const [phase, setPhase] = useState<PitPhase>('approach');
  const [stopwatch, setStopwatch] = useState<number>(0);
  const [approachProgress, setApproachProgress] = useState<number>(0);
  const [burnoutProgress, setBurnoutProgress] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const startSequence = () => {
    setPhase('approach');
    setStopwatch(0);
    setApproachProgress(0);
    setBurnoutProgress(0);

    const startTime = performance.now();
    const approachDuration = 1100;

    const loop = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < approachDuration) {
        // Approach phase (smooth deceleration into the box)
        const p = elapsed / approachDuration;
        const eased = 1 - (1 - p) * (1 - p);
        setApproachProgress(eased);
        animRef.current = requestAnimationFrame(loop);
      } else if (elapsed < 2400) {
        // Service phase (Pit Stop)
        setPhase('service');
        const serviceElapsed = (elapsed - approachDuration) / 1000;
        setStopwatch(Math.min(2.04, serviceElapsed * 1.57));
        animRef.current = requestAnimationFrame(loop);
      } else if (elapsed < 3200) {
        // Burnout launch phase
        setPhase('burnout');
        const burnoutElapsed = elapsed - 2400;
        const bp = Math.min(1, burnoutElapsed / 800);
        setBurnoutProgress(bp * bp);
        animRef.current = requestAnimationFrame(loop);
      } else {
        // Reveal phase
        setPhase('reveal');
        setStopwatch(2.04);
      }
    };

    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    startSequence();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Compute transform styles for the F1 Monoplaza
  let carScale = 1;
  let carY = 0;
  let carOpacity = 1;

  if (phase === 'approach') {
    carScale = 0.18 + approachProgress * 0.82;
    carY = -150 + approachProgress * 150;
    carOpacity = Math.min(1, approachProgress * 2.2);
  } else if (phase === 'service') {
    carScale = 1;
    carY = 0;
    carOpacity = 1;
  } else if (phase === 'burnout') {
    carScale = 1 + burnoutProgress * 2.8;
    carY = burnoutProgress * 340;
    carOpacity = Math.max(0, 1 - burnoutProgress * 1.15);
  } else {
    carScale = 4;
    carY = 340;
    carOpacity = 0;
  }

  // Engine vibration during burnout
  const shakeX = phase === 'burnout' ? (Math.random() - 0.5) * 8 : 0;
  const shakeY = phase === 'burnout' ? (Math.random() - 0.5) * 5 : 0;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#06070A] select-none min-h-[580px] sm:min-h-[620px] flex flex-col items-center justify-between p-4 sm:p-6 shadow-2xl">
      {/* GARAGE OVERHEAD & DEPTH BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Overhead Garage Pit Lane Roof Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-36 bg-gradient-to-b from-white/[0.07] to-transparent" />

        {/* Asphalt floor gradient with asphalt texture */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E14] via-[#07080C] to-[#040507]" />

        {/* Perspective Pit Box Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="none"
          viewBox="0 0 400 400"
        >
          <line x1="200" y1="70" x2="20" y2="400" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 6" />
          <line x1="200" y1="70" x2="380" y2="400" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 6" />
        </svg>

        {/* Yellow Wheel Stop T-Marks on the floor */}
        <div className="absolute top-[67%] left-1/2 -translate-x-1/2 w-72 sm:w-80 flex justify-between px-6 pointer-events-none">
          {/* Left tyre T-mark */}
          <div className="flex flex-col items-center opacity-80">
            <div className="w-14 h-1.5 bg-[#FFD60A] shadow-[0_0_10px_rgba(255,214,10,0.8)]" />
            <div className="w-1.5 h-7 bg-[#FFD60A]" />
          </div>
          {/* Right tyre T-mark */}
          <div className="flex flex-col items-center opacity-80">
            <div className="w-14 h-1.5 bg-[#FFD60A] shadow-[0_0_10px_rgba(255,214,10,0.8)]" />
            <div className="w-1.5 h-7 bg-[#FFD60A]" />
          </div>
        </div>

        {/* Black Burnout Skid Marks */}
        {(phase === 'burnout' || phase === 'reveal') && (
          <div className="absolute top-[67%] left-1/2 -translate-x-1/2 w-72 sm:w-80 flex justify-between px-6 pointer-events-none animate-in fade-in duration-300">
            <div className="w-12 h-44 bg-black/90 blur-[2px] rounded-full shadow-inner" />
            <div className="w-12 h-44 bg-black/90 blur-[2px] rounded-full shadow-inner" />
          </div>
        )}
      </div>

      {/* TOP HEADER: Escape & Brand */}
      <div className="relative z-20 w-full flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-xs bg-[#E10600] flex items-center justify-center font-black text-white text-[10px] italic shadow-sm">
            D
          </div>
          <span className="font-bold uppercase tracking-widest text-zinc-300">
            DELTA PIT GARAGE
          </span>
        </div>

        <button
          type="button"
          onClick={onEnterDelta}
          className="px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer text-[11px] font-bold tracking-wider uppercase"
        >
          <span>SALTAR AL TIMING →</span>
        </button>
      </div>

      {/* OVERHEAD PIT STOP GANTRY / LOLLIPOP */}
      <div className="relative z-20 flex flex-col items-center mt-1 transition-all duration-300">
        <div className="w-1.5 h-5 bg-zinc-700" />

        <div className="bg-[#101319]/95 backdrop-blur-md border-2 border-zinc-700/80 rounded-lg px-4 py-1.5 shadow-[0_0_25px_rgba(0,0,0,0.9)] flex items-center gap-3">
          {/* Signal Light Pods */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded-full transition-all duration-100 ${
                phase === 'approach' || phase === 'service'
                  ? 'bg-red-500 shadow-[0_0_14px_rgba(225,6,0,1)] ring-2 ring-red-500/40 animate-pulse'
                  : 'bg-zinc-800'
              }`}
            />
            <span
              className={`w-3.5 h-3.5 rounded-full transition-all duration-100 ${
                phase === 'burnout' || phase === 'reveal'
                  ? 'bg-emerald-400 shadow-[0_0_14px_rgba(52,199,89,1)] ring-2 ring-emerald-500/40'
                  : 'bg-zinc-800'
              }`}
            />
          </div>

          {/* Stopwatch / Status Text */}
          <div className="font-mono text-center">
            <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
              {phase === 'approach' && 'ENTRADA A BOX'}
              {phase === 'service' && 'CAMBIO DE NEUMÁTICOS'}
              {(phase === 'burnout' || phase === 'reveal') && 'PARADA COMPLETADA'}
            </div>
            <div className="text-xl sm:text-2xl font-black tabular-nums tracking-wider text-white">
              {stopwatch.toFixed(2)}s
            </div>
          </div>
        </div>
      </div>

      {/* CENTER STAGE: THE HIGH-DEFINITION DELTA MONOPLAZA */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center w-full max-w-md h-72">
        {/* Tyre smoke during burnout */}
        {(phase === 'burnout' || phase === 'reveal') && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-36 bg-white/20 rounded-full blur-2xl animate-ping opacity-60" />
            <div className="w-72 h-48 bg-zinc-400/25 rounded-full blur-3xl animate-pulse opacity-50" />
          </div>
        )}

        {/* Monoplaza Transform Wrapper */}
        <div
          style={{
            transform: `translate3d(${shakeX}px, ${carY + shakeY}px, 0) scale(${carScale})`,
            opacity: carOpacity,
            transition: phase === 'service' ? 'transform 0.12s ease-out' : 'none',
          }}
          className="relative flex items-center justify-center pointer-events-none"
        >
          {/* Floor Shadow */}
          <div className="absolute -bottom-3 w-80 h-8 bg-black/90 rounded-full blur-lg" />

          {/* HIGH DEFINITION SVG FRONT-VIEW F1 CAR */}
          <svg
            width="360"
            height="195"
            viewBox="0 0 360 195"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.95)]"
          >
            <defs>
              {/* Carbon chassis gradient */}
              <linearGradient id="chassisCarbon" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E232E" />
                <stop offset="50%" stopColor="#11141B" />
                <stop offset="100%" stopColor="#080A0E" />
              </linearGradient>

              {/* Racing Red metallic gradient */}
              <linearGradient id="racingRed" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF2A24" />
                <stop offset="100%" stopColor="#B30500" />
              </linearGradient>

              {/* Cyan Telemetry gradient */}
              <linearGradient id="telemetryCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#27F4D2" />
                <stop offset="100%" stopColor="#00A896" />
              </linearGradient>

              {/* Glowing Carbon Ceramic Brake Disc */}
              <radialGradient id="brakeGlowLeft" cx="44" cy="118" r="16" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF6B00" />
                <stop offset="70%" stopColor="#FF1E00" />
                <stop offset="100%" stopColor="#300000" />
              </radialGradient>
              <radialGradient id="brakeGlowRight" cx="316" cy="118" r="16" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF6B00" />
                <stop offset="70%" stopColor="#FF1E00" />
                <stop offset="100%" stopColor="#300000" />
              </radialGradient>
            </defs>

            {/* 0. REAR WING & SIDEPODS (Background Depth) */}
            <path d="M 95 62 L 265 62 L 260 90 L 100 90 Z" fill="#0A0C10" stroke="#1A1F2A" strokeWidth="1.5" />
            <rect x="75" y="48" width="210" height="12" rx="3" fill="#141822" stroke="#E10600" strokeWidth="1.5" />
            <text x="180" y="57" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900" fontStyle="italic" letterSpacing="3">
              DELTA
            </text>

            {/* 1. LEFT PIRELLI SLICK TYRE (With Glowing Brakes Inside) */}
            <rect x="18" y="70" width="52" height="106" rx="12" fill="#151820" stroke="#2B3242" strokeWidth="2" />
            <rect x="23" y="78" width="42" height="90" rx="8" fill="#090B0E" />
            {/* Brake Disc Glowing Behind Wheel Cover */}
            <circle cx="44" cy="123" r="18" fill="url(#brakeGlowLeft)" opacity="0.85" className="animate-pulse" />
            {/* Aerodynamic Wheel Cover & Rim */}
            <circle cx="44" cy="123" r="15" fill="#11141A" stroke="#FFD60A" strokeWidth="2.5" />
            <circle cx="44" cy="123" r="7" fill="#050608" />

            {/* 2. RIGHT PIRELLI SLICK TYRE */}
            <rect x="290" y="70" width="52" height="106" rx="12" fill="#151820" stroke="#2B3242" strokeWidth="2" />
            <rect x="295" y="78" width="42" height="90" rx="8" fill="#090B0E" />
            <circle cx="316" cy="123" r="18" fill="url(#brakeGlowRight)" opacity="0.85" className="animate-pulse" />
            <circle cx="316" cy="123" r="15" fill="#11141A" stroke="#FFD60A" strokeWidth="2.5" />
            <circle cx="316" cy="123" r="7" fill="#050608" />

            {/* 3. SUSPENSION CARBON WISHBONES */}
            {/* Left suspension arms */}
            <line x1="70" y1="108" x2="148" y2="112" stroke="#282E3D" strokeWidth="4" strokeLinecap="round" />
            <line x1="70" y1="142" x2="145" y2="140" stroke="#282E3D" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="70" y1="142" x2="152" y2="105" stroke="url(#racingRed)" strokeWidth="2.5" strokeLinecap="round" /> {/* Pushrod */}

            {/* Right suspension arms */}
            <line x1="290" y1="108" x2="212" y2="112" stroke="#282E3D" strokeWidth="4" strokeLinecap="round" />
            <line x1="290" y1="142" x2="215" y2="140" stroke="#282E3D" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="290" y1="142" x2="208" y2="105" stroke="url(#racingRed)" strokeWidth="2.5" strokeLinecap="round" />

            {/* 4. AIRBOX, ROLL HOOP & T-CAM */}
            <path d="M 160 48 L 200 48 L 194 86 L 166 86 Z" fill="url(#chassisCarbon)" stroke="#222836" strokeWidth="2" />
            <ellipse cx="180" cy="53" rx="9" ry="5" fill="#000000" />
            {/* T-Cam on top (Neon Yellow) */}
            <rect x="175" y="38" width="10" height="8" rx="1.5" fill="#FFD60A" stroke="#000000" strokeWidth="1" />

            {/* 5. HALO COCKPIT ARCH (Sculpted Titanium) */}
            <path
              d="M 148 94 C 148 70, 212 70, 212 94 L 186 122 L 174 122 Z"
              fill="#181C26"
              stroke="url(#racingRed)"
              strokeWidth="2.5"
            />
            {/* Halo Titanium highlight */}
            <path d="M 152 92 C 156 78, 204 78, 208 92" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />

            {/* Driver Helmet (Metallic Dark with Cyan Visor) */}
            <circle cx="180" cy="92" r="12" fill="#12151D" stroke="#2A3142" strokeWidth="1.5" />
            <path d="M 172 89 Q 180 87 188 89 Q 188 95 180 96 Q 172 95 172 89 Z" fill="url(#telemetryCyan)" />

            {/* 6. SCULPTED CHASSIS & NOSE CONE */}
            <path
              d="M 155 98 L 205 98 L 198 152 Q 180 168 162 152 Z"
              fill="url(#chassisCarbon)"
              stroke="#2A3040"
              strokeWidth="2"
            />
            {/* Center Racing Red Livery Stripe */}
            <path d="M 174 98 L 186 98 L 183 160 L 177 160 Z" fill="url(#racingRed)" />

            {/* [D] DELTA Logo Crest on Nose Cone */}
            <rect x="172" y="120" width="16" height="16" rx="3" fill="#E10600" stroke="#FF4D47" strokeWidth="1" />
            <text x="180" y="132" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">
              D
            </text>

            {/* 7. FRONT WING (4-Tier Aerodynamic Flaps) */}
            {/* Base Mainplane */}
            <path
              d="M 10 155 Q 180 162 350 155 L 352 168 Q 180 178 8 168 Z"
              fill="#0A0C10"
              stroke="#252C3D"
              strokeWidth="2"
            />
            {/* Tier 2 Racing Red Flap */}
            <path
              d="M 20 147 Q 180 155 340 147 L 342 153 Q 180 161 18 153 Z"
              fill="url(#racingRed)"
            />
            {/* Tier 3 Upper Flap */}
            <path
              d="M 36 140 Q 180 148 324 140 L 326 145 Q 180 153 34 145 Z"
              fill="#1C212D"
              stroke="#2E374A"
              strokeWidth="1"
            />
            {/* Tier 4 Gurney Flap */}
            <path
              d="M 54 134 Q 180 141 306 134 L 308 138 Q 180 145 52 138 Z"
              fill="url(#racingRed)"
            />

            {/* Wing Endplates (With Cyan Telemetry Accents) */}
            <rect x="8" y="126" width="7" height="48" rx="2" fill="url(#telemetryCyan)" stroke="#FFFFFF" strokeWidth="0.5" />
            <rect x="345" y="126" width="7" height="48" rx="2" fill="url(#telemetryCyan)" stroke="#FFFFFF" strokeWidth="0.5" />

            {/* Nose Tip Strobe LEDs during approach */}
            {phase === 'approach' && (
              <>
                <circle cx="160" cy="158" r="3.5" fill="#FFFFFF" className="animate-ping" />
                <circle cx="200" cy="158" r="3.5" fill="#FFFFFF" className="animate-ping" />
              </>
            )}
          </svg>
        </div>

        {/* REVEAL PHASE: CENTERED HERO CARD WITH PROTAGONIST BUTTON */}
        {phase === 'reveal' && (
          <div className="absolute inset-0 flex items-center justify-center z-30 p-2 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full max-w-sm bg-[#0C0E15]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-5 sm:p-6 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E10600]/15 border border-[#E10600]/40 text-[10px] font-mono font-bold text-[#E10600] uppercase tracking-widest">
                <span>⚡ PIT STOP OFICIAL • 2.04s</span>
              </div>

              {/* Punchy Headline */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white font-sans">
                  EL PIT WALL ESTÁ LISTO
                </h2>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                  Telemetría en directo y tiempos oficiales sin spoilers.
                </p>
              </div>

              {/* THE REQUESTED PROTAGONIST BUTTON: [ INGRESAR A DELTA ] */}
              <button
                type="button"
                onClick={onEnterDelta}
                className="w-full py-4 px-6 rounded-full bg-[#E10600] hover:bg-[#ff1a14] active:scale-95 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(225,6,0,0.5)] transition-all cursor-pointer group"
              >
                <span>INGRESAR A DELTA</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Replay Option */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={startSequence}
                  className="text-zinc-500 hover:text-zinc-300 font-mono text-[11px] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ver parada de nuevo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER STATUS */}
      <div className="relative z-20 w-full flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/[0.06] pt-2">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
          <span>DELTA 2026 LIVERY</span>
        </span>
        <span className="text-zinc-400 font-bold">PIT WALL</span>
      </div>
    </div>
  );
};
