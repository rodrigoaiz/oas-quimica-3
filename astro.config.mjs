import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

const base = (process.env.BASE_PATH?.trim() || '/').replace(/\/$/, '/') ;

export default defineConfig({
  site: 'https://portalacademico.cch.unam.mx',
  base,
  integrations: [mdx(), react()],
  // Endure the dev/preview server only binds to localhost to avoid external scans hitting your dev port
  server: {
    host: '127.0.0.1',
    port: 4321,
    open: false,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: '127.0.0.1',
      port: 4321,
      strictPort: true,
      fs: {
        // Keep strict FS serving to prevent access outside project root
        strict: true,
      },
    },
    preview: {
      host: '127.0.0.1',
      port: 4321,
      strictPort: true,
    },
  },
  output: 'static'
});
