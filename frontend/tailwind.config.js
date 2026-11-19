/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052ff',
          active: '#003ecc',
          disabled: '#a8b8cc',
        },
        ink: '#0a0b0d',
        body: {
          DEFAULT: '#5b616e',
          strong: '#0a0b0d',
        },
        muted: {
          DEFAULT: '#7c828a',
          soft: '#a8acb3',
        },
        hairline: {
          DEFAULT: '#dee1e6',
          soft: '#eef0f3',
        },
        canvas: '#ffffff',
        surface: {
          soft: '#f7f7f7',
          card: '#ffffff',
          strong: '#eef0f3',
          dark: '#0a0b0d',
          'dark-elevated': '#16181c',
        },
        on: {
          primary: '#ffffff',
          dark: '#ffffff',
          'dark-soft': '#a8acb3',
        },
        semantic: {
          up: '#05b169',
          down: '#cf202f',
        },
        accent: {
          yellow: '#f4b000',
        },
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'pill': '100px',
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Geist Mono"', 'monospace'],
      },
      letterSpacing: {
        'display-mega': '-2px',
        'display-xl': '-1.6px',
        'display-lg': '-1.3px',
        'display-md': '-1px',
      },
      spacing: {
        'section': '96px',
      },
    },
  },
  plugins: [],
}
