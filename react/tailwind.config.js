/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      white: '#FFF',
      black: '#1E1E1E',
      primary: '#F07167',
      lightGrey: '#EDEDED',
      darkGrey: '#9B9B9B',
      transparent: '#FFFFFF00'
    },

    spacing: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '24px',
      xl: '32px',
    },

    borderRadius: {
      DEFAULT: '12px',
      md: '24px',
      full: '999px'
    },

    fontFamily: {
      sans: ['AppFont', 'sans-serif']
    },

    boxShadow: {
      sm: '0 0 20px 2px rgba(0,0,0,.15)'
    },

    extend: {},
  },
  plugins: [],
}

