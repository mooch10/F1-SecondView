import React, { useEffect } from 'react';
import { X, Download, Share2, PlusSquare, Smartphone, Monitor, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS?: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  isIOS = false,
}) => {
  const { lang } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#131722] border-t sm:border border-white/[0.12] rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 text-zinc-100 flex flex-col gap-3.5 relative max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto -mt-1 sm:hidden shrink-0" />

        {/* Header with App Icon and Close Button */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E10600] flex items-center justify-center font-black text-white text-base tracking-tighter italic shadow-md shrink-0">
              D
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold font-sans tracking-tight text-white leading-tight truncate">
                {lang === 'es' ? 'Instalar Aplicación Delta' : 'Install Delta Application'}
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono leading-tight">
                {lang === 'es' ? 'F1 Second-Screen • Sin Publicidad' : 'F1 Second-Screen • Ad-Free'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title={lang === 'es' ? 'Cerrar' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guide Content */}
        {isIOS ? (
          <div className="space-y-2.5 bg-[#171C28] p-3 sm:p-3.5 rounded-xl border border-white/[0.06] text-xs">
            <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400 uppercase text-[10px] sm:text-[11px]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Instalación en iPhone / iPad (Safari)' : 'iPhone / iPad (Safari) Setup'}</span>
            </div>

            <ol className="space-y-2 text-zinc-300 font-sans text-xs">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-semibold text-white">
                    {lang === 'es' ? 'Toca el botón Compartir' : 'Tap the Share button'}{' '}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 font-mono text-[10px]">
                    <Share2 className="w-3 h-3 inline mr-1 text-sky-400" />
                    {lang === 'es' ? 'Compartir' : 'Share'}
                  </span>{' '}
                  {lang === 'es' ? 'en la barra inferior de Safari.' : 'in the Safari bottom bar.'}
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-semibold text-white">
                    {lang === 'es' ? 'Desliza y selecciona' : 'Scroll and tap'}{' '}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 font-mono text-[10px]">
                    <PlusSquare className="w-3 h-3 inline mr-1 text-emerald-400" />
                    {lang === 'es' ? 'Agregar a inicio' : 'Add to Home Screen'}
                  </span>.
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  {lang === 'es' ? (
                    <>Toca <strong className="text-white font-bold">"Agregar"</strong> arriba a la derecha para finalizar.</>
                  ) : (
                    <>Tap <strong className="text-white font-bold">"Add"</strong> in the top-right corner to finish.</>
                  )}
                </div>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-2.5 bg-[#171C28] p-3 sm:p-3.5 rounded-xl border border-white/[0.06] text-xs">
            <div className="flex items-center gap-1.5 font-mono font-bold text-[#27F4D2] uppercase text-[10px] sm:text-[11px]">
              <Monitor className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Computadora o Android' : 'Desktop or Android'}</span>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed">
              {lang === 'es'
                ? 'Instala Delta para disfrutar de pantalla completa sin barras del navegador, telemetría ultrarrápida y acceso directo en tu pantalla de inicio.'
                : 'Install Delta to enjoy full-screen real-time telemetry with zero browser chrome, instant loading, and a home screen shortcut.'}
            </p>

            <div className="pt-0.5 flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <Download className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
              <span>
                {lang === 'es'
                  ? 'Haz clic en el icono de instalación de tu navegador'
                  : 'Click the install icon in your browser address bar'}
              </span>
            </div>
          </div>
        )}

        {/* Benefits list (compact grid) */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px] font-mono text-zinc-300">
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/[0.04]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{lang === 'es' ? 'Cero publicidad' : '100% Ad-free'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/[0.04]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{lang === 'es' ? 'Pantalla completa' : 'Full-screen app'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/[0.04]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{lang === 'es' ? 'Acceso directo' : 'Home shortcut'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/[0.04]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{lang === 'es' ? 'Carga ultra-rápida' : 'Instant cache'}</span>
          </div>
        </div>

        {/* Action Button with iOS safe-area-inset padding */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-mono text-xs font-bold transition-colors cursor-pointer text-center mb-1 sm:mb-0"
        >
          {lang === 'es' ? 'Entendido' : 'Got it'}
        </button>
      </div>
    </div>
  );
};
