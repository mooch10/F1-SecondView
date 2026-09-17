import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Mic, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import type { TeamRadioCapture } from '../../types/f1';
import { useLanguage } from '../../hooks/useLanguage';
import { useFavoriteDriver } from '../../hooks/useFavoriteDriver';
import { getDriverProfile } from '../../data/f1DriversData';

interface TeamRadioFeedProps {
  radios?: TeamRadioCapture[];
}

export const TeamRadioFeed: React.FC<TeamRadioFeedProps> = ({ radios = [] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeRadioId, setActiveRadioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [filterDriver, setFilterDriver] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { lang } = useLanguage();
  const { favoriteDriverNumber } = useFavoriteDriver();
  const favoriteProfile = favoriteDriverNumber ? getDriverProfile(favoriteDriverNumber) : null;
  const hasFavoriteRadios = Boolean(
    favoriteDriverNumber && radios.some((r) => r.driverNumber === favoriteDriverNumber)
  );

  // Auto-dismiss audio error message after 5 seconds
  useEffect(() => {
    if (!audioError) return;
    const timer = setTimeout(() => setAudioError(null), 5000);
    return () => clearTimeout(timer);
  }, [audioError]);

  // Lifecycle Cleanup: stop playing and reset stream when unmounted (e.g. switching tabs)
  useEffect(() => {
    const audioEl = audioRef.current;
    return () => {
      if (audioEl) {
        audioEl.pause();
        audioEl.src = '';
      }
    };
  }, []);

  if (!radios || radios.length === 0) {
    return null;
  }

  const latestRadio = radios[0];

  // Unique drivers present in radios for quick filtering
  const driversInRadios = Array.from(
    new Map(
      radios.map((r) => [
        r.driverNumber,
        {
          driverNumber: r.driverNumber,
          driverCode: r.driverCode,
          teamColor: r.teamColor,
        },
      ]),
    ).values(),
  );

  const filteredRadios = filterDriver
    ? radios.filter((r) => r.driverNumber === filterDriver)
    : radios;

  const handlePlayToggle = (radio: TeamRadioCapture) => {
    if (activeRadioId === radio.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    setActiveRadioId(radio.id);
    setIsPlaying(true);
    setAudioError(null);

    if (audioRef.current) {
      audioRef.current.src = radio.audioUrl;
      audioRef.current.muted = isMuted;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: unknown) => {
          console.warn('[TeamRadio] Playback error:', err);
          setIsPlaying(false);
          const isNotAllowed =
            err instanceof Error &&
            (err.name === 'NotAllowedError' || err.message.toLowerCase().includes('user gesture'));
          const msg = isNotAllowed
            ? (lang === 'en'
                ? 'Audio autoplay blocked by browser. Click to interact and enable audio.'
                : 'Audio bloqueado por el navegador. Haz clic en la pantalla para habilitar el sonido.')
            : (lang === 'en'
                ? 'Unable to play radio clip. Audio stream may be temporarily unreachable.'
                : 'No se pudo reproducir la radio. El audio no está disponible temporalmente.');
          setAudioError(msg);
        });
      }
    }
  };

  const formatUtcTime = (utcStr: string) => {
    if (!utcStr) return '';
    try {
      const d = new Date(utcStr);
      return d.toLocaleTimeString('es-ES', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-[#131722] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
      {/* Hidden Audio Controller */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setAudioError(
            lang === 'en'
              ? 'Audio format or stream could not be decoded.'
              : 'No se pudo decodificar o cargar el stream de audio.'
          );
        }}
        onPause={() => setIsPlaying(false)}
      />

      {/* Browser Autoplay / Network Warning Banner */}
      {audioError && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-3 py-2 flex items-center justify-between text-xs text-amber-400 font-mono gap-2 animate-fadeIn">
          <div className="flex items-center gap-2 truncate">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">{audioError}</span>
          </div>
          <button
            type="button"
            onClick={() => setAudioError(null)}
            className="text-amber-400/80 hover:text-amber-300 cursor-pointer p-1 rounded hover:bg-amber-500/10 transition-colors flex-shrink-0"
            title={lang === 'en' ? 'Dismiss' : 'Cerrar aviso'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header / Bar */}
      <div className="w-full px-3 py-2.5 flex items-center justify-between gap-2 bg-[#131722] hover:bg-white/[0.02] transition-colors">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 overflow-hidden flex-1 text-left cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full bg-[#00D2BE] animate-pulse flex-shrink-0" />
          <Mic className="w-3.5 h-3.5 text-[#00D2BE] flex-shrink-0" />
          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex-shrink-0">
            {lang === 'en' ? 'Team Radio:' : 'Radios de Equipo:'}
          </span>
          <span className="text-xs text-zinc-200 font-mono truncate flex items-center gap-1.5">
            <span
              className="px-1.5 py-0.2 rounded text-[10px] font-bold"
              style={{
                backgroundColor: `${latestRadio.teamColor}22`,
                color: latestRadio.teamColor,
                border: `1px solid ${latestRadio.teamColor}44`,
              }}
            >
              #{latestRadio.driverNumber} {latestRadio.driverCode}
            </span>
            <span className="text-zinc-400 text-[11px] hidden sm:inline">
              {latestRadio.teamName}
            </span>
            {latestRadio.transcript && (
              <span className="text-emerald-300/90 text-[11px] font-mono italic truncate hidden md:inline">
                💬 "{latestRadio.transcript}"
              </span>
            )}
            <span className="text-zinc-500 text-[10px]">
              ({formatUtcTime(latestRadio.utc)})
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              if (audioRef.current) audioRef.current.muted = nextMuted;
            }}
            className="p-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3" />}
          </button>

          {/* Quick Play Latest Radio */}
          <button
            type="button"
            onClick={() => handlePlayToggle(latestRadio)}
            className="px-2 py-1 rounded bg-[#00D2BE]/15 hover:bg-[#00D2BE]/25 text-[#00D2BE] text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer border border-[#00D2BE]/30"
            title={lang === 'en' ? 'Play latest radio' : 'Reproducir última radio'}
          >
            {activeRadioId === latestRadio.id && isPlaying ? (
              <>
                <Pause className="w-3 h-3" />
                <span className="hidden sm:inline">Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span className="hidden sm:inline">Escuchar</span>
              </>
            )}
          </button>

          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-zinc-400">
            {radios.length}
          </span>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-0.5"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Feed */}
      {isOpen && (
        <div className="border-t border-white/[0.06] bg-[#0E1118]/70 p-3 space-y-3">
          {/* Driver Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setFilterDriver(null)}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterDriver === null
                  ? 'bg-white/20 text-white font-bold'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {lang === 'en' ? 'All Drivers' : 'Todos'} ({radios.length})
            </button>

            {/* Favorite Driver Quick Filter Chip */}
            {hasFavoriteRadios && favoriteDriverNumber && (
              <button
                type="button"
                onClick={() =>
                  setFilterDriver(filterDriver === favoriteDriverNumber ? null : favoriteDriverNumber)
                }
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 font-bold ${
                  filterDriver === favoriteDriverNumber
                    ? 'bg-amber-400 text-black shadow-xs font-black'
                    : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30'
                }`}
                title={
                  lang === 'en'
                    ? `Filter only ${favoriteProfile?.code || '#' + favoriteDriverNumber}`
                    : `Filtrar solo ${favoriteProfile?.code || '#' + favoriteDriverNumber}`
                }
              >
                <span>⭐</span>
                <span>
                  {lang === 'en' ? 'Only' : 'Solo'} {favoriteProfile?.code || `#${favoriteDriverNumber}`}
                </span>
                <span className="text-[9px] opacity-80">
                  ({radios.filter((r) => r.driverNumber === favoriteDriverNumber).length})
                </span>
              </button>
            )}
            {driversInRadios.map((d) => {
              const isSelected = filterDriver === d.driverNumber;
              return (
                <button
                  key={d.driverNumber}
                  type="button"
                  onClick={() => setFilterDriver(isSelected ? null : d.driverNumber)}
                  className="px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                  style={{
                    backgroundColor: isSelected ? `${d.teamColor}33` : 'rgba(255,255,255,0.04)',
                    color: isSelected ? '#FFFFFF' : d.teamColor,
                    border: `1px solid ${isSelected ? d.teamColor : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: d.teamColor }}
                  />
                  <span>#{d.driverNumber} {d.driverCode}</span>
                </button>
              );
            })}
          </div>

          {/* Radios Timeline List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filteredRadios.map((r) => {
              const isThisPlaying = activeRadioId === r.id && isPlaying;
              return (
                <div
                  key={r.id}
                  className={`p-2.5 rounded-lg border transition-all ${
                    isThisPlaying
                      ? 'bg-[#00D2BE]/[0.08] border-[#00D2BE]/40 shadow-sm ring-1 ring-[#00D2BE]/20'
                      : 'bg-[#131722] border-white/[0.05] hover:border-white/[0.12]'
                  }`}
                >
                  {/* Driver Header Row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black whitespace-nowrap flex-shrink-0"
                        style={{
                          backgroundColor: `${r.teamColor}22`,
                          color: r.teamColor,
                          border: `1px solid ${r.teamColor}55`,
                        }}
                      >
                        #{r.driverNumber} {r.driverCode}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate font-sans">
                          {r.driverName}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate font-mono">
                          {r.teamName}
                        </div>
                      </div>

                      <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap flex-shrink-0">
                        {formatUtcTime(r.utc)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlayToggle(r)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer flex-shrink-0 ${
                        isThisPlaying
                          ? 'bg-[#00D2BE] text-black shadow-md scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      title={isThisPlaying ? 'Pausar' : 'Reproducir clip de radio'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Subtitle / Speech Bubble */}
                  {r.transcript && (
                    <div
                      className={`mt-2 px-2.5 py-1.5 rounded-md text-xs font-mono border transition-all flex items-start justify-between gap-2 ${
                        isThisPlaying
                          ? 'bg-[#00D2BE]/15 text-emerald-100 border-[#00D2BE]/40 shadow-xs'
                          : 'bg-black/35 text-zinc-300 border-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-start gap-1.5 flex-1 min-w-0">
                        <span className="text-[#00D2BE] select-none text-[11px] font-bold shrink-0">💬</span>
                        <p className="italic leading-relaxed text-[11px] sm:text-xs break-words">
                          "{r.transcript}"
                        </p>
                      </div>

                      {r.category && (
                        <span className="text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400 shrink-0 select-none">
                          {r.category}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
