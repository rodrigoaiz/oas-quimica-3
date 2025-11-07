import { useId, useState } from 'react';

export default function MCQ({ question, options = [], correctIndex = 0, feedback = {}, questionId }) {
  // Si se proporciona questionId, usarlo; si no, generar uno único
  const generatedId = useId();
  const name = questionId || generatedId;
  const [answer, setAnswer] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const isCorrect = answer === correctIndex;

  const handleAnswer = (index) => {
    setSelectedOption(index);
    setAnswer(index);
  };

  return (
    <div className="mcq-container my-6 p-4 md:p-6 rounded-2xl border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 bg-linear-to-br from-(--color-primary)/5 to-(--color-primary)/10 dark:from-slate-800 dark:to-slate-900 shadow-lg">
      {/* Pregunta */}
      <div className="mb-4 md:mb-6">
        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
          {question}
        </p>
      </div>

      {/* Opciones */}
      <fieldset className="space-y-2 md:space-y-3">
        <legend className="sr-only">Opciones de respuesta</legend>
        {options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isAnswered = answer !== null;
          const isThisCorrect = i === correctIndex;
          
          let optionClasses = "flex items-start gap-2 md:gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ";
          
          if (!isAnswered) {
            // Sin responder
            optionClasses += "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-(--color-primary) dark:hover:border-(--color-primary-dark) hover:shadow-md hover:scale-[1.02]";
          } else if (isSelected && isCorrect) {
            // Respuesta correcta seleccionada
            optionClasses += "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 shadow-lg scale-[1.02]";
          } else if (isSelected && !isCorrect) {
            // Respuesta incorrecta seleccionada
            optionClasses += "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 shadow-lg";
          } else if (isAnswered && isThisCorrect) {
            // Mostrar la correcta después de error
            optionClasses += "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30";
          } else {
            // Otras opciones después de responder
            optionClasses += "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 opacity-60";
          }

          return (
            <label key={i} className={optionClasses}>
              <div className="shrink-0 mt-0.5">
                <input 
                  type="radio" 
                  name={name} 
                  value={i}
                  checked={isSelected}
                  onChange={() => handleAnswer(i)} 
                  disabled={isAnswered}
                  className="w-4 h-4 md:w-5 md:h-5 text-(--color-primary) focus:ring-2 focus:ring-(--color-primary) dark:bg-slate-700 dark:border-slate-500"
                  aria-describedby={answer !== null ? `fb-${name}` : undefined} 
                />
              </div>
              <span className="flex-1 text-sm md:text-base text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                {opt}
              </span>
              {/* Indicadores visuales */}
              {isAnswered && isSelected && isCorrect && (
                <span className="text-green-600 dark:text-green-400 text-lg md:text-xl">✓</span>
              )}
              {isAnswered && isSelected && !isCorrect && (
                <span className="text-red-600 dark:text-red-400 text-lg md:text-xl">✗</span>
              )}
              {isAnswered && !isSelected && isThisCorrect && (
                <span className="text-green-600 dark:text-green-400 text-lg md:text-xl">✓</span>
              )}
            </label>
          );
        })}
      </fieldset>

      {/* Feedback */}
      {answer !== null && (
        <div 
          id={`fb-${name}`} 
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
              <p className="font-bold text-base md:text-lg mb-1 md:mb-2">
                {isCorrect ? '¡Excelente!' : 'Reflexiona tu respuesta'}
              </p>
              <p className="text-sm md:text-base leading-relaxed">
                {isCorrect ? (feedback.correct || '¡Respuesta correcta!') : (feedback.incorrect || 'Piensa en la pregunta y tu elección.')}
              </p>
              {!isCorrect && (
                <button
                  onClick={() => {
                    setAnswer(null);
                    setSelectedOption(null);
                  }}
                  className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  🔄 Intentar de nuevo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
