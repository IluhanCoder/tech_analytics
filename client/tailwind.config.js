module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#e0e7ff',
          DEFAULT: '#6366f1',
          dark: '#3730a3',
        },
        accent: {
          light: '#f0f9ff',
          DEFAULT: '#38bdf8',
          dark: '#0ea5e9',
        },
        background: {
          light: '#ffffff',
          DEFAULT: '#f8fafc',
          dark: '#f1f5f9',
        },
        card: {
          DEFAULT: '#fff',
          subtle: '#f3f4f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(99,102,241,0.08)',
        button: '0 2px 8px 0 rgba(56,189,248,0.10)',
      },
    },
  },
  plugins: [],
};
