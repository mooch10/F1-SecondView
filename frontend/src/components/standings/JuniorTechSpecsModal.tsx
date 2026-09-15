import React from 'react';
import { Gauge, Trophy, Wrench, X } from 'lucide-react';
import { TECH_SPECS, type TechSpecsData } from '../../data/juniorGraduatesData';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';

interface JuniorTechSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JuniorTechSpecsModal: React.FC<JuniorTechSpecsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang } = useLanguage();
  const { series, theme } = useSeries();

  if (!isOpen) return null;

  const targetSeries = series === 'f3' ? 'f3' : 'f2';
  const specs: TechSpecsData = TECH_SPECS[targetSeries];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-[#0B0E14] border border-white/[0.12] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#131722] border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black font-mono shadow-xs"
              style={{ backgroundColor: theme.primary }}
            >
              🏎️
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-400 block">
                {targetSeries.toUpperCase()} FIA CHAMPIONSHIP • {lang === 'es' ? 'ESPECIFICACIONES TÉCNICAS' : 'TECHNICAL SPECS'}
              </span>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                {specs.chassis}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 text-xs font-mono">
          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#131722] border border-white/[0.06] flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Potencia</span>
              <span className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {specs.power.split('@')[0]}
              </span>
              <span className="text-[9px] text-zinc-500">Mecachrome V6</span>
            </div>

            <div className="p-3 rounded-xl bg-[#131722] border border-white/[0.06] flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Velocidad Punta</span>
              <span className="text-sm sm:text-base font-extrabold text-[#27F4D2] mt-0.5">
                {specs.topSpeed.split('(')[0]}
              </span>
              <span className="text-[9px] text-zinc-500">Aero Monza</span>
            </div>

            <div className="p-3 rounded-xl bg-[#131722] border border-white/[0.06] flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Aceleración</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-400 mt-0.5">
                0-100 en 2.9s
              </span>
              <span className="text-[9px] text-zinc-500">Tracción Trasera</span>
            </div>

            <div className="p-3 rounded-xl bg-[#131722] border border-white/[0.06] flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Peso Mínimo</span>
              <span className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {specs.weight.split('(')[0]}
              </span>
              <span className="text-[9px] text-zinc-500">Piloto incluido</span>
            </div>
          </div>

          {/* Superlicense Badge Highlight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 flex items-start gap-3">
            <span className="text-2xl shrink-0">🪪</span>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-amber-300 uppercase tracking-wide text-xs flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'es' ? 'Puntos de Superlicencia FIA hacia la F1' : 'FIA Super License Points to F1'}
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {specs.superlicense}
              </p>
            </div>
          </div>

          {/* Detailed Engine & Chassis Specs */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              {lang === 'es' ? 'Componentes Mecánicos y Aerodinámicos' : 'Chassis & Powertrain Specs'}
            </h3>

            <div className="bg-[#131722] border border-white/[0.06] rounded-xl divide-y divide-white/[0.04]">
              <div className="grid grid-cols-3 p-3 text-[11px]">
                <span className="text-zinc-500">Chasis y Seguridad</span>
                <span className="col-span-2 text-white font-medium">{specs.chassis}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-[11px]">
                <span className="text-zinc-500">Unidad de Potencia</span>
                <span className="col-span-2 text-white font-medium">{specs.engine}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-[11px]">
                <span className="text-zinc-500">Frenos</span>
                <span className="col-span-2 text-white font-medium">{specs.brakes}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-[11px]">
                <span className="text-zinc-500">Transmisión</span>
                <span className="col-span-2 text-white font-medium">{specs.gearbox}</span>
              </div>
              <div className="grid grid-cols-3 p-3 text-[11px]">
                <span className="text-zinc-500">Neumáticos</span>
                <span className="col-span-2 text-white font-medium">{specs.tires}</span>
              </div>
            </div>
          </div>

          {/* Weekend Format: Sprint vs Feature */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#27F4D2]" />
              {lang === 'es' ? 'Estructura de Fin de Semana y Parrilla Invertida' : 'Weekend Format & Reverse Grid'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#131722] border border-white/[0.06] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#FFD60A] uppercase tracking-wide text-xs">
                    {lang === 'es' ? 'Carrera Sprint (Sábado)' : 'Sprint Race (Saturday)'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-bold">
                    {targetSeries === 'f2' ? 'Top 10 Invertido' : 'Top 12 Invertido'}
                  </span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {specs.weekendFormat.sprintRace}
                </p>
                <div className="mt-1 pt-1.5 border-t border-white/[0.06] text-[10px] text-zinc-400">
                  <strong>Puntaje:</strong> {specs.pointsSystem.sprint}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#131722] border border-white/[0.06] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase tracking-wide text-xs">
                    {lang === 'es' ? 'Carrera Feature (Domingo)' : 'Feature Race (Sunday)'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">
                    {targetSeries === 'f2' ? 'Parada en Boxes Obligatoria' : 'Carrera Principal'}
                  </span>
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {specs.weekendFormat.featureRace}
                </p>
                <div className="mt-1 pt-1.5 border-t border-white/[0.06] text-[10px] text-zinc-400">
                  <strong>Puntaje:</strong> {specs.pointsSystem.feature}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#131722] border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            FIA Formula {targetSeries === 'f2' ? '2' : '3'} Technical Regulations
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] dark:text-white dark:border-transparent text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            {lang === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
