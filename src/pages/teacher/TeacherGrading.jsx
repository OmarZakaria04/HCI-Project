import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { papers, paperDetails } from "../../data/teacherData";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import "../../styles/teacher.css";

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

function Block({ title, children }) {
  return (
    <div>
      <p className="grade-block-title">{title}</p>
      {children}
    </div>
  );
}

function ScoreRing({ score, total }) {
  const pct = total ? score / total : 0;
  const c = 2 * Math.PI * 54;
  return (
    <div className="analytics-chart text-center">
      <svg width="160" height="160" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#C8B48A" strokeOpacity="0.35" strokeWidth="14" />
        <circle
          cx="70" cy="70" r="54" fill="none" stroke="#1E3B2F" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 70 70)"
        />
        <text x="70" y="77" textAnchor="middle" fontSize="26" fontWeight="800" fill="#1E3B2F">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <p className="text-xs font-bold text-forest">Score graph</p>
    </div>
  );
}

function GradingView() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const paper = papers.find((p) => String(p.id) === paperId);
  const initialAnswers = paperDetails[paperId]?.answers ?? fallbackAnswers;

  const [stage, setStage] = useState("verify"); // verify | grading | review
  const [answers, setAnswers] = useState(initialAnswers);
  const [editing, setEditing] = useState(false);
  const [markScheme, setMarkScheme] = useState("");
  const [showStruggle, setShowStruggle] = useState(false);
  const [scoreOverride, setScoreOverride] = useState(null);
  const [feedbackOverride, setFeedbackOverride] = useState(null);
  const [flagDismissed, setFlagDismissed] = useState(false);
  const [supervisor, setSupervisor] = useState("Not sent");
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [toast, setToast] = useState(null);

  const closeToast = useCallback(() => setToast(null), []);

  // Fake AI delay
  useEffect(() => {
    if (stage !== "grading") return;
    const id = setTimeout(() => setStage("review"), 2500);
    return () => clearTimeout(id);
  }, [stage]);

  if (!paper) {
    return (
      <div className="teacher-page">
        <h1 className="teacher-heading">Paper not found</h1>
        <Link to="/teacher/papers" className="teacher-btn-outline">Back to papers</Link>
      </div>
    );
  }

  // Everything below is derived from the answers, so fixing an OCR mistake changes the result
  const total = answers.length;
  const wrong = answers.filter((a) => !isCorrect(a));
  const autoScore = total - wrong.length;
  const score = scoreOverride ?? autoScore;
  const gaps = [...new Set(wrong.map((a) => a.gap))];
  const mistakes = [...new Set(wrong.map((a) => a.mistake))];
  const autoFeedback = wrong.length
    ? wrong.map((a) => a.tip).join(" ")
    : "Excellent work. No issues found.";
  const feedback = feedbackOverride ?? autoFeedback;
  const showFlag = wrong.length >= 2 && !flagDismissed;

  const updateAnswer = (q, text) =>
    setAnswers((prev) => prev.map((a) => (a.q === q ? { ...a, text, confidence: 1 } : a)));

  const startGrading = () => {
    setEditing(false);
    setStage("grading");
  };

  const upload = () => {
    setConfirmUpload(false);
    setUploaded(true);
    setToast({ message: "Grade uploaded. The student can now see it." });
  };

  return (
    <div className="teacher-page">
      <div className="teacher-page-head">
        <Link to="/teacher/papers" className="teacher-btn-outline">← Back</Link>
      </div>

      <div className="grade-banner">
        <h1 className="grade-banner-title">{paper.paper} {paper.student} {paper.classId}</h1>
        <p className="grade-banner-sub">Submitted {paper.submitted}</p>
      </div>

      {/* STAGE 1: verify the OCR text */}
      {stage === "verify" && (
        <section className="grade-board">
          <div className="grade-toolbar">
            <button
              type="button"
              className={`grade-tool ${editing ? "grade-tool-on" : ""}`}
              onClick={() => setEditing((e) => !e)}
            >
              {editing ? "Done editing" : "Edit Mode"}
            </button>

            <div className="flex items-center gap-2">
              {markScheme && <span className="grade-file">{markScheme}</span>}
              <button type="button" className="grade-tool" onClick={() => fileRef.current.click()}>
                Upload Mark Scheme
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
                    setToast({ message: "Mark scheme attached." });
                  }
                }}
              />
            </div>
          </div>

          <p className="text-xs text-cream/70">
            Check the extracted answers against the scan. Turn on Edit Mode to fix any OCR mistakes, then start grading.
          </p>

          <div className="grade-answers">
            {answers.map((a) => (
              <div key={a.q} className="grade-answer">
                <div>
                  <span className="grade-q">Q{a.q}</span>
                  <span>{a.question}</span>
                </div>
                <div className="flex items-center gap-2">
                  {a.confidence < 0.8 && <span className="grade-lowconf">Low OCR confidence · check</span>}
                  {editing ? (
                    <input
                      className="grade-input"
                      value={a.text}
                      onChange={(e) => updateAnswer(a.q, e.target.value)}
                      aria-label={`Answer to question ${a.q}`}
                    />
                  ) : (
                    <span className="grade-ocr">{a.text}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button type="button" className="grade-primary" onClick={startGrading}>
              Start AI Grading
            </button>
          </div>
        </section>
      )}

      {/* STAGE 2: fake AI delay */}
      {stage === "grading" && (
        <section className="grade-board text-center py-16">
          <div className="grade-spinner" />
          <p className="mt-4 text-sm font-bold text-cream">The AI is grading the paper...</p>
          <p className="text-xs text-cream/60">You will review the result before anything is sent.</p>
        </section>
      )}

      {/* STAGE 3: review, override, send */}
      {stage === "review" && (
        <section className="grade-board">
          <div className="grade-toolbar">
            <button
              type="button"
              className={`grade-tool ${editing ? "grade-tool-on" : ""}`}
              onClick={() => setEditing((e) => !e)}
            >
              {editing ? "Done editing" : "Edit Mode"}
            </button>
            <button type="button" className="grade-tool" onClick={() => setShowStruggle((s) => !s)}>
              {showStruggle ? "Hide Struggle Questions" : "View Struggle Questions"}
            </button>
          </div>

          <div className="grade-review">
            <div className="space-y-4">
              <p className="grade-score">
                Score:{" "}
                {editing ? (
                  <input
                    type="number"
                    min="0"
                    max={total}
                    value={score}
                    onChange={(e) =>
                      setScoreOverride(Math.min(total, Math.max(0, Number(e.target.value) || 0)))
                    }
                    className="grade-score-input"
                    aria-label="Override score"
                  />
                ) : (
                  score
                )}
                /{total}
              </p>

              {showStruggle && (
                <Block title="Struggle questions">
                  {wrong.length === 0 ? (
                    <p className="text-xs text-cream/60">None. Every answer was correct.</p>
                  ) : (
                    <ul className="space-y-2">
                      {wrong.map((a) => (
                        <li key={a.q} className="stu-item">
                          Q{a.q} {a.question}: answered <strong>{a.text}</strong>, expected <strong>{a.key}</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </Block>
              )}

              <Block title="Learning gaps">
                {gaps.length === 0 ? (
                  <p className="text-xs text-cream/60">None detected.</p>
                ) : (
                  <div className="analytics-badges">
                    {gaps.map((g) => (
                      <span key={g} className="analytics-badge-warn">{g}</span>
                    ))}
                  </div>
                )}
              </Block>

              <Block title="Feedback">
                {editing ? (
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedbackOverride(e.target.value)}
                    className="grade-textarea"
                  />
                ) : (
                  <p className="text-xs italic text-cream/90">"{feedback}"</p>
                )}
              </Block>

              <Block title="Red flags">
                {showFlag ? (
                  <div className="stu-item stu-flag">
                    <span>Needs additional support in: {gaps.join(", ")}</span>
                    {editing && (
                      <button type="button" className="stu-btn-ghost" onClick={() => setFlagDismissed(true)}>
                        Dismiss
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-cream/60">No active red flags.</p>
                )}
              </Block>

              <Block title="Repeated mistakes">
                {mistakes.length === 0 ? (
                  <p className="text-xs text-cream/60">None detected.</p>
                ) : (
                  <ul className="space-y-2">
                    {mistakes.map((m) => (
                      <li key={m} className="stu-item">{m}</li>
                    ))}
                  </ul>
                )}
              </Block>
            </div>

            <ScoreRing score={score} total={total} />
          </div>

          <div className="grade-footer">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="grade-tool"
                disabled={supervisor === "Sent"}
                onClick={() => {
                  setSupervisor("Sent");
                  setToast({ message: "Sent to the supervisor for approval." });
                }}
              >
                Send to Supervisor
              </button>
              <span className={`papers-status-badge ${supervisor === "Sent" ? "papers-status-done" : "papers-status-pending"}`}>
                {supervisor}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {uploaded && (
                <button type="button" className="grade-tool" onClick={() => navigate("/teacher/papers")}>
                  Back to papers
                </button>
              )}
              <button type="button" className="grade-primary" disabled={uploaded} onClick={() => setConfirmUpload(true)}>
                {uploaded ? "Grade uploaded ✓" : "Upload grade to system"}
              </button>
            </div>
          </div>
        </section>
      )}

      <ConfirmModal
        isOpen={confirmUpload}
        title="Upload this grade?"
        message={`${paper.student} will see ${score}/${total} and the feedback. Check your edits first.`}
        confirmLabel="Upload"
        onConfirm={upload}
        onCancel={() => setConfirmUpload(false)}
      />

      <Toast message={toast?.message} onClose={closeToast} />
    </div>
  );
}