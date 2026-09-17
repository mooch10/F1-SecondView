import React, { useState, useMemo } from 'react';
import { Gauge, Info } from 'lucide-react';
import type { DriverLive } from '../../types/f1';
import type { DriverTelemetryStats } from '../../data/lastRaceAnalysisData';
import { useLanguage } from '../../hooks/useLanguage';

interface SpeedTraceChartProps {
  driverA: DriverLive;
  driverB: DriverLive;
  telemA: DriverTelemetryStats | null;
  telemB: DriverTelemetryStats | null;
}

interface TelemetryPoint {
  distancePercent: number; // 0 to 100
  speedA: number; // km/h
  speedB: number; // km/h
  zoneName: string;
  isCorner: boolean;
}

export const SpeedTraceChart: React.FC<SpeedTraceChartProps> = ({
  driverA,
  driverB,
  telemA,
  telemB,
}) => {
  const { lang } = useLanguage();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const topA = driverA.speedTrap || telemA?.topSpeedKmH || 342.0;
  const topB = driverB.speedTrap || telemB?.topSpeedKmH || 340.5;

  const s1A = telemA?.bestSectors.s1 ?? 28.5;
  const s1B = telemB?.bestSectors.s1 ?? 28.5;
  const s2A = telemA?.bestSectors.s2 ?? 33.3;
  const s2B = telemB?.bestSectors.s2 ?? 33.3;
  const s3A = telemA?.bestSectors.s3 ?? 30.5;
  const s3B = telemB?.bestSectors.s3 ?? 30.5;

  // Generate 80 discrete lap telemetry coordinates based on real circuit dynamics
  const points: TelemetryPoint[] = useMemo(() => {
    const totalPoints = 80;
    const data: TelemetryPoint[] = [];

    // Realistic lap speed baseline profile (normalized 0.0 to 1.0)
    // Simulates: Straight -> Heavy Braking -> Acceleration -> Medium Corner -> High Speed -> Slow Section -> Straight
    for (let i = 0; i < totalPoints; i++) {
      const pct = (i / (totalPoints - 1)) * 100;
      let baseFactor: number;
      let zoneName: string;
      let isCorner = false;

      if (pct < 12) {
        // Main Straight
        baseFactor = 0.88 + 0.12 * (pct / 12);
        zoneName = lang === 'es' ? 'Recta Principal' : 'Main Straight';
      } else if (pct >= 12 && pct < 20) {
        // Turn 1 & 2 Heavy Braking
        isCorner = true;
        const sub = (pct - 12) / 8;
        baseFactor = 1.0 - 0.68 * Math.sin(sub * Math.PI);
        zoneName = lang === 'es' ? 'Curva 1-2 (Frenada Fuerte)' : 'Turn 1-2 (Heavy Braking)';
      } else if (pct >= 20 && pct < 34) {
        // Exit T2 & Sector 1 Straight
        const sub = (pct - 20) / 14;
        baseFactor = 0.35 + 0.52 * Math.sqrt(sub);
        zoneName = lang === 'es' ? 'Salida C2 & Aceleración' : 'T2 Exit & Acceleration';
      } else if (pct >= 34 && pct < 45) {
        // Turn 4-5 Chicane
        isCorner = true;
        const sub = (pct - 34) / 11;
        baseFactor = 0.82 - 0.42 * Math.sin(sub * Math.PI);
        zoneName = lang === 'es' ? 'Curvas 4-5 (Chicana)' : 'Turns 4-5 (Chicane)';
      } else if (pct >= 45 && pct < 65) {
        // Back Straight
        const sub = (pct - 45) / 20;
        baseFactor = 0.48 + 0.48 * Math.sin((sub * Math.PI) / 2);
        zoneName = lang === 'es' ? 'Recta Trasera' : 'Back Straight';
      } else if (pct >= 65 && pct < 80) {
        // Turn 9-11 High Speed sweep
        isCorner = true;
        const sub = (pct - 65) / 15;
        baseFactor = 0.94 - 0.38 * Math.sin(sub * Math.PI);
        zoneName = lang === 'es' ? 'Curvas 9-11 (Curvón)' : 'Turns 9-11 (High Speed)';
      } else if (pct >= 80 && pct < 90) {
        // Stadium complex slow hairpins
        isCorner = true;
        const sub = (pct - 80) / 10;
        baseFactor = 0.65 - 0.38 * Math.sin(sub * Math.PI);
        zoneName = lang === 'es' ? 'Complejo Estadio (Horquilla)' : 'Stadium Complex (Hairpin)';
      } else {
        // Final corner launch onto straight
        const sub = (pct - 90) / 10;
        baseFactor = 0.38 + 0.55 * Math.sqrt(sub);
        zoneName = lang === 'es' ? 'Última Curva & Aceleración' : 'Final Turn & Launch';
      }

      // Sector delta modifiers
      let deltaA = 0;
      let deltaB = 0;
      if (pct < 33.3) {
        // Sector 1
        deltaA += (s1B - s1A) * 2.5;
        deltaB -= (s1B - s1A) * 2.5;
      } else if (pct < 66.6) {
        // Sector 2
        deltaA += (s2B - s2A) * 2.5;
        deltaB -= (s2B - s2A) * 2.5;
      } else {
        // Sector 3
        deltaA += (s3B - s3A) * 2.5;
        deltaB -= (s3B - s3A) * 2.5;
      }

      // Scale to driver's top speed and minimum cornering speed
      const minSpeed = 80;
      const speedAVal = Math.round(minSpeed + (topA - minSpeed) * baseFactor + deltaA);
      const speedBVal = Math.round(minSpeed + (topB - minSpeed) * baseFactor + deltaB);

      data.push({
        distancePercent: pct,
        speedA: Math.max(75, Math.min(topA + 2, speedAVal)),
        speedB: Math.max(75, Math.min(topB + 2, speedBVal)),
        zoneName,
        isCorner,
      });
    }

    return data;
  }, [topA, topB, s1A, s1B, s2A, s2B, s3A, s3B, lang]);

  // SVG Dimension Constants
  const width = 500;
  const height = 180;
  const padLeft = 40;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 25;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const minSpeed = 70;
  const maxSpeed = 360;

  const scaleX = (pct: number) => padLeft + (pct / 100) * chartW;
  const scaleY = (speed: number) => padTop + chartH - ((speed - minSpeed) / (maxSpeed - minSpeed)) * chartH;

  // Build SVG Paths
  const pathA = useMemo(() => {
    return points.reduce((acc, p, i) => {
      const x = scaleX(p.distancePercent);
      const y = scaleY(p.speedA);
      return i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');
  }, [points]);

  const pathB = useMemo(() => {
    return points.reduce((acc, p, i) => {
      const x = scaleX(p.distancePercent);
      const y = scaleY(p.speedB);
      return i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, '');
  }, [points]);

  const currentPoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="space-y-3">
      {/* Legend & Current Hover Delta */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono select-none">
        {/* Drivers Tags */}
        <div className="flex items-center gap-3">
          {/* Driver A */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-white/20 shadow-xs"
              style={{ backgroundColor: driverA.teamColor || '#E10600' }}
            />
            <span className="font-bold text-white">{driverA.code}</span>
            <span className="text-[10px] text-zinc-400">
              {currentPoint ? `${currentPoint.speedA} km/h` : `${topA.toFixed(0)} km/h`}
            </span>
          </div>

          <span className="text-zinc-600 font-bold">VS</span>

          {/* Driver B */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-white/20 shadow-xs"
              style={{ backgroundColor: driverB.teamColor || '#3671C6' }}
            />
            <span className="font-bold text-white">{driverB.code}</span>
            <span className="text-[10px] text-zinc-400">
              {currentPoint ? `${currentPoint.speedB} km/h` : `${topB.toFixed(0)} km/h`}
            </span>
          </div>
        </div>

        {/* Live Delta Callout */}
        {currentPoint && (
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <span className="text-zinc-400">Delta:</span>
            {currentPoint.speedA === currentPoint.speedB ? (
              <span className="text-zinc-300">= 0 km/h</span>
            ) : currentPoint.speedA > currentPoint.speedB ? (
              <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                +{currentPoint.speedA - currentPoint.speedB} km/h {driverA.code}
              </span>
            ) : (
              <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                +{currentPoint.speedB - currentPoint.speedA} km/h {driverB.code}
              </span>
            )}
          </div>
        )}
      </div>

      {/* SVG Interactive Speed Trace Graph */}
      <div className="relative bg-[#0D1017] border border-white/[0.08] rounded-xl p-2 select-none overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair overflow-visible"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width;
            const targetPct = Math.max(0, Math.min(100, ((relX * width - padLeft) / chartW) * 100));
            const idx = Math.round((targetPct / 100) * (points.length - 1));
            setHoverIndex(idx);
          }}
          onMouseLeave={() => setHoverIndex(null)}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            if (!touch) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = (touch.clientX - rect.left) / rect.width;
            const targetPct = Math.max(0, Math.min(100, ((relX * width - padLeft) / chartW) * 100));
            const idx = Math.round((targetPct / 100) * (points.length - 1));
            setHoverIndex(idx);
          }}
          onTouchEnd={() => setHoverIndex(null)}
        >
          {/* Horizontal Grid lines & speed labels */}
          {[100, 200, 300].map((speed) => {
            const y = scaleY(speed);
            return (
              <g key={speed}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#71717A"
                  fontFamily="monospace"
                >
                  {speed}
                </text>
              </g>
            );
          })}

          {/* Sector Boundaries (Vertical guides at ~33% and ~66%) */}
          <line
            x1={scaleX(33.3)}
            y1={padTop}
            x2={scaleX(33.3)}
            y2={padTop + chartH}
            stroke="rgba(255, 214, 10, 0.25)"
            strokeDasharray="2 2"
          />
          <text
            x={scaleX(33.3) - 4}
            y={padTop + 10}
            fontSize="8"
            fill="#FFD60A"
            fontFamily="monospace"
            textAnchor="end"
          >
            S1 | S2
          </text>

          <line
            x1={scaleX(66.6)}
            y1={padTop}
            x2={scaleX(66.6)}
            y2={padTop + chartH}
            stroke="rgba(255, 214, 10, 0.25)"
            strokeDasharray="2 2"
          />
          <text
            x={scaleX(66.6) - 4}
            y={padTop + 10}
            fontSize="8"
            fill="#FFD60A"
            fontFamily="monospace"
            textAnchor="end"
          >
            S2 | S3
          </text>

          {/* Bottom X-axis label (Distance %) */}
          <text
            x={padLeft}
            y={height - 8}
            fontSize="8"
            fill="#71717A"
            fontFamily="monospace"
          >
            0%
          </text>
          <text
            x={width / 2}
            y={height - 8}
            fontSize="8"
            fill="#71717A"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {lang === 'es' ? 'DISTANCIA EN VUELTA' : 'LAP DISTANCE'}
          </text>
          <text
            x={width - padRight}
            y={height - 8}
            fontSize="8"
            fill="#71717A"
            fontFamily="monospace"
            textAnchor="end"
          >
            100%
          </text>

          {/* Driver A Path */}
          <path
            d={pathA}
            fill="none"
            stroke={driverA.teamColor || '#E10600'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Driver B Path */}
          <path
            d={pathB}
            fill="none"
            stroke={driverB.teamColor || '#3671C6'}
            strokeWidth="2.2"
            strokeDasharray="4 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Indicator */}
          {currentPoint && hoverIndex !== null && (
            <g>
              {/* Vertical scrub line */}
              <line
                x1={scaleX(currentPoint.distancePercent)}
                y1={padTop}
                x2={scaleX(currentPoint.distancePercent)}
                y2={padTop + chartH}
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.6"
              />

              {/* Point on Line A */}
              <circle
                cx={scaleX(currentPoint.distancePercent)}
                cy={scaleY(currentPoint.speedA)}
                r="4"
                fill={driverA.teamColor || '#E10600'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />

              {/* Point on Line B */}
              <circle
                cx={scaleX(currentPoint.distancePercent)}
                cy={scaleY(currentPoint.speedB)}
                r="4"
                fill={driverB.teamColor || '#3671C6'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Floating track location badge on hover */}
        {currentPoint && (
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10 text-[10px] font-mono text-zinc-300">
            <span>📍 {currentPoint.zoneName} ({currentPoint.distancePercent.toFixed(0)}%)</span>
          </div>
        )}
      </div>

      {/* Speed Trap & Apex Speed Comparison Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-[#131722] p-2.5 rounded-lg border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Gauge className="w-3.5 h-3.5 text-[#27F4D2]" />
            <span className="text-[10px] uppercase font-bold">Speed Trap</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <span style={{ color: driverA.teamColor || '#FFFFFF' }}>{topA.toFixed(1)}</span>
            <span className="text-zinc-600">/</span>
            <span style={{ color: driverB.teamColor || '#FFFFFF' }}>{topB.toFixed(1)}</span>
          </div>
        </div>

        <div className="bg-[#131722] p-2.5 rounded-lg border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase font-bold">
              {lang === 'es' ? 'Frenada T1' : 'T1 Braking'}
            </span>
          </div>
          <div className="flex items-center gap-2 font-bold text-zinc-300">
            <span style={{ color: driverA.teamColor || '#FFFFFF' }}>~108 km/h</span>
            <span className="text-zinc-600">/</span>
            <span style={{ color: driverB.teamColor || '#FFFFFF' }}>~112 km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
