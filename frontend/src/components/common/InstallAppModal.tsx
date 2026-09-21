import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Share, SquarePlus, Monitor, CheckCircle2, AlertCircle } from 'lucide-react';
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

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#131722] border-t sm:border border-white/[0.12] rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 text-zinc-100 flex flex-col gap-4 relative max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto -mt-1 sm:hidden shrink-0" />

        {/* Header with App Icon and Close Button */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#E10600] flex items-center justify-center font-black text-white text-lg tracking-tighter italic shadow-md shrink-0">
              D
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight truncate">
                {lang === 'es' ? 'Instalar Delta en iPhone' : 'Install Delta on iPhone'}
              </h3>
              <p className="text-xs text-zinc-400 font-medium leading-tight mt-0.5">
                {lang === 'es' ? 'Acceso rápido y pantalla completa' : 'Fast shortcut & full screen'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title={lang === 'es' ? 'Cerrar' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guide Content */}
        {isIOS ? (
          <div className="space-y-3 text-sm">
            {/* Steps Container */}
            <div className="space-y-2.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1A202C]/80 border border-white/[0.08]">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs leading-relaxed text-zinc-300">
                  <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                    <span>{lang === 'es' ? 'Toca el botón Compartir' : 'Tap the Share button'}</span>
                    <Share className="w-3.5 h-3.5 text-sky-400 shrink-0 inline" />
                  </div>
                  <p>
                    {lang === 'es'
                      ? 'En la barra inferior de Safari, presiona el icono del cuadrado con la flecha hacia arriba.'
                      : 'In the bottom bar of Safari, tap the square icon with an upward arrow.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1A202C]/80 border border-white/[0.08]">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs leading-relaxed text-zinc-300">
                  <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                    <span>{lang === 'es' ? 'Selecciona "Agregar a inicio"' : 'Select "Add to Home Screen"'}</span>
                    <SquarePlus className="w-3.5 h-3.5 text-emerald-400 shrink-0 inline" />
                  </div>
                  <p>
                    {lang === 'es'
                      ? 'Desliza hacia abajo en el menú de opciones y toca "Agregar a inicio" (o "Añadir a pantalla de inicio").'
                      : 'Scroll down the menu options and tap "Add to Home Screen".'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1A202C]/80 border border-white/[0.08]">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs leading-relaxed text-zinc-300">
                  <div className="font-bold text-white mb-0.5">
                    {lang === 'es' ? 'Toca "Agregar" arriba a la derecha' : 'Tap "Add" in top-right'}
                  </div>
                  <p>
                    {lang === 'es'
                      ? 'Confirma arriba a la derecha para que el icono de Delta aparezca junto a tus demás apps.'
                      : 'Confirm in the top right so the Delta icon appears on your home screen.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Important Safari Tip */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200/90 leading-normal">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {lang === 'es'
                  ? 'Importante: En iPhone este proceso debe hacerse desde el navegador Safari. Si abriste la app desde otra app (WhatsApp, Chrome, etc.), toca compartir y ábrela en Safari.'
                  : 'Note: On iPhone, this can only be done in Safari. If you opened this in Chrome or an in-app browser, tap Share and open in Safari.'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 bg-[#1A202C]/80 p-3.5 rounded-xl border border-white/[0.08] text-xs">
            <div className="flex items-center gap-2 font-bold text-[#27F4D2] uppercase text-xs">
              <Monitor className="w-4 h-4" />
              <span>{lang === 'es' ? 'Computadora o Android' : 'Desktop or Android'}</span>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              {lang === 'es'
                ? 'Instala Delta para disfrutar de pantalla completa sin barras del navegador, telemetría ultrarrápida y acceso directo en tu escritorio o celular.'
                : 'Install Delta for full-screen telemetry without browser bars, instant loading, and a home screen shortcut.'}
            </p>

            <div className="pt-1 flex items-center gap-2 text-zinc-200 text-xs">
              <Download className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">
                {lang === 'es'
                  ? 'Haz clic en el icono de instalación en la barra del navegador'
                  : 'Click the install icon in your browser address bar'}
              </span>
            </div>
          </div>
        )}

        {/* Benefits list (compact and clean) */}
        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
          <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-2 rounded-lg border border-white/[0.05]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-medium">{lang === 'es' ? 'Cero publicidad' : '100% Ad-free'}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-2 rounded-lg border border-white/[0.05]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-medium">{lang === 'es' ? 'Pantalla completa' : 'Full screen'}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-sm transition-all cursor-pointer text-center shadow-lg active:scale-[0.99] mt-1"
        >
          {lang === 'es' ? '¡Entendido!' : 'Got it!'}
        </button>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};
