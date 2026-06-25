// tailwind.config.js — monky's · Paleta de marca (verde, dorado, crema)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,jsx}', './src/components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#15211C',
          800: '#173A32',
          700: '#243A33',
          500: '#5E6F68',
          300: '#9FB0A8',
          100: '#E4E0D4',
          50:  '#F5F2EA',
        },
        emerald: {
          DEFAULT: '#173A32',
          dark:    '#0F2A24',
          light:   '#E9F0EC',
          mist:    '#9FB5AC',
        },
        gold: {
          DEFAULT: '#C99A3C',
          dark:    '#A87E2C',
        },
        cream: '#E9DFC9',
        navy: '#0D3B6E',
        sale: '#C0392B',
        warn: '#B45309',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  // line-clamp viene integrado en Tailwind 3.3+ (no requiere plugin externo)
  plugins: [],
}
