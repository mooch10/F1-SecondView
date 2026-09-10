import React from 'react';
import { Calendar, Flag, Sun, SunMedium, Trophy, Wifi, WifiOff } from 'lucide-react';
import type { ActiveTab } from '../../types/f1';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLiveActive: boolean;
  isLiveConnected: boolean;
  isWakeLocked: boolean;
  onToggleWakeLock: () => void;
  wakeLockSupported: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLiveActive,
  isLiveConnected,
  isWakeLocked,
  onToggleWakeLock,
  wakeLockSupported,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Top brand & status bar */}
        <div className="flex items-center justify-between h-13 py-2">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E10600] to-[#990400] flex items-center justify-center font-extrabold text-white text-base shadow-lg shadow-[#E10600]/20 tracking-tighter italic">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-lg uppercase italic font-sans">
                  REBUFO
                </span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/[0.07] text-zinc-400 uppercase">
                  F1 Live
                </span>
              </div>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2">
            {/* Wake lock indicator button */}
            {wakeLockSupported && (
              <button
                type="button"
                onClick={onToggleWakeLock}
                title={isWakeLocked ? 'Pantalla siempre activa (tap para apagar)' : 'Activar pantalla siempre encendida'}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isWakeLocked
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/20'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]'
                }`}
              >
                {isWakeLocked ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                ) : (
                  <SunMedium className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isWakeLocked ? 'Pantalla Activa' : 'Wake Lock'}
                </span>
              </button>
            )}

            {/* Connection status */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border ${
                isLiveConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
              title={isLiveConnected ? 'Conectado en tiempo real' : 'Reconectando...'}
            >
              {isLiveConnected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <Wifi className="w-3 h-3 hidden sm:inline" />
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span className="hidden sm:inline">Desconectado</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation (Promiedos Style) */}
        <nav className="flex items-center justify-between border-t border-white/[0.06] pt-1 pb-1.5 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'live'
                ? 'bg-[#1C2230] text-white border border-white/[0.12] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            <Flag className="w-4 h-4 text-[#E10600]" />
            <span>En Vivo</span>
            {isLiveActive && (
              <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'schedule'
                ? 'bg-[#1C2230] text-white border border-white/[0.12] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#27F4D2]" />
            <span>Calendario</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standings')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'standings'
                ? 'bg-[#1C2230] text-white border border-white/[0.12] shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            <Trophy className="w-4 h-4 text-[#FFD60A]" />
            <span>Posiciones</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
