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
        background: '#000000',
        surface: '#050505',
        primary: '#5B49AD', // Deep Purple
        textMain: '#A1A1AA', // Semi-Grey
        textMuted: '#71717A',
        border: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        display: ['Syne', 'Clash Display', 'Outfit', 'sans-serif'],
        body: ['Inter', 'Cabinet Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'tech-gradient': 'radial-gradient(circle at center, rgba(255, 107, 0, 0.05) 0%, transparent 70%)',
        'soft-glow': 'radial-gradient(circle at center, rgba(255, 255, 255, 0.02) 0%, transparent 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
