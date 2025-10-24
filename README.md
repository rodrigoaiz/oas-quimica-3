# Micrositio Química 3 · CCH (Astro)

**Stack**: Astro + Tailwind + MDX + React islands (solo para actividades).

## Desarrollo Local
```bash
npm i
npm run dev
```

El sitio correrá en `http://localhost:4321`

## Build para Producción

### Opción 1: Despliegue en raíz del dominio
```bash
npm run build
```

### Opción 2: Despliegue en subcarpeta (Portal Académico CCH)
```bash
BASE_PATH=/oas-quimica-3/ npm run build
```

Esto generará el sitio en `dist/` configurado para:
`http://portalacademico.cch.unam.mx/oas-quimica-3/`

## Preview local del build
```bash
npm run preview
```

## Agregar Contenido

### Nuevo Objeto de Aprendizaje
1. Crea `src/content/objetos/oa4.mdx` con la información principal
2. Crea carpeta `src/content/objetos/oa4/`
3. Agrega pantallas: `introduccion.mdx`, `tema1.mdx`, etc.
4. Cada pantalla debe tener en el frontmatter:
   ```yaml
   ---
   title: "Título de la pantalla"
   order: 1
   oaSlug: "oa4"
   screenSlug: "introduccion"
   ---
   ```

### El sistema es completamente escalable:
- ✅ Las pantallas se obtienen automáticamente de las colecciones
- ✅ El bento grid muestra selección aleatoria
- ✅ La navegación se genera dinámicamente

## Estructura
- `src/pages/` páginas principales y rutas dinámicas
- `src/content/objetos/` colecciones MDX (OAs principales + pantallas)
- `src/components/` componentes Astro y React
- `src/components/Activity/` componentes interactivos (MCQ, etc.)
- `src/layouts/` layouts reutilizables
- `public/` assets estáticos

## Características
- ✅ Accesible (WCAG AA), mobile-first
- ✅ Multi-pantalla con navegación interna y breadcrumbs
- ✅ Build estático; listo para Apache/Nginx
- ✅ Bento grid con selección aleatoria de contenidos
- ✅ Componentes interactivos con React (client:load)
- ✅ Diseño responsive con Tailwind CSS

## Notas Técnicas
- Puedes integrar H5P mediante embeds en MDX
- Las actividades React usan hydration selectiva (`client:load`)
- El sitio funciona sin JavaScript para contenido básico
- Las rutas se generan estáticamente en build time
