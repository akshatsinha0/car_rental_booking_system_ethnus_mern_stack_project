module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // blue
          dark: '#1F58D8',
        },
        secondary: {
          DEFAULT: '#F59E42', // orange accent
        },
        background: '#f1e086', // fixed background color
        text: {
          DEFAULT: '#18181B', // dark text for light mode
        },
      },
    },
  },
  plugins: [],
}; 