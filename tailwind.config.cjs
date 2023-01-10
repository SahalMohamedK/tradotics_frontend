/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height'
      },
      colors: {
        primary: {
          "50": "#E5E8FA",
          "100": "#C7CCF5",
          "200": "#939EEB",
          "300": "#5B6BE1",
          "400": "#273BD3",
          "500": "#1D2C9D",
          "600": "#17237D",
          "700": "#121B5F",
          "800": "#0C1241",
          "900": "#060818"
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },  
  },
  plugins: [
    require('@tailwindcss/forms'),
  ]
}
 