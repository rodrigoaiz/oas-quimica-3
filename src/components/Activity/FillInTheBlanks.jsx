import { useState, useEffect } from 'react';

/**
 * FillInBlanks - Componente para completar oraciones arrastrando términos
 * 
 * @param {string} question - Pregunta o instrucción principal
 * @param {Array} sentences - Array de objetos con { text, blanks: [{ placeholder, correctAnswer }] }
 * @param {Array} wordBank - Banco de palabras para arrastrar
 * @param {Object} feedback - { correct, incorrect }
 * @param {boolean} showWordBank - Mostrar banco de palabras
 * @param {boolean} disableOnMobile - Deshabilitar en dispositivos móviles/táctiles (default: false)
 * @param {string} mobileMessage - Mensaje a mostrar en móviles cuando está deshabilitado
 */
export default function FillInBlanks({ 
  question = "", 
  sentences = [], 
  wordBank = [],
  feedback = { correct: "¡Correcto!", incorrect: "Inténtalo de nuevo" },
  showWordBank = true,
  disableOnMobile = false,
  mobileMessage = "Este ejercicio interactivo requiere un dispositivo de escritorio con mouse para funcionar correctamente."
}) {
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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

  const handleDragStart = (e, word) => {
    setDraggedWord(word);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e, sentenceIndex, blankIndex) => {
    e.preventDefault();
    if (draggedWord) {
      const key = `${sentenceIndex}-${blankIndex}`;
      setAnswers(prev => ({
        ...prev,
        [key]: draggedWord
      }));
      setDraggedWord(null);
    }
  };

  const handleRemoveAnswer = (sentenceIndex, blankIndex) => {
    const key = `${sentenceIndex}-${blankIndex}`;
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[key];
      return newAnswers;
    });
  };

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .trim();
  };

  const isAnswerCorrect = (sentenceIndex, blankIndex) => {
    if (!showFeedback) return null;
    const key = `${sentenceIndex}-${blankIndex}`;
    const userAnswer = normalizeText(answers[key] || '');
    const blank = sentences[sentenceIndex]?.blanks[blankIndex];
    if (!blank) return null;
    const correctAnswers = Array.isArray(blank.correctAnswer) 
      ? blank.correctAnswer.map(ans => normalizeText(ans))
      : [normalizeText(blank.correctAnswer)];
    return correctAnswers.includes(userAnswer);
  };

  const handleCheck = () => {
    let allCorrect = true;
    
    sentences.forEach((sentence, sentenceIndex) => {
      sentence.blanks.forEach((blank, blankIndex) => {
        const key = `${sentenceIndex}-${blankIndex}`;
        const userAnswer = normalizeText(answers[key] || '');
        const correctAnswers = Array.isArray(blank.correctAnswer) 
          ? blank.correctAnswer.map(ans => normalizeText(ans))
          : [normalizeText(blank.correctAnswer)];
        
        console.log(`Comparando: "${userAnswer}" con`, correctAnswers, '→', correctAnswers.includes(userAnswer));
        
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
    let blankIndex = 0;
    const parts = [];
    let lastIndex = 0;

    // Encontrar todos los blanks en el texto
    sentence.blanks.forEach((blank) => {
      const placeholderText = blank.placeholder || 'Arrastra aquí';
      const index = sentence.text.indexOf('_______________', lastIndex);
      
      if (index !== -1) {
        // Agregar texto antes del blank
        if (index > lastIndex) {
          parts.push({
            type: 'text',
            content: sentence.text.substring(lastIndex, index)
          });
        }
        
        // Agregar el blank
        parts.push({
          type: 'blank',
          blankIndex: blankIndex,
          placeholder: placeholderText
        });
        
        lastIndex = index + 15; // Longitud de '_______________'
        blankIndex++;
      }
    });

    // Agregar texto restante
    if (lastIndex < sentence.text.length) {
      parts.push({
        type: 'text',
        content: sentence.text.substring(lastIndex)
      });
    }

    return parts.map((part, partIndex) => {
      if (part.type === 'text') {
        return <span key={partIndex}>{part.content}</span>;
      } else {
        const key = `${sentenceIndex}-${part.blankIndex}`;
        const answer = answers[key];

        const isCorrect = isAnswerCorrect(sentenceIndex, part.blankIndex);
        const showValidation = showFeedback && answer;
        
        return (
          <span
            key={partIndex}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, sentenceIndex, part.blankIndex)}
            className={`inline-flex items-center mx-1 px-3 py-1.5 min-w-[140px] border-2 rounded-lg transition-all ${
              showValidation
                ? isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600 border-solid'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600 border-solid'
                : answer
                ? 'bg-(--color-primary)/10 dark:bg-(--color-primary-dark)/20 border-(--color-primary) dark:border-(--color-primary-dark) border-dashed'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-(--color-primary)/50 dark:hover:border-(--color-primary-dark)/50 border-dashed'
            }`}
          >
            {answer ? (
              <>
                <span className={`flex-1 text-center font-medium ${
                  showValidation
                    ? isCorrect
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                    : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {answer}
                </span>
                {showValidation ? (
                  <span className={`ml-2 font-bold ${
                    isCorrect
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                ) : (
                  <button
                    onClick={() => handleRemoveAnswer(sentenceIndex, part.blankIndex)}
                    className="ml-2 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                    aria-label="Eliminar respuesta"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </>
            ) : (
              <span className="flex-1 text-center text-sm text-slate-400 dark:text-slate-500">
                {part.placeholder}
              </span>
            )}
          </span>
        );
      }
    });
  };

  if (!mounted) {
    return (
      <div className="p-6 rounded-xl border-2 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 bg-slate-50 dark:bg-slate-900/20">
        <p className="text-slate-600 dark:text-slate-400">Cargando actividad...</p>
      </div>
    );
  }

  // Mostrar mensaje si está deshabilitado en móvil
  if (disableOnMobile && isTouchDevice) {
    return (
      <div className="p-6 rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Dispositivo no compatible</p>
            <p className="text-amber-700 dark:text-amber-300 text-sm">{mobileMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalBlanks = sentences.reduce((sum, s) => sum + s.blanks.length, 0);
  const answeredBlanks = Object.keys(answers).length;

  return (
    <div className="p-6 rounded-xl border-2 my-5 md:my-10 border-(--color-primary)/20 dark:border-(--color-primary-dark)/50 bg-slate-50 dark:bg-slate-900/20 space-y-6">
      {/* Pregunta */}
      {question && (
        <div className="font-bold text-lg text-slate-800 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: question }} />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Oraciones con espacios en blanco */}
        <div className="flex-1 space-y-4">
          {sentences.map((sentence, sentenceIndex) => (
            <div key={sentenceIndex} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                {renderSentenceWithBlanks(sentence, sentenceIndex)}
              </p>
            </div>
          ))}
        </div>

        {/* Banco de palabras - columna derecha */}
        {showWordBank && wordBank.length > 0 && (
          <div className="lg:w-64 shrink-0">
            <div className="sticky top-4 p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-(--color-primary)/30 dark:border-(--color-primary-dark)/50 shadow-sm">
              <h4 className="text-sm font-bold text-(--color-primary) dark:text-(--color-primary-dark) mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Términos disponibles
              </h4>
              <div className="flex flex-col gap-2">
                {wordBank.map((word, index) => (
                  <div 
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, word)}
                    className="px-3 py-2 bg-(--color-primary)/10 dark:bg-(--color-primary-dark)/20 text-(--color-primary) dark:text-(--color-primary-dark) text-sm font-medium rounded-lg border border-(--color-primary)/30 dark:border-(--color-primary-dark)/40 cursor-move hover:bg-(--color-primary)/20 dark:hover:bg-(--color-primary-dark)/30 hover:scale-105 transition-all shadow-sm text-center"
                  >
                    {word}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                Arrastra los términos a los espacios
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {answeredBlanks} de {totalBlanks} completados
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Reiniciar
          </button>
          <button
            onClick={handleCheck}
            disabled={answeredBlanks < totalBlanks}
            className="px-4 py-2 rounded-lg font-medium bg-(--color-primary) dark:bg-(--color-primary-dark) text-white hover:bg-(--color-primary)/90 dark:hover:bg-(--color-primary-dark)/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Verificar
          </button>
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`p-4 rounded-lg border-2 ${
          isCorrect
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-700'
            : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-700'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white text-sm font-bold">
                {isCorrect ? '✓' : '✗'}
              </span>
            </div>
            <p className={`flex-1 font-medium ${
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
