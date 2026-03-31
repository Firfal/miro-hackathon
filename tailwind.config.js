export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          light: '#F5F5F7',
          gray: '#FBFBFD',
          border: '#D2D2D7',
          blue: '#007AFF',
          text: '#1D1D1F',
          muted: '#86868B',
        },
        cream: {
          DEFAULT: '#FAF9F6',
          dark: '#F2F1ED',
          deeper: '#E5E4DF',
        },
        ink: {
          DEFAULT: '#1D1D1F',
          light: '#424245',
          muted: '#86868B',
        },
        mood: {
          great: '#34C759',
          good: '#007AFF',
          okay: '#FFCC00',
          low: '#FF9500',
          bad: '#FF3B30',
        },
        pastel: {
          green: '#E4F4E5',
          blue: '#E3F1FD',
          yellow: '#FFF9E0',
          orange: '#FFF1E0',
          pink: '#FDE7EA',
          lavender: '#F1E9FA',
          red: '#FDECEC',
          mint: '#E6F8F2',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'apple': '0 4px 16px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'soft': '0 2px 20px rgba(45, 42, 38, 0.04)',
        'medium': '0 4px 30px rgba(45, 42, 38, 0.08)',
        'glow': '0 0 40px rgba(45, 42, 38, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
