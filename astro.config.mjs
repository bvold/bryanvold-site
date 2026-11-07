// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://bryanvold.com',
  output: 'static',
  // No sessions used; skips the adapter's auto-added KV binding.
  session: false,
  integrations: [sitemap()],
  // Images are plain <img> tags, so no Cloudflare Images binding is needed.
  adapter: cloudflare({ imageService: 'passthrough' }),
});