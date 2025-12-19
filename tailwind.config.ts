import type { Config } from 'tailwindcss';

// =============================================================================
// DESIGN SYSTEM - DOTT. BERNARDO GIAMMETTA
// Palette: Mint, Grigio Chiaro, Lavanda Rosa, Viola Lavanda + Arancioni
// Colori: #CDF0EA #F9F9F9 #F7DBF0 #BEAEE2 + #F2C078 #FFD6BA #F1BA88 #F7AD45 #FCB454
// Ispirato a: Apple (pulizia), Stripe (animazioni), Linear (minimalismo)
// =============================================================================

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // =========================================================================
      // COLORI BRAND
      // Palette principale dal Color Hunt specificato
      // =========================================================================
      colors: {
        // Colori primari brand (nuova palette)
        brand: {
          mint: '#CDF0EA',        // Mint/Acqua - colore principale
          light: '#F9F9F9',       // Grigio chiaro - sfondo principale
          pink: '#F7DBF0',        // Lavanda rosa - accento soft
          lavender: '#BEAEE2',    // Viola lavanda - accento
        },
        // Varianti del mint/acqua (ex-sage)
        sage: {
          50: '#e8faf7',
          100: '#CDF0EA',         // Colore base mint
          200: '#a8e4db',
          300: '#7ed4c8',
          400: '#5ac4b5',
          500: '#3aada0',
          600: '#2d8a80',
          700: '#266d66',
          800: '#215752',
          900: '#1d4844',
          950: '#0f2926',
        },
        // Varianti grigio chiaro (ex-cream)
        cream: {
          50: '#F9F9F9',          // Colore base
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
        },
        // Varianti lavanda/rosa (ex-blush)
        blush: {
          50: '#fdf4fb',
          100: '#F7DBF0',         // Lavanda rosa base
          200: '#f0c4e4',
          300: '#e5a3d3',
          400: '#d47bbe',
          500: '#c05aa6',
        },
        // Varianti viola lavanda
        lavender: {
          50: '#f5f3fa',
          100: '#ebe5f5',
          200: '#d8ceeb',
          300: '#BEAEE2',         // Colore base
          400: '#a08dd4',
          500: '#8770c4',
        },
        // Arancioni accent
        orange: {
          50: '#fff8f3',
          100: '#FFD6BA',         // Arancione chiaro
          200: '#F2C078',         // Arancione medio
          300: '#F1BA88',         // Arancione caldo
          400: '#F7AD45',         // Arancione vivace
          500: '#FCB454',         // Arancione accent
        },
      },

      // =========================================================================
      // TIPOGRAFIA MODERNA
      // Font variabili per look contemporaneo 2025-2026
      // =========================================================================
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-clash)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      fontSize: {
        // Scale tipografica fluida
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'display-xs': ['1.5rem', { lineHeight: '1.3' }],
      },

      // =========================================================================
      // SPAZIATURA E LAYOUT
      // Sistema di spacing consistente
      // =========================================================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },

      // =========================================================================
      // ANIMAZIONI FLUIDE
      // Micro-interazioni e transizioni smooth
      // =========================================================================
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-down': 'fadeDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      // =========================================================================
      // EFFETTI GLASSMORPHISM
      // =========================================================================
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(134, 167, 136, 0.1)',
        'glass-lg': '0 16px 48px 0 rgba(134, 167, 136, 0.15)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'glow': '0 0 40px -10px rgba(134, 167, 136, 0.4)',
        'glow-rose': '0 0 40px -10px rgba(255, 207, 207, 0.5)',
      },

      // =========================================================================
      // BORDI E RADIUS
      // =========================================================================
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // =========================================================================
      // TRANSIZIONI
      // =========================================================================
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // =========================================================================
      // Z-INDEX SCALE
      // =========================================================================
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
};

export default config;
