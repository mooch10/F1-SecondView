import React, { useCallback, useMemo, useState } from 'react';
import {
  Car,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Navigation,
  Zap,
} from 'lucide-react';
import type { DriverLive, SessionState, TrackOutline } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useTrackAnimation } from '../../hooks/useTrackAnimation';
import { getCircuitIntel } from '../../data/circuitIntelData';

interface CircuitMapProps {
  circuitTrack?: TrackOutline | null;
  drivers: DriverLive[];
  sessionName?: string;
  circuitName?: string;
  className?: string;
  defaultExpanded?: boolean;
  sessionStatus?: SessionState;
}

type FilterMode = 'all' | 'top10' | 'top3' | 'leader';

export const CircuitMap: React.FC<CircuitMapProps> = ({
  circuitTrack,
  drivers = [],
  sessionName,
  circuitName,
  className = '',
  defaultExpanded,
  sessionStatus,
}) => {
  const { lang } = useLanguage();
  const isFinished = sessionStatus === 'FINISHED';
  const [isExpanded, setIsExpanded] = useState<boolean>(
    defaultExpanded !== undefined ? defaultExpanded : !isFinished,
  );

  // Automatically collapse track map when session finishes
  React.useEffect(() => {
    if (isFinished) {
      setIsExpanded(false);
    }
  }, [isFinished]);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showSectors, setShowSectors] = useState<boolean>(true);
  const [selectedDriverNumber, setSelectedDriverNumber] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  // Sort active drivers cleanly by position, ensuring strict uniqueness
  const sortedDrivers = useMemo(() => {
    const seen = new Set<number>();
    return [...drivers]
      .filter((d) => {
        if (!d || seen.has(d.driverNumber)) return false;
        seen.add(d.driverNumber);
        return true;
      })
      .sort((a, b) => a.pos - b.pos);
  }, [drivers]);

  // Check if drivers are clustered in parc fermé / pit lane in real GPS data
  const isGpsClustered = useMemo(() => {
    const locs = drivers
      .filter((d) => d.location && (d.location.x !== 0 || d.location.y !== 0))
      .map((d) => d.location!);
    if (locs.length < 4) return false;
    const first = locs[0];
    const maxDist = Math.max(
      ...locs.map((l) => Math.hypot(l.x - first.x, l.y - first.y)),
    );
    // If all cars are within ~300 meters of each other, they are parked
    return maxDist < 400;
  }, [drivers]);

  // Robust fallback: if live snapshot circuitTrack is missing/empty, resolve from 2026 circuit intel
  const effectiveTrack = useMemo(() => {
    if (circuitTrack && circuitTrack.outline && circuitTrack.outline.length >= 3) {
      return circuitTrack;
    }
    const intel = getCircuitIntel(circuitName || sessionName);
    if (intel && intel.outline && intel.outline.length >= 3) {
      return {
        circuitName: intel.name,
        outline: intel.outline,
        bounds: intel.bounds,
      };
    }
    return null;
  }, [circuitTrack, circuitName, sessionName]);

  // Dynamic aspect ratio calculation & track geometry
  const trackGeometry = useMemo(() => {
    if (!effectiveTrack || !effectiveTrack.outline || effectiveTrack.outline.length < 3) {
      return null;
    }

    const { minX, maxX, minY, maxY } = effectiveTrack.bounds;
    const dx = Math.max(1, maxX - minX);
    const dy = Math.max(1, maxY - minY);
    const isPortrait = dy > dx * 1.35;

    // Responsive Canvas viewBox tailored to circuit shape
    const canvasW = isPortrait ? 600 : 860;
    const canvasH = isPortrait ? 860 : 600;
    const padding = 46;

    const availW = canvasW - padding * 2;
    const availH = canvasH - padding * 2;

    const scale = Math.min(availW / dx, availH / dy);
    const offsetX = (canvasW - dx * scale) / 2;
    const offsetY = (canvasH - dy * scale) / 2;

    const toSvgPoint = (x: number, y: number): [number, number] => {
      const px = offsetX + (x - minX) * scale;
      // Invert Y so Cartesian North is up in SVG
      const py = canvasH - (offsetY + (y - minY) * scale);
      return [px, py];
    };

    // Convert raw outline to SVG coordinates
    const pts = effectiveTrack.outline.map((pt) => toSvgPoint(pt[0], pt[1]));
    const N = pts.length;

    // Cumulative distances along circuit perimeter
    const cumDists: number[] = [0];
    for (let i = 0; i < N; i++) {
      const next = pts[(i + 1) % N];
      const dist = Math.hypot(next[0] - pts[i][0], next[1] - pts[i][1]);
      cumDists.push(cumDists[i] + dist);
    }
    const totalLength = cumDists[cumDists.length - 1];

    // Function to sample continuous (x, y) along track for progress t in [0, 1)
    const getPointAtProgress = (
      t: number,
    ): { x: number; y: number; angle: number; segIdx: number } => {
      const normT = ((t % 1) + 1) % 1;
      const targetDist = normT * totalLength;

      let segIdx = 0;
      for (let i = 0; i < N; i++) {
        if (targetDist >= cumDists[i] && targetDist <= cumDists[i + 1]) {
          segIdx = i;
          break;
        }
      }

      const segLen = cumDists[segIdx + 1] - cumDists[segIdx];
      const alpha = segLen > 0 ? (targetDist - cumDists[segIdx]) / segLen : 0;
      const p1 = pts[segIdx];
      const p2 = pts[(segIdx + 1) % N];

      const x = p1[0] + alpha * (p2[0] - p1[0]);
      const y = p1[1] + alpha * (p2[1] - p1[1]);
      const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * (180 / Math.PI);

      return { x, y, angle, segIdx };
    };

    // Build SVG Path strings
    let fullPath = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < N; i++) {
      fullPath += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
    }
    fullPath += ' Z';

    // Sector 1, 2, 3 path splits
    // S1: 0% to 33%, S2: 33% to 67%, S3: 67% to 100%
    const s1EndIdx = Math.floor(N * 0.33);
    const s2EndIdx = Math.floor(N * 0.67);

    let s1Path = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i <= s1EndIdx; i++) {
      s1Path += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
    }

    let s2Path = `M ${pts[s1EndIdx][0].toFixed(1)} ${pts[s1EndIdx][1].toFixed(1)}`;
    for (let i = s1EndIdx + 1; i <= s2EndIdx; i++) {
      s2Path += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
    }

    let s3Path = `M ${pts[s2EndIdx][0].toFixed(1)} ${pts[s2EndIdx][1].toFixed(1)}`;
    for (let i = s2EndIdx + 1; i < N; i++) {
      s3Path += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
    }
    s3Path += ` L ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;

    // Start / Finish normal vector
    const p0 = pts[0];
    const pNext = pts[1] || [p0[0] + 1, p0[1]];
    const dirX = pNext[0] - p0[0];
    const dirY = pNext[1] - p0[1];
    const sfLen = Math.hypot(dirX, dirY) || 1;
    const normX = -dirY / sfLen;
    const normY = dirX / sfLen;
    const halfSf = 20;

    const startFinish = {
      x1: p0[0] - normX * halfSf,
      y1: p0[1] - normY * halfSf,
      x2: p0[0] + normX * halfSf,
      y2: p0[1] + normY * halfSf,
      angle: Math.atan2(dirY, dirX) * (180 / Math.PI),
      center: p0,
    };

    // Landmarks: S1 Split Point, S2 Split Point, Overtake straightaways
    const s1SplitPt = pts[s1EndIdx];
    const s2SplitPt = pts[s2EndIdx];

    // Overtake Zone 1 (Start/Finish straight) & Overtake Zone 2 (back straight)
    const ot1Start = getPointAtProgress(0.93);
    const ot1End = getPointAtProgress(0.06);
    const ot2Start = getPointAtProgress(0.44);
    const ot2End = getPointAtProgress(0.55);

    return {
      canvasW,
      canvasH,
      toSvgPoint,
      getPointAtProgress,
      fullPath,
      s1Path,
      s2Path,
      s3Path,
      startFinish,
      s1SplitPt,
      s2SplitPt,
      pts,
      cumDists,
      totalLength,
      overtakeZones: [
        { start: ot1Start, end: ot1End, label: 'OVERTAKE 1' },
        { start: ot2Start, end: ot2End, label: 'OVERTAKE 2' },
      ],
    };
  }, [effectiveTrack]);

  // Filtered drivers based on active filter chip
  const filteredDrivers = useMemo(() => {
    switch (filterMode) {
      case 'top10':
        return sortedDrivers.filter((d) => d.pos <= 10);
      case 'top3':
        return sortedDrivers.filter((d) => d.pos <= 3);
      case 'leader':
        return sortedDrivers.filter((d) => d.pos === 1);
      case 'all':
      default:
        return sortedDrivers;
    }
  }, [sortedDrivers, filterMode]);

  // Selected driver object
  const selectedDriver = useMemo(() => {
    return sortedDrivers.find((d) => d.driverNumber === selectedDriverNumber) || null;
  }, [sortedDrivers, selectedDriverNumber]);

  // Real-time 60 FPS kinematic animation and dead-reckoning along track
  const animatedPositions = useTrackAnimation({
    drivers: sortedDrivers,
    trackGeometry,
    isGpsClustered,
    sessionStatus,
  });

  // Render car coordinates with anti-overlap decluttering based on real GPS and 60 FPS spline animation
  const carRenderData = useMemo(() => {
    // When session is finished or track geometry is unavailable, no cars are on track
    if (!trackGeometry || isFinished) return [];

    const activeList = filteredDrivers;
    const coords: Array<{
      driver: DriverLive;
      x: number;
      y: number;
      angle: number;
      isSelected: boolean;
      isLeader: boolean;
      sector: number;
    }> = [];

    // Calculate position for each driver using 60 FPS spline kinematic interpolation
    activeList.forEach((d) => {
      let x = 0;
      let y = 0;
      let angle = 0;
      const sector = 1;

      const anim = animatedPositions.get(d.driverNumber);
      if (anim) {
        x = anim.x;
        y = anim.y;
        angle = anim.angle;
      } else if (d.location && (d.location.x !== 0 || d.location.y !== 0)) {
        // Fallback directly to raw GPS coordinates
        const [gx, gy] = trackGeometry.toSvgPoint(d.location.x, d.location.y);
        x = gx;
        y = gy;
      } else {
        // Driver has no active GPS position on track - do not invent fake coordinates
        return;
      }

      coords.push({
        driver: d,
        x,
        y,
        angle,
        isSelected: d.driverNumber === selectedDriverNumber,
        isLeader: d.pos === 1,
        sector,
      });
    });

    // Anti-Overlap Offset Pass: Offset close markers so they never merge into a single blob
    const threshold = 26; // SVG pixels
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const dx = coords[j].x - coords[i].x;
        const dy = coords[j].y - coords[i].y;
        const dist = Math.hypot(dx, dy);

        if (dist < threshold) {
          // Perpendicular offset
          const angle = Math.atan2(dy, dx) + Math.PI / 2;
          const shift = (threshold - dist) / 2 + 3;
          coords[j].x += Math.cos(angle) * shift;
          coords[j].y += Math.sin(angle) * shift;
          coords[i].x -= Math.cos(angle) * shift;
          coords[i].y -= Math.sin(angle) * shift;
        }
      }
    }

    return coords;
  }, [trackGeometry, filteredDrivers, selectedDriverNumber, animatedPositions]);

  // Handle Driver Tap
  const handleDriverSelect = useCallback((driverNum: number) => {
    setSelectedDriverNumber((prev) => (prev === driverNum ? null : driverNum));
  }, []);

  return (
    <div
      className={`bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl transition-all ${className} ${
        isFullScreen ? 'fixed inset-0 z-50 rounded-none flex flex-col bg-[#0B0E14]' : ''
      }`}
    >
      {/* Circuit Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2.5 bg-[#1C2230] border-b border-white/[0.08] select-none gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
              isFinished
                ? 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
                : 'bg-[#E10600]/15 border-[#E10600]/30 text-[#E10600]'
            }`}
          >
            <Navigation className="w-4 h-4 rotate-45" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs sm:text-sm uppercase tracking-wider font-chakra">
                {lang === 'es' ? 'Mapa de Pista' : 'Circuit Map'}
              </span>
              {isFinished ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1.5 whitespace-nowrap shrink-0">
                  <span className="text-[10px]">🏁</span>
                  {lang === 'es' ? 'PISTA CERRADA • FINALIZADA' : 'TRACK CLOSED • FINISHED'}
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 whitespace-nowrap shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {lang === 'es' ? 'GPS EN VIVO • 60 FPS' : 'LIVE GPS • 60 FPS'}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              {(() => {
                const raw = circuitName || effectiveTrack?.circuitName || sessionName || 'Circuito';
                return raw.toLowerCase().includes('madring') ? 'Circuito de Madrid' : raw;
              })()} •{' '}
              {isFinished
                ? (lang === 'es' ? 'Parque Cerrado (Parc Fermé)' : 'Parc Fermé')
                : `${sortedDrivers.length} ${lang === 'es' ? 'autos' : 'cars'}`}
            </span>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Sectors Overlay Toggle */}
          <button
            type="button"
            onClick={() => setShowSectors((prev) => !prev)}
            title={lang === 'es' ? 'Mostrar Sectores (S1/S2/S3)' : 'Show Sectors (S1/S2/S3)'}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-colors ${
              showSectors
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'text-zinc-400 hover:text-white border-transparent'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px] font-mono font-semibold">S1/S2/S3</span>
          </button>

          {/* Driver Code Labels Toggle */}
          {!isFinished && (
            <button
              type="button"
              onClick={() => setShowLabels((prev) => !prev)}
              title={showLabels ? 'Ocultar nombres' : 'Mostrar nombres'}
              className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                showLabels
                  ? 'bg-white/10 text-white border-white/20'
                  : 'text-zinc-400 hover:text-white border-transparent'
              }`}
            >
              {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullScreen((prev) => !prev)}
            title={isFullScreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer border border-transparent"
          >
            {isFullScreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Expand / Collapse Button */}
          {!isFullScreen && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              title={isExpanded ? (lang === 'es' ? 'Cerrar pista' : 'Collapse') : (lang === 'es' ? 'Abrir pista' : 'Expand')}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer border border-transparent"
            >
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col flex-1 bg-[#0B0E14] select-none">
          {/* Interactive Mobile Control Toolbar (Solo durante sesión activa en pista) */}
          {!isFinished && (
            <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-[#141923] border-b border-white/[0.06] text-xs gap-2">
              {/* Filter Pills (All / Top 10 / Top 3 / Leader) */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {(['all', 'top10', 'top3', 'leader'] as FilterMode[]).map((mode) => {
                  const labelMap = {
                    all: lang === 'es' ? `Todos (${sortedDrivers.length})` : `All (${sortedDrivers.length})`,
                    top10: 'Top 10',
                    top3: 'Top 3',
                    leader: lang === 'es' ? 'Líder' : 'Leader',
                  };
                  const isActive = filterMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFilterMode(mode)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                        isActive
                          ? 'bg-white/15 text-white border-white/30'
                          : 'bg-white/[0.03] text-zinc-400 hover:text-white border-transparent'
                      }`}
                    >
                      {labelMap[mode]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clustered / Parc Fermé Notice Banner in GPS Mode */}
          {!isFinished && isGpsClustered && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 flex items-center justify-between text-xs text-amber-300">
              <span className="text-[11px] font-mono">
                {lang === 'es'
                  ? '⚠️ Monoplazas en Boxes / Parque Cerrado. Telemetría GPS en espera.'
                  : '⚠️ Cars in Pits / Parc Fermé. GPS telemetry on standby.'}
              </span>
            </div>
          )}

          {/* SVG Circuit Canvas Area */}
          <div className="relative w-full overflow-hidden flex-1 flex flex-col items-center justify-center p-2 sm:p-4 min-h-[380px] sm:min-h-[460px]">
            {trackGeometry ? (
              <svg
                viewBox={`0 0 ${trackGeometry.canvasW} ${trackGeometry.canvasH}`}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-auto max-h-[440px] sm:max-h-[560px] drop-shadow-xl select-none"
              >
                {/* Visual Glow Gradients & Filters */}
                <defs>
                  <filter id="carGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.8" />
                  </filter>
                  <filter id="spotlightGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* F1 Sector Linear Gradients */}
                  <linearGradient id="sector1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EAB308" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="sector2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="sector3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0.5" />
                  </linearGradient>

                  {/* High Tech Grid Pattern */}
                  <pattern id="circuitGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path
                      d="M 30 0 L 0 0 0 30"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.025)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>

                {/* Ambient Grid Background */}
                <rect width={trackGeometry.canvasW} height={trackGeometry.canvasH} fill="url(#circuitGrid)" />

                {/* Layer 1: Ambient Track Neon Glow */}
                <path
                  d={trackGeometry.fullPath}
                  fill="none"
                  stroke="#E10600"
                  strokeOpacity="0.12"
                  strokeWidth="38"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Layer 2: Outer Curb / Runoff Gravel Barrier */}
                <path
                  d={trackGeometry.fullPath}
                  fill="none"
                  stroke="#1E2330"
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Layer 3: Asphalt Core Surface */}
                <path
                  d={trackGeometry.fullPath}
                  fill="none"
                  stroke="#10141D"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Layer 4: Sector Colored Centerlines (When toggled on) */}
                {showSectors ? (
                  <g opacity="0.85">
                    {/* Sector 1 (Yellow) */}
                    <path
                      d={trackGeometry.s1Path}
                      fill="none"
                      stroke="#EAB308"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Sector 2 (Cyan) */}
                    <path
                      d={trackGeometry.s2Path}
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Sector 3 (Purple) */}
                    <path
                      d={trackGeometry.s3Path}
                      fill="none"
                      stroke="#A855F7"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </g>
                ) : (
                  /* Standard Neutral Racing Line Guide */
                  <path
                    d={trackGeometry.fullPath}
                    fill="none"
                    stroke="#333D4F"
                    strokeWidth="2"
                    strokeDasharray="6 8"
                    strokeLinecap="round"
                  />
                )}



                {/* Layer 6: Sector Dividing Badges (I1 & I2) */}
                {showSectors && (
                  <g pointerEvents="none">
                    {/* S1 Split (I1) */}
                    <g transform={`translate(${trackGeometry.s1SplitPt[0].toFixed(1)}, ${trackGeometry.s1SplitPt[1].toFixed(1)})`}>
                      <circle r="4" fill="#EAB308" />
                      <rect x="6" y="-7" width="22" height="13" rx="2" fill="#0B0E14" stroke="#EAB308" strokeWidth="1" />
                      <text x="17" y="2.5" textAnchor="middle" fill="#EAB308" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                        S1
                      </text>
                    </g>

                    {/* S2 Split (I2) */}
                    <g transform={`translate(${trackGeometry.s2SplitPt[0].toFixed(1)}, ${trackGeometry.s2SplitPt[1].toFixed(1)})`}>
                      <circle r="4" fill="#06B6D4" />
                      <rect x="6" y="-7" width="22" height="13" rx="2" fill="#0B0E14" stroke="#06B6D4" strokeWidth="1" />
                      <text x="17" y="2.5" textAnchor="middle" fill="#06B6D4" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                        S2
                      </text>
                    </g>
                  </g>
                )}

                {/* Layer 7: Official Start / Finish Line */}
                {trackGeometry.startFinish && (
                  <g pointerEvents="none">
                    {/* Checkered Base */}
                    <line
                      x1={trackGeometry.startFinish.x1}
                      y1={trackGeometry.startFinish.y1}
                      x2={trackGeometry.startFinish.x2}
                      y2={trackGeometry.startFinish.y2}
                      stroke="#FFFFFF"
                      strokeWidth="5"
                      strokeLinecap="square"
                    />
                    {/* Red Checkered Overlay */}
                    <line
                      x1={trackGeometry.startFinish.x1}
                      y1={trackGeometry.startFinish.y1}
                      x2={trackGeometry.startFinish.x2}
                      y2={trackGeometry.startFinish.y2}
                      stroke="#E10600"
                      strokeWidth="5"
                      strokeDasharray="4 4"
                      strokeLinecap="square"
                    />
                    {/* Meta Label & Chevron */}
                    <g transform={`translate(${(trackGeometry.startFinish.x1 - 10).toFixed(1)}, ${(trackGeometry.startFinish.y1 - 6).toFixed(1)})`}>
                      <rect x="-14" y="-8" width="30" height="14" rx="3" fill="#0B0E14" stroke="#FFFFFF" strokeWidth="1" />
                      <text
                        x="1"
                        y="2.5"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8"
                        fontWeight="900"
                        fontFamily="monospace"
                      >
                        META
                      </text>
                    </g>
                  </g>
                )}

                {/* Layer 8: Car Position Markers with High-Contrast Touch Pills */}
                {carRenderData.map(({ driver: d, x, y, isSelected, isLeader }) => {
                  const teamColor = d.teamColor || '#E10600';

                  return (
                    <g
                      key={d.driverNumber}
                      transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}
                      onClick={() => handleDriverSelect(d.driverNumber)}
                      className="cursor-pointer group"
                    >
                      {/* Pulsing Highlight Aura for Selected Driver or Leader */}
                      {(isLeader || isSelected) && (
                        <circle
                          r={isSelected ? '24' : '18'}
                          fill="none"
                          stroke={teamColor}
                          strokeWidth={isSelected ? '3' : '2'}
                          opacity="0.65"
                          className="animate-ping"
                        />
                      )}

                      {/* Drop Shadow */}
                      <circle r="15" fill="rgba(0,0,0,0.6)" cy="3" />

                      {/* Main Car Outer Halo */}
                      <circle
                        r="14"
                        fill={teamColor}
                        stroke={isSelected ? '#FFFFFF' : '#0B0E14'}
                        strokeWidth={isSelected ? '3' : '2'}
                        filter="url(#carGlow)"
                      />

                      {/* Inner High Contrast Center */}
                      <circle r="10.5" fill="#FFFFFF" />

                      {/* Position Number inside Dot (Bold, Black, High Contrast) */}
                      <text
                        textAnchor="middle"
                        dy="3.5"
                        fill="#000000"
                        fontSize="10"
                        fontWeight="900"
                        fontFamily="monospace"
                        pointerEvents="none"
                      >
                        {d.pos}
                      </text>

                      {/* Driver 3-Letter Code Pill Badge */}
                      {showLabels && (
                        <g transform="translate(0, -18)" pointerEvents="none">
                          <rect
                            x="-17"
                            y="-9"
                            width="34"
                            height="16"
                            rx="4"
                            fill="rgba(11, 14, 20, 0.95)"
                            stroke={isSelected ? '#FFFFFF' : teamColor}
                            strokeWidth={isSelected ? '2' : '1.2'}
                          />
                          <text
                            textAnchor="middle"
                            dy="2.5"
                            fill={isSelected ? '#FFFFFF' : teamColor}
                            fontSize="9"
                            fontWeight="800"
                            fontFamily="monospace"
                          >
                            {d.code}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* Loading / Sensor Syncing State */
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 relative">
                  <Car className="w-7 h-7 text-zinc-400 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border border-[#E10600]/40 animate-ping opacity-50" />
                </div>
                <span className="font-bold text-white text-sm uppercase tracking-wider font-chakra">
                  {lang === 'es'
                    ? 'Sincronizando trazado y telemetría de pista...'
                    : 'Syncing track layout and GPS telemetry...'}
                </span>
                <span className="text-xs text-zinc-500 font-mono mt-1">
                  {lang === 'es'
                    ? 'Procesando coordenadas vectoriales del circuito...'
                    : 'Processing circuit geometry vectors...'}
                </span>
              </div>
            )}

            {/* Pista Cerrada / Parc Fermé Central Overlay */}
            {isFinished && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 z-20">
                <div className="bg-[#0B0E14]/92 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md max-w-sm text-center shadow-2xl flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-2xl shadow-inner">
                    🏁
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm font-chakra">
                      {lang === 'es' ? 'Pista Cerrada • Sesión Finalizada' : 'Track Closed • Session Finished'}
                    </span>
                    <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                      {lang === 'es'
                        ? 'La actividad en pista ha concluido con bandera a cuadros. Los monoplazas se encuentran en Parque Cerrado y Boxes.'
                        : 'Track activity has concluded with the chequered flag. All cars are in Parc Fermé and Pit Lane.'}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-zinc-400">
                    <span>🔒 {lang === 'es' ? 'Régimen de Parque Cerrado' : 'Parc Fermé Regulations'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Floating Driver HUD Detail Card (Tapped Driver) */}
            {!isFinished && selectedDriver && (
              <div className="absolute bottom-2 left-2 right-2 sm:left-auto sm:right-4 sm:bottom-4 bg-[#131722]/98 border border-white/[0.15] rounded-xl p-3 shadow-2xl backdrop-blur-md flex flex-col gap-2 max-w-sm font-mono text-xs z-30">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm shrink-0"
                      style={{ backgroundColor: selectedDriver.teamColor || '#E10600' }}
                    >
                      {selectedDriver.pos}
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-bold text-white font-sans text-sm truncate">
                          {selectedDriver.fullName}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          ({selectedDriver.code}) #{selectedDriver.driverNumber}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 truncate">
                        {selectedDriver.teamName}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDriverNumber(null)}
                    className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#0B0E14] p-2 rounded-lg border border-white/[0.05] text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase">
                      {lang === 'es' ? 'Mejor Vuelta' : 'Best Lap'}
                    </span>
                    <span className="font-bold text-white tabular-nums">
                      {selectedDriver.bestLapTime || selectedDriver.lastLapTime || '- - -'}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase">
                      {lang === 'es' ? 'Diferencia' : 'Gap'}
                    </span>
                    <span className="font-bold text-emerald-400 tabular-nums">
                      {selectedDriver.gap || (lang === 'es' ? 'LÍDER' : 'LEADER')}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase">
                      {lang === 'es' ? 'Neumático' : 'Tyre'}
                    </span>
                    <span className="font-bold text-amber-300">
                      {selectedDriver.tyre?.compound || 'SOFT'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Driver Selector Carousel (Solo durante sesión activa en pista) */}
          {!isFinished && (
            <div className="px-2.5 py-2 bg-[#141923] border-t border-white/[0.06] overflow-x-auto no-scrollbar flex items-center gap-1.5 select-none">
              <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase shrink-0 px-1">
                {lang === 'es' ? 'Pilotos:' : 'Drivers:'}
              </span>
              {sortedDrivers.map((d) => {
                const isSelected = selectedDriverNumber === d.driverNumber;
                const teamColor = d.teamColor || '#E10600';

                return (
                  <button
                    key={d.driverNumber}
                    type="button"
                    onClick={() => handleDriverSelect(d.driverNumber)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-white/20 text-white border-white shadow-md'
                        : 'bg-[#0B0E14] text-zinc-400 hover:text-white border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: teamColor }}
                    />
                    <span className="text-zinc-500 text-[10px]">P{d.pos}</span>
                    <span className="text-white text-[11px]">{d.code}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
