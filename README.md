# Micrositio Química 3 · CCH (Astro)

**Stack**: Astro + Tailwind + MDX + React islands (solo para actividades).

## Uso
```bash
npm i
cp .env.example .env    # Ajusta BASE_PATH si va en subcarpeta
npm run dev
npm run build && npm run preview
```

- Edita contenidos en `src/content/objetos/*.mdx`.
- Las actividades React (MCQ) usan `client:load`.
- Si publicas bajo `/interactivos/quimica3/`, asegúrate de que `BASE_PATH` coincida.

## Estructura
- `src/pages/` páginas principales
- `src/content/` colecciones MDX de objetos
- `src/components/Activity/` componentes interactivos
- `public/` assets estáticos

## Notas
- Accesible (WCAG AA), mobile-first.
- Build estático; listo para Apache/Nginx.
- Puedes integrar H5P mediante embeds en MDX.
