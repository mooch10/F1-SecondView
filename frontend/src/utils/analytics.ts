/**
 * Analytics & User Session Diagnostics Module for Delta F1
 * Integrates Google Analytics 4 (GA4) and Microsoft Clarity gracefully.
 * No-ops safely when environment variables are not provided (e.g. in local development).
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

let isInitialized = false;

/**
 * Initializes GA4 and Microsoft Clarity asynchronously without blocking the main UI thread.
 */
export function initAnalytics(): void {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // 1. Google Analytics 4 (GA4)
  if (GA_ID && typeof GA_ID === 'string' && GA_ID.startsWith('G-')) {
    try {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', GA_ID, {
        send_page_view: true,
        anonymize_ip: true,
      });

      if (import.meta.env.DEV) {
        console.log(`[Delta Analytics] GA4 initialized (${GA_ID})`);
      }
    } catch (err) {
      console.warn('[Delta Analytics] Failed to initialize GA4:', err);
    }
  }

  // 2. Microsoft Clarity
  if (CLARITY_ID && typeof CLARITY_ID === 'string' && CLARITY_ID.trim().length > 0 && typeof window.clarity !== 'function') {
    try {
      (function (c: any, l: any, a: string, r: string, i: string) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        const t = l.createElement(r);
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        const y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', CLARITY_ID.trim());

      if (import.meta.env.DEV) {
        console.log(`[Delta Analytics] Microsoft Clarity initialized (${CLARITY_ID})`);
      }
    } catch (err) {
      console.warn('[Delta Analytics] Failed to initialize Microsoft Clarity:', err);
    }
  }
}

/**
 * Sends a generic event to Google Analytics 4.
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

/**
 * Tracks when a user inspects or selects an F1 driver telemetry card.
 */
export function trackDriverSelect(driverNumber: number, driverName: string, team?: string): void {
  trackEvent('select_driver', {
    driver_number: driverNumber,
    driver_name: driverName,
    team: team || 'Unknown',
  });
}

/**
 * Tracks when a user toggles motorsport series (F1, F2, F3).
 */
export function trackSeriesChange(series: string): void {
  trackEvent('change_series', {
    series_name: series,
  });
}

/**
 * Tracks navigation between views/tabs (Qualy, Carrera, Horarios, etc.).
 */
export function trackTabChange(tab: string): void {
  trackEvent('change_tab', {
    tab_name: tab,
  });
}

/**
 * Tracks when TV Mode is toggled.
 */
export function trackTvModeToggle(enabled: boolean): void {
  trackEvent('toggle_tv_mode', {
    is_tv_mode: enabled,
  });
}

/**
 * Tracks when a user submits telemetry/bug feedback.
 */
export function trackFeedbackSubmit(category: string): void {
  trackEvent('submit_feedback', {
    feedback_category: category,
  });
}
