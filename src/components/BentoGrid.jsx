import { useState, useEffect } from 'react';

// Colores para los OAs
const oaColors = {
  'oa1': { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200' },
  'oa2': { bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-200' },
  'oa3': { bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-200' },
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
 * @param {{ screens: Array<{oaSlug: string, oaTitle: string, screenSlug: string, screenTitle: string, order: number}> }} props
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
        const colors = oaColors[screen.oaSlug];
        
        return (
          <a
            key={`${screen.oaSlug}-${screen.screenSlug}`}
            href={`/objetos/${screen.oaSlug}/${screen.screenSlug}`}
            className={`${colSpanClass} ${colors.bg} ${colors.text} ${colors.border} border rounded-xl p-6 
              transition-all duration-300 hover:scale-102 hover:shadow-xl
              ${isLarge ? 'min-h-[140px] text-lg' : 'min-h-[120px] text-base'}
              flex flex-col justify-between`}
          >
            <div>
              <div className="text-sm opacity-75 mb-2">{screen.oaTitle}</div>
              <div className="font-semibold">{screen.screenTitle}</div>
            </div>
          </a>
        );
      })}
      
      {/* Celda informativa para llenar el espacio */}
      <a
        href="/objetos"
        className="hidden md:block md:col-span-3 bg-gradient-to-br from-cch-azul/10 to-purple-500/10 
          border-2 border-cch-azul/20 rounded-xl p-8 
          transition-all duration-300 hover:scale-102 hover:shadow-xl hover:border-cch-azul/40
          min-h-[140px]"
      >
        <div className="flex items-center justify-between h-full">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Explora todos los objetos de aprendizaje
            </h3>
            <p className="text-gray-600">
              Descubre más contenido interactivo sobre química →
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
