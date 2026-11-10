/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)',
        header: 'var(--color-header)',
        foreground: 'var(--color-foreground)',
        subtle: 'var(--color-subtle)',
        inverse: 'var(--color-inverse)',
        line: 'var(--color-line)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        'accent-muted': 'var(--color-accent-muted)',
        online: 'var(--color-online)',
        danger: 'var(--color-danger)',
        input: 'var(--color-input)',
        'tab-bar': 'var(--color-tab-bar)',
        icon: 'var(--color-icon)',
      },
      borderWidth: {
        hairline: 1,
      },
    },
  },
  plugins: [],
};
