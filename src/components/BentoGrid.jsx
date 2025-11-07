import { useState, useEffect } from 'react';

// Utilidad para componer clases con soporte condicional y evitar duplicación
const joinClassList = (tokens) => tokens.filter(Boolean).join(' ');

const createOAStyles = ({
  lightBg,
  darkBg,
  borderLight,
  borderDark,
  textLight,
  textDark,
  indicatorLight,
  indicatorDark,
  ring,
  shadow,
}) => ({
  labelSurface: joinClassList([
    lightBg,
    darkBg && `dark:${darkBg}`,
  ]),
  labelBorder: joinClassList([borderLight, borderDark && `dark:${borderDark}`]),
  labelText: joinClassList([textLight, textDark && `dark:${textDark}`]),
  indicator: joinClassList([indicatorLight, indicatorDark && `dark:${indicatorDark}`]),
  ring,
  shadow,
});

// Paleta por OA para acentos visuales
const oaColors = {
  oa1: createOAStyles({
    lightBg: 'bg-blue-50/60',
    darkBg: 'bg-blue-400/25',
    borderLight: 'border-blue-300/70',
    borderDark: 'border-blue-400/40',
    textLight: 'text-blue-900',
    textDark: 'text-blue-50',
    indicatorLight: 'text-blue-700',
    indicatorDark: 'text-blue-200',
    ring: 'focus-visible:ring-blue-400/60',
    shadow: 'hover:shadow-[0_18px_35px_-20px_rgba(37,99,235,0.45)]',
  }),
  oa2: createOAStyles({
    lightBg: 'bg-purple-50/60',
    darkBg: 'bg-purple-400/25',
    borderLight: 'border-purple-300/70',
    borderDark: 'border-purple-400/40',
    textLight: 'text-purple-900',
    textDark: 'text-purple-50',
    indicatorLight: 'text-purple-700',
    indicatorDark: 'text-purple-200',
    ring: 'focus-visible:ring-purple-400/60',
    shadow: 'hover:shadow-[0_18px_35px_-20px_rgba(147,51,234,0.45)]',
  }),
  oa3: createOAStyles({
    lightBg: 'bg-emerald-50/60',
    darkBg: 'bg-green-400/23',
    borderLight: 'border-emerald-300/70',
    borderDark: 'border-emerald-400/40',
    textLight: 'text-emerald-900',
    textDark: 'text-green-50',
    indicatorLight: 'text-green-700',
    indicatorDark: 'text-green-200',
    ring: 'focus-visible:ring-green-400/60',
    shadow: 'hover:shadow-[0_18px_35px_-20px_rgba(22,163,74,0.45)]',
  }),
};

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * @param {{ screens: Array<{oaSlug: string, oaTitle: string, oaCover: string, screenSlug: string, screenTitle: string, order: number}> }} props
 */
export default function BentoGrid({ screens = [] }) {
  const [selectedScreens, setSelectedScreens] = useState([]);

  useEffect(() => {
    // Seleccionar 8 pantallas aleatorias al montar el componente
    const shuffled = shuffleArray(screens);
    const selected = shuffled.slice(0, 8);
    setSelectedScreens(selected);
  }, [screens]);

  if (selectedScreens.length === 0) {
    // Mostrar skeleton mientras carga
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        <div className="bg-slate-100 rounded-xl h-32"></div>
        <div className="bg-slate-100 rounded-xl h-32 md:col-span-2"></div>
        <div className="bg-slate-100 rounded-xl h-32"></div>
        <div className="bg-slate-100 rounded-xl h-32 md:col-span-2"></div>
        <div className="bg-slate-100 rounded-xl h-32 md:col-span-2"></div>
        <div className="bg-slate-100 rounded-xl h-32"></div>
        <div className="bg-slate-100 rounded-xl h-32 md:col-span-2"></div>
        <div className="bg-slate-100 rounded-xl h-32"></div>
      </div>
    );
  }

  // Patrón de bento: 1-2-1, luego 2-2, luego 1-2-1 (simétrico)
  const bentoPatterns = [
    'md:col-span-1',  // Celda 1 (pequeña)
    'md:col-span-2',  // Celda 2 (grande)
    'md:col-span-1',  // Celda 3 (pequeña)
    'md:col-span-2',  // Celda 4 (grande)
    'md:col-span-2',  // Celda 5 (grande)
    'md:col-span-1',  // Celda 6 (pequeña)
    'md:col-span-2',  // Celda 7 (grande)
    'md:col-span-1'   // Celda 8 (pequeña)
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {selectedScreens.map((screen, index) => {
        const colSpanClass = bentoPatterns[index % bentoPatterns.length];
        const isLarge = colSpanClass.includes('col-span-2');
        const colors = oaColors[screen.oaSlug] ?? oaColors.oa1;
        
        return (
          <a
            key={`${screen.oaSlug}-${screen.screenSlug}`}
            href={`/objetos/${screen.oaSlug}/${screen.screenSlug}`}
            className={`${colSpanClass} group relative overflow-hidden rounded-2xl
              border border-slate-200/70 dark:border-white/10
              bg-white/5 dark:bg-slate-950/10
              transition-all duration-300 ease-out
              hover:-translate-y-1 ${colors.shadow}
              focus-visible:outline-none focus-visible:ring-2 ${colors.ring}
              focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
              ${isLarge ? 'min-h-40' : 'min-h-32'}`}
          >
            {/* Imagen de fondo con efecto zoom en hover */}
            <img 
              src={screen.oaCover} 
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Capas de refuerzo para contraste */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-950/30 via-slate-900/20 to-slate-900/5 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-slate-900/20 to-transparent"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-[1.02]
              transition-all duration-300 ease-out
              bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),rgba(255,255,255,0.06)_60%)]"></div>

            {/* Contenido */}
            <div className="relative z-10 h-full p-4 md:p-6 flex items-end">
              <div className="w-full">
                <div className={`inline-flex flex-wrap items-center gap-2 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] leading-4
                  rounded-lg md:rounded-full border ${colors.labelBorder}
                  ${colors.labelSurface} ${colors.labelText}
                  max-w-full text-left line-clamp-2 overflow-hidden
                  backdrop-blur-xs backdrop-saturate-25 backdrop-contrast-200`}
                >
                  {screen.oaTitle}
                </div>
                <div className={`mt-3 font-bold tracking-tight leading-snug text-slate-50 dark:text-slate-100 ${isLarge ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}>
                  {screen.screenTitle}
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium transition-all duration-300
                    opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 text-white drop-shadow-lg">
                    Ver contenido
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5 fill-current"
                    >
                      <path d="M6.75 4.75a.75.75 0 0 1 0-1.5h7.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-5.69l-7.22 7.22a.75.75 0 0 1-1.06-1.06l7.22-7.22h-5.69z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>
        );
      })}
      
      {/* Celda informativa para llenar el espacio */}
      <a
        href="/objetos"
        className="hidden md:block md:col-span-4 bg-linear-to-br from-(--color-primary)/10 to-purple-500/10 
          dark:from-(--color-primary-dark)/20 dark:to-purple-500/20
          border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/30 rounded-xl p-8 
          transition-all duration-300 hover:scale-102 hover:shadow-xl hover:border-(--color-primary)/40
          dark:hover:border-(--color-primary-dark)/50
          min-h-[140px]"
      >
        <div className="flex items-center justify-between h-full">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">
              Explora todos los objetos de aprendizaje
            </h3>
            <p className="text-gray-600 dark:text-slate-300">
              Descubre más contenido interactivo sobre química →
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
