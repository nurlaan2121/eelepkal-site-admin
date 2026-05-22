/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4fa',
          100: '#dde5f4',
          200: '#c2d2eb',
          300: '#99b6de',
          400: '#6992ce',
          500: '#4671bd',
          600: '#3557a3',
          700: '#2c4685',
          800: '#273c6e',
          900: '#24345c',
          950: '#051d49', // Тот самый темно-синий цвет фона вашего логотипа
          primary: '#051d49', // Используем его как основной брендовый цвет
        },
      },
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
