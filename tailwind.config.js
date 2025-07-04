/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vascular-navy': '#001F3F',
        'cobalt-pulse': '#005BFF',
        'electric-cyan': '#00D9FF',
        'calcium-ivory': '#F4F7FA',
        'slate-graphite': '#2B3138',
        'infra-hotspot': '#FF3763',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};