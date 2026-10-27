/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: '#F5F5F3',
          surface: '#EFEEEA',
          card: '#FFFFFF',
          text: '#0A0A0A',
          muted: '#807D7A',
          accent: '#8C8172',
          'accent-hover': '#786E60',
          'accent-light': '#F4F2EE',
          border: '#E5E3DF',
          'border-light': '#ECEBE7',
          'border-dark': '#D1CECA',
          tag: '#ECE9E2',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'paper': '0 1px 3px rgba(0,0,0,0.04), 0 16px 36px -8px rgba(0,0,0,0.08)',
        'paper-lg': '0 4px 6px -1px rgba(0,0,0,0.05), 0 24px 48px -12px rgba(0,0,0,0.12)',
        'subtle': '0 1px 2px rgba(0,0,0,0.03)',
        'floating': '0 20px 40px -15px rgba(10,10,10,0.07)',
      },
      letterSpacing: {
        'tightest': '-0.035em',
        'tighter': '-0.02em',
        'luxury': '0.12em',
        'superwide': '0.2em',
      }
    },
  },
  plugins: [],
}
