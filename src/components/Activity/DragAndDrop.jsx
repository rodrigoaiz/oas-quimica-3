import { useState, useRef, useEffect } from 'react';

/**
 * DragAndDrop - Componente para arrastrar elementos a una zona de drop
 * Compatible con mouse y touch (móviles)
 * 
 * @param {string} question - Pregunta del ejercicio
 * @param {Array<string>} items - Items distractores (palabras incorrectas)
 * @param {Array<string>} correctAnswers - Respuestas correctas
 * @param {Object} feedback - Mensajes de retroalimentación
 */
export default function DragAndDrop({ 
  question, 
  items = [], 
  correctAnswers = [],
  feedback = {}
}) {
  // Función para mezclar array (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Combinar correctAnswers con distractores (sin mezclar inicialmente)
  const allItemsUnshuffled = [...correctAnswers, ...items];
  
  // Estado: items disponibles en el banco (se mezclará solo en el cliente)
  const [availableItems, setAvailableItems] = useState(allItemsUnshuffled);
  // Estado: items colocados en la zona de drop
  const [droppedItems, setDroppedItems] = useState([]);
  // Estado: verificación
  const [submitted, setSubmitted] = useState(false);
  // Estado: item que se está arrastrando
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingSource, setDraggingSource] = useState(null); // 'bank' o 'drop'
  
  // Mezclar solo en el cliente después de la hidratación
  useEffect(() => {
    setAvailableItems(shuffleArray(allItemsUnshuffled));
  }, []);
  
  // Refs para touch events
  const draggedElement = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });

  // Manejar inicio de arrastre (mouse)
  const handleDragStart = (e, item, source) => {
    if (submitted) return;
    setDraggingItem(item);
    setDraggingSource(source);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item);
    
    // Hacer visible el arrastre
    e.target.style.opacity = '0.5';
  };

  // Finalizar arrastre (mouse)
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  // Manejar inicio de arrastre (touch)
  const handleTouchStart = (e, item, source) => {
    if (submitted) return;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    setDraggingItem(item);
    setDraggingSource(source);
    
    // Clonar el elemento para arrastre visual
    const target = e.currentTarget;
    draggedElement.current = target.cloneNode(true);
    draggedElement.current.style.position = 'fixed';
    draggedElement.current.style.pointerEvents = 'none';
    draggedElement.current.style.zIndex = '1000';
    draggedElement.current.style.opacity = '0.9';
    draggedElement.current.style.width = target.offsetWidth + 'px';
    draggedElement.current.style.transform = `translate(${touch.clientX - target.offsetWidth/2}px, ${touch.clientY - target.offsetHeight/2}px)`;
    document.body.appendChild(draggedElement.current);
    
    target.style.opacity = '0.5';
  };

  // Manejar movimiento (touch)
  const handleTouchMove = (e) => {
    if (!draggingItem || !draggedElement.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const target = e.currentTarget;
    
    draggedElement.current.style.transform = `translate(${touch.clientX - target.offsetWidth/2}px, ${touch.clientY - target.offsetHeight/2}px)`;
  };

  // Manejar fin de arrastre (touch)
  const handleTouchEnd = (e) => {
    if (!draggingItem) return;
    
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = dropTarget?.closest('.drop-zone');
    
    if (dropZone) {
      handleDropAction();
    }
    
    // Limpiar
    if (draggedElement.current) {
      draggedElement.current.remove();
      draggedElement.current = null;
    }
    
    document.querySelectorAll('[style*="opacity: 0.5"]').forEach(el => el.style.opacity = '1');
    setDraggingItem(null);
    setDraggingSource(null);
  };

  // Permitir drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Acción de drop
  const handleDropAction = () => {
    if (!draggingItem) return;

    // Si viene del banco, agregarlo a la zona
    if (draggingSource === 'bank') {
      setDroppedItems([...droppedItems, draggingItem]);
      setAvailableItems(availableItems.filter(item => item !== draggingItem));
    }
    // Si ya está en la zona, no hacer nada (ya está ahí)

    setDraggingItem(null);
    setDraggingSource(null);
  };

  // Manejar drop (mouse)
  const handleDrop = (e) => {
    e.preventDefault();
    handleDropAction();
  };

  // Devolver item al banco
  const returnToBank = (item) => {
    if (submitted) return;
    
    setDroppedItems(droppedItems.filter(i => i !== item));
    setAvailableItems([...availableItems, item]);
  };

  // Verificar respuestas
  const handleSubmit = () => {
    if (droppedItems.length === 0) return;
    setSubmitted(true);
  };

  // Reiniciar
  const handleReset = () => {
    setAvailableItems(shuffleArray(allItemsUnshuffled));
    setDroppedItems([]);
    setSubmitted(false);
  };

  // Verificar si está correcto
  const isCorrect = () => {
    if (!submitted) return false;
    // Verificar que todos los items en droppedItems sean correctos
    const allCorrect = droppedItems.every(item => correctAnswers.includes(item));
    // Verificar que estén todas las respuestas correctas
    const allPresent = correctAnswers.every(answer => droppedItems.includes(answer));
    return allCorrect && allPresent;
  };

  const correct = isCorrect();

  return (
    <div className="drag-drop-container my-6 p-4 md:p-6 rounded-2xl border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 bg-linear-to-br from-(--color-primary)/5 to-(--color-primary)/10 dark:from-slate-800 dark:to-slate-900 shadow-lg">
      {/* Pregunta */}
      <div className="mb-4 md:mb-6">
        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
          {question}
        </p>
        <p className="text-xs md:text-sm text-(--color-primary) dark:text-(--color-primary-dark) mt-2 font-medium">
          Arrastra las palabras correctas a la caja
        </p>
      </div>

      {/* Zona de Drop única */}
      <div className="mb-6">
        <div
          className="drop-zone min-h-32 p-4 rounded-xl border-2 border-dashed bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600 transition-all"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {droppedItems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {droppedItems.map((item, index) => {
                const isItemCorrect = submitted && correctAnswers.includes(item);
                const isItemIncorrect = submitted && !correctAnswers.includes(item);

                return (
                  <div
                    key={`${item}-${index}`}
                    className={`drag-item inline-block px-4 py-2 rounded-lg border-2 font-medium text-sm md:text-base cursor-move transition-all ${
                      isItemCorrect
                        ? 'correct bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-400 text-green-800 dark:text-green-200'
                        : isItemIncorrect
                        ? 'incorrect bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-400 text-red-800 dark:text-red-200'
                        : 'bg-white dark:bg-slate-800 border-(--color-primary) dark:border-(--color-primary-dark) text-gray-900 dark:text-gray-100 hover:shadow-md'
                    }`}
                    draggable={!submitted}
                    onDragStart={(e) => handleDragStart(e, item, 'drop')}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(e, item, 'drop')}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onDoubleClick={() => returnToBank(item)}
                  >
                    {item}
                    {submitted && isItemCorrect && <span className="ml-2">✓</span>}
                    {submitted && isItemIncorrect && <span className="ml-2">✗</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600 text-sm italic">
              Arrastra aquí las respuestas correctas
            </div>
          )}
        </div>
      </div>

      {/* Banco de palabras */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Palabras disponibles:
        </p>
        <div className="flex flex-wrap gap-2">
          {availableItems.length > 0 ? (
            availableItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="drag-item px-4 py-2 rounded-lg border-2 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 font-medium text-sm md:text-base shadow-sm hover:shadow-md cursor-move transition-all"
                draggable={!submitted}
                onDragStart={(e) => handleDragStart(e, item, 'bank')}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, item, 'bank')}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {item}
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              {submitted ? 'Todas las palabras han sido colocadas' : 'No hay palabras disponibles'}
            </p>
          )}
        </div>
      </div>

      {/* Feedback */}
      {submitted && (
        <div
          className={`p-4 rounded-xl mb-4 ${
            correct
              ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-400'
              : 'bg-red-50 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-400'
          }`}
        >
          <p
            className={`text-sm md:text-base font-semibold ${
              correct
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}
          >
            {correct ? (
              <>
                <span className="text-xl mr-2">✓</span>
                {feedback.correct || '¡Excelente! Todas las respuestas son correctas.'}
              </>
            ) : (
              <>
                <span className="text-xl mr-2">✗</span>
                {feedback.incorrect || 'Algunas respuestas no son correctas. Revisa las palabras marcadas con ✗ y las que faltan.'}
              </>
            )}
          </p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={droppedItems.length === 0}
            className={`flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
              droppedItems.length > 0
                ? 'bg-(--color-primary) dark:bg-(--color-primary-dark) text-white hover:opacity-90 shadow-md hover:shadow-lg'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Verificar respuestas
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base bg-(--color-secondary) dark:bg-scondary text-white hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            Intentar de nuevo
          </button>
        )}
      </div>

      {/* Instrucciones móvil */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Arrastra las palabras o haz doble clic para moverlas. Solo las respuestas correctas cuentan.
      </p>
    </div>
  );
}
