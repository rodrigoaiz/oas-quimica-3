import { useState } from 'react';

/**
 * DragAndDropText - Componente para ejercicios de arrastrar palabras a una caja
 * 
 * @param {Object} props
 * @param {string} props.question - Pregunta o instrucciones del ejercicio
 * @param {Array<string>} props.items - Array de palabras/textos distractores
 * @param {Array<string>} props.correctAnswers - Array de respuestas correctas
 * @param {Object} props.feedback - Objeto con mensajes {correct, incorrect}
 */
export default function DragAndDropText({ 
  question = "", 
  items = [], 
  correctAnswers = [], 
  feedback = { correct: "¡Correcto!", incorrect: "Inténtalo de nuevo" }
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Todos los elementos disponibles
  const allItems = [...items, ...correctAnswers];

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropInBox = (e) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Solo agregar si no está ya en la caja
    if (!droppedItems.includes(draggedItem)) {
      setDroppedItems(prev => [...prev, draggedItem]);
    }

    setDraggedItem(null);
  };

  const handleReset = () => {
    setDroppedItems([]);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    // Verificar si todos los elementos en la caja son correctos
    const allCorrect = droppedItems.length === correctAnswers.length &&
      droppedItems.every(item => correctAnswers.includes(item));

    setIsCorrect(allCorrect);
    setShowFeedback(true);
  };

  const getAvailableItems = () => {
    return allItems.filter(item => !droppedItems.includes(item));
  };

  const removeFromBox = (itemToRemove) => {
    setDroppedItems(prev => prev.filter(item => item !== itemToRemove));
    setShowFeedback(false);
  };

  return (
    <div className="drag-and-drop-text-container p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Pregunta */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {question}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Elementos arrastrables */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
            Elementos disponibles:
          </h4>
          <div className="flex flex-wrap gap-2">
            {getAvailableItems().map((item, index) => (
              <div
                key={`${item}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="draggable-item px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-lg cursor-move hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Caja de destino */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
            Arrastra aquí las respuestas correctas:
          </h4>
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDropInBox}
            className="min-h-[200px] p-4 border-2 border-dashed border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            {droppedItems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Arrastra aquí los elementos correctos
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {droppedItems.map((item, index) => (
                  <div
                    key={`dropped-${item}-${index}`}
                    className="relative px-4 py-2 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 rounded-lg group"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item}
                    </span>
                    <button
                      onClick={() => removeFromBox(item)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      aria-label="Remover"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handleCheck}
          disabled={droppedItems.length === 0}
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
            <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
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
