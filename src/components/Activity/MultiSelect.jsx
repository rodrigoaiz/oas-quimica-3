import { useId, useState } from 'react';

/**
 * MultiSelect - Componente para seleccionar múltiples opciones correctas
 * Similar a MCQ pero permite seleccionar varias respuestas
 */
export default function MultiSelect({ 
  question, 
  options = [], 
  correctIndexes = [], 
  feedback = {},
  questionId 
}) {
  const generatedId = useId();
  const name = questionId || generatedId;
  const [selectedOptions, setSelectedOptions] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const handleToggleOption = (index) => {
    if (submitted) return;
    
    setSelectedOptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.size === 0) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOptions(new Set());
    setSubmitted(false);
  };

  // Verificar si la respuesta es correcta
  const correctSet = new Set(correctIndexes);
  const isCorrect = submitted && 
    selectedOptions.size === correctSet.size &&
    [...selectedOptions].every(i => correctSet.has(i));

  return (
    <div className="multiselect-container my-6 p-4 md:p-6 rounded-2xl border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 bg-linear-to-br from-(--color-primary)/5 to-(--color-primary)/10 dark:from-slate-800 dark:to-slate-900 shadow-lg">
      {/* Pregunta */}
      <div className="mb-4 md:mb-6">
        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
          {question}
        </p>
        <p className="text-xs md:text-sm text-(--color-primary) dark:text-(--color-primary-dark) mt-2 font-medium">
          Selecciona todas las opciones correctas
        </p>
      </div>

      {/* Opciones */}
      <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
        <legend className="sr-only">Opciones de respuesta (múltiple selección)</legend>
        {options.map((opt, i) => {
          const isSelected = selectedOptions.has(i);
          const isThisCorrect = correctSet.has(i);
          
          let optionClasses = "flex items-start gap-2 md:gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ";
          
          if (!submitted) {
            // Sin enviar
            optionClasses += isSelected
              ? "border-(--color-primary) dark:border-(--color-primary-dark) bg-(--color-primary)/10 dark:bg-(--color-primary-dark)/20 shadow-md scale-[1.01]"
              : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-(--color-primary) dark:hover:border-(--color-primary-dark) hover:shadow-md";
          } else {
            // Después de enviar
            if (isSelected && isThisCorrect) {
              // Correcta y seleccionada
              optionClasses += "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 shadow-lg";
            } else if (isSelected && !isThisCorrect) {
              // Incorrecta pero seleccionada
              optionClasses += "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 shadow-lg";
            } else if (!isSelected && isThisCorrect) {
              // Correcta pero no seleccionada
              optionClasses += "border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-900/30";
            } else {
              // Incorrecta y no seleccionada (neutro)
              optionClasses += "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 opacity-60";
            }
          }

          return (
            <label key={i} className={optionClasses}>
              <div className="shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  name={`${name}-${i}`}
                  checked={isSelected}
                  onChange={() => handleToggleOption(i)} 
                  disabled={submitted}
                  className="w-4 h-4 md:w-5 md:h-5 text-purple-600 focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:border-slate-500 rounded"
                />
              </div>
              <span className="flex-1 text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                {opt}
              </span>
              {/* Indicadores visuales después de enviar */}
              {submitted && isSelected && isThisCorrect && (
                <span className="text-green-600 dark:text-green-400 text-lg md:text-xl">✓</span>
              )}
              {submitted && isSelected && !isThisCorrect && (
                <span className="text-red-600 dark:text-red-400 text-lg md:text-xl">✗</span>
              )}
              {submitted && !isSelected && isThisCorrect && (
                <span className="text-amber-600 dark:text-amber-400 text-sm md:text-base font-semibold">⚠️</span>
              )}
            </label>
          );
        })}
      </fieldset>

      {/* Botones de acción */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedOptions.size === 0}
          className={`mt-4 md:mt-6 w-full py-3 rounded-xl font-semibold text-sm md:text-base transition-all ${
            selectedOptions.size === 0
              ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'bg-primary dark:bg-primary-dark text-white hover:bg-primary/90 dark:hover:bg-primary-dark/90 hover:scale-[1.02] shadow-md'
          }`}
        >
          {selectedOptions.size === 0 ? 'Selecciona al menos una opción' : `Verificar (${selectedOptions.size} seleccionada${selectedOptions.size !== 1 ? 's' : ''})`}
        </button>
      ) : (
        <>
          {/* Feedback */}
          <div 
            className={`mt-4 md:mt-6 p-3 md:p-4 rounded-xl border-2 ${
              isCorrect 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
            }`}
          >
            <div className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl shrink-0">
                {isCorrect ? '🎉' : '💡'}
              </span>
              <div className="flex-1">
                <p className={`font-semibold mb-1 text-sm md:text-base ${
                  isCorrect 
                    ? 'text-green-800 dark:text-green-300' 
                    : 'text-amber-800 dark:text-amber-300'
                }`}>
                  {isCorrect ? '¡Perfecto!' : 'Revisa tu selección'}
                </p>
                <p className={`text-xs md:text-sm ${
                  isCorrect 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-amber-700 dark:text-amber-400'
                }`}>
                  {isCorrect 
                    ? (feedback.correct || '¡Seleccionaste todas las opciones correctas!') 
                    : (feedback.incorrect || 'Algunas opciones son incorrectas o te faltan opciones por seleccionar. Las marcadas con ⚠️ son correctas pero no las seleccionaste.')}
                </p>
              </div>
            </div>
          </div>

          {/* Botón de reintentar */}
          {!isCorrect && (
            <button
              onClick={handleReset}
              className="mt-3 w-full py-2.5 rounded-xl font-semibold text-sm md:text-base bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
            >
              Intentar de nuevo
            </button>
          )}
        </>
      )}
    </div>
  );
}
