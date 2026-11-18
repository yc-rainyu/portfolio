// @ts-check

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { buildFonts } from './scripts/subset-fonts.mjs';
import { site } from './src/config/site';

/** @returns {import('astro').AstroIntegration} */

function subsetFonts() {
  return {
    name: 'subset-fonts',
    hooks: {
      'astro:config:setup': async ({ logger }) => {
        const { skipped, report } = await buildFonts();
        if (!skipped) for (const line of report) logger.info(line);
      },
      'astro:server:setup': ({ server, logger }) => {
        /** @type {NodeJS.Timeout | undefined} */

        let timer;
        server.watcher.on('change', (file) => {
          if (!file.includes('/src/content/')) return;
          clearTimeout(timer);
          timer = setTimeout(async () => {
            try {
              const { skipped } = await buildFonts();
              if (!skipped) logger.info('內容用到新的字，已重新產生字型子集');
            } catch (error) {
              logger.error(String(error));
            }
          }, 300);
        });
      },
    },
  };
}

function externalLinksNewTab() {
  return {
    name: 'external-links-new-tab',
    element: {
      filter: ['a'],
      /** @param {any} node @param {any} ctx */

      visit(node, ctx) {
        if (/^https?:\/\//.test(String(node.properties?.href ?? ''))) {
          ctx.setProperty(node, 'target', '_blank');
          ctx.setProperty(node, 'rel', 'noopener');
        }
      },
    },
  };
}

export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  markdown: { processor: satteri({ hastPlugins: [externalLinksNewTab] }) },
  integrations: [
    subsetFonts(),
    sitemap({
      filter: (page) => new URL(page).pathname !== '/',
      i18n: {
        defaultLocale: 'en',
        locales: { zh: 'zh-TW', en: 'en' },
      },
    }),
  ],
});
