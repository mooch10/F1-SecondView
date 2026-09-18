import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx'
import { LanguageProvider } from './context/LanguageProvider.tsx'
import { SeriesProvider } from './context/SeriesProvider.tsx'
import { TimezoneProvider } from './context/TimezoneProvider.tsx'
import { initAnalytics } from './utils/analytics'

// Initialize Google Analytics 4 & Microsoft Clarity (if configured in env)
initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <SeriesProvider>
          <TimezoneProvider>
            <App />
          </TimezoneProvider>
        </SeriesProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
)

// Register PWA Service Worker
if ('serviceWorker' in navigator && import.meta.env.MODE !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered successfully with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

