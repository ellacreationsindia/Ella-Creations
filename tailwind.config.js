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
          rose: '#D49AA5',
          'rose-light': '#E8BEC6',
          pink: '#F2C4C7',
          gold: '#CFA45C',
          'gold-light': '#E9D097',
          'gold-dark': '#B3873E',
          cream: '#FFF6EE',
          sand: '#F3E7DA',
          charcoal: '#333333',
          card: '#FDF8F5',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #CFA45C 0%, #E9D097 50%, #B3873E 100%)',
        'rose-gradient': 'linear-gradient(135deg, #D49AA5 0%, #F2C4C7 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FFF6EE 0%, #F3E7DA 100%)',
        'dark-gold-gradient': 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
      },
      boxShadow: {
        'soft-rose': '0 10px 30px -5px rgba(212, 154, 165, 0.25)',
        'gold-glow': '0 0 20px rgba(207, 164, 92, 0.35)',
        'glass': '0 8px 32px 0 rgba(180, 140, 150, 0.15)',
      }
    },
  },
  plugins: [],
}
