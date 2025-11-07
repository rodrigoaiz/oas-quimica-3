import { useState } from 'react';

/**
 * Matching Activity Component
 * Permite relacionar elementos de dos columnas
 * 
 * @param {Object} props
 * @param {string} props.question - Instrucciones de la actividad
 * @param {Array} props.items - Elementos de la columna izquierda [{id, content}]
 * @param {Array} props.targets - Elementos de la columna derecha [{id, content}]
 * @param {Object} props.correctMatches - Mapeo correcto {itemId: targetId}
 * @param {Object} props.feedback - Mensajes de retroalimentación
 */
export default function Matching({ 
  question, 
  items = [], 
  targets = [], 
  correctMatches = {},
  feedback = { correct: '¡Correcto!', incorrect: 'Revisa tus respuestas.' }
}) {
  const [matches, setMatches] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleMatch = (itemId, targetId) => {
    if (submitted) return;
    
    setMatches(prev => ({
      ...prev,
      [itemId]: targetId
    }));
  };

  const handleSubmit = () => {
    // Verificar si todas las respuestas son correctas
    const allCorrect = Object.keys(correctMatches).every(
      itemId => matches[itemId] === correctMatches[itemId]
    );
    
    setIsCorrect(allCorrect);
    setSubmitted(true);
  };

  const handleReset = () => {
    setMatches({});
    setSubmitted(false);
    setIsCorrect(false);
  };

  const allMatched = items.every(item => matches[item.id]);

  return (
    <div className="matching-activity my-8 p-6 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
      {/* Pregunta */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
          {question}
        </p>
      </div>

      {/* Grid de matching */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Columna izquierda: Items */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-purple-700 dark:text-purple-300 mb-3">
            Conceptos
          </h3>
          {items.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                submitted
                  ? matches[item.id] === correctMatches[item.id]
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                    : 'bg-red-100 dark:bg-red-900/30 border-red-500'
                  : matches[item.id]
                  ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-400'
                  : 'bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-700'
              }`}
            >
              <div className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                {item.content}
              </div>
              
              {/* Selector de target */}
              {!submitted && (
                <select
                  value={matches[item.id] || ''}
                  onChange={(e) => handleMatch(item.id, e.target.value)}
                  className="w-full p-2 rounded border border-purple-300 dark:border-purple-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
                >
                  <option value="">Selecciona una opción...</option>
                  {targets.map(target => (
                    <option key={target.id} value={target.id}>
                      {target.content}
                    </option>
                  ))}
                </select>
              )}

              {/* Mostrar respuesta seleccionada después de submit */}
              {submitted && matches[item.id] && (
                <div className={`mt-2 p-2 rounded text-sm font-medium ${
                  matches[item.id] === correctMatches[item.id]
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  → {targets.find(t => t.id === matches[item.id])?.content}
                  {matches[item.id] !== correctMatches[item.id] && (
                    <div className="text-xs mt-1">
                      Correcto: {targets.find(t => t.id === correctMatches[item.id])?.content}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Columna derecha: Targets (solo referencia visual) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-purple-700 dark:text-purple-300 mb-3">
            Descripciones
          </h3>
          {targets.map(target => (
            <div
              key={target.id}
              className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700"
            >
              <div className="text-sm text-slate-700 dark:text-slate-300">
                {target.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retroalimentación */}
      {submitted && (
        <div className={`mb-4 p-4 rounded-lg ${
          isCorrect
            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
            : 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500'
        }`}>
          <p className={`font-medium ${
            isCorrect
              ? 'text-green-800 dark:text-green-200'
              : 'text-amber-800 dark:text-amber-200'
          }`}>
            {isCorrect ? feedback.correct : feedback.incorrect}
          </p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allMatched}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              allMatched
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
            }`}
          >
            Verificar respuestas
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  );
}
