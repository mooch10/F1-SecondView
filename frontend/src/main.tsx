import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageProvider.tsx'
import { SeriesProvider } from './context/SeriesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SeriesProvider>
        <App />
      </SeriesProvider>
    </LanguageProvider>
  </StrictMode>,
)

