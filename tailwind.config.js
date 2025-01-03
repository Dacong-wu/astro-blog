import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        dark: '#040404',
        light: '#717171',
        border: '#eaeaea',
        muted: 'var(--aw-color-text-muted)',
        'theme-light': '#f6f6f6',
        'theme-dark': '',
        darkmode: {
          text: '#B4AFB6',
          body: '#1c1c1c',
          border: '#3E3E3E',
          primary: '#fff',
          dark: '#fff',
          light: '#B4AFB6',
          'theme-light': '#222222',
          'theme-dark': '#222222',
        },
      },
      animation: {
        fade: 'fadeInUp 1s both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
    }),
  ],
  darkMode: 'class',
};
