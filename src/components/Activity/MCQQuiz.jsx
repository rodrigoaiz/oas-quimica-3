import { useState } from 'react';
import MCQControlled from './MCQControlled.jsx';

/**
 * MCQQuiz - Componente para manejar múltiples preguntas de opción múltiple
 * 
 * @param {Object} props
 * @param {Array} props.questions - Array de objetos con: { question, options, correctIndex, feedback }
 * @param {boolean} props.showAll - Mostrar todas las preguntas a la vez (default: false)
 */
export default function MCQQuiz({ questions = [], showAll = false }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [viewMode, setViewMode] = useState(showAll ? 'all' : 'single');
  const [answers, setAnswers] = useState({}); // Guardar respuestas por índice de pregunta

  const handleAnswerChange = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  if (questions.length === 0) {
    return (
      <div className="p-6 rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
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
        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800">
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
            className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-700 font-medium hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors"
          >
            Vista una por una
          </button>
        </div>

        {/* Todas las preguntas */}
        {questions.map((q, index) => (
          <div key={index}>
            <div className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
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
      <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-blue-50 dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800">
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
                      ? 'bg-blue-600 dark:bg-blue-400 w-8 md:w-12'
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
            className="px-3 py-1.5 text-xs md:text-sm rounded-lg bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-700 font-medium hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors"
          >
            Ver todas
          </button>
        )}
      </div>

      {/* Pregunta actual */}
      <MCQControlled
        questionId={`quiz-single-q${currentQuestion}`}
        question={currentQ.question}
        options={currentQ.options}
        correctIndex={currentQ.correctIndex}
        feedback={currentQ.feedback}
        answer={answers[currentQuestion] ?? null}
        onChange={(answerIndex) => handleAnswerChange(currentQuestion, answerIndex)}
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
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:scale-105'
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
                : 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-105'
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
