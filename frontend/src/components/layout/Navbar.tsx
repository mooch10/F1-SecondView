import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ActiveTab } from '../../types/f1';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLiveActive: boolean;
  isLiveConnected: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLiveActive,
  isLiveConnected,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Top Brand & Telemetry Status */}
        <div className="flex items-center justify-between h-12">
          {/* Logo & Racing Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#E10600] flex items-center justify-center font-black text-white text-xs tracking-tighter italic shadow-sm">
              R
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-zinc-100 text-base uppercase italic font-sans">
                REBUFO
              </span>
              <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-md bg-[#131722] text-zinc-400 uppercase border border-white/[0.08]">
                F1 TELEMETRY
              </span>
            </div>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-3">
            {/* Live Feed Status (Compact pro telemetry style) */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 tracking-tight select-none">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLiveConnected ? 'bg-[#39B54A]' : 'bg-[#E10600]'
                }`}
              />
              <span className="hidden sm:inline">
                {isLiveConnected ? 'LIVE FEED 24ms' : 'FEED OFFLINE'}
              </span>
              <span className="sm:hidden">
                {isLiveConnected ? 'LIVE' : 'OFF'}
              </span>
            </div>

            {/* Theme Toggle Button: Sol (modo claro) / Luna (modo oscuro) */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-[#131722] border border-transparent hover:border-white/[0.08] transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-zinc-300 hover:text-white transition-colors" />
              ) : (
                <Sun className="w-4 h-4 text-[#FFD60A] hover:text-amber-300 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation (Broadcast Bar Style) */}
        <nav className="flex items-center gap-6 sm:gap-8 border-t border-white/[0.08] px-1">
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'live'
                ? 'text-zinc-100 border-[#E10600]'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
          >
            <span>En Vivo</span>
            {isLiveActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qualy')}
            className={`py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 ${
              activeTab === 'qualy'
                ? 'text-zinc-100 border-[#E10600]'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
          >
            <span>Clasificación</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 ${
              activeTab === 'schedule'
                ? 'text-zinc-100 border-[#E10600]'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
          >
            <span>Calendario</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standings')}
            className={`py-2 text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 ${
              activeTab === 'standings'
                ? 'text-zinc-100 border-[#E10600]'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
          >
            <span>Posiciones</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
