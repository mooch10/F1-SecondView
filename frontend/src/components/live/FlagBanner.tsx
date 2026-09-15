import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Flag, ShieldAlert } from 'lucide-react';
import type { FlagStatus, SessionLive } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { translateSessionName } from '../../utils/sessionTranslation';

interface FlagBannerProps {
  session: SessionLive | null;
}

const OFFICIAL_CIRCUIT_LAPS: Record<string, number> = {
  madrid: 57,
  madring: 57,
  ifema: 57,
  valdebebas: 57,
  spain: 57,
  bahrain: 57,
  sakhir: 57,
  jeddah: 50,
  saudi: 50,
  albert_park: 58,
  melbourne: 58,
  suzuka: 53,
  japan: 53,
  shanghai: 56,
  china: 56,
  miami: 57,
  imola: 63,
  emilia: 63,
  monaco: 78,
  monte_carlo: 78,
  montreal: 70,
  canada: 70,
  villeneuve: 70,
  barcelona: 66,
  catalunya: 66,
  spielberg: 71,
  austria: 71,
  red_bull_ring: 71,
  silverstone: 52,
  britain: 52,
  hungaroring: 70,
  hungary: 70,
  spa: 44,
  belgium: 44,
  francorchamps: 44,
  zandvoort: 72,
  netherlands: 72,
  monza: 53,
  italy: 53,
  baku: 51,
  azerbaijan: 51,
  sepang: 56,
  malaysia: 56,
  singapore: 62,
  marina_bay: 62,
  austin: 56,
  cota: 56,
  americas: 56,
  mexico: 71,
  rodriguez: 71,
  interlagos: 71,
  brazil: 71,
  sao_paulo: 71,
  vegas: 50,
  las_vegas: 50,
  losail: 57,
  qatar: 57,
  yas_marina: 58,
  abu_dhabi: 58,
};

function getCircuitOfficialLaps(circuit?: string, location?: string, country?: string): number {
  const terms = [circuit, location, country]
    .filter(Boolean)
    .map((t) => t!.toLowerCase().trim().replace(/[\s-]+/g, '_'));

  for (const term of terms) {
    for (const [key, laps] of Object.entries(OFFICIAL_CIRCUIT_LAPS)) {
      if (term.includes(key) || key.includes(term)) {
        return laps;
      }
    }
  }
  return 58;
}

export const FlagBanner: React.FC<FlagBannerProps> = ({ session }) => {
  const { lang, t } = useLanguage();

  if (!session) {
    return (
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3 animate-pulse text-zinc-400 font-mono text-xs">
        {lang === 'es' ? 'CARGANDO TELEMETRÍA DE PISTA...' : 'LOADING TRACK TELEMETRY...'}
      </div>
    );
  }

  const resolvedTotalLaps =
    session.totalLaps || getCircuitOfficialLaps(session.circuit, session.location, session.country);

  const getFlagConfig = (flag: FlagStatus) => {
    switch (flag) {
      case 'GREEN':
        return {
          border: 'border-l-4 border-l-[#39B54A]',
          text: 'text-[#39B54A]',
          indicator: 'bg-[#39B54A]',
          icon: <CheckCircle2 className="w-4 h-4 text-[#39B54A]" />,
          label: t.live.flags.green,
        };
      case 'YELLOW':
        return {
          border: 'border-l-4 border-l-[#FFD800]',
          text: 'text-[#FFD800]',
          indicator: 'bg-[#FFD800] animate-pulse',
          icon: <AlertTriangle className="w-4 h-4 text-[#FFD800]" />,
          label: t.live.flags.yellow,
        };
      case 'VSC':
        return {
          border: 'border-l-4 border-l-[#FF9500]',
          text: 'text-[#FF9500]',
          indicator: 'bg-[#FF9500] animate-ping',
          icon: <ShieldAlert className="w-4 h-4 text-[#FF9500]" />,
          label: t.live.flags.vsc,
        };
      case 'SC':
        return {
          border: 'border-l-4 border-l-[#FF9500]',
          text: 'text-[#FF9500]',
          indicator: 'bg-[#FF9500] animate-ping',
          icon: <ShieldAlert className="w-4 h-4 text-[#FF9500]" />,
          label: t.live.flags.sc,
        };
      case 'RED':
        return {
          border: 'border-l-4 border-l-[#E10600]',
          text: 'text-[#E10600]',
          indicator: 'bg-[#E10600] animate-ping',
          icon: <AlertTriangle className="w-4 h-4 text-[#E10600]" />,
          label: t.live.flags.red,
        };
      case 'CHEQUERED':
        return {
          border: 'border-l-4 border-l-white',
          text: 'text-white',
          indicator: 'bg-white',
          icon: <Flag className="w-4 h-4 text-white" />,
          label: t.live.flags.chequered,
        };
      default:
        return {
          border: 'border-l-4 border-l-zinc-400',
          text: 'text-zinc-400',
          indicator: 'bg-zinc-400',
          icon: <Flag className="w-4 h-4 text-zinc-400" />,
          label: t.live.flags.inProgress,
        };
    }
  };

  const isNotStarted = session.status === 'NOT_STARTED';
  const isRaceFinished =
    session.sessionType === 'Race' &&
    (session.status === 'FINISHED' ||
      session.flag === 'CHEQUERED' ||
      (resolvedTotalLaps > 0 && session.currentLap >= resolvedTotalLaps));
  const effectiveFlag: FlagStatus =
    session.status === 'FINISHED' || isRaceFinished || isNotStarted ? 'CHEQUERED' : session.flag;

  const displayLap = isRaceFinished || session.status === 'FINISHED' ? resolvedTotalLaps : session.currentLap;
  const effectiveProgressPercent =
    isRaceFinished || session.status === 'FINISHED'
      ? 100
      : Math.min(
          100,
          Math.max(
            0,
            session.progressPercentage ??
              Math.round((displayLap / (resolvedTotalLaps || 1)) * 100),
          ),
        );

  const flagConfig = isNotStarted
    ? {
        border: 'border-l-4 border-l-cyan-500/70',
        text: 'text-cyan-400',
        indicator: 'bg-cyan-500',
        icon: <Clock className="w-4 h-4 text-cyan-400" />,
        label: lang === 'es' ? 'SESIÓN NO INICIADA • PISTA CERRADA' : 'NOT STARTED • TRACK CLOSED',
      }
    : getFlagConfig(effectiveFlag);

  const rawCircuit = session.circuit ? session.circuit.toUpperCase() : '';
  const cleanCircuit = rawCircuit.includes('MADRING') ? 'CIRCUITO DE MADRID' : rawCircuit;

  return (
    <div className="flex flex-col gap-2">
      {/* Session Title & Digital Instrument Box */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-sm">
        <div>
          {(cleanCircuit || session.country) ? (
            <div className="text-xs font-mono tracking-wider uppercase text-zinc-400">
              {cleanCircuit}
              {cleanCircuit && session.country ? ' • ' : ''}
              {session.country ? session.country.toUpperCase() : ''}
            </div>
          ) : null}
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5 uppercase">
            {session.location && session.location !== 'Circuito'
              ? `${session.location} `
              : ''}
            {session.sessionType === 'Qualifying'
              ? (lang === 'es' ? 'QUALY' : 'QUALIFYING')
              : session.sessionType === 'Practice'
              ? (lang === 'es' ? 'PRÁCTICA LIBRE' : 'FREE PRACTICE')
              : session.sessionName
              ? translateSessionName(session.sessionName, lang).toUpperCase()
              : (lang === 'es' ? 'GRAN PREMIO' : 'GRAND PRIX')}
          </h1>
        </div>

        {/* Lap / Phase Instrument Box */}
        {session.sessionType === 'Qualifying' && !isNotStarted ? (
          <div className="flex flex-col items-end justify-center bg-[#0B0E14] border border-cyan-500/30 px-3 py-1.5 rounded-lg shadow-xs">
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#27F4D2] uppercase">
              {t.live.qualyPhase}
            </span>
            <div className="text-xl sm:text-2xl font-mono font-black tracking-tight text-[#FFD60A] tabular-nums">
              {session.qualifyingPhase || 'Q1'}
            </div>
          </div>
        ) : isNotStarted ? (
          <div className="flex flex-col items-end justify-center bg-[#0B0E14] border border-white/[0.08] px-3 py-1.5 rounded-lg">
            <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
              {lang === 'es' ? 'ESTADO' : 'STATUS'}
            </span>
            <div className="text-base sm:text-xl font-mono font-bold tracking-tight text-cyan-400 tabular-nums">
              {lang === 'es' ? 'GRILLA' : 'GRID'}
              <span className="text-xs font-normal text-zinc-500 ml-1">
                (0/{resolvedTotalLaps})
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end justify-center bg-[#0B0E14] border border-white/[0.08] px-3 py-1.5 rounded-lg">
            <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
              {isRaceFinished || session.status === 'FINISHED'
                ? (lang === 'es' ? 'RESULTADO' : 'RESULT')
                : t.live.lap}
            </span>
            <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white tabular-nums">
              {displayLap}
              <span className="text-xs sm:text-sm font-normal text-zinc-500 ml-1">
                / {resolvedTotalLaps}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress / Status Bar */}
      <div className="bg-[#131722] border border-white/[0.08] rounded-xl px-3 py-2 flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-zinc-400 uppercase tracking-wider font-semibold">
            {isNotStarted
              ? (lang === 'es' ? 'INICIO PROGRAMADO: 10:00 HS' : 'SCHEDULED START: 10:00 HS')
              : session.sessionType === 'Qualifying'
              ? `${t.live.qualyProgress} ${session.qualifyingPhase || 'Q1'}`
              : t.live.gpProgress}
          </span>
          <span className="font-bold text-white tabular-nums">
            {session.sessionType === 'Qualifying' && !isNotStarted ? (
              session.poleDriver && session.poleLapTime && session.poleLapTime !== '--:--.---' ? (
                <>
                  {t.live.provisionalPole}{' '}
                  <span className="text-[#FFD60A] font-bold font-mono">
                    {session.poleDriver} ({session.poleLapTime})
                  </span>
                </>
              ) : (
                <span className="text-[#27F4D2]">{t.live.liveTimes}</span>
              )
            ) : isNotStarted ? (
              <span className="text-cyan-400 font-bold">
                {lang === 'es' ? 'PARRILLA CONFIRMADA' : 'CONFIRMED GRID'}
              </span>
            ) : (
              <>
                {displayLap} / {resolvedTotalLaps} {lang === 'es' ? 'VUELTAS' : 'LAPS'} •{' '}
                <span className="text-[#FFD60A]">{effectiveProgressPercent}%</span>
              </>
            )}
          </span>
        </div>
        <div className="w-full h-2 bg-[#0B0E14] border border-white/[0.08] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              session.sessionType === 'Qualifying'
                ? 'bg-gradient-to-r from-[#27F4D2] via-[#FFD800] to-[#E10600]'
                : isNotStarted
                ? 'bg-cyan-500/50'
                : 'bg-gradient-to-r from-[#E10600] via-[#FF8000] to-[#34C759]'
            }`}
            style={{
              width: `${isNotStarted ? 0 : effectiveProgressPercent}%`,
            }}
          />
        </div>
      </div>

      {/* Track Flag Strip */}
      <div
        className={`flex items-center justify-between px-3 py-2 bg-[#131722] border-y border-r border-white/[0.08] ${flagConfig.border} rounded-xl text-xs font-mono font-semibold tracking-wider ${flagConfig.text} shadow-sm min-w-0`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full ${flagConfig.indicator} shrink-0`} />
          <span className="shrink-0">{flagConfig.icon}</span>
          <span className="whitespace-nowrap text-[11px] sm:text-xs tracking-wide truncate">
            {flagConfig.label}
          </span>
        </div>
      </div>
    </div>
  );
};
