import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

const base = (process.env.BASE_PATH?.trim() || '/').replace(/\/$/, '/') ;

export default defineConfig({
  site: 'https://portalacademico.cch.unam.mx',
  base,
  integrations: [tailwind({ applyBaseStyles: false }), mdx(), react()],
  output: 'static'
});
