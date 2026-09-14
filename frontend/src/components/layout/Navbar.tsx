import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ActiveTab } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries, SERIES_THEMES } from '../../hooks/useSeries';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLiveActive: boolean;
  isLiveConnected: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onReturnToHero?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLiveActive,
  isLiveConnected,
  isDarkMode,
  onToggleTheme,
  onReturnToHero,
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const { series, setSeries, theme } = useSeries();

  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        {/* Top Brand, Series Switcher & Right Controls */}
        <div className="flex items-center justify-between h-12 gap-2">
          {/* Left: Brand Identity & Series Switcher (anchored together so switcher NEVER shifts) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Return to Hero Trigger: Exclusively Logo + 'DELTA' text */}
            <button
              type="button"
              onClick={() => (onReturnToHero ? onReturnToHero() : setActiveTab('live'))}
              className="inline-flex items-center gap-2 group cursor-pointer text-left focus:outline-none shrink-0"
              title="Portada / Inicio DELTA"
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white text-xs tracking-tighter italic shadow-sm transition-all active:scale-95 shrink-0"
                style={{ backgroundColor: theme.primary }}
              >
                D
              </div>
              <span className="font-extrabold tracking-tight text-zinc-100 group-hover:text-white text-base uppercase italic font-sans transition-colors">
                DELTA
              </span>
            </button>

            {/* Series Category Badge (Non-clickable, strictly outside the button) */}
            <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-md bg-[#131722] text-zinc-400 uppercase border border-white/[0.08] hidden sm:inline-block pointer-events-none select-none">
              {theme.badge}
            </span>

            {/* Series Switcher Pill Group: [ F1 | F2 | F3 ] */}
            <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-white/[0.08] text-xs font-mono shrink-0">
              {(['f1', 'f2', 'f3'] as const).map((s) => {
                const isSelected = series === s;
                const sTheme = SERIES_THEMES[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSeries(s);
                      if (s !== 'f1' && (activeTab === 'qualy' || activeTab === 'live')) {
                        setActiveTab('standings');
                      }
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                    style={isSelected ? { backgroundColor: sTheme.primary } : undefined}
                  >
                    {s.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Status Controls (Constant width & position across F1, F2, F3) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher Button: [ ES | EN ] */}
            <button
              type="button"
              onClick={toggleLang}
              title={t.nav.langTitle}
              className="flex items-center px-2 py-1 rounded-lg text-[11px] font-mono bg-[#131722] hover:bg-[#1a202c] border border-white/[0.08] transition-colors cursor-pointer select-none"
            >
              <span
                className={`w-4 text-center transition-colors duration-150 ${
                  lang === 'es' ? 'font-bold' : 'text-zinc-500 font-medium'
                }`}
                style={lang === 'es' ? { color: theme.primary } : undefined}
              >
                ES
              </span>
              <span className="text-zinc-600 font-normal mx-0.5">/</span>
              <span
                className={`w-4 text-center transition-colors duration-150 ${
                  lang === 'en' ? 'font-bold' : 'text-zinc-500 font-medium'
                }`}
                style={lang === 'en' ? { color: theme.primary } : undefined}
              >
                EN
              </span>
            </button>

            {/* Theme Toggle Button */}
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

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 sm:gap-6 md:gap-8 border-t border-white/[0.08] -mx-3 px-3 sm:mx-0 sm:px-1 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
          {/* Live telemetry only for F1 */}
          {series === 'f1' && (
            <button
              type="button"
              onClick={() => setActiveTab('live')}
              className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
                activeTab === 'live'
                  ? 'text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-100 border-transparent'
              }`}
              style={activeTab === 'live' ? { borderColor: theme.primary } : undefined}
            >
              <span>{t.nav.live}</span>
              {isLiveActive && isLiveConnected && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39B54A] animate-pulse" />
                  <span>LIVE</span>
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('last-race')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'last-race'
                ? 'text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
            style={activeTab === 'last-race' ? { borderColor: theme.primary } : undefined}
          >
            <span>{t.nav.lastRace}</span>
          </button>

          {/* Qualy tab (F1 only) */}
          {series === 'f1' && (
            <button
              type="button"
              onClick={() => setActiveTab('qualy')}
              className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
                activeTab === 'qualy'
                  ? 'text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-100 border-transparent'
              }`}
              style={activeTab === 'qualy' ? { borderColor: theme.primary } : undefined}
            >
              <span className="sm:hidden">{t.nav.qualyShort}</span>
              <span className="hidden sm:inline">{t.nav.qualy}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'schedule'
                ? 'text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
            style={activeTab === 'schedule' ? { borderColor: theme.primary } : undefined}
          >
            <span>{t.nav.schedule}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standings')}
            className={`px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold transition-all border-b-2 shrink-0 ${
              activeTab === 'standings'
                ? 'text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100 border-transparent'
            }`}
            style={activeTab === 'standings' ? { borderColor: theme.primary } : undefined}
          >
            <span>{t.nav.standings}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
