import { useState } from 'react';

export default function FillInBlanks({ 
  question = "", 
  sentences = [], 
  wordBank = [],
  feedback = { correct: "¡Correcto!", incorrect: "Inténtalo de nuevo" },
  showWordBank = true 
}) {
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleInputChange = (sentenceIndex, blankIndex, value) => {
    const key = `${sentenceIndex}-${blankIndex}`;
    setAnswers(prev => ({
      ...prev,
      [key]: value.trim()
    }));
  };

  const handleCheck = () => {
    let allCorrect = true;
    
    sentences.forEach((sentence, sentenceIndex) => {
      sentence.blanks.forEach((blank, blankIndex) => {
        const key = `${sentenceIndex}-${blankIndex}`;
        const userAnswer = answers[key]?.toLowerCase() || '';
        const correctAnswers = Array.isArray(blank.correctAnswer) 
          ? blank.correctAnswer.map(ans => ans.toLowerCase())
          : [blank.correctAnswer.toLowerCase()];
        
        if (!correctAnswers.includes(userAnswer)) {
          allCorrect = false;
        }
      });
    });

    setIsCorrect(allCorrect);
    setShowFeedback(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const renderSentenceWithBlanks = (sentence, sentenceIndex) => {
    const parts = sentence.text.split(/__(.*?)__/g);
    let blankIndex = 0;

    return parts.map((part, partIndex) => {
      if (partIndex % 2 === 0) {
        return <span key={partIndex}>{part}</span>;
      } else {
        const currentBlank = sentence.blanks[blankIndex];
        const key = `${sentenceIndex}-${blankIndex}`;
        blankIndex++;

        return (
          <input
            key={partIndex}
            type="text"
            value={answers[key] || ''}
            onChange={(e) => handleInputChange(sentenceIndex, blankIndex - 1, e.target.value)}
            placeholder={currentBlank?.placeholder || 'Escribe aquí'}
            className="mx-2 px-3 py-2 border-2 border-dashed border-primary-400 dark:border-primary-500 focus:border-primary-600 dark:focus:border-primary-400 focus:border-solid outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-lg shadow-sm focus:shadow-md transition-all duration-200 text-center"
            style={{ 
              width: `${Math.max(currentBlank?.width || 120, 100)}px`,
              minHeight: '42px'
            }}
          />
        );
      }
    });
  };

  return (
    <div className="activity-container">
      {/* Pregunta/Instrucciones */}
      <div className="mb-6">
        <h3 className="activity-question" dangerouslySetInnerHTML={{ __html: question }} />
      </div>

      {/* Banco de palabras */}
      {showWordBank && wordBank.length > 0 && (
        <div className="mb-6 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-600">
          <h4 className="text-sm font-semibold text-teal-800 dark:text-teal-200 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Términos disponibles:
          </h4>
          <div className="flex flex-wrap gap-2">
            {wordBank.map((word, index) => (
              <span 
                key={index}
                className="px-3 py-2 bg-teal-100 dark:bg-teal-800/50 text-teal-800 dark:text-teal-200 text-sm font-medium rounded-full border border-teal-300 dark:border-teal-600 shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                "{word}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Oraciones con espacios en blanco */}
      <div className="space-y-4 mb-8">
        {sentences.map((sentence, sentenceIndex) => (
          <div key={sentenceIndex} className="p-5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed text-base">
              {renderSentenceWithBlanks(sentence, sentenceIndex)}
            </p>
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className="activity-buttons">
        <button
          onClick={handleCheck}
          disabled={Object.keys(answers).length === 0}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verificar respuestas
        </button>
        <button
          onClick={handleReset}
          className="btn-secondary"
        >
          Reiniciar
        </button>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`activity-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
          <div className="flex items-start">
            <div className={`feedback-icon ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
              <span className="text-white text-sm font-bold">
                {isCorrect ? '✓' : '✗'}
              </span>
            </div>
            <p className={`feedback-text ${
              isCorrect 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {isCorrect ? feedback.correct : feedback.incorrect}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}