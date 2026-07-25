/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aqua-Emerald Fusion Theme
        aqua: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        farm: {
          sky: '#0284C7',
          emerald: '#059669',
          mint: '#10B981',
          teal: '#14B8A6',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      animation: {
        'float-cloud': 'floatCloud 20s ease-in-out infinite',
        'drift-left': 'driftLeft 60s linear infinite',
        'drift-right': 'driftRight 80s linear infinite',
        'avatar-bounce': 'avatarBounce 3s ease-in-out infinite',
        'chat-bubble': 'chatBubblePop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'water-flow': 'waterFlow 3s linear infinite',
        'crop-grow': 'cropGrow 3s linear infinite',
        'dual-pulse': 'dualPulse 2s infinite',
        'soft-glow': 'softGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'aqua': '0 20px 50px rgba(3, 105, 161, 0.05)',
        'emerald': '0 20px 50px rgba(5, 150, 105, 0.1)',
        'farm': '0 30px 70px rgba(5, 150, 105, 0.15), 0 10px 30px rgba(2, 132, 199, 0.1)',
      },
    },
  },
  plugins: [],
}
