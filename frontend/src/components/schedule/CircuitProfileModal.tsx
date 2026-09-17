import React, { useEffect } from 'react';
import { X, MapPin, Gauge, Flag } from 'lucide-react';
import { type CircuitIntel, getCircuitIntel } from '../../data/circuitIntelData';
import { useLanguage } from '../../hooks/useLanguage';

interface CircuitProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuitIdOrName?: string;
}

export const CircuitProfileModal: React.FC<CircuitProfileModalProps> = ({
  isOpen,
  onClose,
  circuitIdOrName,
}) => {
  const { lang } = useLanguage();
  const circuit: CircuitIntel = getCircuitIntel(circuitIdOrName);

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
  const padding = 30;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const viewBox = `${minX - padding} ${minY - padding} ${width} ${height}`;

  // Convert outline points into SVG path data
  const pathD = circuit.outline.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt[0]} ${pt[1]}` : `${acc} L ${pt[0]} ${pt[1]}`;
  }, '') + ' Z';

  const pirelliMetrics = [
    { label: lang === 'es' ? 'Estrés Neumáticos' : 'Tyre Stress', val: circuit.pirelliRatings.tyreStress },
    { label: lang === 'es' ? 'Agarre Asfalto' : 'Asphalt Grip', val: circuit.pirelliRatings.asphaltGrip },
    { label: lang === 'es' ? 'Abrasión Asfalto' : 'Asphalt Abrasion', val: circuit.pirelliRatings.asphaltAbrasion },
    { label: lang === 'es' ? 'Carga Aerodinámica' : 'Downforce', val: circuit.pirelliRatings.downforce },
    { label: lang === 'es' ? 'Exigencia Frenos' : 'Braking Demand', val: circuit.pirelliRatings.braking },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#10141E] border border-zinc-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-[#0B0E14]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{circuit.flag}</span>
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
        <div className="overflow-y-auto p-4 space-y-4 no-scrollbar overscroll-contain">
          
          {/* Vector Track Visualizer Card */}
          <div className="relative bg-zinc-900 rounded-xl border border-white/[0.08] p-4 flex flex-col items-center justify-center min-h-[210px] overflow-hidden shadow-inner">
            <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{circuit.city}, {circuit.country}</span>
            </div>

            <div className="absolute top-2 right-3">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                2026 ACTIVE AERO
              </span>
            </div>

            {/* SVG Track Outline */}
            <svg
              viewBox={viewBox}
              className="w-full max-w-[340px] h-[160px] sm:h-[180px] drop-shadow-[0_0_12px_rgba(239,68,68,0.35)]"
            >
              {/* Outer glow track line */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(239, 68, 68, 0.4)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Core track line */}
              <path
                d={pathD}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Circuit short description */}
            <p className="mt-2 text-center text-xs text-zinc-300 font-sans italic max-w-lg px-2">
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

          {/* Lap Record Card */}
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
            <div className="font-mono font-black text-sm sm:text-base text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 self-end sm:self-auto font-tabular">
              ⏱️ {circuit.lapRecord.time}
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
