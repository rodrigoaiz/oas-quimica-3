import { useState, useRef, useEffect } from 'react';

/**
 * DragAndDrop - Componente para ejercicios de arrastrar y soltar con imágenes
 * 
 * @param {Object} props
 * @param {string} props.question - Pregunta o instrucciones del ejercicio
 * @param {string} props.backgroundImage - Imagen de fondo del esquema
 * @param {string} props.backgroundAlt - Texto alternativo para la imagen de fondo
 * @param {Array} props.items - Array de elementos arrastrables con {id, image, alt, label}
 * @param {Array} props.dropZones - Array de zonas de destino con {id, x, y, width, height, correctItemId}
 * @param {Object} props.feedback - Objeto con mensajes {correct, incorrect}
 */
export default function DragAndDrop({ 
  question = "", 
  backgroundImage,
  backgroundAlt = "Esquema para completar",
  items = [], 
  dropZones = [], 
  feedback = { correct: "¡Correcto!", incorrect: "Inténtalo de nuevo" }
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const containerRef = useRef(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, zone) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Actualizar el estado de elementos soltados
    setDroppedItems(prev => ({
      ...prev,
      [zone.id]: draggedItem
    }));

    setDraggedItem(null);
  };

  const handleReset = () => {
    setDroppedItems({});
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    // Verificar si todas las zonas están completadas correctamente
    const allCorrect = dropZones.every(zone => {
      const droppedItem = droppedItems[zone.id];
      return droppedItem && droppedItem.id === zone.correctItemId;
    });

    setIsCorrect(allCorrect);
    setShowFeedback(true);
  };

  const getAvailableItems = () => {
    const usedItemIds = Object.values(droppedItems).map(item => item.id);
    return items.filter(item => !usedItemIds.includes(item.id));
  };

  const removeFromZone = (zoneId) => {
    setDroppedItems(prev => {
      const updated = { ...prev };
      delete updated[zoneId];
      return updated;
    });
  };

  return (
    <div className="drag-and-drop-container p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Pregunta */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {question}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Elementos arrastrables */}
        <div className="lg:col-span-1">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
            Elementos disponibles:
          </h4>
          <div className="space-y-3">
            {getAvailableItems().map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="draggable-item flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-lg cursor-move hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
              >
                {item.image && (
                  <img 
                    src={item.image.src || item.image} 
                    alt={item.alt} 
                    className="mr-3 object-contain"
                  />
                )}
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Área del esquema */}
        <div className="lg:col-span-2">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
            Esquema para completar:
          </h4>
          <div 
            ref={containerRef}
            className="relative w-full bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
            style={{ paddingBottom: '60%' }} // Aspect ratio 5:3
          >
            {/* Imagen de fondo */}
            {backgroundImage && (
              <img 
                src={backgroundImage.src || backgroundImage}
                alt={backgroundAlt}
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}

            {/* Zonas de destino */}
            {dropZones.map((zone) => (
              <div
                key={zone.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, zone)}
                className="absolute border-2 border-dashed border-gray-400 dark:border-gray-500 bg-white/20 dark:bg-gray-800/20 rounded flex items-center justify-center hover:bg-blue-100/30 dark:hover:bg-blue-800/30 transition-colors"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`
                }}
              >
                {droppedItems[zone.id] ? (
                  <div className="flex items-center justify-center relative group">
                    {droppedItems[zone.id].image && (
                      <img 
                        src={droppedItems[zone.id].image.src || droppedItems[zone.id].image}
                        alt={droppedItems[zone.id].alt}
                        className="object-contain"
                      />
                    )}
                    <button
                      onClick={() => removeFromZone(zone.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-1">
                    Arrastra aquí
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handleCheck}
          disabled={Object.keys(droppedItems).length === 0}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Verificar respuesta
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reiniciar
        </button>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`mt-6 p-4 rounded-lg ${
          isCorrect 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white text-sm font-bold">
                {isCorrect ? '✓' : '✗'}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${
              isCorrect 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {isCorrect ? feedback.correct : feedback.incorrect}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
