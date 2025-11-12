import { useState, useRef } from 'react';

/**
 * DragAndDrop - Componente para arrastrar elementos a zonas de drop
 * Compatible con mouse y touch (móviles)
 * 
 * @param {string} question - Pregunta del ejercicio
 * @param {Array<string>} items - Items arrastrables
 * @param {Array<string>} correctAnswers - Respuestas correctas en orden
 * @param {Object} feedback - Mensajes de retroalimentación
 */
export default function DragAndDrop({ 
  question, 
  items = [], 
  correctAnswers = [],
  feedback = {}
}) {
  // Estado: items disponibles en el banco
  const [availableItems, setAvailableItems] = useState([...items]);
  // Estado: items colocados en las zonas de drop (array de arrays)
  const [droppedItems, setDroppedItems] = useState(Array(correctAnswers.length).fill(null));
  // Estado: verificación
  const [submitted, setSubmitted] = useState(false);
  // Estado: item que se está arrastrando
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingSource, setDraggingSource] = useState(null); // 'bank' o índice de zona
  
  // Refs para touch events
  const draggedElement = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });

  // Manejar inicio de arrastre (mouse)
  const handleDragStart = (e, item, source) => {
    if (submitted) return;
    setDraggingItem(item);
    setDraggingSource(source);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
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
    draggedElement.current.style.opacity = '0.8';
    draggedElement.current.style.width = target.offsetWidth + 'px';
    document.body.appendChild(draggedElement.current);
    
    target.classList.add('dragging');
  };

  // Manejar movimiento (touch)
  const handleTouchMove = (e) => {
    if (!draggingItem || !draggedElement.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const x = touch.clientX - touchStartPos.current.x;
    const y = touch.clientY - touchStartPos.current.y;
    
    draggedElement.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  // Manejar fin de arrastre (touch)
  const handleTouchEnd = (e) => {
    if (!draggingItem) return;
    
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = dropTarget?.closest('.drop-zone');
    
    if (dropZone) {
      const zoneIndex = parseInt(dropZone.dataset.zoneIndex);
      handleDrop(zoneIndex);
    }
    
    // Limpiar
    if (draggedElement.current) {
      draggedElement.current.remove();
      draggedElement.current = null;
    }
    
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    setDraggingItem(null);
    setDraggingSource(null);
  };

  // Permitir drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Manejar drop
  const handleDrop = (zoneIndex) => {
    if (!draggingItem) return;

    const newDroppedItems = [...droppedItems];
    const newAvailableItems = [...availableItems];

    // Si viene del banco
    if (draggingSource === 'bank') {
      // Si la zona ya tiene un item, devolverlo al banco
      if (newDroppedItems[zoneIndex]) {
        newAvailableItems.push(newDroppedItems[zoneIndex]);
      }
      // Colocar el nuevo item
      newDroppedItems[zoneIndex] = draggingItem;
      // Quitar del banco
      const itemIndex = newAvailableItems.indexOf(draggingItem);
      newAvailableItems.splice(itemIndex, 1);
    } 
    // Si viene de otra zona
    else if (typeof draggingSource === 'number') {
      // Intercambiar items
      const temp = newDroppedItems[zoneIndex];
      newDroppedItems[zoneIndex] = draggingItem;
      newDroppedItems[draggingSource] = temp;
    }

    setDroppedItems(newDroppedItems);
    setAvailableItems(newAvailableItems);
    setDraggingItem(null);
    setDraggingSource(null);
  };

  // Devolver item al banco
  const returnToBank = (zoneIndex) => {
    if (submitted) return;
    
    const item = droppedItems[zoneIndex];
    if (!item) return;

    const newDroppedItems = [...droppedItems];
    const newAvailableItems = [...availableItems];

    newDroppedItems[zoneIndex] = null;
    newAvailableItems.push(item);

    setDroppedItems(newDroppedItems);
    setAvailableItems(newAvailableItems);
  };

  // Verificar respuestas
  const handleSubmit = () => {
    // Verificar que todas las zonas estén llenas
    if (droppedItems.some(item => item === null)) {
      return;
    }
    setSubmitted(true);
  };

  // Reiniciar
  const handleReset = () => {
    setAvailableItems([...items]);
    setDroppedItems(Array(correctAnswers.length).fill(null));
    setSubmitted(false);
  };

  // Verificar si está correcto
  const isCorrect = submitted && droppedItems.every((item, i) => item === correctAnswers[i]);
  const allFilled = droppedItems.every(item => item !== null);

  return (
    <div className="drag-drop-container my-6 p-4 md:p-6 rounded-2xl border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 bg-linear-to-br from-(--color-primary)/5 to-(--color-primary)/10 dark:from-slate-800 dark:to-slate-900 shadow-lg">
      {/* Pregunta */}
      <div className="mb-4 md:mb-6">
        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
          {question}
        </p>
        <p className="text-xs md:text-sm text-(--color-primary) dark:text-(--color-primary-dark) mt-2 font-medium">
          Arrastra las palabras a las cajas correspondientes
        </p>
      </div>

      {/* Zonas de Drop */}
      <div className="mb-6 space-y-3">
        {correctAnswers.map((_, index) => {
          const item = droppedItems[index];
          const isItemCorrect = submitted && item === correctAnswers[index];
          const isItemIncorrect = submitted && item && item !== correctAnswers[index];

          return (
            <div
              key={index}
              className={`drop-zone min-h-[3rem] p-3 md:p-4 rounded-xl border-2 border-dashed transition-all ${
                item 
                  ? 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600' 
                  : 'bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-600'
              }`}
              data-zone-index={index}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(index);
              }}
            >
              {item ? (
                <div
                  className={`drag-item inline-block px-4 py-2 rounded-lg border-2 font-medium text-sm md:text-base ${
                    isItemCorrect
                      ? 'correct'
                      : isItemIncorrect
                      ? 'incorrect'
                      : 'bg-(--color-primary)/10 dark:bg-(--color-primary-dark)/20 border-(--color-primary) dark:border-(--color-primary-dark) text-gray-900 dark:text-gray-100'
                  }`}
                  draggable={!submitted}
                  onDragStart={(e) => handleDragStart(e, item, index)}
                  onTouchStart={(e) => handleTouchStart(e, item, index)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onDoubleClick={() => returnToBank(index)}
                >
                  {item}
                  {submitted && isItemCorrect && <span className="ml-2">✓</span>}
                  {submitted && isItemIncorrect && <span className="ml-2">✗</span>}
                </div>
              ) : (
                <div className="text-gray-400 dark:text-gray-600 text-sm italic">
                  Arrastra aquí
                </div>
              )}
            </div>
          );
        })}
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
                className="drag-item px-4 py-2 rounded-lg border-2 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 font-medium text-sm md:text-base shadow-sm hover:shadow-md"
                draggable={!submitted}
                onDragStart={(e) => handleDragStart(e, item, 'bank')}
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
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-400'
              : 'bg-red-50 dark:bg-red-900/30 border-2 border-red-500 dark:border-red-400'
          }`}
        >
          <p
            className={`text-sm md:text-base font-semibold ${
              isCorrect
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}
          >
            {isCorrect ? (
              <>
                <span className="text-xl mr-2">✓</span>
                {feedback.correct || '¡Excelente! Todas las respuestas son correctas.'}
              </>
            ) : (
              <>
                <span className="text-xl mr-2">✗</span>
                {feedback.incorrect || 'Algunas respuestas no son correctas. Revisa las palabras marcadas.'}
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
            disabled={!allFilled}
            className={`flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
              allFilled
                ? 'bg-(--color-primary) dark:bg-(--color-primary-dark) text-white hover:opacity-90 shadow-md hover:shadow-lg'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Verificar respuestas
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base bg-(--color-secondary) dark:bg-(--color-accent) text-white hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            Intentar de nuevo
          </button>
        )}
      </div>

      {/* Instrucciones móvil */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center md:hidden">
        💡 Toca y mantén presionado para arrastrar. Doble toque para devolver al banco.
      </p>
    </div>
  );
}
