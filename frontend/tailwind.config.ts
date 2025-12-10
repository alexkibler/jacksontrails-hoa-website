import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
      },
      colors: {
        // Jackson Trails Forest Theme - REI catalog meets City Hall
        // Established, calm, and expensive - nice trees and good property values
        'jt-forest': {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7cec7',
          300: '#a1aea2',
          400: '#7a8a7c',
          500: '#5f6f61',
          600: '#4a584c',
          700: '#3c473e',
          800: '#323a33',
          900: '#14532d', // Deep forest green for headers/hero
          950: '#0a2818',
        },
        'jt-emerald': {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669', // Vibrant but natural green for buttons/accents
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        'jt-stone': {
          50: '#fafaf9', // Warm off-white backgrounds
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c', // Softer text color
          800: '#292524',
          900: '#1c1917', // Deep stone for headers
          950: '#0c0a09',
        },
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #14532d 0%, #059669 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
