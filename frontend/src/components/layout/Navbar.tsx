import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ActiveTab } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';

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
  const { lang, toggleLang, t } = useLanguage();

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
              <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-md bg-[#131722] text-zinc-400 uppercase border border-white/[0.08] hidden min-[380px]:inline-block">
                F1 TELEMETRY
              </span>
            </div>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Feed Status (Compact pro telemetry style) */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 tracking-tight select-none">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLiveActive && isLiveConnected
                    ? 'bg-[#39B54A] animate-pulse'
                    : isLiveConnected
                    ? 'bg-zinc-500'
                    : 'bg-[#E10600]'
                }`}
              />
              <span className="hidden sm:inline">
                {isLiveActive && isLiveConnected
                  ? t.nav.liveFeed
                  : isLiveConnected
                  ? t.nav.standby
                  : t.nav.offline}
              </span>
              <span className="sm:hidden">
                {isLiveActive && isLiveConnected ? 'LIVE' : t.nav.standby}
              </span>
            </div>

            {/* Language Switcher Button: [ ES | EN ] */}
            <button
              type="button"
              onClick={toggleLang}
              title={t.nav.langTitle}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider bg-[#131722] hover:bg-[#1a202c] border border-white/[0.08] transition-colors cursor-pointer select-none"
            >
              <span className={lang === 'es' ? 'text-[#E10600] font-black' : 'text-zinc-500'}>ES</span>
              <span className="text-zinc-600">/</span>
              <span className={lang === 'en' ? 'text-[#E10600] font-black' : 'text-zinc-500'}>EN</span>
            </button>

            {/* Theme Toggle Button: Sol (modo claro) / Luna (modo oscuro) */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDarkMode ? t.nav.themeLight : t.nav.themeDark}
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

        {/* Tab Navigation (Broadcast Bar Style with Smooth Edge-to-Edge Scroll on Mobile) */}
        <nav className="flex items-center gap-1 sm:gap-6 md:gap-8 border-t border-white/[0.08] -mx-3 px-3 sm:mx-0 sm:px-1 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'live'
                ? 'text-zinc-100 border-[#E10600]'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
          >
            <span>{t.nav.live}</span>
            {isLiveActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('last-race')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'last-race'
                ? 'text-zinc-100 border-[#E10600]'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
          >
            <span>{t.nav.lastRace}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qualy')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'qualy'
                ? 'text-zinc-100 border-[#E10600]'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
          >
            <span className="sm:hidden">{t.nav.qualyShort}</span>
            <span className="hidden sm:inline">{t.nav.qualy}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'schedule'
                ? 'text-zinc-100 border-[#E10600]'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
          >
            <span>{t.nav.schedule}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standings')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'standings'
                ? 'text-zinc-100 border-[#E10600]'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
          >
            <span>{t.nav.standings}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
