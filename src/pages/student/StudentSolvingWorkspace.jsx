import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Toast from "../../components/Toast";
import { getOnlineWorkspaceAssessments } from "../../i18n/studentDataDe";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import { CheckIcon, CalculatorIcon, StarIcon, LightbulbIcon } from "../../components/StudentIcons";
import {
  clearWorkspaceSubmission,
  getWorkspaceSubmissions,
  nowIsoTimestamp,
  saveWorkspaceSubmission,
} from "../../utils/studentStore";
import "../../styles/student.css";
import "../../styles/student-workspace.css";

function isQuestionAnswered(question, value) {
  if (question.inputType === "text") {
    return Boolean(String(value || "").trim());
  }
  return Number.isInteger(value);
}

export default function StudentSolvingWorkspace() {
  const { assessmentId } = useParams();
  const { lang, tr } = useLanguage();
  const onlineWorkspaceAssessments = getOnlineWorkspaceAssessments(lang);
  const assessment =
    onlineWorkspaceAssessments[assessmentId] || onlineWorkspaceAssessments["assess-1"];
  const questions = assessment.questions;
  const savedSubmission = getWorkspaceSubmissions()[assessment.id];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(() => savedSubmission?.answers || {});
  const [markedHard, setMarkedHard] = useState(() => savedSubmission?.markedHard || {});
  const [questionTimes, setQuestionTimes] = useState(
    () =>
      savedSubmission?.questionTimes ||
      questions.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {})
  );
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scratchpadNote, setScratchpadNote] = useState("");
  const [calcDisplay, setCalcDisplay] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(() => Boolean(savedSubmission));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const confirmRef = useRef(null);
  const summaryRef = useRef(null);
  const questionRef = useRef(null);
  const toolsToggleRef = useRef(null);
  const toolsCloseRef = useRef(null);
  const activeQuestion = questions[currentQuestionIndex];
  const assessmentTypeLabel = translateValue(assessment.type, lang);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setQuestionTimes((prev) => ({
        ...prev,
        [activeQuestion.id]: (prev[activeQuestion.id] || 0) + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuestion.id, isSubmitted]);

  useEffect(() => {
    if (isConfirmOpen) confirmRef.current.showModal();
    else confirmRef.current.close();
  }, [isConfirmOpen]);

  useEffect(() => {
    if (isSubmitted) summaryRef.current?.focus();
  }, [isSubmitted]);

  useEffect(() => {
    if (isToolsOpen) toolsCloseRef.current?.focus({ preventScroll: true });
  }, [isToolsOpen]);

  const closeTools = () => {
    setIsToolsOpen(false);
    toolsToggleRef.current?.focus({ preventScroll: true });
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  const changeQuestion = (index) => {
    setCurrentQuestionIndex(index);
    requestAnimationFrame(() => questionRef.current?.focus());
  };

  const handleToggleHard = () => {
    const isNowHard = !markedHard[activeQuestion.id];
    setMarkedHard((prev) => ({ ...prev, [activeQuestion.id]: isNowHard }));
    if (isNowHard) {
      setToastMessage(
        tr(
          `Question ${activeQuestion.number} marked as hard. You can return to it before submitting.`,
          `Frage ${activeQuestion.number} als schwer markiert. Du kannst vor dem Abgeben darauf zurückkommen.`
        )
      );
    }
  };

  const hardCount = Object.values(markedHard).filter(Boolean).length;
  const answeredCount = questions.filter((q) => isQuestionAnswered(q, answers[q.id])).length;

  const handleSubmit = () => {
    saveWorkspaceSubmission(assessment.id, {
      answers,
      markedHard,
      questionTimes,
      answeredCount,
      totalQuestions: questions.length,
      submittedAt: nowIsoTimestamp(),
      title: assessment.title,
      teacher: assessment.teacher,
    });
    setIsConfirmOpen(false);
    setIsSubmitted(true);
    setIsToolsOpen(false);
    setToastMessage(null);
  };

  const handlePracticeAgain = () => {
    clearWorkspaceSubmission(assessment.id);
    setAnswers({});
    setMarkedHard({});
    setQuestionTimes(questions.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {}));
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
  };

  const handleCalcClick = (val) => {
    if (val === "C") setCalcDisplay("");
    else if (val === "=") {
      try {
        const sanitized = calcDisplay.replace(/[^0-9+\-*/.]/g, "");
        if (sanitized) {
          const result = new Function(`return (${sanitized})`)();
          setCalcDisplay(String(result ?? ""));
        }
      } catch {
        setCalcDisplay(tr("Error", "Fehler"));
      }
    } else {
      setCalcDisplay((prev) => prev + val);
    }
  };

  return (
    <div className="student-page-wrapper student-themed-page">
      <Header role="student" />
      <div className="student-workspace">
      <main className="student-container">
        <div className="workspace-heading">
          <div className="workspace-heading-copy">
            <p className="workspace-meta">{assessment.subject} · {tr("Online", "Online-")}{assessmentTypeLabel.toLowerCase()}</p>
            <h1>{assessment.title}</h1>
            <p className="workspace-description">{assessment.instructions}</p>
            <p className="workspace-meta">{questions.length} {tr("questions", "Fragen")} · {assessment.durationMinutes} {tr("minutes", "Minuten")} · {assessment.teacher}</p>
          </div>
          {!isSubmitted && (
            <div className="workspace-heading-actions">
              <div className="workspace-timer">
                <span>{tr("Time on this question", "Zeit bei dieser Frage")}</span>
                <strong>{formatTime(questionTimes[activeQuestion.id] || 0)}</strong>
              </div>
              <button
                ref={toolsToggleRef}
                type="button"
                onClick={() => isToolsOpen ? closeTools() : setIsToolsOpen(true)}
                className="btn-secondary"
                aria-expanded={isToolsOpen}
                aria-controls="workspace-tools"
              >
                <CalculatorIcon className="w-5 h-5" />
                {isToolsOpen ? tr("Hide tools", "Hilfsmittel ausblenden") : tr("Open tools", "Hilfsmittel öffnen")}
              </button>
            </div>
          )}
        </div>

        {isToolsOpen && (
          <aside
            id="workspace-tools"
            className="workspace-panel workspace-tools"
            aria-labelledby="workspace-tools-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeTools();
              }
            }}
          >
            <div className="workspace-tools-heading">
              <h2 id="workspace-tools-title">{tr("Your tools", "Deine Hilfsmittel")}</h2>
              <button ref={toolsCloseRef} type="button" className="workspace-tools-close" aria-label={tr("Close tools", "Hilfsmittel schließen")} onClick={closeTools}>×</button>
            </div>
            <div className="workspace-tools-grid">
              <div className="workspace-calculator">
                <h3>{tr("Calculator", "Taschenrechner")}</h3>
                <output className="workspace-calculator-display" aria-label={tr("Calculator result", "Ergebnis Taschenrechner")} aria-live="polite">
                  {calcDisplay || "0"}
                </output>
                <div className="workspace-calculator-keys">
                  {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", "C", "=", "+"].map((btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleCalcClick(btn)}
                      className={btn === "=" ? "workspace-calculate" : ""}
                      aria-label={{
                        "/": tr("Divide", "Teilen"),
                        "*": tr("Multiply", "Mal"),
                        "-": tr("Subtract", "Minus"),
                        "+": tr("Add", "Plus"),
                        "C": tr("Clear calculator", "Zurücksetzen"),
                        "=": tr("Equals", "Gleich"),
                      }[btn] || btn}
                    >
                      {{ "/": "÷", "*": "×", "-": "−" }[btn] || btn}
                    </button>
                  ))}
                </div>
              </div>
              <div className="workspace-scratchpad">
                <label htmlFor="workspace-notes">{tr("Scratchpad", "Notizfeld")}</label>
                <p id="workspace-notes-help" className="workspace-meta">{tr("Notes stay on this page until you leave or refresh.", "Notizen bleiben auf dieser Seite bis zum Verlassen oder Aktualisieren.")}</p>
                <textarea
                  id="workspace-notes"
                  aria-describedby="workspace-notes-help"
                  rows="6"
                  value={scratchpadNote}
                  onChange={(e) => setScratchpadNote(e.target.value)}
                  placeholder={tr("Write your working or notes here…", "Rechenwege oder Notizen hier eintragen …")}
                />
              </div>
            </div>
          </aside>
        )}

        {isSubmitted ? (
          <section className="workspace-panel workspace-summary" aria-labelledby="workspace-summary-title">
            <div className="workspace-summary-heading">
              <span className="workspace-summary-check"><CheckIcon className="w-6 h-6" /></span>
              <div>
                <h2 id="workspace-summary-title" ref={summaryRef} tabIndex={-1}>{tr("Assessment complete", "Bearbeitung abgeschlossen")}</h2>
                <p>{tr(`${answeredCount} of ${questions.length} answered · ${hardCount} marked as hard`, `${answeredCount} von ${questions.length} beantwortet · ${hardCount} als schwer markiert`)}</p>
              </div>
            </div>
            <p className="workspace-demo-note">{tr(`Saved in your browser: your answers, hard-question marks, and per-question timings are recorded for ${assessment.teacher}'s review and updated on your dashboard.`, `Im Browser gespeichert: Deine Antworten, Markierungen und Bearbeitungszeiten sind für ${assessment.teacher} hinterlegt und auf deiner Übersicht aktualisiert.`)}</p>
            <h3>{tr("Your answers and time", "Deine Antworten und Zeiten")}</h3>
            <ul className="workspace-review-list">
              {questions.map((q) => {
                const chosenValue = answers[q.id];
                const chosenText =
                  q.inputType === "text"
                    ? String(chosenValue || "").trim()
                    : Number.isInteger(chosenValue)
                    ? q.options[chosenValue]
                    : null;
                return (
                  <li key={q.id}>
                    <div>
                      <h4>{tr(`Question ${q.number}`, `Frage ${q.number}`)} · {q.topic}</h4>
                      <p>{chosenText || tr("Not answered", "Nicht beantwortet")}</p>
                      {markedHard[q.id] && <span className="workspace-hard-status"><StarIcon className="w-4 h-4" /> {tr("Marked as hard", "Als schwer markiert")}</span>}
                    </div>
                    <span className="workspace-review-time">{formatTime(questionTimes[q.id] || 0)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="workspace-summary-actions">
              <Link to="/student" className="btn-primary">{tr("Return to dashboard", "Zurück zur Übersicht")}</Link>
              <Link to="/student/teachers" className="btn-secondary">{tr("Message a teacher", "Lehrkraft schreiben")}</Link>
              <button type="button" onClick={handlePracticeAgain} className="btn-secondary">
                {tr("Reset & try again", "Zurücksetzen & neu üben")}
              </button>
            </div>
          </section>
        ) : (
          <section className="workspace-panel workspace-question" aria-labelledby="workspace-question-title">
            <div className="workspace-question-toolbar">
              <nav className="workspace-question-nav" aria-label={tr("Assessment questions", "Aufgabennavigation")}>
                <span>{tr("Questions", "Fragen")}</span>
                <div className="workspace-question-numbers">
                  {questions.map((q, idx) => {
                    const answered = isQuestionAnswered(q, answers[q.id]);
                    return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => changeQuestion(idx)}
                      className="workspace-question-number"
                      aria-current={idx === currentQuestionIndex ? "step" : undefined}
                      aria-label={tr(
                        `Question ${q.number}, ${answered ? "answered" : "not answered"}${markedHard[q.id] ? ", marked as hard" : ""}`,
                        `Frage ${q.number}, ${answered ? "beantwortet" : "nicht beantwortet"}${markedHard[q.id] ? ", als schwer markiert" : ""}`
                      )}
                    >
                      {q.number}
                      {answered && <CheckIcon className="workspace-answered-icon" />}
                      {markedHard[q.id] && <StarIcon className="workspace-hard-icon" />}
                    </button>
                    );
                  })}
                </div>
              </nav>
              <button
                type="button"
                onClick={handleToggleHard}
                className="btn-secondary workspace-mark-hard"
                aria-pressed={Boolean(markedHard[activeQuestion.id])}
              >
                <StarIcon className="w-5 h-5" />
                {markedHard[activeQuestion.id] ? tr("Marked as hard", "Als schwer markiert") : tr("Mark as hard", "Als schwer markieren")}
              </button>
            </div>

            <div className="workspace-question-content">
              <p className="workspace-meta">{tr(`Question ${activeQuestion.number} of ${questions.length}`, `Frage ${activeQuestion.number} von ${questions.length}`)} · {activeQuestion.topic}</p>
              <h2 id="workspace-question-title" ref={questionRef} tabIndex={-1}>{activeQuestion.prompt}</h2>
              {activeQuestion.hint && (
                <div className="workspace-hint">
                  <LightbulbIcon className="w-5 h-5" />
                  <p><strong>{tr("Helpful tip:", "Hilfreicher Tipp:")}</strong> {activeQuestion.hint}</p>
                </div>
              )}
              {activeQuestion.inputType === "text" ? (
                <div className="workspace-text-answer">
                  <label htmlFor={`workspace-answer-${activeQuestion.id}`}>
                    {tr("Your written answer", "Deine schriftliche Antwort")}
                  </label>
                  <textarea
                    id={`workspace-answer-${activeQuestion.id}`}
                    rows={4}
                    value={typeof answers[activeQuestion.id] === "string" ? answers[activeQuestion.id] : ""}
                    onChange={(event) =>
                      setAnswers((prev) => ({ ...prev, [activeQuestion.id]: event.target.value }))
                    }
                    placeholder={activeQuestion.placeholder || tr("Write your answer here…", "Schreibe deine Antwort hier …")}
                  />
                </div>
              ) : (
                <fieldset className="workspace-options" key={activeQuestion.id}>
                  <legend className="sr-only">{tr(`Choose one answer for question ${activeQuestion.number}`, `Wähle eine Antwort für Frage ${activeQuestion.number}`)}</legend>
                  {activeQuestion.options.map((opt, i) => (
                    <label key={i} className="workspace-option">
                      <span className="workspace-option-letter" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                      <span>{opt}</span>
                      <input
                        type="radio"
                        name={`answer-${activeQuestion.id}`}
                        value={i}
                        checked={answers[activeQuestion.id] === i}
                        onChange={() => setAnswers((prev) => ({ ...prev, [activeQuestion.id]: i }))}
                      />
                    </label>
                  ))}
                </fieldset>
              )}
            </div>

            <div className="workspace-question-footer">
              <div className="workspace-step-actions">
                <button type="button" disabled={currentQuestionIndex === 0} onClick={() => changeQuestion(currentQuestionIndex - 1)} className="btn-secondary">← {tr("Previous", "Zurück")}</button>
                <button type="button" disabled={currentQuestionIndex === questions.length - 1} onClick={() => changeQuestion(currentQuestionIndex + 1)} className="btn-secondary">{tr("Next", "Weiter")} →</button>
              </div>
              <div className="workspace-submit-actions">
                <span className="workspace-meta" role="status">{tr(`${answeredCount} of ${questions.length} answered`, `${answeredCount} von ${questions.length} beantwortet`)}</span>
                <button type="button" onClick={() => setIsConfirmOpen(true)} className="btn-primary">{tr(`Submit ${assessmentTypeLabel.toLowerCase()}`, `${assessmentTypeLabel} abgeben`)}</button>
              </div>
            </div>
          </section>
        )}
      </main>

      <dialog
        ref={confirmRef}
        className="workspace-confirm"
        aria-labelledby="workspace-confirm-title"
        aria-describedby="workspace-confirm-description"
        onCancel={() => setIsConfirmOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) setIsConfirmOpen(false); }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const [cancel, confirm] = event.currentTarget.querySelectorAll("button");
          if (event.shiftKey && document.activeElement === cancel) {
            event.preventDefault();
            confirm.focus();
          } else if (!event.shiftKey && document.activeElement === confirm) {
            event.preventDefault();
            cancel.focus();
          }
        }}
      >
        <div className="workspace-confirm-content">
          <h2 id="workspace-confirm-title">{tr(`Submit ${assessment.title}?`, `„${assessment.title}“ abgeben?`)}</h2>
          <p id="workspace-confirm-description">
            {tr(`You have answered ${answeredCount} of ${questions.length} questions.`, `Du hast ${answeredCount} von ${questions.length} Fragen beantwortet.`)}
            {answeredCount < questions.length && tr(` ${questions.length - answeredCount} will be left unanswered.`, ` ${questions.length - answeredCount} bleiben unbeantwortet.`)}
            {hardCount > 0 && tr(` ${hardCount} marked as hard.`, ` ${hardCount} als schwer markiert.`)}
            {" "}{tr("Your answers, marked hard questions, and question timings will be saved and shown on your dashboard.", "Deine Antworten, Markierungen und Bearbeitungszeiten werden gespeichert und auf deiner Übersicht angezeigt.")}
          </p>
          <div className="workspace-confirm-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsConfirmOpen(false)}>{tr("Keep working", "Weiterarbeiten")}</button>
            <button type="button" className="btn-primary" onClick={handleSubmit}>{tr(`Submit ${assessmentTypeLabel.toLowerCase()}`, `${assessmentTypeLabel} abgeben`)}</button>
          </div>
        </div>
      </dialog>
      <div className="workspace-notice" role="status">
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
      </div>
    </div>
  );
}
