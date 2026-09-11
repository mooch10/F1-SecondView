/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        f1: {
          bg: '#0B0E14',
          surface: '#131722',
          elevated: '#1C2230',
          border: 'rgba(255, 255, 255, 0.08)',
          red: '#E10600',
          yellow: '#FFD60A',
          drs: '#27F4D2',
          purple: '#BD00FF',
        },
        tyre: {
          soft: '#FF3B30',
          medium: '#FFD60A',
          hard: '#F2F2F7',
          inter: '#34C759',
          wet: '#007AFF',
          unknown: '#8E8E93',
        },
        flag: {
          green: '#34C759',
          yellow: '#FFD60A',
          vsc: '#FF9500',
          sc: '#FF9500',
          red: '#FF3B30',
          chequered: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', '"Chakra Petch"', 'sans-serif'],
        mono: ['var(--font-mono)', '"JetBrains Mono"', 'monospace'],
        chakra: ['"Chakra Petch"', 'sans-serif'],
        'mono-jetbrains': ['"JetBrains Mono"', 'monospace'],
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
