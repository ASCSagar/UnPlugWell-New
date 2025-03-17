/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/*/.{js,ts,jsx,tsx,mdx}",
    "./src/components/*/.{js,ts,jsx,tsx,mdx}",
    "./src/app/*/.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Primary lavender palette
        lavender: {
          light: '#E6E6FA',  // Light lavender
          DEFAULT: '#9370DB', // Medium lavender
          dark: '#7B68EE',   // Dark lavender
        },
        // Secondary lavender palette
        lavenderSecondary: {
          light: '#F5F0FF',  // Very light lavender
          DEFAULT: '#D8BFD8', // Thistle
          dark: '#A78BA7',   // Darker thistle
        },
        // Accent colors
        accent: {
          lilac: '#C8A2C8',     // Soft lilac
          periwinkle: '#CCCCFF', // Periwinkle
          violet: '#8A2BE2',    // Deep violet
          wisteria: '#D4BBEB',  // Wisteria
          mauve: '#E0B0FF',     // Mauve
        },
        // Text colors
        textColor: {
          primary: '#483D8B',   // Dark slate blue for primary text
          secondary: '#6A5ACD', // Slate blue for secondary text
        },
        // Background colors
        backgroundColor: {
          default: '#FAFAFF',  // Very light lavender background
          paper: '#FFFFFF',    // White for paper/card backgrounds
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Quicksand', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        h2: ['2rem', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }],
        h3: ['1.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        h4: ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],
        h5: ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        h6: ['1rem', { lineHeight: '1.4', fontWeight: '500' }],
        body1: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        body2: ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        subtitle1: ['1rem', { lineHeight: '1.5', fontStyle: 'italic' }],
      },
      borderRadius: {
        DEFAULT: '12px',
        button: '20px',
        card: '16px',
        chip: '12px',
      },
      boxShadow: {
        sm: '0px 2px 8px rgba(0, 0, 0, 0.03)',
        DEFAULT: '0px 4px 16px rgba(0, 0, 0, 0.04)',
        md: '0px 6px 20px rgba(0, 0, 0, 0.05)',
        lg: '0px 8px 24px rgba(0, 0, 0, 0.08)',
        xl: '0px 10px 28px rgba(0, 0, 0, 0.07)',
        '2xl': '0px 12px 32px rgba(0, 0, 0, 0.08)',
        card: '0px 4px 16px rgba(0, 0, 0, 0.04)',
        'card-hover': '0px 8px 24px rgba(0, 0, 0, 0.08)',
      },
      transitionProperty: {
        'card': 'transform, box-shadow',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease': 'ease',
      },
    },
  },
  plugins: [
    // Custom plugin to add component specific styles
    function({ addComponents }) {
      addComponents({
        '.btn': {
          borderRadius: '20px',
          padding: '10px 24px',
          textTransform: 'none',
          fontWeight: '500',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          },
        },
        '.card': {
          borderRadius: '16px',
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
          },
        },
        '.app-bar': {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.03)',
          backgroundColor: '#FAFAFF',
        },
        '.chip': {
          borderRadius: '12px',
          fontWeight: '500',
        },
        '.divider': {
          margin: '24px 0',
          backgroundColor: '#E6E6FA',
        },
      });
    },
  ],
};