// tailwind.config.js — Sweet Raquel · Paleta premium internacional
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,jsx}', './src/components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0F0F0F',
          800: '#1C1C1E',
          700: '#2C2C2E',
          500: '#636366',
          300: '#AEAEB2',
          100: '#E5E5EA',
          50:  '#F5F5F7',
        },
        emerald: {
          DEFAULT: '#0B7A5E',
          dark:    '#065444',
          light:   '#E8F5F1',
          mist:    '#A7D8C8',
        },
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
