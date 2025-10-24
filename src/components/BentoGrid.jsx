import { useState, useEffect } from 'react';

const allScreens = [
  // OA1 - Modelos atómicos
  { oaSlug: 'oa1', oaTitle: 'Modelos atómicos', screenSlug: 'introduccion', screenTitle: 'Introducción', href: '/objetos/oa1/introduccion' },
  { oaSlug: 'oa1', oaTitle: 'Modelos atómicos', screenSlug: 'dalton', screenTitle: 'Modelo de Dalton', href: '/objetos/oa1/dalton' },
  { oaSlug: 'oa1', oaTitle: 'Modelos atómicos', screenSlug: 'thomson', screenTitle: 'Modelo de Thomson', href: '/objetos/oa1/thomson' },
  { oaSlug: 'oa1', oaTitle: 'Modelos atómicos', screenSlug: 'rutherford', screenTitle: 'Modelo de Rutherford', href: '/objetos/oa1/rutherford' },
  { oaSlug: 'oa1', oaTitle: 'Modelos atómicos', screenSlug: 'bohr', screenTitle: 'Modelo de Bohr', href: '/objetos/oa1/bohr' },
  { oaSlug: 'oa1', oaTitle: 'Modelos atómicos', screenSlug: 'cuantico', screenTitle: 'Modelo cuántico', href: '/objetos/oa1/cuantico' },
  
  // OA2 - Enlaces químicos
  { oaSlug: 'oa2', oaTitle: 'Enlaces químicos', screenSlug: 'introduccion', screenTitle: 'Introducción', href: '/objetos/oa2/introduccion' },
  { oaSlug: 'oa2', oaTitle: 'Enlaces químicos', screenSlug: 'ionico', screenTitle: 'Enlace iónico', href: '/objetos/oa2/ionico' },
  { oaSlug: 'oa2', oaTitle: 'Enlaces químicos', screenSlug: 'covalente', screenTitle: 'Enlace covalente', href: '/objetos/oa2/covalente' },
  { oaSlug: 'oa2', oaTitle: 'Enlaces químicos', screenSlug: 'metalico', screenTitle: 'Enlace metálico', href: '/objetos/oa2/metalico' },
  
  // OA3 - Reacciones químicas
  { oaSlug: 'oa3', oaTitle: 'Reacciones químicas', screenSlug: 'introduccion', screenTitle: 'Introducción', href: '/objetos/oa3/introduccion' },
  { oaSlug: 'oa3', oaTitle: 'Reacciones químicas', screenSlug: 'evidencias', screenTitle: 'Evidencias', href: '/objetos/oa3/evidencias' },
  { oaSlug: 'oa3', oaTitle: 'Reacciones químicas', screenSlug: 'energia', screenTitle: 'Energía', href: '/objetos/oa3/energia' },
  { oaSlug: 'oa3', oaTitle: 'Reacciones químicas', screenSlug: 'balanceo', screenTitle: 'Balanceo', href: '/objetos/oa3/balanceo' },
];

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

export default function BentoGrid() {
  const [selectedScreens, setSelectedScreens] = useState([]);

  useEffect(() => {
    // Seleccionar 6 pantallas aleatorias al montar el componente
    const shuffled = shuffleArray(allScreens);
    setSelectedScreens(shuffled.slice(0, 6));
  }, []);

  if (selectedScreens.length === 0) {
    // Mostrar skeleton mientras carga
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-100 rounded-xl h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {selectedScreens.map((screen, index) => {
        const colors = oaColors[screen.oaSlug] || oaColors['oa1'];
        
        return (
          <a
            key={`${screen.oaSlug}-${screen.screenSlug}-${index}`}
            href={screen.href}
            className={`
              ${colors.bg} ${colors.text} 
              border-2 ${colors.border}
              rounded-xl p-4 
              hover:shadow-lg hover:scale-105 
              transition-all duration-200
              flex flex-col justify-between
              min-h-[120px]
              group
            `}
          >
            <div>
              <div className="text-xs font-semibold opacity-70 mb-1 uppercase tracking-wide">
                {screen.oaTitle}
              </div>
              <div className="font-bold text-base leading-tight group-hover:underline">
                {screen.screenTitle}
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs opacity-60 mt-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4 h-4" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>Explorar</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
