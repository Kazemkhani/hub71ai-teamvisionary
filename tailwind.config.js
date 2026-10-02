/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F3F6F8', surface: '#FFFFFF', surface2: '#E9EEF2', fg: '#15202A', muted: '#5A6B7A', line: '#CFD9E1',
        accent: '#0E7A78', accentSoft: '#D9EFEE', crit: '#C13A2E', critSoft: '#F7E1DE', warn: '#A86A12', warnSoft: '#F6EAD3', ok: '#2E7D4F',
      },
      fontFamily: {
        display: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['"Source Sans 3"', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
