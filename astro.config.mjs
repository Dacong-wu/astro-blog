import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import tasks from './src/utils/tasks';
import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter.mjs';
import { ANALYTICS, SITE } from './src/utils/config.ts';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const whenExternalScripts = (items = []) =>
  ANALYTICS.vendors.googleAnalytics.id && ANALYTICS.vendors.googleAnalytics.partytown
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

// https://astro.build/config
export default defineConfig({
  site: SITE.site,
  base: SITE.base,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'static',
  integrations: [
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        logos: ['*'],
      },
    }),
    ...whenExternalScripts(() =>
      partytown({
        config: {
          forward: ['dataLayer.push'],
        },
      })
    ),
    tasks(),
    react(),
  ],
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin],
  },
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },

    plugins: [tailwindcss()],
  },
});