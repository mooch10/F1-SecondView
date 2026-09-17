import React, { useState } from 'react';
import { X, MessageSquarePlus, Send, Copy, Check, ShieldCheck, Activity } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useSeries } from '../../hooks/useSeries';
import { trackFeedbackSubmit } from '../../utils/analytics';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLiveConnected?: boolean;
}

type FeedbackCategory = 'telemetry_lag' | 'timing_bug' | 'map_issue' | 'audio_issue' | 'suggestion' | 'other';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  isLiveConnected = false,
}) => {
  const { lang } = useLanguage();
  const { series, theme } = useSeries();

  const [category, setCategory] = useState<FeedbackCategory>('telemetry_lag');
  const [comment, setComment] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  if (!isOpen) return null;

  // Diagnostic Payload
  const diagnostics = {
    app: 'Delta F1 Live Timing & Telemetry',
    timestamp: new Date().toISOString(),
    series,
    url: window.location.href,
    screen: `${window.innerWidth}x${window.innerHeight} (DPR: ${window.devicePixelRatio})`,
    online: navigator.onLine,
    liveConnected: isLiveConnected,
    isPWA: window.matchMedia('(display-mode: standalone)').matches,
    userAgent: navigator.userAgent,
    language: lang,
  };

  const categoryLabels: Record<FeedbackCategory, { es: string; en: string }> = {
    telemetry_lag: { es: 'Retraso / Lag en Telemetría', en: 'Telemetry Lag / Delay' },
    timing_bug: { es: 'Error en Tiempos o Clasificación', en: 'Timing / Leaderboard Bug' },
    map_issue: { es: 'Problema en Mapa 2D de Circuito', en: '2D Track Map Issue' },
    audio_issue: { es: 'Team Radio o Alertas de Audio', en: 'Team Radio / Audio Alerts' },
    suggestion: { es: 'Sugerencia / Nueva Función', en: 'Feature Suggestion' },
    other: { es: 'Otro Asunto', en: 'Other' },
  };

  const formatReportText = () => {
    return [
      `🏎️ **Reporte Delta F1 Telemetry**`,
      `• **Categoría:** ${categoryLabels[category][lang] || categoryLabels[category].es}`,
      `• **Comentario:** ${comment.trim() || '(Sin comentario adicional)'}`,
      ``,
      `📊 **Diagnóstico del Sistema:**`,
      `• Serie activa: ${diagnostics.series.toUpperCase()}`,
      `• Conexión Live: ${diagnostics.liveConnected ? 'Conectado (En vivo)' : 'Desconectado / Standby'}`,
      `• Pantalla: ${diagnostics.screen}`,
      `• Modo PWA: ${diagnostics.isPWA ? 'Sí (App instalada)' : 'No (Navegador web)'}`,
      `• Fecha/Hora: ${diagnostics.timestamp}`,
      `• Navegador: ${diagnostics.userAgent}`,
    ].join('\n');
  };

  const handleCopy = () => {
    const text = formatReportText();
    navigator.clipboard.writeText(text);
    trackFeedbackSubmit(category);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(formatReportText());
    trackFeedbackSubmit(category);
    // WhatsApp direct link (can open in WhatsApp Web or app)
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSendEmail = () => {
    trackFeedbackSubmit(category);
    const subject = encodeURIComponent(`[Delta F1 Feedback] ${categoryLabels[category].es}`);
    const body = encodeURIComponent(formatReportText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0E121A] border border-white/10 rounded-lg shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Racing */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-[#141824]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: theme.primary }}
            >
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight uppercase font-mono">
                {lang === 'es' ? 'Canal de Feedback & Diagnóstico' : 'Feedback & Diagnostics Channel'}
              </h2>
              <p className="text-[11px] text-zinc-400">
                {lang === 'es'
                  ? 'Reporta fallos en vivo o sugiere mejoras técnicas'
                  : 'Report live telemetry issues or suggest improvements'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              {lang === 'es' ? 'Tipo de Reporte' : 'Report Type'}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(categoryLabels) as FeedbackCategory[]).map((catKey) => {
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`px-2.5 py-2 text-left rounded text-xs transition-all border ${
                      isSelected
                        ? 'border-[#E10600] bg-[#E10600]/10 text-white font-medium'
                        : 'border-white/5 bg-zinc-900/60 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    {categoryLabels[catKey][lang] || categoryLabels[catKey].es}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              {lang === 'es' ? 'Descripción o Detalle' : 'Description / Details'}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                lang === 'es'
                  ? 'Ej: El sector 2 de Verstappen no actualizó a tiempo en la vuelta 14...'
                  : 'E.g., Sector 2 delta did not refresh on lap 14...'
              }
              className="w-full bg-[#0B0E14] border border-white/10 rounded p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#E10600] transition-colors resize-none"
            />
          </div>

          {/* Diagnostic Collapsible info */}
          <div className="rounded border border-white/5 bg-[#0B0E14]/80 p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px]">
                  {lang === 'es' ? 'Telemetría de diagnóstico adjunta' : 'Attached diagnostic telemetry'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="text-[10px] text-zinc-400 hover:text-white underline font-mono"
              >
                {showDiagnostics ? (lang === 'es' ? 'Ocultar' : 'Hide') : (lang === 'es' ? 'Ver datos' : 'View data')}
              </button>
            </div>

            {showDiagnostics && (
              <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400 space-y-1 select-all">
                <p>• Serie: {diagnostics.series.toUpperCase()}</p>
                <p>• Estado Live: {diagnostics.liveConnected ? 'ONLINE' : 'OFFLINE/STANDBY'}</p>
                <p>• Resolución: {diagnostics.screen}</p>
                <p>• App instalada (PWA): {diagnostics.isPWA ? 'SÍ' : 'NO'}</p>
                <p className="truncate">• User-Agent: {diagnostics.userAgent}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 border-t border-white/[0.08] bg-[#141824] flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium border border-white/10 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'es' ? '¡Copiado!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>{lang === 'es' ? 'Copiar Reporte' : 'Copy Report'}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium border border-white/10 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              Email
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-bold text-white transition-all active:scale-95 shadow-md"
              style={{ backgroundColor: theme.primary }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
