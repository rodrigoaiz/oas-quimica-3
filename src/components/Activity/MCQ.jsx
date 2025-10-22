import { useId, useState } from 'react';
export default function MCQ({ question, options = [], correctIndex = 0, feedback = {} }) {
  const name = useId();
  const [answer, setAnswer] = useState(null);
  const isCorrect = answer === correctIndex;
  return (
    <div className="card">
      <p className="font-medium">{question}</p>
      <fieldset className="mt-3 space-y-2">
        <legend className="sr-only">Opciones</legend>
        {options.map((opt, i) => (
          <label key={i} className="flex items-center gap-2">
            <input type="radio" name={name} onChange={() => setAnswer(i)} aria-describedby={answer!==null?`fb-${name}`:undefined} />
            <span>{opt}</span>
          </label>
        ))}
      </fieldset>
      {answer !== null && (
        <div id={`fb-${name}`} className={`mt-3 text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {isCorrect ? (feedback.correct || '¡Correcto!') : (feedback.incorrect || 'Revisa tu respuesta.')}
        </div>
      )}
    </div>
  );
}
