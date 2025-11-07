import { useState } from 'react';
import MCQControlled from './MCQControlled.jsx';

/**
 * MCQQuiz - Componente para manejar múltiples preguntas de opción múltiple
 * 
 * @param {Object} props
 * @param {Array} props.questions - Array de objetos con: { question, options, correctIndex, feedback }
 * @param {boolean} props.showAll - Mostrar todas las preguntas a la vez (default: false)
 * @param {boolean} props.hideProgress - Ocultar el header de progreso y navegación (default: false)
 */
export default function MCQQuiz({ questions = [], showAll = false, hideProgress = false }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [viewMode, setViewMode] = useState(showAll ? 'all' : 'single');
  const [answers, setAnswers] = useState({}); // Guardar respuestas por índice de pregunta

  const handleAnswerChange = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleReset = (questionIndex) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionIndex];
      return newAnswers;
    });
  };

  if (questions.length === 0) {
    return (
      <div className="p-6 rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-slate-50 dark:bg-slate-900/20">
        <p className="text-amber-800 dark:text-amber-300">No hay preguntas disponibles.</p>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const goToNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'single' ? 'all' : 'single');
  };

  // Vista de todas las preguntas
  if (viewMode === 'all') {
    return (
      <div className="space-y-6">
        {/* Header con controles */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-(--color-primary)/5 dark:bg-slate-800 border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              Cuestionario completo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalQuestions} pregunta{totalQuestions !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={toggleViewMode}
            className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-700 text-(--color-primary) dark:text-(--color-primary-dark) border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 font-medium hover:bg-(--color-primary)/5 dark:hover:bg-slate-600 transition-colors"
          >
            Vista una por una
          </button>
        </div>

        {/* Todas las preguntas */}
        {questions.map((q, index) => (
          <div key={index}>
            <div className="mb-2 text-sm font-semibold text-(--color-primary) dark:text-(--color-primary-dark)">
              Pregunta {index + 1} de {totalQuestions}
            </div>
            <MCQControlled
              questionId={`quiz-all-q${index}`}
              question={q.question}
              options={q.options}
              correctIndex={q.correctIndex}
              feedback={q.feedback}
              answer={answers[index] ?? null}
              onChange={(answerIndex) => handleAnswerChange(index, answerIndex)}
              onReset={() => handleReset(index)}
            />
          </div>
        ))}
      </div>
    );
  }

  // Vista individual con navegación
  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Indicador de progreso */}
      {!hideProgress && (
        <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-(--color-primary)/5 dark:bg-slate-800 border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl">📝</span>
            <div>
              <p className="font-bold text-sm md:text-base text-gray-900 dark:text-gray-100">
                Pregunta {currentQuestion + 1} de {totalQuestions}
              </p>
              <div className="flex gap-1 mt-1">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestion(i)}
                    className={`w-6 md:w-8 h-1.5 md:h-2 rounded-full transition-all ${
                      i === currentQuestion
                        ? 'bg-(--color-primary) dark:bg-(--color-primary-dark) w-8 md:w-12'
                        : answers[i] !== undefined
                        ? 'bg-green-400 dark:bg-green-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={`Ir a pregunta ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          {totalQuestions > 1 && (
            <button
              onClick={toggleViewMode}
              className="px-3 py-1.5 text-xs md:text-sm rounded-lg bg-white dark:bg-slate-700 text-(--color-primary) dark:text-(--color-primary-dark) border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 font-medium hover:bg-(--color-primary)/5 dark:hover:bg-slate-600 transition-colors"
            >
              Ver todas
            </button>
          )}
        </div>
      )}

      {/* Pregunta actual */}
      <MCQControlled
        questionId={`quiz-single-q${currentQuestion}`}
        question={currentQ.question}
        options={currentQ.options}
        correctIndex={currentQ.correctIndex}
        feedback={currentQ.feedback}
        answer={answers[currentQuestion] ?? null}
        onChange={(answerIndex) => handleAnswerChange(currentQuestion, answerIndex)}
        onReset={() => handleReset(currentQuestion)}
      />

      {/* Navegación */}
      {totalQuestions > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={goToPrevious}
            disabled={isFirstQuestion}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isFirstQuestion
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-(--color-primary)/10 dark:bg-(--color-primary-dark)/20 text-(--color-primary) dark:text-(--color-primary-dark) hover:bg-(--color-primary)/20 dark:hover:bg-(--color-primary-dark)/30 hover:scale-105 dark:border dark:border-(--color-primary-dark)/40'
            }`}
          >
            <span>←</span>
            <span>Anterior</span>
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {currentQuestion + 1} / {totalQuestions}
          </div>

          <button
            onClick={goToNext}
            disabled={isLastQuestion}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isLastQuestion
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-(--color-primary) dark:bg-(--color-primary-dark)/80 text-white dark:text-white hover:bg-(--color-primary)/90 dark:hover:bg-(--color-primary-dark) hover:scale-105 dark:border dark:border-(--color-primary-dark)'
            }`}
          >
            <span>Siguiente</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
