export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E8604C',
          light: '#FFF0ED',
          dark: '#D14E3B',
        },
        secondary: {
          DEFAULT: '#5B6CF0',
          light: '#EDEFFD',
        },
        accent: {
          coral: '#E8604C',
          indigo: '#5B6CF0',
          amber: '#F5C542',
          teal: '#2DB67D',
          plum: '#9B6BCD',
        },
        surface: {
          DEFAULT: '#FAF8F5',
          raised: '#FFFFFF',
          sunken: '#F2EFEA',
          warm: '#F7F4EF',
        },
        ink: {
          DEFAULT: '#1D1D1F',
          light: '#4A4540',
          muted: '#9B9590',
          faint: '#C5C0BA',
        },
        border: {
          DEFAULT: '#E8E4DE',
          subtle: '#F0EDE8',
        },
        mood: {
          great: '#2DB67D',
          good: '#5B6CF0',
          okay: '#F5C542',
          low: '#E88C4A',
          bad: '#D94F4F',
        },
        pastel: {
          green: '#E2F5EC',
          blue: '#E8EAFD',
          yellow: '#FDF5E0',
          orange: '#FDF0E4',
          red: '#FCEAEA',
          lavender: '#F1E9FA',
          mint: '#E6F8F2',
          pink: '#FDE7EA',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        elevated: '0 4px 16px rgba(0,0,0,0.06)',
        float: '0 8px 30px rgba(0,0,0,0.08)',
        glow: '0 0 0 1px rgba(232,96,76,0.12), 0 4px 16px rgba(232,96,76,0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
