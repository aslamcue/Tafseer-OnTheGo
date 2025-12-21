/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          900: '#111315', // Matte Black
          800: '#1A1D21', // Deep Charcoal (Primary)
          700: '#2A2E33', // Soft Graphite
          600: '#3E434A', // Light Slate
        },
        cyan: {
          main: '#32E0FF',     // Bright Cyan
          glow: '#A1F3FF',     // Soft Cyan Glow
          dim: 'rgba(50, 224, 255, 0.1)',
        },
        glass: {
          border: 'rgba(255, 255, 255, 0.08)',
          surface: 'rgba(255, 255, 255, 0.03)',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        quran: ['"Amiri"', 'serif'],
      },
      boxShadow: {
        'cyan-glow': '0px 0px 12px rgba(50, 224, 255, 0.35)',
      }
    },
  },
  plugins: [],
}