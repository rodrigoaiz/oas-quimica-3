import { useState } from 'react';
import MultiSelectControlled from './MultiSelectControlled.jsx';

/**
 * MultiSelectQuiz - Sistema de múltiples preguntas de selección múltiple con navegación
 * Permite navegar entre preguntas y mostrar todas a la vez
 */
export default function MultiSelectQuiz({ questions = [], viewMode: initialViewMode = 'single' }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [viewMode, setViewMode] = useState(initialViewMode);
  
  // Estado: { questionIndex: { selectedOptions: Set, submitted: boolean } }
  const [questionsState, setQuestionsState] = useState({});

  const handleSelectionChange = (questionIndex, newSet) => {
    setQuestionsState(prev => ({
      ...prev,
      [questionIndex]: {
        selectedOptions: newSet,
        submitted: prev[questionIndex]?.submitted || false
      }
    }));
  };

  const handleSubmit = (questionIndex) => {
    setQuestionsState(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        selectedOptions: prev[questionIndex]?.selectedOptions || new Set(),
        submitted: true
      }
    }));
  };

  const handleReset = (questionIndex) => {
    setQuestionsState(prev => ({
      ...prev,
      [questionIndex]: {
        selectedOptions: new Set(),
        submitted: false
      }
    }));
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getQuestionState = (index) => {
    return questionsState[index] || { selectedOptions: new Set(), submitted: false };
  };

  const isQuestionAnswered = (index) => {
    const state = getQuestionState(index);
    return state.submitted && state.selectedOptions.size > 0;
  };

  const isQuestionCorrect = (index) => {
    const state = getQuestionState(index);
    if (!state.submitted) return false;
    
    const correctSet = new Set(questions[index].correctIndexes || []);
    return state.selectedOptions.size === correctSet.size &&
      [...state.selectedOptions].every(i => correctSet.has(i));
  };

  if (questions.length === 0) {
    return (
      <div className="p-4 md:p-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700">
        <p className="text-amber-800 dark:text-amber-300">No hay preguntas disponibles.</p>
      </div>
    );
  }

  // Modo: mostrar todas las preguntas
  if (viewMode === 'all') {
    return (
      <div className="multiselect-quiz">
        {/* Botón para cambiar modo */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setViewMode('single')}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
          >
            Ver una por una
          </button>
        </div>

        {/* Todas las preguntas */}
        {questions.map((q, index) => {
          const state = getQuestionState(index);
          return (
            <div key={index} className="mb-6">
              <div className="mb-2 text-xs md:text-sm font-semibold text-purple-700 dark:text-purple-300">
                Pregunta {index + 1} de {questions.length}
              </div>
              <MultiSelectControlled
                questionId={`multiselect-quiz-${index}`}
                question={q.question}
                options={q.options}
                correctIndexes={q.correctIndexes}
                feedback={q.feedback}
                selectedOptions={state.selectedOptions}
                submitted={state.submitted}
                onChange={(newSet) => handleSelectionChange(index, newSet)}
                onSubmit={() => handleSubmit(index)}
                onReset={() => handleReset(index)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // Modo: mostrar una pregunta a la vez
  const currentQ = questions[currentQuestion];
  const currentState = getQuestionState(currentQuestion);

  return (
    <div className="multiselect-quiz">
      {/* Header con progreso */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs md:text-sm font-semibold text-purple-700 dark:text-purple-300">
          Pregunta {currentQuestion + 1} de {questions.length}
        </div>
        <button
          onClick={() => setViewMode('all')}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
        >
          Ver todas
        </button>
      </div>

      {/* Indicadores de progreso (puntos) */}
      {questions.length > 1 && (
        <div className="flex items-center justify-center gap-2 mb-4">
          {questions.map((_, index) => {
            const isActive = index === currentQuestion;
            const isAnswered = isQuestionAnswered(index);
            const isCorrect = isQuestionCorrect(index);
            
            let dotClasses = "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all cursor-pointer ";
            
            if (isActive) {
              dotClasses += "bg-purple-600 dark:bg-purple-400 ring-2 ring-purple-300 dark:ring-purple-600 scale-125";
            } else if (isAnswered) {
              if (isCorrect) {
                dotClasses += "bg-green-500 dark:bg-green-400";
              } else {
                dotClasses += "bg-amber-500 dark:bg-amber-400";
              }
            } else {
              dotClasses += "bg-gray-300 dark:bg-slate-600";
            }
            
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={dotClasses}
                aria-label={`Ir a pregunta ${index + 1}`}
              />
            );
          })}
        </div>
      )}

      {/* Pregunta actual */}
      <MultiSelectControlled
        questionId={`multiselect-quiz-${currentQuestion}`}
        question={currentQ.question}
        options={currentQ.options}
        correctIndexes={currentQ.correctIndexes}
        feedback={currentQ.feedback}
        selectedOptions={currentState.selectedOptions}
        submitted={currentState.submitted}
        onChange={(newSet) => handleSelectionChange(currentQuestion, newSet)}
        onSubmit={() => handleSubmit(currentQuestion)}
        onReset={() => handleReset(currentQuestion)}
      />

      {/* Navegación */}
      {questions.length > 1 && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm md:text-base transition-all ${
              currentQuestion === 0
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 hover:scale-[1.02]'
            }`}
          >
            ← Anterior
          </button>
          <button
            onClick={goToNext}
            disabled={currentQuestion === questions.length - 1}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm md:text-base transition-all ${
              currentQuestion === questions.length - 1
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 hover:scale-[1.02]'
            }`}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
