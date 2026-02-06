import { useState, useEffect } from 'react';
import katex from 'katex';

/**
 * Ordering Activity Component
 * Componente para ordenar elementos (con soporte para LaTeX usando KaTeX)
 * 
 * @param {string} question - Instrucciones de la actividad
 * @param {string} description - Descripción adicional (opcional)
 * @param {Array} items - Array de objetos {id: string, formula: string, label: string} o {id: string, html: string}
 * @param {Array} correctOrder - Array de IDs en el orden correcto (ej: ['item2', 'item0', 'item1'])
 * @param {Object} feedback - Mensajes de retroalimentación {correct, incorrect}
 * @param {string} layout - "vertical" (default) o "horizontal" para mostrar inline
 */
export default function Ordering({ 
  question, 
  description,
  items = [],
  correctOrder = [],
  layout = 'vertical',
  feedback = { 
    correct: '¡Excelente! El orden es correcto.', 
    incorrect: 'Revisa el orden de los elementos.' 
  }
}) {
  const [currentOrder, setCurrentOrder] = useState(items.map(item => item.id));
  const [submitted, setSubmitted] = useState(false);
  const [renderedItems, setRenderedItems] = useState({});

  // Renderizar fórmulas KaTeX en el cliente
  useEffect(() => {
    const rendered = {};
    items.forEach(item => {
      if (item.formula) {
        try {
          const html = katex.renderToString(item.formula, {
            throwOnError: false,
            displayMode: false,
            output: 'html',
            strict: false
          });
          rendered[item.id] = html;
        } catch (e) {
          console.error('Error rendering KaTeX:', e);
          rendered[item.id] = item.formula;
        }
      }
    });
    setRenderedItems(rendered);
  }, [items]);

  const moveLeft = (index) => {
    if (submitted || index === 0) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    setCurrentOrder(newOrder);
  };

  const moveRight = (index) => {
    if (submitted || index === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setCurrentOrder(newOrder);
  };

  const moveUp = (index) => {
    if (submitted || index === 0) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    setCurrentOrder(newOrder);
  };

  const moveDown = (index) => {
    if (submitted || index === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setCurrentOrder(newOrder);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setCurrentOrder(items.map(item => item.id));
    setSubmitted(false);
  };

  const isCorrect = submitted && currentOrder.every((id, idx) => id === correctOrder[idx]);

  // Encontrar el item por ID
  const getItemById = (id) => items.find(item => item.id === id);

  return (
    <div className="not-prose w-screen max-w-screen-xl relative left-1/2 -translate-x-1/2 ordering-activity my-6 px-4 md:px-8 py-4 md:py-6 rounded-2xl border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 bg-gradient-to-br from-(--color-primary)/5 to-(--color-primary)/10 dark:from-slate-800 dark:to-slate-900 shadow-lg">
      {/* Pregunta */}
      <div className="mb-4 md:mb-6">
        <p 
          className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question }}
        />
        {description && (
          <p 
            className="text-sm md:text-base text-gray-700 dark:text-gray-300 mt-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>

      {/* Lista ordenable */}
      {layout === 'horizontal' ? (
        /* Layout Horizontal */
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {currentOrder.map((itemId, position) => {
              const item = getItemById(itemId);
              const isThisCorrect = submitted && itemId === correctOrder[position];
              const isThisIncorrect = submitted && itemId !== correctOrder[position];

              return (
                <div
                  key={position}
                  className={`inline-flex items-center gap-2 p-2 md:p-3 rounded-xl border-2 transition-all ${
                    submitted
                      ? isThisCorrect
                        ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                        : 'border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {/* Botón izquierda */}
                  {!submitted && (
                    <button
                      onClick={() => moveLeft(position)}
                      disabled={position === 0}
                      className={`p-1 rounded transition-colors ${
                        position === 0
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'text-(--color-primary) dark:text-(--color-primary-dark) hover:bg-(--color-primary)/10 dark:hover:bg-(--color-primary-dark)/20'
                      }`}
                      aria-label="Mover izquierda"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Número de posición */}
                  <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm ${
                    submitted
                      ? isThisCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-(--color-primary)/10 dark:bg-(--color-primary-dark)/20 text-(--color-primary) dark:text-(--color-primary-dark)'
                  }`}>
                    {position + 1}
                  </div>

                  {/* Contenido del item */}
                  <div className="text-sm md:text-base text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {item.formula ? (
                      <>
                        <span 
                          className="katex-wrapper"
                          dangerouslySetInnerHTML={{ __html: renderedItems[itemId] || item.formula }}
                        />
                        {item.label && <span className="ml-1 text-xs md:text-sm text-gray-600 dark:text-gray-400">({item.label})</span>}
                      </>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: item.html }} />
                    )}
                  </div>

                  {/* Botón derecha */}
                  {!submitted && (
                    <button
                      onClick={() => moveRight(position)}
                      disabled={position === currentOrder.length - 1}
                      className={`p-1 rounded transition-colors ${
                        position === currentOrder.length - 1
                          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'text-(--color-primary) dark:text-(--color-primary-dark) hover:bg-(--color-primary)/10 dark:hover:bg-(--color-primary-dark)/20'
                      }`}
                      aria-label="Mover derecha"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  {/* Indicador de correcto/incorrecto */}
                  {submitted && (
                    <div className="flex-shrink-0">
                      {isThisCorrect ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Layout Vertical */
        <div className="space-y-2 mb-6">
        {currentOrder.map((itemId, position) => {
          const item = getItemById(itemId);
          const isThisCorrect = submitted && itemId === correctOrder[position];
          const isThisIncorrect = submitted && itemId !== correctOrder[position];

          return (
            <div
              key={position}
              className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 transition-all ${
                submitted
                  ? isThisCorrect
                    ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800'
              }`}
            >
              {/* Número de posición */}
              <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${
                submitted
                  ? isThisCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-(--color-primary)/10 dark:bg-(--color-primary-dark)/20 text-(--color-primary) dark:text-(--color-primary-dark)'
              }`}>
                {position + 1}
              </div>

              {/* Contenido del item */}
              <div className="flex-1 text-sm md:text-base text-gray-900 dark:text-gray-100">
                {item.formula ? (
                  <>
                    <span 
                      className="katex-wrapper"
                      dangerouslySetInnerHTML={{ __html: renderedItems[itemId] || item.formula }}
                    />
                    {item.label && <span className="ml-2 text-gray-600 dark:text-gray-400">({item.label})</span>}
                  </>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: item.html }} />
                )}
              </div>

              {/* Botones de movimiento */}
              {!submitted && (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(position)}
                    disabled={position === 0}
                    className={`p-1 rounded transition-colors ${
                      position === 0
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-(--color-primary) dark:text-(--color-primary-dark) hover:bg-(--color-primary)/10 dark:hover:bg-(--color-primary-dark)/20'
                    }`}
                    aria-label="Mover arriba"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveDown(position)}
                    disabled={position === currentOrder.length - 1}
                    className={`p-1 rounded transition-colors ${
                      position === currentOrder.length - 1
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-(--color-primary) dark:text-(--color-primary-dark) hover:bg-(--color-primary)/10 dark:hover:bg-(--color-primary-dark)/20'
                    }`}
                    aria-label="Mover abajo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Indicador de correcto/incorrecto */}
              {submitted && (
                <div className="flex-shrink-0">
                  {isThisCorrect ? (
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      )}
      {/* Feedback */}
      {submitted && (
        <div className={`p-4 md:p-5 rounded-xl mb-4 md:mb-6 ${
          isCorrect
            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600'
            : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600'
        }`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {isCorrect ? (
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p 
                className={`text-sm md:text-base font-medium ${
                  isCorrect
                    ? 'text-green-800 dark:text-green-300'
                    : 'text-red-800 dark:text-red-300'
                }`}
                dangerouslySetInnerHTML={{ __html: isCorrect ? feedback.correct : feedback.incorrect }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-wrap gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="flex-1 min-w-[140px] px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all bg-(--color-primary) dark:bg-(--color-primary-dark) text-white hover:opacity-90 shadow-md hover:shadow-lg"
          >
            Verificar orden
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 min-w-[140px] px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 shadow-md hover:shadow-lg"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  );
}
