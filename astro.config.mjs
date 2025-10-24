import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

const base = (process.env.BASE_PATH?.trim() || '/').replace(/\/$/, '/') ;

export default defineConfig({
  site: 'https://portalacademico.cch.unam.mx',
  base,
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static'
});
