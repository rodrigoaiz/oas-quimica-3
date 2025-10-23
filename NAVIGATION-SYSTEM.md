# Sistema de Navegación Multi-Pantalla para Objetos de Aprendizaje

## 📋 Descripción

Este sistema permite crear objetos de aprendizaje (OAs) con múltiples pantallas/secciones, navegación interna entre ellas, y breadcrumbs para orientación del usuario.

## 🏗️ Arquitectura

### Componentes creados

1. **`Breadcrumb.astro`** (`src/components/`)
   - Navegación jerárquica (migas de pan)
   - Props: `items: Array<{ label: string, href?: string }>`
   - Responsive, accesible (ARIA)

2. **`InternalNav.astro`** (`src/components/`)
   - Navegación Prev/Next entre pantallas
   - Índice desplegable de todas las pantallas
   - Props: `screens`, `currentSlug`, `baseUrl`, `showIndex`

3. **`OAScreen.astro`** (`src/layouts/`)
   - Layout específico para pantallas de OA
   - Integra automáticamente breadcrumbs y navegación interna
   - Props: `oaTitle`, `oaSlug`, `screenTitle`, `screenSlug`, `screens`

### Rutas

- **Índice de OAs**: `/objetos/` → Lista todos los OAs
- **Pantalla de OA**: `/objetos/[oaSlug]/[screenSlug]` → Pantalla individual
  - Ejemplo: `/objetos/oa1/introduccion`
  - Ejemplo: `/objetos/oa1/dalton`

## 🚀 Uso

### 1. Configurar pantallas de un OA

En `src/pages/objetos/[oaSlug]/[screenSlug].astro`, edita el objeto `oaConfigs`:

```typescript
const oaConfigs: Record<string, OAMeta> = {
  'oa1': {
    title: 'Estructura de la materia: modelos atómicos',
    screens: [
      { slug: 'introduccion', title: 'Introducción', order: 1 },
      { slug: 'dalton', title: 'Modelo de Dalton', order: 2 },
      { slug: 'thomson', title: 'Modelo de Thomson', order: 3 },
      // ... más pantallas
    ]
  },
  // ... más OAs
};
```

### 2. Crear contenido para una pantalla

**Opción A: Contenido inline (actual)**
Edita directamente el contenido en `[oaSlug]/[screenSlug].astro` dentro del componente `<OAScreen>`.

**Opción B: Contenido desde MDX (recomendado para futuro)**
1. Crea archivo: `src/content/objetos/oa1/introduccion.mdx`
2. Agrega frontmatter:
   ```yaml
   ---
   title: "Introducción"
   order: 1
   ---
   ```
3. Escribe contenido en Markdown/MDX
4. Actualiza `[screenSlug].astro` para renderizar el MDX

### 3. Usar componentes interactivos

Dentro del contenido de una pantalla:

```astro
---
import MCQ from '@/components/Activity/MCQ.jsx';
---

<OAScreen {...props}>
  <h2>Pregunta de opción múltiple</h2>
  
  <MCQ 
    client:load 
    question="¿Qué postula el modelo de Dalton?" 
    options={[
      "El átomo es divisible",
      "La materia está compuesta por átomos indivisibles",
      "Los electrones están en órbitas"
    ]} 
    correctIndex={1} 
    feedback={{
      correct: "¡Correcto! Dalton propuso átomos indivisibles.",
      incorrect: "Revisa las premisas del modelo de Dalton."
    }} 
  />
</OAScreen>
```

## 🎨 Personalización

### Breadcrumbs

Edita estilos en `src/components/Breadcrumb.astro`:
- `.breadcrumb-nav`: contenedor principal
- `.breadcrumb-link`: enlaces
- `.breadcrumb-current`: página actual

### Navegación interna

Edita estilos en `src/components/InternalNav.astro`:
- `.nav-btn`: botones Prev/Next
- `.screen-index`: índice de pantallas
- Media queries para mobile/desktop

### Layout de pantalla

Edita `src/layouts/OAScreen.astro`:
- `.screen-header`: encabezado de pantalla
- `.prose`: estilos de contenido (Tailwind Typography)

## 📱 Responsividad

- **Mobile**: 
  - Breadcrumbs compactos
  - Navegación Prev/Next en columna (solo texto "Anterior"/"Siguiente")
  - Índice colapsable por defecto
  
- **Desktop**:
  - Breadcrumbs completos
  - Navegación Prev/Next horizontal con títulos completos
  - Índice expandido por defecto
  - Moléculas de fondo más grandes (HeroQuimico)

## 🔍 Próximos pasos

1. **Migrar contenido MDX**: Mover contenido actual de `oa1.mdx`, `oa2.mdx`, `oa3.mdx` a estructura de carpetas:
   ```
   src/content/objetos/
     oa1/
       introduccion.mdx
       dalton.mdx
       thomson.mdx
       ...
     oa2/
       ...
   ```

2. **Colección de pantallas**: Actualizar `config.ts` para definir colección `screens`:
   ```typescript
   const screens = defineCollection({
     type: 'content',
     schema: z.object({
       title: z.string(),
       order: z.number(),
       oaSlug: z.string(),
       // ...
     })
   });
   ```

3. **Navegación desde metadatos**: Leer configuración de pantallas desde archivos JSON o frontmatter en lugar de hardcodear en `getStaticPaths()`.

4. **Progress tracking**: Agregar indicador de progreso (ej: "3 de 7 pantallas completadas").

5. **Animaciones**: Transiciones suaves entre pantallas (View Transitions API de Astro).

## 🧪 Pruebas

Visita en tu entorno de desarrollo:
- `/objetos/` → Índice con breadcrumb
- `/objetos/oa1/introduccion` → Primera pantalla de OA1 con contenido real
- `/objetos/oa1/dalton` → Segunda pantalla de OA1
- Navega con Prev/Next y breadcrumbs
- Prueba en mobile (< 640px) y desktop (> 1024px)

### Contenido disponible

**✅ OA1 - Estructura de la materia** (7 pantallas completas con MDX):
- introduccion, dalton, thomson, rutherford, bohr, cuantico, evaluacion

**✅ OA2 - Enlaces químicos** (5 pantallas completas con MDX):
- introduccion, ionico, covalente, metalico, evaluacion

**✅ OA3 - Reacciones químicas** (5 pantallas completas con MDX):
- introduccion, evidencias, energia, balanceo, evaluacion

Cada pantalla incluye:
- Contenido educativo estructurado
- Preguntas interactivas (MCQ)
- Ejemplos y aplicaciones
- Actividades de autoevaluación

## 📝 Notas

- Los errores de TypeScript en el editor son temporales; se resolverán al recargar el servidor o reiniciar TypeScript.
- Las rutas antiguas (`/objetos/[slug]`) siguen funcionando para compatibilidad, pero ahora se recomienda usar `/objetos/[oaSlug]/[screenSlug]`.
- El componente MCQ y otros interactivos requieren `client:load` para hidratación en el navegador.
