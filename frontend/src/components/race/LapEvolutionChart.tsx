import React, { useState, useMemo } from 'react';
import {
  LAST_RACE_LAP_CHART_DRIVERS,
  LAST_RACE_EVENTS,
} from '../../data/lastRaceAnalysisData';
import { useLanguage } from '../../hooks/useLanguage';
import { CountryFlag } from '../common/CountryFlag';

export const LapEvolutionChart: React.FC = () => {
  const { lang, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'podium' | 'points' | 'colapinto' | 'norris'>('all');
  const [hoveredDriver, setHoveredDriver] = useState<string | null>(null);

  const filteredDrivers = useMemo(() => {
    switch (activeFilter) {
      case 'podium':
        return LAST_RACE_LAP_CHART_DRIVERS.filter((d) => d.finishPos <= 3);
      case 'points':
        return LAST_RACE_LAP_CHART_DRIVERS.filter((d) => d.finishPos <= 10);
      case 'colapinto':
        return LAST_RACE_LAP_CHART_DRIVERS.filter((d) => d.code === 'COL' || d.code === 'GAS');
      case 'norris':
        return LAST_RACE_LAP_CHART_DRIVERS.filter((d) => d.code === 'NOR' || d.code === 'PIA');
      default:
        return LAST_RACE_LAP_CHART_DRIVERS;
    }
  }, [activeFilter]);

  // Chart dimensions & scaling
  const totalLaps = 57;
  const svgWidth = 800;
  const svgHeight = 360;
  const padLeft = 40;
  const padRight = 55;
  const padTop = 25;
  const padBottom = 30;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const getX = (lap: number) => padLeft + (lap / totalLaps) * chartW;
  const getY = (pos: number) => padTop + ((pos - 1) / 19) * chartH;

  return (
    <div className="bg-zinc-50 dark:bg-[#10141E] border border-zinc-200 dark:border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col gap-4 shadow-sm">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-white/[0.08] pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-red-600 dark:text-red-400 uppercase block">
            {lang === 'es' ? 'ANÁLISIS VUELTA A VUELTA' : 'LAP-BY-LAP ANALYSIS'}
          </span>
          <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">
            {t.lastRace.lapChartTitle}
          </h3>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all' as const, label: t.lastRace.filterAll },
            { id: 'podium' as const, label: t.lastRace.filterPodium },
            { id: 'points' as const, label: t.lastRace.filterPoints },
            {
              id: 'colapinto' as const,
              label: (
                <span className="inline-flex items-center gap-1">
                  <span>Alpine</span>
                  <CountryFlag countryCode="AR" alt="Argentina" className="w-3.5 h-2.5 rounded-[2px] shadow-xs inline-block" />
                </span>
              ),
            },
            { id: 'norris' as const, label: 'McLaren' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setActiveFilter(btn.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeFilter === btn.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Responsive Container */}
      <div className="relative w-full overflow-x-auto no-scrollbar py-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[500px] h-[300px] sm:h-[350px] select-none"
        >
          {/* Background SC/VSC Bands */}
          {LAST_RACE_EVENTS.map((ev, idx) => {
            const x1 = getX(ev.startLap);
            const x2 = getX(ev.endLap);
            const bandW = Math.max(x2 - x1, 10);
            return (
              <g key={idx}>
                <rect
                  x={x1}
                  y={padTop}
                  width={bandW}
                  height={chartH}
                  fill={ev.type === 'SC' ? 'rgba(234, 179, 8, 0.14)' : 'rgba(245, 158, 11, 0.08)'}
                  stroke={ev.type === 'SC' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(245, 158, 11, 0.2)'}
                  strokeDasharray="2 2"
                />
                <text
                  x={x1 + bandW / 2}
                  y={padTop + 14}
                  textAnchor="middle"
                  fill="#EAB308"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {ev.type}
                </text>
              </g>
            );
          })}

          {/* Horizontal Position Grid Lines (P1, P5, P10, P15, P20) */}
          {[1, 5, 10, 15, 20].map((p) => {
            const y = getY(p);
            return (
              <g key={p}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-zinc-200 dark:text-white/[0.06]"
                  strokeDasharray={p === 10 ? '4 4' : '1 2'}
                />
                <text
                  x={padLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="currentColor"
                  className="text-zinc-400 text-[10px] font-mono font-bold"
                >
                  P{p}
                </text>
              </g>
            );
          })}

          {/* Vertical Lap Grid Marks (every 10 laps) */}
          {[0, 10, 20, 30, 40, 50, 57].map((lap) => {
            const x = getX(lap);
            return (
              <g key={lap}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + chartH}
                  stroke="currentColor"
                  className="text-zinc-200 dark:text-white/[0.04]"
                />
                <text
                  x={x}
                  y={padTop + chartH + 18}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-zinc-400 text-[10px] font-mono"
                >
                  {lap === 0 ? 'START' : `L${lap}`}
                </text>
              </g>
            );
          })}

          {/* Driver Position Lines */}
          {filteredDrivers.map((d) => {
            const isHovered = hoveredDriver === d.code;
            const strokeColor = d.teamColor || '#FFFFFF';
            const strokeWidth = isHovered ? 3.5 : 2;
            const opacity = hoveredDriver && !isHovered ? 0.25 : 0.9;

            const pathString = d.positions.reduce((acc, pos, lap) => {
              const x = getX(lap);
              const y = getY(pos);
              return lap === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
            }, '');

            const lastX = getX(57);
            const lastY = getY(d.finishPos);

            return (
              <g
                key={d.code}
                onMouseEnter={() => setHoveredDriver(d.code)}
                onMouseLeave={() => setHoveredDriver(null)}
                className="cursor-pointer transition-opacity duration-150"
                style={{ opacity }}
              >
                {/* Driver line */}
                <path
                  d={pathString}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Finish Label Badge */}
                <circle cx={lastX} cy={lastY} r={isHovered ? 5 : 3.5} fill={strokeColor} />
                <text
                  x={lastX + 6}
                  y={lastY + 3.5}
                  fill={strokeColor}
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {d.code}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Active Highlights */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-2.5 border-t border-zinc-200 dark:border-white/[0.08] text-xs font-mono">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {filteredDrivers.map((d) => (
            <button
              key={d.code}
              type="button"
              onMouseEnter={() => setHoveredDriver(d.code)}
              onMouseLeave={() => setHoveredDriver(null)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all cursor-pointer text-xs ${
                hoveredDriver === d.code
                  ? 'bg-zinc-200 dark:bg-white/15 ring-1 ring-zinc-400 dark:ring-white/30 scale-105'
                  : 'bg-zinc-100/60 dark:bg-white/[0.03] hover:bg-zinc-200/70 dark:hover:bg-white/[0.08]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: d.teamColor }}
              />
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{d.code}</span>
              <span className="text-zinc-500 text-[10px]">P{d.finishPos}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-yellow-500/40 border border-yellow-500" />
            <span>SC / VSC</span>
          </span>
          <span>• 57 Vueltas Totales</span>
        </div>
      </div>
    </div>
  );
};
