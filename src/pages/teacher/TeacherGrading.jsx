import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { papers, paperDetails } from "../../data/teacherData";
import submissionDate from "../../utils/submissionDate";
import "../../styles/teacher.css";
import "../../styles/teacher-grading.css";

// Used for papers that have no entry in paperDetails
const fallbackAnswers = [
  { q: 1, question: "15 × 8 = ?", text: "120", key: "120", confidence: 0.96, gap: "", mistake: "", tip: "" },
  { q: 2, question: "Simplify 6/8", text: "3/4", key: "3/4", confidence: 0.94, gap: "", mistake: "", tip: "" },
  { q: 3, question: "0.75 as a percentage", text: "75%", key: "75%", confidence: 0.92, gap: "", mistake: "", tip: "" },
];

const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, "");
const isCorrect = (a) => norm(a.text) === norm(a.key);

// Key makes React reset all the state when you open a different paper
export default function TeacherGrading() {
  const { paperId } = useParams();
  return <GradingView key={paperId} />;
}

function ReviewField({ id, title, value, onChange, placeholder, rows = 2 }) {
  return (
    <div className="review-report-field">
      <label htmlFor={id}>{title}</label>
      <textarea id={id} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ScoreRing({ score, total }) {
  const pct = total ? score / total : 0;
  const c = 2 * Math.PI * 54;
  return (
    <div className="review-score-chart" aria-hidden="true">
      <svg width="96" height="96" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#C8B48A" strokeOpacity="0.35" strokeWidth="14" />
        <circle
          cx="70" cy="70" r="54" fill="none" stroke="#1E3B2F" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 70 70)"
        />
        <text x="70" y="77" textAnchor="middle" fontSize="26" fontWeight="700" fill="#1E3B2F">
          {Math.round(pct * 100)}%
        </text>
      </svg>
    </div>
  );
}

function GradingView() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const titleRef = useRef(null);
  const stageTitleRef = useRef(null);
  const confirmRef = useRef(null);
  const cancelRef = useRef(null);
  const saveRef = useRef(null);

  const paper = papers.find((p) => String(p.id) === paperId);
  const initialAnswers = paperDetails[paperId]?.answers ?? fallbackAnswers;

  const [stage, setStage] = useState("verify"); // verify | grading | review
  const [answers, setAnswers] = useState(initialAnswers);
  const [markScheme, setMarkScheme] = useState("");
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [questionGrades, setQuestionGrades] = useState({});
  const [questionComments, setQuestionComments] = useState({});
  const [scoreOverride, setScoreOverride] = useState(null);
  const [feedbackOverride, setFeedbackOverride] = useState(null);
  const [gapsOverride, setGapsOverride] = useState(null);
  const [mistakesOverride, setMistakesOverride] = useState(null);
  const [flagOverride, setFlagOverride] = useState(null);
  const [flagStatus, setFlagStatus] = useState(null);
  const [supervisor, setSupervisor] = useState("Not sent");
  const [uploaded, setUploaded] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (stage !== "verify") stageTitleRef.current?.focus({ preventScroll: true });
  }, [stage]);

  // Fake AI delay
  useEffect(() => {
    if (stage !== "grading") return;
    const id = setTimeout(() => setStage("review"), 2500);
    return () => clearTimeout(id);
  }, [stage]);

  if (!paper) {
    return (
      <div className="teacher-grading">
        <Link to="/teacher/papers" className="review-back-link">← Back to papers</Link>
        <h1 ref={titleRef} tabIndex={-1}>Paper not found</h1>
        <p>Choose a submission from the papers list to review its answers.</p>
      </div>
    );
  }

  // Everything below is derived from the answers, so fixing an OCR mistake changes the result
  const total = answers.length;
  const questionGradeValue = (answer) => questionGrades[answer.q] ?? (isCorrect(answer) ? 1 : 0);
  const validQuestionGrade = (answer) => questionGradeValue(answer) !== "" && Number.isFinite(Number(questionGradeValue(answer))) && Number(questionGradeValue(answer)) >= 0 && Number(questionGradeValue(answer)) <= 1;
  const questionGrade = (answer) => Math.min(1, Math.max(0, Number(questionGradeValue(answer)) || 0));
  const questionComment = (answer) => questionComments[answer.q] ?? (isCorrect(answer) ? "Correct answer." : answer.tip || `Compare the student's answer with the expected answer: ${answer.key}.`);
  const wrong = answers.filter((answer) => questionGrade(answer) < 1);
  const autoScore = answers.reduce((sum, answer) => sum + questionGrade(answer), 0);
  const scoreValue = scoreOverride ?? autoScore;
  const validScore = scoreValue !== "" && Number.isFinite(Number(scoreValue)) && Number(scoreValue) >= 0 && Number(scoreValue) <= total;
  const score = Math.min(total, Math.max(0, Number(scoreValue) || 0));
  const gaps = [...new Set(wrong.map((a) => a.gap).filter(Boolean))];
  const mistakes = [...new Set(wrong.map((a) => a.mistake).filter(Boolean))];
  const commentedAnswers = answers.filter((answer) => questionGrade(answer) < 1 || questionComments[answer.q] !== undefined);
  const autoFeedback = commentedAnswers.length
    ? commentedAnswers.map(questionComment).filter(Boolean).join(" ")
    : "Excellent work. No issues found.";
  const feedback = feedbackOverride ?? autoFeedback;
  const redFlags = flagOverride ?? (wrong.length >= 2 ? `Needs additional support in: ${gaps.join(", ") || "the questions below"}` : "");
  const currentFlagStatus = redFlags.trim() ? flagStatus ?? "Needs review" : "None";
  const date = submissionDate(paper.submitted);

  const updateReview = (setter, value) => {
    setter(value);
    setUploaded(false);
    setSupervisor("Not sent");
    setToast(null);
  };

  const updateAnswer = (q, text) => {
    if (stage !== "verify") return;
    setAnswers((previous) => previous.map((answer) => answer.q === q ? { ...answer, text, confidence: 1 } : answer));
  };

  const startGrading = () => {
    setShowQuestionDetails(false);
    setStage("grading");
  };

  const upload = () => {
    confirmRef.current.close();
    setUploaded(true);
    setToast("Review saved.");
  };

  return (
    <div className="teacher-grading">
      <header className="review-intro">
        <Link to="/teacher/papers" className="review-back-link"><span aria-hidden="true">←</span> Back to papers</Link>
        <h1 ref={titleRef} tabIndex={-1}>Paper review</h1>
        <dl className="review-metadata">
          <div><dt>Name</dt><dd>{paper.student}</dd></div>
          <div><dt>Class</dt><dd>{paper.classId}</dd></div>
          <div><dt>Assignment</dt><dd>{paper.paper}</dd></div>
        </dl>
        <p className="review-submitted">Grade {paper.grade} · Submitted {date ? <time dateTime={date.iso}>{date.label}</time> : paper.submitted}</p>
      </header>

      {/* STAGE 1: verify the OCR text */}
      {stage === "verify" && (
        <section className="grade-board review-workspace" aria-labelledby="review-workspace-title">
          <header className="review-workspace-heading">
            <div>
              <h2 id="review-workspace-title">Check extracted answers</h2>
              <p>Correct extraction mistakes only. Keep the student’s answer as written on the paper.</p>
            </div>
            <div className="review-attachment">
              <button type="button" className="review-button review-button-outline" onClick={() => fileRef.current.click()}>
                {markScheme ? "Replace mark scheme" : "Attach mark scheme"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setMarkScheme(f.name);
                  }
                }}
              />
            </div>
          </header>
          {markScheme && <p className="review-attachment-note" role="status">Attached: <strong>{markScheme}</strong></p>}

          <form onSubmit={(event) => { event.preventDefault(); startGrading(); }}>
            <div className="review-columns">
              <section className="review-source" aria-labelledby="review-source-title">
                <h3 id="review-source-title">Submitted paper</h3>
                <p className="review-column-meta">Page 1 of 1</p>
                <article className="review-demo-paper" aria-label="Submitted paper with original student answers">
                  <header>
                    <h4>Mathematics</h4>
                    <dl className="review-paper-metadata">
                      <div><dt>Name:</dt><dd>{paper.student}</dd></div>
                      <div><dt>Class:</dt><dd>{paper.classId}</dd></div>
                      <div><dt>Assignment:</dt><dd>{paper.paper}</dd></div>
                    </dl>
                  </header>
                  <ol className="review-paper-questions">
                    {initialAnswers.map((answer) => (
                      <li key={answer.q} value={answer.q}>
                        <p>{answer.question}</p>
                        <p className="review-handwriting">{answer.scanText ?? answer.text}</p>
                      </li>
                    ))}
                  </ol>
                </article>
              </section>

              <section className="review-extracted" aria-labelledby="review-extracted-title">
                <h3 id="review-extracted-title">Extracted answers</h3>
                {answers.length ? answers.map((answer) => (
                  <div key={answer.q} className="review-answer-field">
                    <label htmlFor={`review-answer-${answer.q}`}>
                      <span>Question {answer.q}</span>
                      <strong>{answer.question}</strong>
                    </label>
                    <input
                      id={`review-answer-${answer.q}`}
                      value={answer.text}
                      onChange={(event) => updateAnswer(answer.q, event.target.value)}
                      required
                      pattern={".*\\S.*"}
                      title="Enter the answer shown on the paper."
                      aria-describedby={answer.confidence < 0.8 ? `review-confidence-${answer.q}` : undefined}
                    />
                    {answer.confidence < 0.8 && <p className="review-confidence" id={`review-confidence-${answer.q}`}>Check this extraction against the paper.</p>}
                  </div>
                )) : <p className="review-no-answers">No extracted answers are available. Return to papers and choose another submission.</p>}
              </section>
            </div>
            <footer className="review-workspace-footer">
              <p>You’ll review the grade before saving.</p>
              <button type="submit" className="review-button" disabled={!total}>Confirm answers and grade</button>
            </footer>
          </form>
        </section>
      )}

      {/* STAGE 2: fake AI delay */}
      {stage === "grading" && (
        <section className="grade-board review-loading" aria-busy="true" aria-labelledby="review-loading-title">
          <div className="grade-spinner" aria-hidden="true" />
          <h2 ref={stageTitleRef} tabIndex={-1} id="review-loading-title">Grading paper</h2>
          <p role="status">Your extracted answers are confirmed. Preparing suggested grades for your review.</p>
        </section>
      )}

      {/* STAGE 3: review, override, send */}
      {stage === "review" && (
        <section className="grade-board review-results" aria-labelledby="review-results-title">
          <form
            className="review-results-form"
            onSubmit={(event) => {
              event.preventDefault();
              const invalidQuestion = answers.find((answer) => !validQuestionGrade(answer));
              if (invalidQuestion) {
                setShowQuestionDetails(true);
                requestAnimationFrame(() => document.getElementById(`review-question-grade-${invalidQuestion.q}`)?.focus());
                return;
              }
              if (event.nativeEvent.submitter?.value === "supervisor") {
                setSupervisor("Sent");
                setToast("Review sent to supervisor.");
              } else {
                confirmRef.current.showModal();
                cancelRef.current.focus();
              }
            }}
          >
            <div className="review-question-toggle">
              <button type="button" className="grade-tool" aria-expanded={showQuestionDetails} aria-controls="review-question-details" onClick={() => setShowQuestionDetails((show) => !show)}>
                {showQuestionDetails ? "Hide question details" : "View question details"}
              </button>
            </div>
            <section id="review-question-details" className="review-question-details" aria-labelledby="review-question-details-title" hidden={!showQuestionDetails}>
              <header>
                <h2 id="review-question-details-title">Question details</h2>
                <p>Review each answer, grade, and comment before the overall result. Question grades update the total below.</p>
              </header>
              {answers.map((answer) => (
                <article key={answer.q} className="review-question-reference" aria-labelledby={`review-question-title-${answer.q}`}>
                  <div className="review-question-content">
                    <h3 id={`review-question-title-${answer.q}`}>Question {answer.q}</h3>
                    <p className="review-question-prompt">{answer.question}</p>
                    <dl className="review-question-answers">
                      <div><dt>Student answer</dt><dd>{answer.text}</dd></div>
                      <div><dt>Expected answer</dt><dd>{answer.key}</dd></div>
                    </dl>
                  </div>
                  <div className="review-question-decision">
                    <div className="review-question-grade">
                      <label htmlFor={`review-question-grade-${answer.q}`}>Grade<span className="sr-only"> for question {answer.q}</span></label>
                      <div>
                        <input id={`review-question-grade-${answer.q}`} type="number" min="0" max="1" step="any" required disabled={!showQuestionDetails} value={questionGradeValue(answer)} aria-invalid={!validQuestionGrade(answer)} aria-describedby={!validQuestionGrade(answer) ? `review-question-grade-error-${answer.q}` : undefined} onChange={(event) => { updateReview(setQuestionGrades, { ...questionGrades, [answer.q]: event.target.value }); setScoreOverride(null); }} />
                        <span>/ 1</span>
                      </div>
                      {!validQuestionGrade(answer) && <p id={`review-question-grade-error-${answer.q}`} role="alert">Enter a grade from 0 to 1.</p>}
                    </div>
                    <ReviewField id={`review-question-comment-${answer.q}`} title={<>Comment<span className="sr-only"> for question {answer.q}</span></>} value={questionComment(answer)} onChange={(value) => updateReview(setQuestionComments, { ...questionComments, [answer.q]: value })} placeholder="Add a comment about this answer." />
                  </div>
                </article>
              ))}
            </section>

            <header className="review-results-heading">
              <div>
                <h2 ref={stageTitleRef} tabIndex={-1} id="review-results-title">Review suggested grades</h2>
                <p>Check and edit the results before saving.</p>
              </div>
            </header>
            <div className="grade-review">
              <div className="review-report-fields">
                <ReviewField id="review-feedback" title="Feedback" value={feedback} onChange={(value) => updateReview(setFeedbackOverride, value)} placeholder="Add feedback for the student." rows={3} />
                <ReviewField id="review-gaps" title="Learning gaps" value={gapsOverride ?? gaps.join("\n")} onChange={(value) => updateReview(setGapsOverride, value)} placeholder="No learning gaps identified." />
                <ReviewField id="review-mistakes" title="Repeated mistakes" value={mistakesOverride ?? mistakes.join("\n")} onChange={(value) => updateReview(setMistakesOverride, value)} placeholder="No repeated mistakes identified." rows={3} />
              </div>
              <div className="review-report-decisions">
                <div className="review-overall-score">
                  <label htmlFor="review-score">Overall score</label>
                  <div className="review-score-summary">
                    <div className="review-score-field">
                      <div>
                        <input id="review-score" type="number" min="0" max={total} step="any" required value={scoreValue} onChange={(event) => updateReview(setScoreOverride, event.target.value)} aria-describedby={validScore ? "review-score-total review-score-percentage" : "review-score-error"} aria-invalid={!validScore} />
                        <span id="review-score-total">/ {total}</span>
                      </div>
                      <p id="review-score-percentage" className="sr-only">{Math.round((total ? score / total : 0) * 100)} percent</p>
                    </div>
                    <ScoreRing score={score} total={total} />
                    {!validScore && <p id="review-score-error" className="review-score-error" role="alert">Enter a score from 0 to {total}.</p>}
                  </div>
                </div>
                <div className="review-flags-field">
                  <ReviewField id="review-flags" title="Red flags" value={redFlags} onChange={(value) => { updateReview(setFlagOverride, value); if (!redFlags.trim()) setFlagStatus(null); }} placeholder="No red flags identified." rows={3} />
                  <label className="review-flag-status" htmlFor="review-flag-status">
                    <span>Flag status</span>
                    <select id="review-flag-status" value={currentFlagStatus} disabled={!redFlags.trim()} onChange={(event) => updateReview(setFlagStatus, event.target.value)}>
                      {!redFlags.trim() && <option value="None">No red flags</option>}
                      <option value="Needs review">Needs review</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Dismissed">Dismissed</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <footer className="grade-footer">
              <div className="review-supervisor-action">
                <button type="submit" name="action" value="supervisor" className="grade-tool" disabled={supervisor === "Sent"}>Send to supervisor</button>
                <span className="review-supervisor-status">{supervisor === "Sent" ? "Sent to supervisor" : "No request sent"}</span>
              </div>
              <div className="flex items-center gap-3">
                {uploaded && <button type="button" className="grade-tool" onClick={() => navigate("/teacher/papers")}>Back to papers</button>}
                <button ref={saveRef} type="submit" name="action" value="save" className="grade-primary" disabled={uploaded}>{uploaded ? "Review saved" : "Save review"}</button>
              </div>
            </footer>
          </form>
        </section>
      )}

      {toast && <div className="review-notice" role="status"><p>{toast}</p><button type="button" onClick={() => setToast(null)}>Dismiss notice</button></div>}

      <dialog ref={confirmRef} className="review-confirm" aria-labelledby="review-confirm-title" aria-describedby="review-confirm-description" onClose={() => { if (!saveRef.current?.disabled) saveRef.current?.focus(); else stageTitleRef.current?.focus(); }}>
        <h2 id="review-confirm-title">Save this review?</h2>
        <p id="review-confirm-description">Save the grade of {score}/{total}, feedback, and your changes for {paper.student}?</p>
        <div className="review-confirm-actions">
          <button ref={cancelRef} type="button" className="review-button review-button-outline" onClick={() => confirmRef.current.close()}>Cancel</button>
          <button type="button" className="review-button" onClick={upload}>Save review</button>
        </div>
      </dialog>
    </div>
  );
}
