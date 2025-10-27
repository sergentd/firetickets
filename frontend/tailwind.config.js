/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Electric Blue Design System
        'electric-blue': {
          DEFAULT: 'var(--electric-blue)',
          dark: 'var(--electric-blue-dark)',
          light: 'var(--electric-blue-light)'
        },
        // Background colors
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-card': 'var(--bg-card)',
        'bg-overlay': 'var(--bg-overlay)',
        // Glass effects
        'glass-bg': 'var(--glass-bg)',
        'glass-bg-light': 'var(--glass-bg-light)',
        // Border colors
        'border-primary': 'var(--border-primary)',
        'border-secondary': 'var(--border-secondary)',
        'border-accent': 'var(--border-accent)',
        // Legacy support
        primary: {
          bg: 'var(--bg-primary)',
          accent: 'var(--electric-blue)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow': 'var(--shadow-glow)',
        'accent': 'var(--shadow-accent)',
        'primary': 'var(--shadow-primary)'
      }
    },
  },
  plugins: [],
}