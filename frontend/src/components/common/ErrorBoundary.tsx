import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center p-4 font-sans select-none">
          <div className="max-w-md w-full bg-[#131722] border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full mb-2">
              Error de Ejecución
            </span>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase mb-2">
              Algo no salió como se esperaba
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
              Ocurrió un error inesperado al procesar los datos de telemetría. Podés reintentar el renderizado o recargar la sesión.
            </p>

            {this.state.error?.message && (
              <div className="w-full bg-[#0B0E14] border border-white/[0.06] rounded-lg p-2.5 mb-6 text-left overflow-x-auto">
                <code className="text-[11px] font-mono text-zinc-400 block whitespace-pre-wrap break-all">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 transition-colors cursor-pointer border border-white/[0.08]"
              >
                Reintentar
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#E10600] hover:bg-[#E10600]/90 text-xs font-mono font-bold uppercase tracking-wider text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recargar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
