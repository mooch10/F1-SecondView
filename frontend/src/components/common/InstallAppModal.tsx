import React from 'react';
import { X, Download, Share2, PlusSquare, Smartphone, Monitor } from 'lucide-react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#131722] border border-white/[0.12] rounded-2xl shadow-2xl p-5 text-zinc-100 flex flex-col gap-4 relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title={lang === 'es' ? 'Cerrar' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-xl bg-[#E10600] flex items-center justify-center font-black text-white text-xl tracking-tighter italic shadow-md shrink-0">
            D
          </div>
          <div>
            <h3 className="text-base font-bold font-sans tracking-tight text-white leading-snug">
              {lang === 'es' ? 'Instalar Aplicación Delta' : 'Install Delta Application'}
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              {lang === 'es' ? 'F1 Second-Screen • Sin Publicidad' : 'F1 Second-Screen • Ad-Free'}
            </p>
          </div>
        </div>

        {/* Guide Content */}
        {isIOS ? (
          <div className="space-y-3 bg-[#171C28] p-3.5 rounded-xl border border-white/[0.06] text-xs">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-400 uppercase text-[11px]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Instalación en iPhone / iPad (Safari)' : 'iPhone / iPad (Safari) Setup'}</span>
            </div>

            <ol className="space-y-2.5 text-zinc-300 font-sans">
              <li className="flex items-start gap-2.5">
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
                  {lang === 'es' ? 'en la barra inferior del navegador Safari.' : 'in the Safari bottom toolbar.'}
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-semibold text-white">
                    {lang === 'es' ? 'Desliza hacia abajo y selecciona' : 'Scroll down and tap'}{' '}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-zinc-200 font-mono text-[10px]">
                    <PlusSquare className="w-3 h-3 inline mr-1 text-emerald-400" />
                    {lang === 'es' ? 'Agregar a inicio' : 'Add to Home Screen'}
                  </span>.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  {lang === 'es' ? (
                    <>Toca <strong className="text-white font-bold">"Agregar"</strong> en la esquina superior derecha para finalizar.</>
                  ) : (
                    <>Tap <strong className="text-white font-bold">"Add"</strong> in the top-right corner to complete.</>
                  )}
                </div>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3 bg-[#171C28] p-3.5 rounded-xl border border-white/[0.06] text-xs">
            <div className="flex items-center gap-2 font-mono font-bold text-[#27F4D2] uppercase text-[11px]">
              <Monitor className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Computadora o Android' : 'Desktop or Android'}</span>
            </div>

            <p className="text-zinc-300">
              {lang === 'es'
                ? 'Puedes instalar Delta en tu dispositivo para abrirla a pantalla completa sin barra de navegación del navegador, con tiempos de respuesta instantáneos y acceso directo en tu escritorio o menú de apps.'
                : 'Install Delta on your device to enjoy full-screen real-time telemetry with zero browser chrome, instant loading, and a desktop or app drawer shortcut.'}
            </p>

            <div className="pt-1 flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
              <Download className="w-3.5 h-3.5 text-zinc-300" />
              <span>
                {lang === 'es'
                  ? 'Usa el botón de instalación en la barra de direcciones o el menú ⋮'
                  : 'Use the install icon in your address bar or browser menu ⋮'}
              </span>
            </div>
          </div>
        )}

        {/* Benefits list */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 bg-black/20 p-2 rounded-lg border border-white/[0.04]">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{lang === 'es' ? 'Cero publicidad' : '100% Ad-free'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 p-2 rounded-lg border border-white/[0.04]">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{lang === 'es' ? 'Pantalla completa' : 'Full-screen app'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 p-2 rounded-lg border border-white/[0.04]">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{lang === 'es' ? 'Acceso directo' : 'Home shortcut'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 p-2 rounded-lg border border-white/[0.04]">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{lang === 'es' ? 'Carga ultra-rápida' : 'Instant cache'}</span>
          </div>
        </div>

        {/* Done Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-mono text-xs font-bold transition-colors cursor-pointer text-center"
        >
          {lang === 'es' ? 'Entendido' : 'Got it'}
        </button>
      </div>
    </div>
  );
};
