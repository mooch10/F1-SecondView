import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  MapPin,
  Gauge,
  Flag,
  Timer,
  Zap,
  Layers,
  CornerDownRight,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  type CircuitIntel,
  type CircuitCornerTelemetry,
  getCircuitIntel,
  getCircuitTelemetry,
} from '../../data/circuitIntelData';
import { useLanguage } from '../../hooks/useLanguage';
import { CountryFlag } from '../common/CountryFlag';

interface CircuitProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuitIdOrName?: string;
}

type InteractiveMapMode = 'sectors' | 'drs' | 'corners';

export const CircuitProfileModal: React.FC<CircuitProfileModalProps> = ({
  isOpen,
  onClose,
  circuitIdOrName,
}) => {
  const { lang } = useLanguage();
  const circuit: CircuitIntel = getCircuitIntel(circuitIdOrName);
  const telemetry = useMemo(() => getCircuitTelemetry(circuit), [circuit]);

  const [activeMode, setActiveMode] = useState<InteractiveMapMode>('sectors');
  const [selectedCorner, setSelectedCorner] = useState<CircuitCornerTelemetry | null>(null);
  const [hoveredCorner, setHoveredCorner] = useState<CircuitCornerTelemetry | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Compute SVG viewBox from circuit bounds
  const { minX, maxX, minY, maxY } = circuit.bounds;
  const padding = 34;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const viewBox = `${minX - padding} ${minY - padding} ${width} ${height}`;

  const N = circuit.outline.length;

  // Helper to convert outline point arrays into SVG path string
  const toSvgPath = (pts: Array<[number, number]>) => {
    return pts.reduce(
      (acc, pt, idx) => (idx === 0 ? `M ${pt[0]} ${pt[1]}` : `${acc} L ${pt[0]} ${pt[1]}`),
      ''
    );
  };

  const fullPathD = toSvgPath(circuit.outline) + ' Z';

  // Sector path splits
  const s1End = Math.min(N - 1, Math.max(1, Math.floor(N * (telemetry.sectors.s1EndRatio || 0.33))));
  const s2End = Math.min(N - 1, Math.max(s1End + 1, Math.floor(N * (telemetry.sectors.s2EndRatio || 0.67))));

  const s1Path = toSvgPath(circuit.outline.slice(0, s1End + 1));
  const s2Path = toSvgPath(circuit.outline.slice(s1End, s2End + 1));
  const s3Path = toSvgPath([...circuit.outline.slice(s2End), circuit.outline[0]]);

  // DRS Paths
  const drsPaths = telemetry.drsZones.map((drs) => {
    const startIdx = Math.min(N - 1, Math.max(0, Math.floor(drs.startRatio * N)));
    const endIdx = Math.min(N - 1, Math.max(0, Math.floor(drs.endRatio * N)));
    let slice: Array<[number, number]>;
    if (startIdx <= endIdx) {
      slice = circuit.outline.slice(startIdx, endIdx + 1);
    } else {
      slice = [...circuit.outline.slice(startIdx), ...circuit.outline.slice(0, endIdx + 1)];
    }
    const midPoint = slice[Math.floor(slice.length / 2)] || circuit.outline[startIdx];
    return {
      drs,
      path: toSvgPath(slice),
      midPoint,
    };
  });

  // Corner Apex Coordinates
  const cornerApexes = telemetry.corners.map((corner) => {
    const ptIdx = Math.min(N - 1, Math.max(0, Math.round(corner.pointRatio * N)));
    const coord = circuit.outline[ptIdx] || [0, 0];
    return {
      corner,
      coord,
    };
  });

  const activeCorner = hoveredCorner || selectedCorner || telemetry.corners[0] || null;

  const pirelliMetrics = [
    { label: lang === 'es' ? 'Estrés Neumáticos' : 'Tyre Stress', val: circuit.pirelliRatings.tyreStress },
    { label: lang === 'es' ? 'Agarre Asfalto' : 'Asphalt Grip', val: circuit.pirelliRatings.asphaltGrip },
    { label: lang === 'es' ? 'Abrasión Asfalto' : 'Asphalt Abrasion', val: circuit.pirelliRatings.asphaltAbrasion },
    { label: lang === 'es' ? 'Carga Aerodinámica' : 'Downforce', val: circuit.pirelliRatings.downforce },
    { label: lang === 'es' ? 'Exigencia Frenos' : 'Braking Demand', val: circuit.pirelliRatings.braking },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#10141E] border border-zinc-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans max-h-[94vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-4 py-3 border-b border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-[#0B0E14]">
          <div className="flex items-center gap-2.5 min-w-0">
            <CountryFlag
              flagEmoji={circuit.flag}
              countryName={circuit.country}
              alt={circuit.country}
              className="w-6 h-4 rounded-[2px] shadow-xs shrink-0 inline-block"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-600 dark:text-red-400 uppercase block truncate">
                {circuit.officialGpName}
              </span>
              <h2 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white tracking-tight truncate">
                {circuit.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] transition-colors cursor-pointer shrink-0"
            title={lang === 'es' ? 'Cerrar' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-3.5 no-scrollbar overscroll-contain">
          
          {/* Interactive Vector Track Visualizer Card */}
          <div className="relative bg-zinc-950 rounded-xl border border-zinc-200 dark:border-white/[0.08] p-3 sm:p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner">
            
            {/* Top Toolbar: Location & Interactive Mode Toggles */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">{circuit.city}, {circuit.country}</span>
              </div>

              {/* Mode Segmented Switcher */}
              <div className="inline-flex items-center gap-0.5 bg-zinc-900/90 p-1 rounded-lg border border-white/10 text-[10px] sm:text-[11px] font-mono self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveMode('sectors')}
                  className={`px-2 sm:px-2.5 py-1 rounded transition-all cursor-pointer font-bold flex items-center gap-1 ${
                    activeMode === 'sectors'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{lang === 'es' ? 'Sectores' : 'Sectors'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('drs')}
                  className={`px-2 sm:px-2.5 py-1 rounded transition-all cursor-pointer font-bold flex items-center gap-1 ${
                    activeMode === 'drs'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>DRS / Aero</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('corners')}
                  className={`px-2 sm:px-2.5 py-1 rounded transition-all cursor-pointer font-bold flex items-center gap-1 ${
                    activeMode === 'corners'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <CornerDownRight className="w-3 h-3" />
                  <span>{lang === 'es' ? 'Curvas' : 'Corners'}</span>
                </button>
              </div>
            </div>

            {/* Mode Banner Indicator */}
            <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] font-mono pt-2 px-0.5 text-zinc-400">
              {activeMode === 'sectors' && (
                <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse"></span>
                  {lang === 'es' ? 'SECTORES FIA (S1 · S2 · S3)' : 'FIA SECTORS (S1 · S2 · S3)'}
                </span>
              )}
              {activeMode === 'drs' && (
                <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  {lang === 'es'
                    ? `${circuit.activeAeroZones} ZONAS ACTIVE AERO / DRS`
                    : `${circuit.activeAeroZones} ACTIVE AERO / DRS ZONES`}
                </span>
              )}
              {activeMode === 'corners' && (
                <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse"></span>
                  {lang === 'es'
                    ? 'APEXES Y TELEMETRÍA POR CURVA'
                    : 'CORNER APEXES & TELEMETRY'}
                </span>
              )}
              <span className="text-zinc-500 uppercase">
                {circuit.corners.total} {lang === 'es' ? 'CURVAS' : 'TURNS'} • {circuit.trackLengthKm} KM
              </span>
            </div>

            {/* Main Interactive SVG Track Outline */}
            <div className="w-full flex items-center justify-center my-2 sm:my-3">
              <svg
                viewBox={viewBox}
                className="w-full max-w-[400px] h-[175px] sm:h-[210px] overflow-visible drop-shadow-[0_0_18px_rgba(0,0,0,0.6)]"
              >
                {/* 1. Track Base Shadow / Asphalt Line */}
                <path
                  d={fullPathD}
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 2. Layer: SECTORS */}
                {activeMode === 'sectors' && (
                  <g id="sectors-layer">
                    {/* Sector 1: Cyan */}
                    <path
                      d={s1Path}
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    />
                    {/* Sector 2: Amber */}
                    <path
                      d={s2Path}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                    />
                    {/* Sector 3: Rose */}
                    <path
                      d={s3Path}
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    />
                  </g>
                )}

                {/* 3. Layer: DRS / ACTIVE AERO */}
                {activeMode === 'drs' && (
                  <g id="drs-layer">
                    <path
                      d={fullPathD}
                      fill="none"
                      stroke="#334155"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {drsPaths.map((dp) => (
                      <g key={dp.drs.id}>
                        <path
                          d={dp.path}
                          fill="none"
                          stroke="#22C55E"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                        />
                        {/* DRS Zone Marker Dot */}
                        <circle
                          cx={dp.midPoint[0]}
                          cy={dp.midPoint[1]}
                          r="12"
                          fill="#15803D"
                          stroke="#22C55E"
                          strokeWidth="2"
                        />
                        <text
                          x={dp.midPoint[0]}
                          y={dp.midPoint[1] + 3.5}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="900"
                          fill="#FFFFFF"
                          fontFamily="monospace"
                        >
                          D{dp.drs.id}
                        </text>
                      </g>
                    ))}
                  </g>
                )}

                {/* 4. Layer: CORNERS & DEFAULT TRACK */}
                {activeMode === 'corners' && (
                  <path
                    d={fullPathD}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  />
                )}

                {/* 5. Interactive Corner Pins (Visible in Corners & Sectors modes) */}
                <g id="corner-pins-layer">
                  {cornerApexes.map(({ corner, coord }) => {
                    const isSelected = activeCorner?.number === corner.number;
                    return (
                      <g
                        key={corner.number}
                        onClick={() => setSelectedCorner(corner)}
                        onMouseEnter={() => setHoveredCorner(corner)}
                        onMouseLeave={() => setHoveredCorner(null)}
                        className="cursor-pointer transition-transform"
                      >
                        {/* Transparent Large Hitbox for Touch Screens (Mobile friendly 36px radius) */}
                        <circle
                          cx={coord[0]}
                          cy={coord[1]}
                          r="22"
                          fill="transparent"
                          pointerEvents="all"
                        />

                        {/* Outer Pin Body */}
                        <circle
                          cx={coord[0]}
                          cy={coord[1]}
                          r={isSelected ? '12' : '9'}
                          fill={isSelected ? '#F59E0B' : '#1E293B'}
                          stroke={isSelected ? '#FFFFFF' : '#F59E0B'}
                          strokeWidth={isSelected ? '2' : '1.5'}
                          className="transition-all"
                        />

                        {/* Corner Number Typography */}
                        <text
                          x={coord[0]}
                          y={coord[1] + (isSelected ? 3.5 : 3)}
                          textAnchor="middle"
                          fontSize={isSelected ? '9' : '8'}
                          fontWeight="900"
                          fill={isSelected ? '#000000' : '#F59E0B'}
                          fontFamily="monospace"
                        >
                          {corner.number}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Dynamic Telemetry HUD / Info Strip */}
            {activeMode === 'corners' || activeCorner ? (
              <div className="w-full bg-[#131722]/95 border border-white/10 rounded-xl p-2.5 sm:p-3 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-black text-amber-400 text-xs shrink-0">
                      T{activeCorner?.number}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                        {lang === 'es'
                          ? activeCorner?.nameEs || activeCorner?.name || `Curva ${activeCorner?.number}`
                          : activeCorner?.name || `Turn ${activeCorner?.number}`}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-400 block truncate">
                        {lang === 'es' ? activeCorner?.typeLabelEs : activeCorner?.typeLabelEn}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500 uppercase hidden sm:inline-block">
                    {lang === 'es' ? 'Datos de Telemetría' : 'Telemetry Live Specs'}
                  </span>
                </div>

                {/* Telemetry Metrics Row */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/[0.06] font-mono text-center">
                  <div className="bg-black/30 rounded-lg p-1.5 border border-white/[0.04]">
                    <span className="text-[9px] text-zinc-400 uppercase block font-bold">
                      Apex Speed
                    </span>
                    <span className="text-xs sm:text-sm font-black text-amber-400">
                      {activeCorner?.apexSpeedKmh} <span className="text-[9px] font-normal text-zinc-400">km/h</span>
                    </span>
                  </div>

                  <div className="bg-black/30 rounded-lg p-1.5 border border-white/[0.04]">
                    <span className="text-[9px] text-zinc-400 uppercase block font-bold">
                      {lang === 'es' ? 'Marcha' : 'Gear'}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white">
                      {activeCorner?.gear}ª
                    </span>
                  </div>

                  <div className="bg-black/30 rounded-lg p-1.5 border border-white/[0.04]">
                    <span className="text-[9px] text-zinc-400 uppercase block font-bold">
                      Lateral G
                    </span>
                    <span className="text-xs sm:text-sm font-black text-rose-400">
                      {activeCorner?.lateralG} G
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-400 px-0.5">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span>
                      {lang === 'es'
                        ? 'Tocá o pasá el cursor por cualquier curva del trazado'
                        : 'Click or hover any corner on the map'}
                    </span>
                  </span>
                  {telemetry.corners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const currentIdx = telemetry.corners.findIndex(
                          (c) => c.number === activeCorner?.number
                        );
                        const nextCorner =
                          telemetry.corners[(currentIdx + 1) % telemetry.corners.length];
                        setSelectedCorner(nextCorner);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{lang === 'es' ? 'Siguiente' : 'Next'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* Sector Mode Legend */}
            {activeMode === 'sectors' && (
              <div className="w-full mt-2.5 grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-1.5 text-center">
                  <span className="text-cyan-400 font-bold block">SECTOR 1</span>
                  <span className="text-zinc-400 text-[9px] truncate block">
                    {lang === 'es' ? 'Velocidad y Entrada' : 'Speed & Entry'}
                  </span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-1.5 text-center">
                  <span className="text-amber-400 font-bold block">SECTOR 2</span>
                  <span className="text-zinc-400 text-[9px] truncate block">
                    {lang === 'es' ? 'Técnico y Virado' : 'Technical Infield'}
                  </span>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-1.5 text-center">
                  <span className="text-rose-400 font-bold block">SECTOR 3</span>
                  <span className="text-zinc-400 text-[9px] truncate block">
                    {lang === 'es' ? 'Tracción y Recta' : 'Traction & Straight'}
                  </span>
                </div>
              </div>
            )}

            {/* DRS Mode Legend */}
            {activeMode === 'drs' && (
              <div className="w-full mt-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg p-2 font-mono text-[10px] text-zinc-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'es'
                      ? 'Reglamento 2026: Alerón activo de baja resistencia (Low-Drag Straightaway)'
                      : '2026 Active Aero: Low-Drag straightaway deployment mode'}
                  </span>
                </div>
                <span className="font-bold text-emerald-400 shrink-0">
                  ~335-345 km/h
                </span>
              </div>
            )}

            {/* Circuit short description */}
            <p className="mt-2.5 text-center text-xs text-zinc-400 font-sans italic max-w-lg px-2">
              "{lang === 'es' ? circuit.characteristics.es : circuit.characteristics.en}"
            </p>
          </div>

          {/* Key Track Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-zinc-50 dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                {lang === 'es' ? 'Longitud' : 'Length'}
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-zinc-900 dark:text-white">
                {circuit.trackLengthKm} km
              </span>
            </div>

            <div className="bg-zinc-50 dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                {lang === 'es' ? 'Vueltas' : 'Laps'}
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-zinc-900 dark:text-white">
                {circuit.totalLaps}
              </span>
            </div>

            <div className="bg-zinc-50 dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                {lang === 'es' ? 'Distancia Total' : 'Race Distance'}
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-zinc-900 dark:text-white">
                {circuit.raceDistanceKm} km
              </span>
            </div>

            <div className="bg-zinc-50 dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-2.5 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                {lang === 'es' ? 'Curvas' : 'Corners'}
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-zinc-900 dark:text-white">
                {circuit.corners.total} ({circuit.corners.left}I / {circuit.corners.right}D)
              </span>
            </div>
          </div>

          {/* Lap Record Card (No AI emojis, uses Lucide Flag & Timer) */}
          <div className="bg-zinc-50 dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Flag className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block">
                  {lang === 'es' ? 'Récord Oficial de Vuelta' : 'Official Lap Record'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                  {circuit.lapRecord.driver} • {circuit.lapRecord.team} ({circuit.lapRecord.year})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono font-black text-sm sm:text-base text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 self-end sm:self-auto font-tabular">
              <Timer className="w-4 h-4 text-amber-500" />
              <span>{circuit.lapRecord.time}</span>
            </div>
          </div>

          {/* Technical Telemetry & Pirelli Rating Bars */}
          <div className="bg-zinc-50 dark:bg-[#131722] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 uppercase">
                <Gauge className="w-4 h-4 text-red-500" />
                <span>{lang === 'es' ? 'Exigencia Técnica Pirelli & Carga' : 'Pirelli Technical Demands & Aero'}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-300 font-bold uppercase">
                {lang === 'es' ? `Carga ${circuit.downforceLevelEs}` : `${circuit.downforceLevel} Downforce`}
              </span>
            </div>

            {/* Bars */}
            <div className="space-y-2 pt-1">
              {pirelliMetrics.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono gap-3">
                  <span className="text-zinc-600 dark:text-zinc-400 text-[11px] w-36 truncate">
                    {m.label}
                  </span>
                  <div className="flex-1 flex items-center gap-1 h-3 bg-zinc-200 dark:bg-white/[0.06] rounded-full overflow-hidden p-0.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 h-full rounded-xs transition-all ${
                          lvl <= m.val
                            ? lvl >= 4
                              ? 'bg-rose-500'
                              : lvl === 3
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 w-6 text-right">
                    {m.val}/5
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-zinc-100 dark:bg-[#0B0E14] border-t border-zinc-200 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          <span className="text-[10px]">FIA FORMULA 1 2026 WORLD CHAMPIONSHIP</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-zinc-200 hover:bg-zinc-300 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] text-zinc-800 dark:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {lang === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
