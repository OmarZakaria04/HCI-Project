import { useState } from "react";

export default function QuickPracticeWidget({ practice, tr }) {
  const [selected, setSelected] = useState(null);
  if (!practice) return null;

  const isCorrect = selected !== null && selected === practice.correctOption;

  return (
    <div className="quick-practice-box">
      <p className="quick-practice-prompt">{practice.prompt}</p>
      <div className="quick-practice-options" role="group" aria-label={practice.topic || tr("Quick practice", "Kurze Übung")}>
        {(practice.options ?? []).map((option) => {
          const picked = selected === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={picked}
              className={`quick-practice-opt${picked ? (option === practice.correctOption ? " is-right" : " is-try") : ""}`}
              onClick={() => setSelected(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="quick-practice-feedback" role="status">
          {isCorrect
            ? practice.encouragement
            : tr("Good try! Have another go or ask your teacher below.", "Guter Versuch! Probiere es noch einmal oder frage deine Lehrkraft.")}
        </p>
      )}
    </div>
  );
}

