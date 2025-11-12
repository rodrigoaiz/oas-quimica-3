import { useState } from 'react';

/**
 * Matching Activity Component - Versión simplificada
 * Relaciona descripciones con conceptos mediante dropdowns
 * 
 * @param {string} question - Instrucciones de la actividad
 * @param {Array} pairs - Array de objetos {description: string, correctAnswer: string, options: string[]}
 * @param {Object} feedback - Mensajes de retroalimentación {correct, incorrect}
 */
export default function Matching({ 
  question, 
  pairs = [],
  feedback = { correct: '¡Correcto!', incorrect: 'Revisa tus respuestas.' }
}) {
  const [answers, setAnswers] = useState(Array(pairs.length).fill(''));
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index, value) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers(Array(pairs.length).fill(''));
    setSubmitted(false);
  };

  const allAnswered = answers.every(answer => answer !== '');
  const isCorrect = submitted && pairs.every((pair, i) => answers[i] === pair.correctAnswer);

  return (
    <div className="matching-activity my-6 p-4 md:p-6 rounded-2xl border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 bg-linear-to-br from-(--color-primary)/5 to-(--color-primary)/10 dark:from-slate-800 dark:to-slate-900 shadow-lg">
      {/* Pregunta */}
      <div className="mb-4 md:mb-6">
        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
          {question}
        </p>
      </div>

      {/* Tabla de matching */}
      <div className="space-y-3 mb-6">
        {pairs.map((pair, index) => {
          const isThisCorrect = submitted && answers[index] === pair.correctAnswer;
          const isThisIncorrect = submitted && answers[index] && answers[index] !== pair.correctAnswer;

          return (
            <div
              key={index}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all ${
                submitted
                  ? isThisCorrect
                    ? 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-400'
                    : isThisIncorrect
                    ? 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-400'
                    : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600'
              }`}
            >
              {/* Descripción */}
              <div className="mb-3 text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {pair.description}
              </div>

              {/* Selector */}
              <div className="flex items-center gap-3">
                <label className="text-xs md:text-sm font-semibold text-(--color-primary) dark:text-(--color-primary-dark) whitespace-nowrap">
                  Variable:
                </label>
                <select
                  value={answers[index]}
                  onChange={(e) => handleSelect(index, e.target.value)}
                  disabled={submitted}
                  className={`flex-1 p-2 md:p-2.5 rounded-lg border-2 text-sm md:text-base font-medium transition-all ${
                    submitted
                      ? isThisCorrect
                        ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200'
                        : isThisIncorrect
                        ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200'
                        : 'bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300'
                      : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 hover:border-(--color-primary) dark:hover:border-(--color-primary-dark)'
                  } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <option value="">Selecciona...</option>
                  {pair.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {/* Indicadores */}
                {submitted && isThisCorrect && (
                  <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                )}
                {submitted && isThisIncorrect && (
                  <span className="text-red-600 dark:text-red-400 text-xl">✗</span>
                )}
              </div>

              {/* Mostrar respuesta correcta si es incorrecta */}
              {submitted && isThisIncorrect && (
                <div className="mt-2 text-xs md:text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Respuesta correcta: <strong>{pair.correctAnswer}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Retroalimentación */}
      {submitted && (
        <div
          className={`mb-4 p-4 rounded-xl ${
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
                {feedback.correct}
              </>
            ) : (
              <>
                <span className="text-xl mr-2">✗</span>
                {feedback.incorrect}
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
            disabled={!allAnswered}
            className={`flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
              allAnswered
                ? 'bg-(--color-primary) dark:bg-(--color-primary-dark) text-white hover:opacity-90 shadow-md hover:shadow-lg'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Verificar respuestas
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base bg-(--color-secondary) dark:bg-secondary text-white hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  );
}
  