import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Toast from "../../components/Toast";
import { onlineWorkspaceAssessments } from "../../data/studentData";
import { CheckIcon, CalculatorIcon, StarIcon, LightbulbIcon } from "../../components/StudentIcons";
import "../../styles/student.css";
import "../../styles/student-workspace.css";

export default function StudentSolvingWorkspace() {
  const { assessmentId } = useParams();
  const assessment =
    onlineWorkspaceAssessments[assessmentId] || onlineWorkspaceAssessments["assess-1"];
  const questions = assessment.questions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedHard, setMarkedHard] = useState({});
  const [questionTimes, setQuestionTimes] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {})
  );
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scratchpadNote, setScratchpadNote] = useState("");
  const [calcDisplay, setCalcDisplay] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const confirmRef = useRef(null);
  const summaryRef = useRef(null);
  const questionRef = useRef(null);
  const toolsToggleRef = useRef(null);
  const toolsCloseRef = useRef(null);
  const activeQuestion = questions[currentQuestionIndex];

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
      setToastMessage(`Question ${activeQuestion.number} marked as hard. You can return to it before submitting.`);
    }
  };

  const handleSubmit = () => {
    setIsConfirmOpen(false);
    setIsSubmitted(true);
    setIsToolsOpen(false);
    setToastMessage(null);
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
        setCalcDisplay("Error");
      }
    } else {
      setCalcDisplay((prev) => prev + val);
    }
  };

  const hardCount = Object.values(markedHard).filter(Boolean).length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="student-page-wrapper student-themed-page">
      <Header role="student" />
      <div className="student-workspace">
      <main className="student-container">
        <div className="workspace-heading">
          <div className="workspace-heading-copy">
            <p className="workspace-meta">{assessment.subject} · Online {assessment.type.toLowerCase()}</p>
            <h1>{assessment.title}</h1>
            <p className="workspace-description">{assessment.instructions}</p>
            <p className="workspace-meta">{questions.length} questions · {assessment.durationMinutes} minutes · {assessment.teacher}</p>
          </div>
          {!isSubmitted && (
            <div className="workspace-heading-actions">
              <div className="workspace-timer">
                <span>Time on this question</span>
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
                {isToolsOpen ? "Hide tools" : "Open tools"}
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
              <h2 id="workspace-tools-title">Your tools</h2>
              <button ref={toolsCloseRef} type="button" className="workspace-tools-close" aria-label="Close tools" onClick={closeTools}>×</button>
            </div>
            <div className="workspace-tools-grid">
              <div className="workspace-calculator">
                <h3>Calculator</h3>
                <output className="workspace-calculator-display" aria-label="Calculator result" aria-live="polite">
                  {calcDisplay || "0"}
                </output>
                <div className="workspace-calculator-keys">
                  {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", "C", "=", "+"].map((btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleCalcClick(btn)}
                      className={btn === "=" ? "workspace-calculate" : ""}
                      aria-label={{ "/": "Divide", "*": "Multiply", "-": "Subtract", "+": "Add", "C": "Clear calculator", "=": "Equals" }[btn] || btn}
                    >
                      {{ "/": "÷", "*": "×", "-": "−" }[btn] || btn}
                    </button>
                  ))}
                </div>
              </div>
              <div className="workspace-scratchpad">
                <label htmlFor="workspace-notes">Scratchpad</label>
                <p id="workspace-notes-help" className="workspace-meta">Notes stay on this page until you leave or refresh.</p>
                <textarea
                  id="workspace-notes"
                  aria-describedby="workspace-notes-help"
                  rows="6"
                  value={scratchpadNote}
                  onChange={(e) => setScratchpadNote(e.target.value)}
                  placeholder="Write your working or notes here…"
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
                <h2 id="workspace-summary-title" ref={summaryRef} tabIndex={-1}>Assessment complete</h2>
                <p>{answeredCount} of {questions.length} answered · {hardCount} marked as hard</p>
              </div>
            </div>
            <p className="workspace-demo-note">Demo only: your answers and timings are shown below for this visit. They are not sent to {assessment.teacher} and will reset when you leave or refresh.</p>
            <h3>Your answers and time</h3>
            <ul className="workspace-review-list">
              {questions.map((q) => (
                <li key={q.id}>
                  <div>
                    <h4>Question {q.number} · {q.topic}</h4>
                    <p>{answers[q.id] || "Not answered"}</p>
                    {markedHard[q.id] && <span className="workspace-hard-status"><StarIcon className="w-4 h-4" /> Marked as hard</span>}
                  </div>
                  <span className="workspace-review-time">{formatTime(questionTimes[q.id] || 0)}</span>
                </li>
              ))}
            </ul>
            <div className="workspace-summary-actions">
              <Link to="/student" className="btn-primary">Return to dashboard</Link>
              <Link to="/student/teachers" className="btn-secondary">Message a teacher</Link>
            </div>
          </section>
        ) : (
          <section className="workspace-panel workspace-question" aria-labelledby="workspace-question-title">
            <div className="workspace-question-toolbar">
              <nav className="workspace-question-nav" aria-label="Assessment questions">
                <span>Questions</span>
                <div className="workspace-question-numbers">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => changeQuestion(idx)}
                      className="workspace-question-number"
                      aria-current={idx === currentQuestionIndex ? "step" : undefined}
                      aria-label={`Question ${q.number}, ${answers[q.id] ? "answered" : "not answered"}${markedHard[q.id] ? ", marked as hard" : ""}`}
                    >
                      {q.number}
                      {answers[q.id] && <CheckIcon className="workspace-answered-icon" />}
                      {markedHard[q.id] && <StarIcon className="workspace-hard-icon" />}
                    </button>
                  ))}
                </div>
              </nav>
              <button
                type="button"
                onClick={handleToggleHard}
                className="btn-secondary workspace-mark-hard"
                aria-pressed={Boolean(markedHard[activeQuestion.id])}
              >
                <StarIcon className="w-5 h-5" />
                {markedHard[activeQuestion.id] ? "Marked as hard" : "Mark as hard"}
              </button>
            </div>

            <div className="workspace-question-content">
              <p className="workspace-meta">Question {activeQuestion.number} of {questions.length} · {activeQuestion.topic}</p>
              <h2 id="workspace-question-title" ref={questionRef} tabIndex={-1}>{activeQuestion.prompt}</h2>
              {activeQuestion.hint && (
                <div className="workspace-hint">
                  <LightbulbIcon className="w-5 h-5" />
                  <p><strong>Helpful tip:</strong> {activeQuestion.hint}</p>
                </div>
              )}
              <fieldset className="workspace-options" key={activeQuestion.id}>
                <legend className="sr-only">Choose one answer for question {activeQuestion.number}</legend>
                {activeQuestion.options.map((opt, i) => (
                  <label key={opt} className="workspace-option">
                    <span className="workspace-option-letter" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                    <input
                      type="radio"
                      name={`answer-${activeQuestion.id}`}
                      value={opt}
                      checked={answers[activeQuestion.id] === opt}
                      onChange={() => setAnswers((prev) => ({ ...prev, [activeQuestion.id]: opt }))}
                    />
                  </label>
                ))}
              </fieldset>
            </div>

            <div className="workspace-question-footer">
              <div className="workspace-step-actions">
                <button type="button" disabled={currentQuestionIndex === 0} onClick={() => changeQuestion(currentQuestionIndex - 1)} className="btn-secondary">← Previous</button>
                <button type="button" disabled={currentQuestionIndex === questions.length - 1} onClick={() => changeQuestion(currentQuestionIndex + 1)} className="btn-secondary">Next →</button>
              </div>
              <div className="workspace-submit-actions">
                <span className="workspace-meta" role="status">{answeredCount} of {questions.length} answered</span>
                <button type="button" onClick={() => setIsConfirmOpen(true)} className="btn-primary">Submit {assessment.type.toLowerCase()}</button>
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
          <h2 id="workspace-confirm-title">Submit {assessment.title}?</h2>
          <p id="workspace-confirm-description">
            You have answered {answeredCount} of {questions.length} questions.
            {answeredCount < questions.length && ` ${questions.length - answeredCount} will be left unanswered.`}
            {hardCount > 0 && ` ${hardCount} marked as hard.`}
            {" "}You can check your answers before finishing. This demo shows a summary on this page; it does not send your work to a teacher.
          </p>
          <div className="workspace-confirm-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsConfirmOpen(false)}>Keep working</button>
            <button type="button" className="btn-primary" onClick={handleSubmit}>Submit {assessment.type.toLowerCase()}</button>
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
