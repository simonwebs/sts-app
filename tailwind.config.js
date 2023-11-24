/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./ui/**/*.{js,jsx,ts,tsx}', './client/*.html'],
  darkMode: 'class',
  safelist: [
    // Add your safelist classes here
  ],
  theme: {
    animation: {
      slide: 'slide 10s infinite both',
      marquee: 'marquee 1s linear infinite',
      blob: 'blob 7s infinite',
    },
    keyframes: {
      slide: {
        '0%': { transform: 'translateX(100%) scale(0.75)', zIndex: '0' },
        '25%': { transform: 'translateX(50%) scale(0.9)', zIndex: '10' },
        '50%': { transform: 'translateX(0%) scale(1)', zIndex: '20' },
        '75%': { transform: 'translateX(-50%) scale(0.9)', zIndex: '10' },
        '100%': { transform: 'translateX(-100%) scale(0.75)', zIndex: '0' },
      },
      marquee: {
        '0%': { transform: 'translateX(120%)' },
        '100%': { transform: 'translateX(-120%)' },
      },
      blob: {
        '0%': { transform: 'translate(0px, 0px) scale(1)' },
        '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
        '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        '100%': { transform: 'tranlate(0px, 0px) scale(1)' },
      },
    },
    screens: {
      xs: '399px',
      sm: '640px',
      md: '767px',
      lg: '1041px',
      xl: '1280px',
      '2xl': '1536px',
    },
    lineClamp: {
      7: '7',
      8: '8',
      9: '9',
      10: '10',
    },
    extend: {
      backgroundColor: {
        primary: 'var(--primary-color)',
      },
      textColor: {
        primary: 'var(--primary-text-color)',
      },
      colors: {
        white: '#FFFFFF',
        fbBlue: '#1877F2',
        chatBg: '#E4E6EB',
        buttonM: '#BD9168',
        buttonS: '#09EE90',
        darkPrimary: '#6f43c1',
        primary_2: '#5700ab',
        secondary: '#2c00ab',
        border: '#D7C49EFF',
        shadow: 'E6E4E2',
        tertiaryOne: '#D7C49EFF',
        tertiaryTwo: '#abb8c3',
        tertiaryThree: '#cdbda1',
        danger: '#FF0000',
        'whatsapp-dark': '#131c21',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      zIndex: {
        100: '100',
      },
      maxWidth: {
        '2xl': '40rem',
      },
    },
  },
  variants: {
    display: ['responsive', 'group-hover', 'group-focus'],
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar-hide'),
  ],
};
