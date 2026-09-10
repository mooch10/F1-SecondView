import React from 'react';
import { AlertTriangle, CheckCircle2, Flag, ShieldAlert, Timer } from 'lucide-react';
import type { FlagStatus, SessionLive } from '../../types/f1';

interface FlagBannerProps {
  session: SessionLive | null;
}

export const FlagBanner: React.FC<FlagBannerProps> = ({ session }) => {
  if (!session) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3 animate-pulse text-zinc-500 text-xs">
        Cargando estado de pista...
      </div>
    );
  }

  const getFlagConfig = (flag: FlagStatus) => {
    switch (flag) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300',
          indicator: 'bg-emerald-400',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          label: 'PISTA LIBRE • BANDERA VERDE',
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-950/40 border-amber-500/30 text-amber-300',
          indicator: 'bg-amber-400 animate-pulse',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: 'PELIGRO EN PISTA • BANDERA AMARILLA',
        };
      case 'VSC':
        return {
          bg: 'bg-amber-950/60 border-amber-400/50 text-amber-200',
          indicator: 'bg-amber-400 animate-ping',
          icon: <ShieldAlert className="w-4 h-4 text-amber-300" />,
          label: 'VIRTUAL SAFETY CAR (VSC)',
        };
      case 'SC':
        return {
          bg: 'bg-orange-950/60 border-orange-400/50 text-orange-200',
          indicator: 'bg-orange-400 animate-ping',
          icon: <ShieldAlert className="w-4 h-4 text-orange-300" />,
          label: 'SAFETY CAR EN PISTA',
        };
      case 'RED':
        return {
          bg: 'bg-rose-950/70 border-rose-500/60 text-rose-200',
          indicator: 'bg-rose-500 animate-ping',
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
          label: 'SESIÓN DETENIDA • BANDERA ROJA',
        };
      case 'CHEQUERED':
        return {
          bg: 'bg-zinc-900 border-white/20 text-white',
          indicator: 'bg-white',
          icon: <Flag className="w-4 h-4 text-white" />,
          label: 'FINALIZADA • BANDERA A CUADROS',
        };
      default:
        return {
          bg: 'bg-zinc-900 border-white/10 text-zinc-300',
          indicator: 'bg-zinc-500',
          icon: <Flag className="w-4 h-4" />,
          label: 'SESIÓN EN CURSO',
        };
    }
  };

  const flagConfig = getFlagConfig(session.flag);

  return (
    <div className="flex flex-col gap-2">
      {/* Session Title & Lap Counter Card */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3 sm:p-4 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E10600]">
              {session.sessionName || 'Gran Premio'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400 font-medium">
              {session.circuit} ({session.country})
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
            {session.location} Grand Prix
          </h1>
        </div>

        {/* Lap Counter */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <Timer className="w-3 h-3 text-[#27F4D2]" /> VUELTA
          </span>
          <div className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight font-tabular">
            {session.currentLap}{' '}
            <span className="text-xs sm:text-sm font-normal text-zinc-500">
              / {session.totalLaps || '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Track Flag Banner */}
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs sm:text-sm font-bold tracking-wide transition-colors ${flagConfig.bg}`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${flagConfig.indicator}`} />
          {flagConfig.icon}
          <span>{flagConfig.label}</span>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/30 font-semibold">
          {session.status}
        </span>
      </div>
    </div>
  );
};
