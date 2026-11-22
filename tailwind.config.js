/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A1416',
        panel: '#111C1F',
        panel2: '#152327',
        line: '#1E2C30',
        line2: '#2A3B40',
        fg: '#E6ECEA',
        muted: '#8A9A97',
        mint: { DEFAULT: '#5FD4B4', soft: '#7DE0C5', deep: '#2F8F78' },
        danger: '#F2797B'
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
};
