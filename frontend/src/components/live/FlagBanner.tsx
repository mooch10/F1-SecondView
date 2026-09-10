import React from 'react';
import { AlertTriangle, CheckCircle2, Flag, ShieldAlert } from 'lucide-react';
import type { FlagStatus, SessionLive } from '../../types/f1';

interface FlagBannerProps {
  session: SessionLive | null;
}

export const FlagBanner: React.FC<FlagBannerProps> = ({ session }) => {
  if (!session) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3 animate-pulse text-zinc-400 font-mono text-xs">
        CARGANDO TELEMETRÍA DE PISTA...
      </div>
    );
  }

  const getFlagConfig = (flag: FlagStatus) => {
    switch (flag) {
      case 'GREEN':
        return {
          border: 'border-l-4 border-l-[#39B54A]',
          text: 'text-[#39B54A]',
          indicator: 'bg-[#39B54A]',
          icon: <CheckCircle2 className="w-4 h-4 text-[#39B54A]" />,
          label: 'PISTA LIBRE • BANDERA VERDE',
        };
      case 'YELLOW':
        return {
          border: 'border-l-4 border-l-[#FFD800]',
          text: 'text-[#FFD800]',
          indicator: 'bg-[#FFD800] animate-pulse',
          icon: <AlertTriangle className="w-4 h-4 text-[#FFD800]" />,
          label: 'PELIGRO EN PISTA • BANDERA AMARILLA',
        };
      case 'VSC':
        return {
          border: 'border-l-4 border-l-[#FF9500]',
          text: 'text-[#FF9500]',
          indicator: 'bg-[#FF9500] animate-ping',
          icon: <ShieldAlert className="w-4 h-4 text-[#FF9500]" />,
          label: 'VIRTUAL SAFETY CAR (VSC)',
        };
      case 'SC':
        return {
          border: 'border-l-4 border-l-[#FF9500]',
          text: 'text-[#FF9500]',
          indicator: 'bg-[#FF9500] animate-ping',
          icon: <ShieldAlert className="w-4 h-4 text-[#FF9500]" />,
          label: 'SAFETY CAR EN PISTA',
        };
      case 'RED':
        return {
          border: 'border-l-4 border-l-[#E10600]',
          text: 'text-[#E10600]',
          indicator: 'bg-[#E10600] animate-ping',
          icon: <AlertTriangle className="w-4 h-4 text-[#E10600]" />,
          label: 'SESIÓN DETENIDA • BANDERA ROJA',
        };
      case 'CHEQUERED':
        return {
          border: 'border-l-4 border-l-[#F5F5F7]',
          text: 'text-[#F5F5F7]',
          indicator: 'bg-[#F5F5F7]',
          icon: <Flag className="w-4 h-4 text-[#F5F5F7]" />,
          label: 'SESIÓN FINALIZADA • BANDERA A CUADROS',
        };
      default:
        return {
          border: 'border-l-4 border-l-[#8E929B]',
          text: 'text-[#8E929B]',
          indicator: 'bg-[#8E929B]',
          icon: <Flag className="w-4 h-4 text-[#8E929B]" />,
          label: 'SESIÓN EN CURSO',
        };
    }
  };

  const flagConfig = getFlagConfig(session.flag);

  return (
    <div className="flex flex-col gap-2">
      {/* Session Title & Digital Lap Instrument */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-xs font-mono tracking-wider uppercase text-zinc-400">
            ROUND 16 • {session.circuit.toUpperCase()} ({session.country.toUpperCase()})
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5 uppercase">
            {session.location} GRAND PRIX
          </h1>
        </div>

        {/* Lap Instrument Box */}
        <div className="flex flex-col items-end justify-center bg-[#0B0E14] border border-white/[0.08] px-3 py-1.5 rounded-lg">
          <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
            VUELTA
          </span>
          <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white tabular-nums">
            {session.currentLap}
            <span className="text-xs sm:text-sm font-normal text-zinc-500 ml-1">
              / {session.totalLaps || '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Race Progress Bar */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl px-3 py-2 flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-zinc-400 uppercase tracking-wider font-semibold">
            PROGRESO DEL GRAN PREMIO
          </span>
          <span className="font-bold text-white tabular-nums">
            {session.currentLap} / {session.totalLaps || session.currentLap} VUELTAS •{' '}
            <span className="text-[#FFD60A]">
              {session.progressPercentage ??
                Math.round((session.currentLap / (session.totalLaps || 1)) * 100)}
              %
            </span>
          </span>
        </div>
        <div className="w-full h-2 bg-[#0B0E14] border border-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E10600] via-[#FF8000] to-[#34C759] transition-all duration-500 rounded-full"
            style={{
              width: `${Math.min(
                100,
                session.progressPercentage ??
                  Math.round((session.currentLap / (session.totalLaps || 1)) * 100),
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Track Flag Strip */}
      <div
        className={`flex items-center justify-between px-3 py-2 bg-[#131722] border-y border-r border-white/[0.08] ${flagConfig.border} rounded-xl text-xs font-mono font-semibold tracking-wider ${flagConfig.text} shadow-sm`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${flagConfig.indicator}`} />
          {flagConfig.icon}
          <span>{flagConfig.label}</span>
        </div>
      </div>
    </div>
  );
};
