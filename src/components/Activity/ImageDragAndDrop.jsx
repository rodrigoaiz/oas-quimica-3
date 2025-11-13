import { useState, useRef, useEffect } from 'react';

/**
 * ImageDragAndDrop - Componente para arrastrar imágenes a múltiples zonas de drop
 * Compatible con mouse y touch (móviles)
 * 
 * @param {string} question - Pregunta del ejercicio
 * @param {Array} images - Array de objetos { id, src, alt }
 * @param {Array} dropZones - Array de objetos { id, label, correctImageId }
 * @param {Object} feedback - Mensajes de retroalimentación
 * @param {number} columns - Número de columnas en el grid de imágenes (default: auto según cantidad)
 * @param {string} imageHeight - Altura de las imágenes (default: 'h-24')
 * @param {boolean|number} dropZonesInline - Mostrar zonas en columnas. true=2 cols, número=cols específicas (default: false)
 * @param {boolean} disableOnMobile - Deshabilitar en dispositivos móviles/táctiles (default: false)
 * @param {string} mobileMessage - Mensaje a mostrar en móviles cuando está deshabilitado
 */
export default function ImageDragAndDrop({ 
  question, 
  images = [], 
  dropZones = [],
  feedback = {},
  columns = null,
  imageHeight = 'h-24',
  dropZonesInline = false,
  disableOnMobile = false,
  mobileMessage = "Este ejercicio interactivo requiere un dispositivo de escritorio con mouse para funcionar correctamente."
}) {
  // Detectar si es dispositivo táctil
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Marcar como montado para evitar errores de hidratación
    setMounted(true);
    
    // Detectar dispositivo táctil
    const checkTouch = () => {
      return (
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0)
      );
    };
    setIsTouchDevice(checkTouch());
  }, []);

  // Función para mezclar array (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Estado: imágenes disponibles en el banco
  const [availableImages, setAvailableImages] = useState(images);
  // Estado: mapeo de zona -> imagen colocada { zoneId: imageId }
  const [droppedImages, setDroppedImages] = useState({});
  // Estado: verificación
  const [submitted, setSubmitted] = useState(false);
  // Estado: imagen que se está arrastrando
  const [draggingImage, setDraggingImage] = useState(null);
  const [draggingSource, setDraggingSource] = useState(null); // 'bank' o zoneId
  
  // Mezclar solo en el cliente después de la hidratación
  useEffect(() => {
    setAvailableImages(shuffleArray(images));
  }, []);
  
  // Refs para touch events
  const draggedElement = useRef(null);

  // Manejar inicio de arrastre (mouse)
  const handleDragStart = (e, imageId, source) => {
    if (submitted) return;
    setDraggingImage(imageId);
    setDraggingSource(source);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', imageId);
    e.target.style.opacity = '0.5';
  };

  // Finalizar arrastre (mouse)
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  // Manejar inicio de arrastre (touch)
  const handleTouchStart = (e, imageId, source) => {
    if (submitted) return;
    const touch = e.touches[0];
    setDraggingImage(imageId);
    setDraggingSource(source);
    
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
    if (!draggingImage || !draggedElement.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const target = e.currentTarget;
    
    draggedElement.current.style.transform = `translate(${touch.clientX - target.offsetWidth/2}px, ${touch.clientY - target.offsetHeight/2}px)`;
  };

  // Manejar fin de arrastre (touch)
  const handleTouchEnd = (e) => {
    if (!draggingImage) return;
    
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = dropTarget?.closest('.image-drop-zone');
    
    if (dropZone) {
      const zoneId = dropZone.dataset.zoneId;
      handleDropAction(zoneId);
    }
    
    // Limpiar
    if (draggedElement.current) {
      draggedElement.current.remove();
      draggedElement.current = null;
    }
    
    document.querySelectorAll('[style*="opacity: 0.5"]').forEach(el => el.style.opacity = '1');
    setDraggingImage(null);
    setDraggingSource(null);
  };

  // Permitir drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Acción de drop
  const handleDropAction = (zoneId) => {
    if (!draggingImage || !zoneId) return;

    const newDroppedImages = { ...droppedImages };

    // Si la zona ya tiene una imagen, devolverla al banco
    if (newDroppedImages[zoneId]) {
      const previousImage = images.find(img => img.id === newDroppedImages[zoneId]);
      if (previousImage && !availableImages.find(img => img.id === previousImage.id)) {
        setAvailableImages([...availableImages, previousImage]);
      }
    }

    // Si la imagen viene de otra zona, quitarla de ahí
    if (draggingSource !== 'bank') {
      delete newDroppedImages[draggingSource];
    }

    // Colocar la nueva imagen en la zona
    newDroppedImages[zoneId] = draggingImage;
    setDroppedImages(newDroppedImages);

    // Si viene del banco, quitarla de ahí
    if (draggingSource === 'bank') {
      setAvailableImages(availableImages.filter(img => img.id !== draggingImage));
    }

    setDraggingImage(null);
    setDraggingSource(null);
  };

  // Manejar drop (mouse)
  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    handleDropAction(zoneId);
  };

  // Devolver imagen al banco desde una zona
  const handleRemoveFromZone = (zoneId) => {
    if (submitted) return;
    
    const imageId = droppedImages[zoneId];
    const image = images.find(img => img.id === imageId);
    
    if (image) {
      setAvailableImages([...availableImages, image]);
      const newDroppedImages = { ...droppedImages };
      delete newDroppedImages[zoneId];
      setDroppedImages(newDroppedImages);
    }
  };

  // Verificar respuesta
  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Reiniciar
  const handleReset = () => {
    setAvailableImages(shuffleArray(images));
    setDroppedImages({});
    setSubmitted(false);
  };

  // Verificar si todas las zonas están correctas
  const allCorrect = submitted && dropZones.every(zone => 
    droppedImages[zone.id] === zone.correctImageId
  );

  // Verificar si hay algún error
  const hasErrors = submitted && dropZones.some(zone => 
    droppedImages[zone.id] && droppedImages[zone.id] !== zone.correctImageId
  );

  const getImage = (imageId) => images.find(img => img.id === imageId);

  // Determinar el número de columnas
  const getGridColumns = () => {
    if (columns) return `grid-cols-${columns}`;
    
    const imageCount = images.length;
    if (imageCount <= 2) return 'grid-cols-1 sm:grid-cols-2';
    if (imageCount <= 3) return 'grid-cols-2 sm:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
  };

  // Determinar el layout de las zonas de drop
  const getDropZonesLayout = () => {
    if (dropZonesInline === false) return 'space-y-4';
    
    if (dropZonesInline === true) {
      return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    }
    
    // Si es un número, usar ese número de columnas
    if (typeof dropZonesInline === 'number') {
      return `grid grid-cols-1 md:grid-cols-${dropZonesInline} gap-4`;
    }
    
    return 'space-y-4';
  };

  // Mostrar mensaje en dispositivos móviles si está deshabilitado
  if (disableOnMobile && isTouchDevice && mounted) {
    return (
      <div className="my-6 p-6 md:p-8 rounded-2xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="shrink-0 text-4xl">
            💻
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">
              Ejercicio disponible solo en escritorio
            </h3>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              {mobileMessage}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-3">
              💡 <strong>Sugerencia:</strong> Accede desde una computadora para completar esta actividad.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar un placeholder mientras se monta (evita error de hidratación)
  if (!mounted) {
    return (
      <div className="my-6 p-6 rounded-2xl border-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="image-drag-drop-container my-6 p-4 md:p-6 rounded-2xl border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 bg-white dark:bg-slate-900 shadow-lg">
      {/* Pregunta */}
      <div className="mb-6">
        <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed">
          {question}
        </p>
      </div>

      {/* Banco de imágenes */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Arrastra las imágenes:
        </h3>
        <div className={`grid ${getGridColumns()} gap-3 max-w-2xl mx-auto`}>
          {availableImages.map((image) => (
            <div
              key={image.id}
              draggable={!submitted}
              onDragStart={(e) => handleDragStart(e, image.id, 'bank')}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, image.id, 'bank')}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative cursor-move bg-white dark:bg-slate-800 rounded-lg border-2 border-gray-300 dark:border-slate-600 p-2 hover:border-(--color-primary) dark:hover:border-(--color-primary-dark) transition-all ${
                submitted ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'
              }`}
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className={`w-full ${imageHeight} object-cover rounded`}
              />
            </div>
          ))}
        </div>
        {availableImages.length === 0 && !submitted && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
            Todas las imágenes han sido colocadas
          </p>
        )}
      </div>

      {/* Zonas de drop */}
      <div className={`${getDropZonesLayout()} mb-6`}>
        {dropZones.map((zone) => {
          const droppedImageId = droppedImages[zone.id];
          const droppedImage = droppedImageId ? getImage(droppedImageId) : null;
          const isCorrect = submitted && droppedImageId === zone.correctImageId;
          const isIncorrect = submitted && droppedImageId && droppedImageId !== zone.correctImageId;

          let zoneClasses = "image-drop-zone min-h-32 p-4 rounded-xl border-2 transition-all ";
          
          if (isCorrect) {
            zoneClasses += "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30";
          } else if (isIncorrect) {
            zoneClasses += "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30";
          } else if (!submitted) {
            zoneClasses += "border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 hover:border-(--color-primary) dark:hover:border-(--color-primary-dark) hover:bg-(--color-primary)/5 dark:hover:bg-(--color-primary-dark)/10";
          } else {
            zoneClasses += "border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50";
          }

          return (
            <div
              key={zone.id}
              data-zone-id={zone.id}
              className={zoneClasses}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zone.id)}
            >
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {zone.label}
              </div>
              
              {droppedImage ? (
                <div className="relative">
                  <div
                    draggable={!submitted}
                    onDragStart={(e) => handleDragStart(e, droppedImage.id, zone.id)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(e, droppedImage.id, zone.id)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`bg-white dark:bg-slate-700 rounded-lg border-2 p-2 ${
                      submitted ? 'cursor-default' : 'cursor-move border-gray-300 dark:border-slate-600'
                    }`}
                  >
                    <img 
                      src={droppedImage.src} 
                      alt={droppedImage.alt}
                      className={`w-full ${imageHeight} object-cover rounded`}
                    />
                  </div>
                  {!submitted && (
                    <button
                      onClick={() => handleRemoveFromZone(zone.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      aria-label="Quitar imagen"
                    >
                      ×
                    </button>
                  )}
                  {isCorrect && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                  {isIncorrect && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✗
                    </div>
                  )}
                </div>
              ) : (
                <div className={`flex items-center justify-center ${imageHeight} text-gray-400 dark:text-gray-500 text-sm`}>
                  {submitted ? 'Sin respuesta' : 'Suelta aquí la imagen'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botones de acción */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(droppedImages).length === 0}
          className="w-full px-6 py-3 bg-(--color-primary) dark:bg-(--color-primary-dark) text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          Verificar
        </button>
      ) : (
        <div className="space-y-4">
          {/* Feedback */}
          <div className={`p-4 rounded-xl ${
            allCorrect 
              ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-400'
              : 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500 dark:border-amber-400'
          }`}>
            <p className={`font-semibold ${
              allCorrect ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'
            }`}>
              {allCorrect ? (feedback.correct || '¡Excelente!') : (feedback.incorrect || 'Revisa tus respuestas.')}
            </p>
          </div>
          
          <button
            onClick={handleReset}
            className="w-full px-6 py-3 bg-gray-500 dark:bg-slate-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
}
