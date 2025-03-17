/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Primary lavender palette with #E0C6FF as the main color
        lavender: {
          light: '#F0E2FD',  // Lighter version of #E0C6FF
          DEFAULT: '#E0C6FF', // The main color you specified
          dark: '#C5A2EC',   // Darker version of #E0C6FF
        },
        // Secondary lavender palette
        lavenderSecondary: {
          light: '#F5F0FF',  // Very light lavender
          DEFAULT: '#D8BFD8', // Thistle
          dark: '#A78BA7',   // Darker thistle
        },
        // Accent colors complementing #E0C6FF
        accent: {
          lilac: '#C8A2C8',     // Soft lilac
          periwinkle: '#CCCCFF', // Periwinkle
          violet: '#9966CC',    // Adjusted deep violet to complement #E0C6FF
          wisteria: '#D4BBEB',  // Wisteria
          mauve: '#E0B0FF',     // Mauve
        },
        // Text colors that work well with #E0C6FF
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
      // Add animation keyframes
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 7s infinite',
        'gradient-x': 'gradientX 15s ease infinite',
      },
    },
  },
  plugins: [
    // Add base CSS variables to make theme colors available globally
    function({ addBase }) {
      addBase({
        ':root': {
          '--background': '#FAFAFF',
          '--foreground': '#483D8B',
          '--lavender-light': '#F0E2FD',
          '--lavender': '#E0C6FF',
          '--lavender-dark': '#C5A2EC',
          '--lavender-secondary-light': '#F5F0FF',
          '--lavender-secondary': '#D8BFD8',
          '--lavender-secondary-dark': '#A78BA7',
          '--accent-lilac': '#C8A2C8',
          '--accent-periwinkle': '#CCCCFF',
          '--accent-violet': '#9966CC',
          '--accent-wisteria': '#D4BBEB',
          '--accent-mauve': '#E0B0FF',
          '--text-color-primary': '#483D8B',
          '--text-color-secondary': '#6A5ACD',
          '--background-color-default': '#FAFAFF',
          '--background-color-paper': '#FFFFFF',
        },
      });
    },

    function({ addComponents }) {
      addComponents({
        '.btn': {
          borderRadius: '20px',
          padding: '10px 24px',
          textTransform: 'none',
          fontWeight: '500',
          boxShadow: 'none',
          backgroundColor: '#E0C6FF',
          color: '#483D8B',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#C5A2EC',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          },
        },
        '.btn-outlined': {
          borderRadius: '20px',
          padding: '10px 24px',
          textTransform: 'none',
          fontWeight: '500',
          boxShadow: 'none',
          backgroundColor: 'transparent',
          border: '1px solid #E0C6FF',
          color: '#483D8B',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#F0E2FD',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          },
        },
        '.btn-text': {
          padding: '10px 24px',
          textTransform: 'none',
          fontWeight: '500',
          color: '#483D8B',
          backgroundColor: 'transparent',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#F0E2FD',
          },
        },
        '.card': {
          borderRadius: '16px',
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
          backgroundColor: '#FFFFFF',
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
          borderBottom: '1px solid rgba(224, 198, 255, 0.2)',
        },
        '.chip': {
          borderRadius: '12px',
          fontWeight: '500',
          backgroundColor: '#F0E2FD',
          color: '#483D8B',
          padding: '4px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.divider': {
          margin: '24px 0',
          backgroundColor: '#E0C6FF',
          opacity: 0.3,
          height: '1px',
          width: '100%',
        },
        '.paper': {
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.03)',
          padding: '16px',
        },
        '.backdrop': {
          backgroundColor: 'rgba(224, 198, 255, 0.1)',
          backdropFilter: 'blur(8px)',
        },
        '.gradient-primary': {
          background: 'linear-gradient(45deg, #E0C6FF 0%, #CCCCFF 100%)',
        },
        '.gradient-text': {
          background: 'linear-gradient(90deg, #483D8B 0%, #9966CC 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'text-fill-color': 'transparent',
        },
      });
    },

    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}