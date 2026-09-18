import React, { useState, useEffect, useMemo } from 'react';
import { Download, Moon, Search, Star, Sun, Tv, Volume2, VolumeX } from 'lucide-react';
import type { ActiveTab } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries, SERIES_THEMES } from '../../hooks/useSeries';
import { TrackTimeToggle } from '../common/TrackTimeToggle';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallAppModal } from '../common/InstallAppModal';
import { useFavoriteDriver } from '../../hooks/useFavoriteDriver';
import { getDriverProfile } from '../../data/f1DriversData';
import { isAudioAlertsEnabled, setAudioAlertsEnabled } from '../../utils/audioAlerts';
import { trackSeriesChange, trackTabChange } from '../../utils/analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLiveActive: boolean;
  isLiveConnected: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onReturnToHero?: () => void;
  onOpenSearch?: () => void;
  onToggleTvMode?: () => void;
  isTvMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLiveActive,
  isLiveConnected,
  isDarkMode,
  onToggleTheme,
  onReturnToHero,
  onOpenSearch,
  onToggleTvMode,
  isTvMode = false,
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const { series, setSeries, theme } = useSeries();

  const { isInstalled, isIOS, promptInstall, isModalOpen, setIsModalOpen } = usePWAInstall();
  const { favoriteDriverNumber } = useFavoriteDriver();
  const [soundEnabled, setSoundEnabled] = useState(() => isAudioAlertsEnabled());

  const handleTabClick = (tab: ActiveTab) => {
    trackTabChange(tab);
    setActiveTab(tab);
  };

  useEffect(() => {
    const handleAudioChange = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      setSoundEnabled(custom.detail.enabled);
    };
    window.addEventListener('delta_audio_setting_change', handleAudioChange);
    return () => window.removeEventListener('delta_audio_setting_change', handleAudioChange);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setAudioAlertsEnabled(next);
    setSoundEnabled(next);
  };

  const favoriteProfile = useMemo(() => {
    return favoriteDriverNumber ? getDriverProfile(favoriteDriverNumber) : null;
  }, [favoriteDriverNumber]);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0E14]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        {/* Top Brand, Series Switcher & Right Controls */}
        <div className="flex items-center justify-between h-12 gap-1.5 sm:gap-2">
          {/* Left: Brand Identity & Series Switcher (anchored together so switcher NEVER shifts) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Return to Hero Trigger: Exclusively Logo + 'DELTA' text */}
            <button
              type="button"
              onClick={() => (onReturnToHero ? onReturnToHero() : setActiveTab('live'))}
              className="inline-flex items-center gap-1.5 sm:gap-2 group cursor-pointer text-left focus:outline-none shrink-0"
              title="Portada / Inicio DELTA"
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white text-xs tracking-tighter italic shadow-sm transition-all active:scale-95 shrink-0 keep-white"
                style={{ backgroundColor: theme.primary }}
              >
                D
              </div>
              <span className="font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white text-sm sm:text-base uppercase italic font-sans transition-colors">
                DELTA
              </span>
            </button>

            {/* Series Category Badge (Non-clickable, strictly outside the button) */}
            <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-[#131722] text-zinc-600 dark:text-zinc-400 uppercase border border-zinc-200 dark:border-white/[0.08] hidden sm:inline-block pointer-events-none select-none">
              {theme.badge}
            </span>

            {/* Series Switcher Pill Group: [ F1 | F2 | F3 ] */}
            <div className="flex items-center bg-zinc-100 dark:bg-[#131722] p-0.5 rounded-lg border border-zinc-200 dark:border-white/[0.08] text-xs font-mono shrink-0">
              {(['f1', 'f2', 'f3'] as const).map((s) => {
                const isSelected = series === s;
                const sTheme = SERIES_THEMES[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSeries(s);
                      trackSeriesChange(s);
                      if (s !== 'f1' && (activeTab === 'qualy' || activeTab === 'live')) {
                        handleTabClick('standings');
                      }
                    }}
                    className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'text-white shadow-sm font-black keep-white'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
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
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Dual Clock Track Time Widget (My Time vs Track Time) */}
            <TrackTimeToggle className="hidden sm:inline-flex" />

            {/* Quick Command Palette Search Button */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                title={lang === 'es' ? 'Buscar' : 'Search'}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 dark:bg-[#131722] dark:hover:bg-[#1a202c] dark:text-zinc-400 dark:hover:text-white dark:border-white/[0.08] transition-colors cursor-pointer select-none"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{lang === 'es' ? 'Buscar' : 'Search'}</span>
              </button>
            )}

            {/* TV Focus Mode Toggle */}
            {onToggleTvMode && (
              <button
                type="button"
                onClick={onToggleTvMode}
                title={lang === 'es' ? 'Modo TV Focus' : 'TV Focus Mode'}
                className={`hidden sm:flex w-7 h-7 rounded-lg items-center justify-center transition-colors cursor-pointer border ${
                  isTvMode
                    ? 'bg-amber-400 text-black border-amber-300'
                    : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-[#131722] border-transparent hover:border-zinc-200 dark:hover:border-white/[0.08]'
                }`}
              >
                <Tv className="w-4 h-4" />
              </button>
            )}

            {/* Language Switcher Button: [ ES | EN ] */}
            <button
              type="button"
              onClick={toggleLang}
              title={t.nav.langTitle}
              className="flex items-center px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono bg-[#131722] hover:bg-[#1a202c] border border-white/[0.08] transition-colors cursor-pointer select-none"
            >
              <span
                className={`w-3.5 sm:w-4 text-center transition-colors duration-150 ${
                  lang === 'es' ? 'font-bold' : 'text-zinc-500 font-medium'
                }`}
                style={lang === 'es' ? { color: theme.primary } : undefined}
              >
                ES
              </span>
              <span className="text-zinc-600 font-normal mx-0.5">/</span>
              <span
                className={`w-3.5 sm:w-4 text-center transition-colors duration-150 ${
                  lang === 'en' ? 'font-bold' : 'text-zinc-500 font-medium'
                }`}
                style={lang === 'en' ? { color: theme.primary } : undefined}
              >
                EN
              </span>
            </button>

            {/* Persistent Favorite Driver Quick Access Badge */}
            {favoriteProfile && (
              <button
                type="button"
                onClick={() => setActiveTab('live')}
                title={lang === 'es' ? `Tu Piloto: ${favoriteProfile.fullName}` : `Your Driver: ${favoriteProfile.fullName}`}
                className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold transition-colors cursor-pointer select-none"
              >
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{favoriteProfile.code}</span>
                <span className="text-[9px] text-amber-300/70">#{favoriteProfile.number}</span>
              </button>
            )}

            {/* Live Audio Alerts Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={soundEnabled ? (lang === 'es' ? 'Silenciar alertas en vivo' : 'Mute live alerts') : (lang === 'es' ? 'Activar alertas de sonido' : 'Enable sound alerts')}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-[#131722] border border-transparent hover:border-white/[0.08] transition-colors cursor-pointer select-none"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
              )}
            </button>

            {/* PWA Install App Button (Visible when not yet installed) */}
            {!isInstalled && (
              <button
                type="button"
                onClick={promptInstall}
                title={lang === 'es' ? 'Instalar aplicación Delta' : 'Install Delta App'}
                className="w-7 h-7 sm:w-auto flex items-center justify-center sm:gap-1.5 px-0 sm:px-2 py-0 sm:py-1 rounded-lg text-[11px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer shadow-xs active:scale-95 select-none"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-bold">
                  {lang === 'es' ? 'Instalar' : 'Install'}
                </span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={isDarkMode ? t.nav.themeLight : t.nav.themeDark}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-[#131722] border border-transparent hover:border-white/[0.08] transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-300 hover:text-white transition-colors" />
              ) : (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD60A] hover:text-amber-300 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative">
          <nav className="flex items-center justify-between sm:justify-start sm:gap-6 md:gap-8 border-t border-white/[0.08] w-full">
            {/* Live telemetry only for F1 */}
            {series === 'f1' && (
              <button
                type="button"
                data-active={activeTab === 'live'}
                onClick={() => handleTabClick('live')}
                className={`flex-1 sm:flex-initial min-w-0 py-2.5 sm:py-2 px-1 sm:px-3 text-[10px] sm:text-xs font-mono uppercase tracking-tight sm:tracking-wider font-semibold transition-all border-b-2 flex items-center justify-center gap-1 text-center whitespace-nowrap cursor-pointer ${
                  activeTab === 'live'
                    ? 'text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-100 border-transparent'
                }`}
                style={activeTab === 'live' ? { borderColor: theme.primary } : undefined}
              >
                <span>{t.nav.live}</span>
                {isLiveActive && isLiveConnected && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39B54A] animate-pulse" />
                    <span className="hidden sm:inline">LIVE</span>
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              data-active={activeTab === 'last-race'}
              onClick={() => handleTabClick('last-race')}
              className={`flex-1 sm:flex-initial min-w-0 py-2.5 sm:py-2 px-1 sm:px-3 text-[10px] sm:text-xs font-mono uppercase tracking-tight sm:tracking-wider font-semibold transition-all border-b-2 flex items-center justify-center text-center whitespace-nowrap cursor-pointer ${
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
                data-active={activeTab === 'qualy'}
                onClick={() => handleTabClick('qualy')}
                className={`flex-1 sm:flex-initial min-w-0 py-2.5 sm:py-2 px-1 sm:px-3 text-[10px] sm:text-xs font-mono uppercase tracking-tight sm:tracking-wider font-semibold transition-all border-b-2 flex items-center justify-center text-center whitespace-nowrap cursor-pointer ${
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
              data-active={activeTab === 'schedule'}
              onClick={() => handleTabClick('schedule')}
              className={`flex-1 sm:flex-initial min-w-0 py-2.5 sm:py-2 px-1 sm:px-3 text-[10px] sm:text-xs font-mono uppercase tracking-tight sm:tracking-wider font-semibold transition-all border-b-2 flex items-center justify-center text-center whitespace-nowrap cursor-pointer ${
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
              data-active={activeTab === 'standings'}
              onClick={() => handleTabClick('standings')}
              className={`flex-1 sm:flex-initial min-w-0 py-2.5 sm:py-2 px-1 sm:px-3 text-[10px] sm:text-xs font-mono uppercase tracking-tight sm:tracking-wider font-semibold transition-all border-b-2 flex items-center justify-center text-center whitespace-nowrap cursor-pointer ${
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
      </div>
      <InstallAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIOS={isIOS}
      />
    </header>
  );
};
