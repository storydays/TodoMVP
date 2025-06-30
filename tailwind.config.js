/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'celebration-bounce': {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0) scale(1)',
          },
          '40%': {
            transform: 'translateY(-30px) scale(1.1)',
          },
          '60%': {
            transform: 'translateY(-15px) scale(1.05)',
          },
        },
      },
      animation: {
        'celebration-bounce': 'celebration-bounce 1s ease-in-out infinite',
      },
      colors: {
        'holi-golden': '#FFD700',
        'holi-emerald': '#50C878',
      },
    },
  },
  plugins: [],
};