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
        clean: {
          white: '#FFFFFF',
          cloud: '#F5F7FA',
          slate: '#A0AEC0',
          charcoal: '#2D3748',
          'charcoal-deep': '#1E2530',
          'charcoal-dark': '#1A202C',
          'charcoal-border': '#4A5568',
        },
        dark: {
          950: '#1A202C',
          900: '#1E2530',
          850: '#2D3748',
          800: '#3A4659',
          700: '#4A5568',
          600: '#718096',
        },
        violet: {
          400: '#A0AEC0',
          500: '#2D3748',
          600: '#2D3748',
          700: '#1A202C',
          800: '#1A202C',
          900: '#1A202C',
          glow: 'rgba(160, 174, 192, 0.2)',
        },
        accent: {
          cyan: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['var(--font-sans)', 'Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        body: ['var(--font-body)', 'Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'inner-subtle': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
