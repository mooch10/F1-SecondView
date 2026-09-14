import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageProvider.tsx'
import { SeriesProvider } from './context/SeriesContext.tsx'
import { TimezoneProvider } from './context/TimezoneContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SeriesProvider>
        <TimezoneProvider>
          <App />
        </TimezoneProvider>
      </SeriesProvider>
    </LanguageProvider>
  </StrictMode>,
)

