import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTeacherData } from "../../i18n/teacherDataDe";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import submissionDate from "../../utils/submissionDate";
import { formatDuration, getStruggleSignal } from "../../utils/struggleSignals";
import {
  getSavedMarkSchemes,
  getUploadedPapersMap,
  saveMarkScheme,
  saveUploadedPaper,
} from "../../utils/teacherStore";
import "../../styles/teacher.css";
import "../../styles/teacher-grading.css";

// Used for papers that have no entry in paperDetails
const getFallbackAnswers = (lang, submissionType = "scan") => [
  { q: 1, question: "15 × 8 = ?", text: "120", key: "120", confidence: 0.96, ...(submissionType === "online" ? { timeSpentSec: 45, expectedTimeSec: 60 } : { erasingNoise: 8 }), gap: "", mistake: "", tip: "" },
  { q: 2, question: lang === "de" ? "Kürze 6/8" : "Simplify 6/8", text: "3/4", key: "3/4", confidence: 0.94, ...(submissionType === "online" ? { timeSpentSec: 155, expectedTimeSec: 60 } : { erasingNoise: 31 }), gap: "", mistake: "", tip: "" },
  { q: 3, question: lang === "de" ? "0,75 als Prozentsatz" : "0.75 as a percentage", text: "75%", key: "75%", confidence: 0.92, ...(submissionType === "online" ? { timeSpentSec: 40, expectedTimeSec: 60 } : { erasingNoise: 10 }), gap: "", mistake: "", tip: "" },
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
  const { lang, tr } = useLanguage();
  const { papers, paperDetails, markSchemeLibrary } = getTeacherData(lang);
  const { paperId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const titleRef = useRef(null);
  const stageTitleRef = useRef(null);
  const confirmRef = useRef(null);
  const cancelRef = useRef(null);
  const saveRef = useRef(null);

  const paper = papers.find((p) => String(p.id) === paperId);
  const submissionType = paperDetails[paperId]?.submissionType ?? paper?.submissionType ?? "scan";
  const initialAnswers = paperDetails[paperId]?.answers ?? getFallbackAnswers(lang, submissionType);
  const schemeLookup = paper ? markSchemeLibrary?.[paper.paper] ?? markSchemeLibrary?.[paper.paper === "HA1" ? "HW1" : paper.paper] : null;
  const savedScheme = paper ? getSavedMarkSchemes()[paper.paper] : null;
  const savedUpload = getUploadedPapersMap()[String(paperId)] ?? null;

  const [stage, setStage] = useState("verify"); // verify | grading | review
  const [answerOverrides, setAnswerOverrides] = useState({});
  const [markScheme, setMarkScheme] = useState(savedScheme?.name ?? schemeLookup?.name ?? "");
  const [markSchemeCriteria, setMarkSchemeCriteria] = useState(savedScheme?.criteria ?? schemeLookup?.criteria ?? "");
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [questionGrades, setQuestionGrades] = useState({});
  const [questionComments, setQuestionComments] = useState({});
  const [scoreOverride, setScoreOverride] = useState(null);
  const [feedbackOverride, setFeedbackOverride] = useState(null);
  const [gapsOverride, setGapsOverride] = useState(null);
  const [mistakesOverride, setMistakesOverride] = useState(null);
  const [flagOverride, setFlagOverride] = useState(null);
  const [flagStatus, setFlagStatus] = useState(null);
  const [metricOverrides, setMetricOverrides] = useState({});
  const [signalDecisions, setSignalDecisions] = useState({});
  const [signalNotesAdded, setSignalNotesAdded] = useState({});
  const [supervisor, setSupervisor] = useState(savedUpload?.supervisor ?? "Not sent");
  const [supervisorNote, setSupervisorNote] = useState(savedUpload?.supervisorNote ?? "");
  const [draftSaved, setDraftSaved] = useState(Boolean(savedUpload?.draftSaved || savedUpload?.uploaded));
  const [uploaded, setUploaded] = useState(Boolean(savedUpload?.uploaded));
  const [flagError, setFlagError] = useState("");
  const [toastKey, setToastKey] = useState(null);

  const answers = initialAnswers.map((answer) =>
    answerOverrides[answer.q] !== undefined
      ? { ...answer, text: answerOverrides[answer.q], confidence: 1 }
      : answer,
  );

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
        <Link to="/teacher/papers" className="review-back-link">← {tr("Back to papers", "Zurück zu den Arbeiten")}</Link>
        <h1 ref={titleRef} tabIndex={-1}>{tr("Paper not found", "Arbeit nicht gefunden")}</h1>
        <p>{tr("Choose a submission from the papers list to review its answers.", "Wählen Sie eine Abgabe aus der Arbeitsliste aus, um die Antworten zu prüfen.")}</p>
      </div>
    );
  }

  // Everything below is derived from the answers, so fixing an OCR mistake changes the result
  const total = answers.length;
  const questionGradeValue = (answer) => questionGrades[answer.q] ?? (isCorrect(answer) ? 1 : 0);
  const validQuestionGrade = (answer) => questionGradeValue(answer) !== "" && Number.isFinite(Number(questionGradeValue(answer))) && Number(questionGradeValue(answer)) >= 0 && Number(questionGradeValue(answer)) <= 1;
  const questionGrade = (answer) => Math.min(1, Math.max(0, Number(questionGradeValue(answer)) || 0));
  const questionComment = (answer) =>
    questionComments[answer.q] ??
    (isCorrect(answer)
      ? tr("Correct answer.", "Richtige Antwort.")
      : answer.tip ||
        tr(
          `Compare the student's answer with the expected answer: ${answer.key}.`,
          `Vergleichen Sie die Schülerantwort mit der erwarteten Antwort: ${answer.key}.`,
        ));
  const wrong = answers.filter((answer) => questionGrade(answer) < 1);
  const rightCount = answers.length - wrong.length;
  const autoScore = answers.reduce((sum, answer) => sum + questionGrade(answer), 0);
  const scoreValue = scoreOverride ?? autoScore;
  const validScore = scoreValue !== "" && Number.isFinite(Number(scoreValue)) && Number(scoreValue) >= 0 && Number(scoreValue) <= total;
  const score = Math.min(total, Math.max(0, Number(scoreValue) || 0));
  const gaps = [...new Set(wrong.map((a) => a.gap).filter(Boolean))];
  const mistakes = [...new Set(wrong.map((a) => a.mistake).filter(Boolean))];
  const commentedAnswers = answers.filter((answer) => questionGrade(answer) < 1 || questionComments[answer.q] !== undefined);
  const positiveOpening = rightCount
    ? tr(
        `Good work solving ${rightCount} of ${total} questions accurately.`,
        `Gute Arbeit: ${rightCount} von ${total} Aufgaben sicher gelöst.`,
      )
    : tr(
        "Good effort attempting every question on this assessment.",
        "Guter Einsatz bei der Bearbeitung aller Aufgaben.",
      );
  const autoFeedback = commentedAnswers.length
    ? `${positiveOpening} ${commentedAnswers.map(questionComment).filter(Boolean).join(" ")}`
    : tr("Excellent work. All questions solved cleanly with no issues found.", "Hervorragende Arbeit. Alle Aufgaben sauber und fehlerfrei gelöst.");
  const feedback = feedbackOverride ?? autoFeedback;
  const derivedAccuracy = total ? Math.round((score / total) * 100) : 0;
  const metrics = {
    accuracy: metricOverrides.accuracy ?? derivedAccuracy,
    problemSolving: metricOverrides.problemSolving ?? Math.min(100, derivedAccuracy + 6),
    clarity: metricOverrides.clarity ?? (submissionType === "online" ? 90 : 84),
  };
  const redFlags =
    flagOverride ??
    (wrong.length >= 2
      ? tr(
          `Needs additional support in: ${gaps.join(", ") || "the questions below"}`,
          `Zusätzlicher Förderbedarf in: ${gaps.join(", ") || "den folgenden Aufgaben"}`,
        )
      : "");
  const currentFlagStatus = redFlags.trim() ? flagStatus ?? "Needs review" : "None";
  const struggleItems = answers
    .map((answer) => ({ answer, signal: getStruggleSignal(answer, submissionType) }))
    .filter(({ signal }) => signal.hasSignal);

  const signalDecisionLabel = (decision) => {
    if (decision === "concept_struggle") return tr("Concept struggle — follow up", "Verständnisschwierigkeit — nachbesprechen");
    if (decision === "hesitation") return tr("Hesitation / took extra care", "Unsicherheit / sorgfältig nachgedacht");
    if (decision === "benign") return tr("Benign (smudge / pause) — ignore", "Unkritisch (Radierrest / Pause) — ignorieren");
    return tr("Unreviewed (private to teacher)", "Noch nicht eingeordnet (nur für Lehrkraft)");
  };

  const addSignalNoteToFeedback = (answer, decision) => {
    const noteText =
      decision === "concept_struggle"
        ? tr(
            `Question ${answer.q} (${answer.question}) showed signs of extra effort—let's review this step together.`,
            `Bei Aufgabe ${answer.q} (${answer.question}) war erhöhter Aufwand erkennbar – wir schauen uns diesen Schritt gemeinsam an.`,
          )
        : tr(
            `Question ${answer.q} (${answer.question}) took extra time/erasing, though your approach is worth reinforcing.`,
            `Für Aufgabe ${answer.q} (${answer.question}) wurde etwas mehr Zeit bzw. Korrektur benötigt – den Lösungsweg festigen wir kurz.`,
          );
    const nextFeedback = feedback.trim() ? `${feedback.trim()} ${noteText}` : noteText;
    updateReview(setFeedbackOverride, nextFeedback);
    setSignalNotesAdded((prev) => ({ ...prev, [answer.q]: true }));
  };

  const date = submissionDate(paper.submitted, lang);
  const toast =
    toastKey === "supervisor"
      ? tr("Submitted to supervisor for review.", "Zur Prüfung an Fachleitung eingereicht.")
      : toastKey === "supervisor_confirmed"
        ? tr("Supervisor confirmed the assessment. You can now publish the confirmed results.", "Fachleitung hat die Bewertung bestätigt. Sie können die bestätigten Ergebnisse jetzt veröffentlichen.")
        : toastKey === "published"
          ? tr("Confirmed results published and uploaded automatically to student and parent views.", "Bestätigte Ergebnisse veröffentlicht und automatisch für Schüler- und Elternansicht hochgeladen.")
          : toastKey === "revision_requested"
            ? tr("Revision requested by supervisor. Review reopened for teacher edits.", "Überarbeitung durch Fachleitung angefordert. Prüfung wieder geöffnet.")
            : toastKey === "draft_saved"
              ? tr("Teacher review saved locally. Next, submit to supervisor.", "Lehrkraft-Prüfung gespeichert. Reichen Sie sie als Nächstes bei der Fachleitung ein.")
              : null;

  const updateReview = (setter, value) => {
    setter(value);
    setDraftSaved(false);
    setUploaded(false);
    setSupervisor("Not sent");
    setFlagError("");
    setToastKey(null);
  };

  const hasReviewEdits =
    scoreOverride !== null ||
    feedbackOverride !== null ||
    gapsOverride !== null ||
    mistakesOverride !== null ||
    flagOverride !== null ||
    flagStatus !== null ||
    Object.keys(questionGrades).length > 0 ||
    Object.keys(questionComments).length > 0 ||
    Object.keys(metricOverrides).length > 0;

  const resetToAiDefaults = () => {
    setQuestionGrades({});
    setQuestionComments({});
    setScoreOverride(null);
    setFeedbackOverride(null);
    setGapsOverride(null);
    setMistakesOverride(null);
    setFlagOverride(null);
    setFlagStatus(null);
    setMetricOverrides({});
    setFlagError("");
    setDraftSaved(false);
    setUploaded(false);
    setSupervisor("Not sent");
    setToastKey(null);
  };

  const confirmSupervisorAssessment = () => {
    setSupervisor("Confirmed");
    setToastKey("supervisor_confirmed");
  };

  const publishConfirmedResults = () => {
    if (supervisor !== "Confirmed") return;
    setUploaded(true);
    setDraftSaved(true);
    setToastKey("published");
    saveUploadedPaper(paperId, {
      score: `${score}/${total}`,
      status: "Graded",
      supervisor: "Confirmed",
      supervisorNote,
      draftSaved: true,
      uploaded: true,
      title: paper.paper,
    });
  };

  const updateAnswer = (q, text) => {
    if (stage !== "verify") return;
    setAnswerOverrides((previous) => ({ ...previous, [q]: text }));
    setDraftSaved(false);
    setUploaded(false);
    setSupervisor("Not sent");
  };

  const startGrading = () => {
    setShowQuestionDetails(false);
    setStage("grading");
  };

  const saveTeacherReview = () => {
    confirmRef.current.close();
    setDraftSaved(true);
    setToastKey("draft_saved");
  };

  return (
    <div className="teacher-grading">
      <header className="review-intro">
        <Link to="/teacher/papers" className="review-back-link"><span aria-hidden="true">←</span> {tr("Back to papers", "Zurück zu den Arbeiten")}</Link>
        <h1 ref={titleRef} tabIndex={-1}>{tr("Paper review", "Arbeitenprüfung")}</h1>
        <dl className="review-metadata">
          <div><dt>{tr("Name", "Name")}</dt><dd>{paper.student}</dd></div>
          <div><dt>{tr("Class", "Klasse")}</dt><dd>{paper.classId}</dd></div>
          <div><dt>{tr("Assignment", "Aufgabe")}</dt><dd>{paper.paper}</dd></div>
          <div><dt>{tr("Source", "Abgabeform")}</dt><dd>{submissionType === "online" ? tr("Online quiz / assessment", "Online-Quiz / Test") : tr("Scanned paper", "Gescannter Bogen")}</dd></div>
        </dl>
        <p className="review-submitted">
          {tr(`Grade ${paper.grade} · Submitted`, `Stufe ${paper.grade} · Eingereicht`)}{" "}
          {date ? <time dateTime={date.iso}>{date.label}</time> : paper.submitted}
        </p>
        <ol className="review-steps" aria-label={tr("Grading workflow steps", "Schritte der Korrektur")}>
          <li className={stage === "verify" ? "is-active" : "is-done"}>
            <span>1</span>
            {tr("Verify extracted answers", "Ausgelesene Antworten prüfen")}
          </li>
          <li className={stage === "grading" ? "is-active" : stage === "review" ? "is-done" : ""}>
            <span>2</span>
            {tr("AI grading", "KI-Bewertung")}
          </li>
          <li className={uploaded ? "is-done" : stage === "review" ? "is-active" : ""}>
            <span>3</span>
            {tr("Review & publish", "Prüfen & veröffentlichen")}
          </li>
        </ol>
      </header>

      {/* STAGE 1: verify the OCR text */}
      {stage === "verify" && (
        <section className="grade-board review-workspace" aria-labelledby="review-workspace-title">
          <header className="review-workspace-heading">
            <div>
              <h2 id="review-workspace-title">{tr("Check extracted answers", "Ausgelesene Antworten prüfen")}</h2>
              <p>{tr("Correct extraction mistakes only. Keep the student’s answer as written on the paper.", "Korrigieren Sie nur Erkennungsfehler. Belassen Sie die Schülerantwort so, wie sie auf dem Blatt steht.")}</p>
            </div>
            <div className="review-attachment">
              <button type="button" className="review-button review-button-outline" onClick={() => fileRef.current.click()}>
                {markScheme ? tr("Replace mark scheme", "Bewertungsschema ersetzen") : tr("Attach mark scheme", "Bewertungsschema anhängen")}
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
                    saveMarkScheme(paper.paper, { name: f.name, criteria: markSchemeCriteria });
                  }
                }}
              />
            </div>
          </header>
          {markScheme && (
            <details className="review-scheme-panel">
              <summary>{tr(`Mark scheme: ${markScheme}`, `Bewertungsschema: ${markScheme}`)}</summary>
              <div className="review-scheme-body">
                <label htmlFor="verify-mark-scheme-criteria">
                  <span>{tr("Mark scheme rubric notes (saved for grading reference)", "Kriterien & Hinweise zum Bewertungsschema (für die Korrektur gespeichert)")}</span>
                </label>
                <textarea
                  id="verify-mark-scheme-criteria"
                  value={markSchemeCriteria}
                  placeholder={tr("Paste or write key rubric points to reference while grading…", "Bewertungskriterien hier einfügen oder notieren …")}
                  onChange={(event) => {
                    const nextCriteria = event.target.value;
                    setMarkSchemeCriteria(nextCriteria);
                    saveMarkScheme(paper.paper, { name: markScheme, criteria: nextCriteria });
                  }}
                />
              </div>
            </details>
          )}

          <form onSubmit={(event) => { event.preventDefault(); startGrading(); }}>
            <div className="review-columns">
              <section className="review-source" aria-labelledby="review-source-title">
                <h3 id="review-source-title">{tr("Submitted paper", "Eingereichte Arbeit")}</h3>
                <p className="review-column-meta">{tr("Page 1 of 1", "Seite 1 von 1")}</p>
                <article className="review-demo-paper" aria-label={tr("Submitted paper with original student answers", "Eingereichte Arbeit mit den ursprünglichen Schülerantworten")}>
                  <header>
                    <h4>{tr("Mathematics", "Mathematik")}</h4>
                    <dl className="review-paper-metadata">
                      <div><dt>{tr("Name:", "Name:")}</dt><dd>{paper.student}</dd></div>
                      <div><dt>{tr("Class:", "Klasse:")}</dt><dd>{paper.classId}</dd></div>
                      <div><dt>{tr("Assignment:", "Aufgabe:")}</dt><dd>{paper.paper}</dd></div>
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
                <h3 id="review-extracted-title">{tr("Extracted answers", "Ausgelesene Antworten")}</h3>
                {answers.length ? answers.map((answer) => (
                  <div key={answer.q} className="review-answer-field">
                    <label htmlFor={`review-answer-${answer.q}`}>
                      <span>{tr(`Question ${answer.q}`, `Aufgabe ${answer.q}`)}</span>
                      <strong>{answer.question}</strong>
                    </label>
                    <input
                      id={`review-answer-${answer.q}`}
                      value={answer.text}
                      onChange={(event) => updateAnswer(answer.q, event.target.value)}
                      required
                      pattern={".*\\S.*"}
                      title={tr("Enter the answer shown on the paper.", "Geben Sie die auf dem Blatt stehende Antwort ein.")}
                      aria-describedby={answer.confidence < 0.8 ? `review-confidence-${answer.q}` : undefined}
                    />
                    {answer.confidence < 0.8 && <p className="review-confidence" id={`review-confidence-${answer.q}`}>{tr("Check this extraction against the paper.", "Bitte diese Erkennung mit dem Originalblatt abgleichen.")}</p>}
                    {(() => {
                      const sig = getStruggleSignal(answer, submissionType);
                      if (sig.noisePercent === null && sig.timeSpentSec === null) return null;
                      return (
                        <p className={`review-signal-inline${sig.hasSignal ? " review-signal-inline-highlight" : ""}`}>
                          {sig.noisePercent !== null
                            ? sig.hasHighNoise
                              ? tr(
                                  `Answer-area erasing noise: ${sig.noisePercent}% (worth a closer look after grading)`,
                                  `Radier-/Rauschanteil im Antwortfeld: ${sig.noisePercent} % (nach Bewertung genauer ansehen)`,
                                )
                              : tr(
                                  `Answer-area erasing noise: ${sig.noisePercent}%`,
                                  `Radier-/Rauschanteil im Antwortfeld: ${sig.noisePercent} %`,
                                )
                            : sig.hasLongTime
                              ? tr(
                                  `Time spent: ${formatDuration(sig.timeSpentSec, lang)} (unusually long)`,
                                  `Bearbeitungszeit: ${formatDuration(sig.timeSpentSec, lang)} (ungewöhnlich lang)`,
                                )
                              : tr(
                                  `Time spent: ${formatDuration(sig.timeSpentSec, lang)}`,
                                  `Bearbeitungszeit: ${formatDuration(sig.timeSpentSec, lang)}`,
                                )}
                        </p>
                      );
                    })()}
                  </div>
                )) : <p className="review-no-answers">{tr("No extracted answers are available. Return to papers and choose another submission.", "Keine ausgelesenen Antworten verfügbar. Kehren Sie zu den Arbeiten zurück und wählen Sie eine andere Abgabe.")}</p>}
              </section>
            </div>
            <footer className="review-workspace-footer">
              <p>{tr("You’ll review the grade before saving.", "Sie prüfen die Bewertung vor dem Speichern.")}</p>
              <button type="submit" className="review-button" disabled={!total}>{tr("Confirm answers and grade", "Antworten bestätigen & bewerten")}</button>
            </footer>
          </form>
        </section>
      )}

      {/* STAGE 2: fake AI delay */}
      {stage === "grading" && (
        <section className="grade-board review-loading" aria-busy="true" aria-labelledby="review-loading-title">
          <div className="grade-spinner" aria-hidden="true" />
          <h2 ref={stageTitleRef} tabIndex={-1} id="review-loading-title">{tr("Grading paper", "Arbeit wird bewertet")}</h2>
          <p role="status">{tr("Your extracted answers are confirmed. Preparing suggested grades for your review.", "Ihre ausgelesenen Antworten sind bestätigt. Bewertungsvorschläge werden vorbereitet.")}</p>
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
                if (redFlags.trim() && currentFlagStatus === "Needs review") {
                  setFlagError(
                    tr(
                      "Choose Confirmed or Dismissed for the red flag before submitting to supervisor.",
                      "Wählen Sie für den Förderhinweis ‚Bestätigt‘ oder ‚Verworfen‘, bevor Sie an die Fachleitung senden.",
                    ),
                  );
                  document.getElementById("review-flag-status")?.focus();
                  return;
                }
                setFlagError("");
                setSupervisor("Sent");
                setToastKey("supervisor");
              } else if (event.nativeEvent.submitter?.value === "publish") {
                publishConfirmedResults();
              } else {
                confirmRef.current.showModal();
                cancelRef.current.focus();
              }
            }}
          >
            <div className="review-question-toggle flex flex-wrap items-center justify-between gap-3">
              <button type="button" className="grade-tool" onClick={() => setStage("verify")}>
                ← {tr("Back to extracted answers", "Zurück zu ausgelesenen Antworten")}
              </button>
              <button type="button" className="grade-tool" aria-expanded={showQuestionDetails} aria-controls="review-question-details" onClick={() => setShowQuestionDetails((show) => !show)}>
                {showQuestionDetails ? tr("Hide question details", "Aufgabendetails ausblenden") : tr("View question details", "Aufgabendetails anzeigen")}
              </button>
            </div>
            <section id="review-question-details" className="review-question-details" aria-labelledby="review-question-details-title" hidden={!showQuestionDetails}>
              <header>
                <h2 id="review-question-details-title">{tr("Question details", "Aufgabendetails")}</h2>
                <p>{tr("Review each answer, grade, and comment before the overall result. Question grades update the total below.", "Prüfen Sie jede Antwort, Punktzahl und Anmerkung vor dem Gesamtergebnis. Die Punkte aktualisieren den Gesamtwert unten.")}</p>
              </header>
              {answers.map((answer) => (
                <article key={answer.q} className="review-question-reference" aria-labelledby={`review-question-title-${answer.q}`}>
                  <div className="review-question-content">
                    <h3 id={`review-question-title-${answer.q}`}>{tr(`Question ${answer.q}`, `Aufgabe ${answer.q}`)}</h3>
                    <p className="review-question-prompt">{answer.question}</p>
                    <dl className="review-question-answers">
                      <div><dt>{tr("Student answer", "Schülerantwort")}</dt><dd>{answer.text}</dd></div>
                      <div><dt>{tr("Expected answer", "Erwartete Antwort")}</dt><dd>{answer.key}</dd></div>
                    </dl>
                    {(() => {
                      const sig = getStruggleSignal(answer, submissionType);
                      if (!sig.hasSignal) return null;
                      return (
                        <p className="review-signal-inline review-signal-inline-highlight">
                          {sig.hasHighNoise
                            ? tr(
                                `Struggle signal · Scanned-paper erasing noise: ${sig.noisePercent}% (advisory only)`,
                                `Hinweis auf Schwierigkeit · Radier-Rauschen: ${sig.noisePercent} % (nur Orientierung)`,
                              )
                            : tr(
                                `Struggle signal · Time on question: ${formatDuration(sig.timeSpentSec, lang)} (typical ${formatDuration(sig.expectedTimeSec, lang)})`,
                                `Hinweis auf Schwierigkeit · Zeit bei Aufgabe: ${formatDuration(sig.timeSpentSec, lang)} (üblich ${formatDuration(sig.expectedTimeSec, lang)})`,
                              )}
                        </p>
                      );
                    })()}
                  </div>
                  <div className="review-question-decision">
                    <div className="review-question-grade">
                      <label htmlFor={`review-question-grade-${answer.q}`}>{tr("Grade", "Punkte")}<span className="sr-only"> {tr(`for question ${answer.q}`, `für Aufgabe ${answer.q}`)}</span></label>
                      <div>
                        <input id={`review-question-grade-${answer.q}`} type="number" min="0" max="1" step="any" required disabled={!showQuestionDetails} value={questionGradeValue(answer)} aria-invalid={!validQuestionGrade(answer)} aria-describedby={!validQuestionGrade(answer) ? `review-question-grade-error-${answer.q}` : undefined} onChange={(event) => { updateReview(setQuestionGrades, { ...questionGrades, [answer.q]: event.target.value }); setScoreOverride(null); }} />
                        <span>/ 1</span>
                      </div>
                      {!validQuestionGrade(answer) && <p id={`review-question-grade-error-${answer.q}`} role="alert">{tr("Enter a grade from 0 to 1.", "Geben Sie einen Wert von 0 bis 1 ein.")}</p>}
                    </div>
                    <ReviewField id={`review-question-comment-${answer.q}`} title={<>{tr("Comment", "Kommentar")}<span className="sr-only"> {tr(`for question ${answer.q}`, `für Aufgabe ${answer.q}`)}</span></>} value={questionComment(answer)} onChange={(value) => updateReview(setQuestionComments, { ...questionComments, [answer.q]: value })} placeholder={tr("Add a comment about this answer.", "Kommentar zu dieser Antwort hinzufügen.")} />
                  </div>
                </article>
              ))}
            </section>

            <header className="review-results-heading">
              <div>
                <h2 ref={stageTitleRef} tabIndex={-1} id="review-results-title">{tr("Review suggested grades", "Bewertungsvorschlag prüfen")}</h2>
                <p>{tr("Check and edit every AI-suggested grade, evaluation metric, feedback note, and red flag before confirmation.", "Prüfen und bearbeiten Sie jede KI-vorgeschlagene Note, Bewertungsmetrik, Rückmeldung und jeden Förderhinweis vor der Bestätigung.")}</p>
              </div>
            </header>

            <details className="review-scheme-panel">
              <summary>
                {markScheme
                  ? tr(`Reference mark scheme · ${markScheme}`, `Bewertungsschema ansehen · ${markScheme}`)
                  : tr("Reference mark scheme (none attached yet)", "Bewertungsschema ansehen (noch keins angehängt)")}
              </summary>
              <div className="review-scheme-body">
                <p>{markSchemeCriteria || tr("No rubric criteria recorded yet. You can add rubric notes below.", "Noch keine Kriterien hinterlegt. Sie können unten Kriterien ergänzen.")}</p>
                <textarea
                  aria-label={tr("Mark scheme criteria", "Bewertungskriterien")}
                  value={markSchemeCriteria}
                  onChange={(event) => {
                    const nextCriteria = event.target.value;
                    setMarkSchemeCriteria(nextCriteria);
                    saveMarkScheme(paper.paper, { name: markScheme || `${paper.paper}_Rubric`, criteria: nextCriteria });
                  }}
                />
              </div>
            </details>

            {struggleItems.length > 0 && (
              <section className="review-struggle-section" aria-labelledby="review-struggle-title">
                <header className="review-struggle-header">
                  <h3 id="review-struggle-title">
                    {tr(
                      `Struggle signals · ${struggleItems.length} ${struggleItems.length === 1 ? "question" : "questions"} highlighted`,
                      `Schwierigkeitshinweise · ${struggleItems.length} ${struggleItems.length === 1 ? "Aufgabe" : "Aufgaben"} hervorgehoben`,
                    )}
                  </h3>
                  <p>
                    {tr(
                      "Advisory only: based on high erasing noise on scanned work or unusually long time on online questions. These signals never change grades or create red flags on their own—decide what each highlight means before sharing anything.",
                      "Nur als Orientierung: basiert auf starkem Radier-Rauschen auf gescannten Bögen oder ungewöhnlich langer Bearbeitungszeit bei Online-Aufgaben. Diese Hinweise ändern niemals Noten und erzeugen keine Förderhinweise – entscheiden Sie selbst über die Bedeutung, bevor etwas geteilt wird.",
                    )}
                  </p>
                </header>
                <ul className="review-struggle-list">
                  {struggleItems.map(({ answer, signal }) => {
                    const decision = signalDecisions[answer.q] ?? "unreviewed";
                    const canAddNote = (decision === "concept_struggle" || decision === "hesitation") && !signalNotesAdded[answer.q];
                    return (
                      <li key={answer.q} className="review-struggle-item">
                        <div className="review-struggle-item-top">
                          <strong>{tr(`Question ${answer.q}:`, `Aufgabe ${answer.q}:`)} {answer.question}</strong>
                          <span className="review-struggle-metric">
                            {signal.hasHighNoise
                              ? tr(`Erasing noise: ${signal.noisePercent}%`, `Radier-Rauschen: ${signal.noisePercent} %`)
                              : tr(
                                  `Time spent: ${formatDuration(signal.timeSpentSec, lang)} (typical ${formatDuration(signal.expectedTimeSec, lang)})`,
                                  `Zeit: ${formatDuration(signal.timeSpentSec, lang)} (üblich ${formatDuration(signal.expectedTimeSec, lang)})`,
                                )}
                          </span>
                        </div>
                        <p className="review-struggle-context">
                          {questionGrade(answer) >= 1
                            ? tr(
                                `Current answer “${answer.text}” is marked full credit—signal only flags extra erasing or time worth a closer look.`,
                                `Die aktuelle Antwort „${answer.text}“ ist mit voller Punktzahl bewertet – der Hinweis zeigt lediglich erhöhtes Radieren bzw. längere Zeit an.`,
                              )
                            : tr(
                                `Current answer: “${answer.text}” (expected: “${answer.key}”).`,
                                `Aktuelle Antwort: „${answer.text}“ (erwartet: „${answer.key}“).`,
                              )}
                        </p>
                        <div className="review-struggle-controls">
                          <label htmlFor={`struggle-decision-${answer.q}`}>
                            <span>{tr("Teacher interpretation", "Einordnung der Lehrkraft")}</span>
                            <select
                              id={`struggle-decision-${answer.q}`}
                              value={decision}
                              onChange={(event) => {
                                const val = event.target.value;
                                setSignalDecisions((prev) => ({ ...prev, [answer.q]: val }));
                                setSignalNotesAdded((prev) => ({ ...prev, [answer.q]: false }));
                              }}
                            >
                              <option value="unreviewed">{signalDecisionLabel("unreviewed")}</option>
                              <option value="concept_struggle">{signalDecisionLabel("concept_struggle")}</option>
                              <option value="hesitation">{signalDecisionLabel("hesitation")}</option>
                              <option value="benign">{signalDecisionLabel("benign")}</option>
                            </select>
                          </label>
                          <button
                            type="button"
                            className="grade-tool"
                            disabled={!canAddNote}
                            onClick={() => addSignalNoteToFeedback(answer, decision)}
                          >
                            {signalNotesAdded[answer.q]
                              ? tr("Note added to feedback", "Hinweis zum Feedback hinzugefügt")
                              : tr("Add note to feedback", "Hinweis in Feedback übernehmen")}
                          </button>
                        </div>
                        <p className="review-struggle-privacy">
                          {signalNotesAdded[answer.q]
                            ? tr("Included in Feedback below for your final save decision.", "Unten im Feedback-Feld übernommen (wird erst beim Speichern bestätigt).")
                            : tr("Private to teacher — not shared with student or parent.", "Nur für Lehrkraft sichtbar — wird nicht automatisch mit Schüler oder Eltern geteilt.")}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
            <div className="grade-review">
              <div className="review-report-fields">
                <ReviewField id="review-feedback" title={tr("Feedback", "Feedback")} value={feedback} onChange={(value) => updateReview(setFeedbackOverride, value)} placeholder={tr("Add feedback for the student.", "Feedback für den Schüler hinzufügen.")} rows={3} />
                <ReviewField id="review-gaps" title={tr("Learning gaps", "Lernlücken")} value={gapsOverride ?? gaps.join("\n")} onChange={(value) => updateReview(setGapsOverride, value)} placeholder={tr("No learning gaps identified.", "Keine Lernlücken festgestellt.")} />
                <ReviewField id="review-mistakes" title={tr("Repeated mistakes", "Wiederholte Fehler")} value={mistakesOverride ?? mistakes.join("\n")} onChange={(value) => updateReview(setMistakesOverride, value)} placeholder={tr("No repeated mistakes identified.", "Keine wiederholten Fehler festgestellt.")} rows={3} />
              </div>
              <div className="review-report-decisions">
                <div className="review-overall-score">
                  <label htmlFor="review-score">{tr("Overall score", "Gesamtpunktzahl")}</label>
                  <div className="review-score-summary">
                    <div className="review-score-field">
                      <div>
                        <input id="review-score" type="number" min="0" max={total} step="any" required value={scoreValue} onChange={(event) => updateReview(setScoreOverride, event.target.value)} aria-describedby={validScore ? "review-score-total review-score-percentage" : "review-score-error"} aria-invalid={!validScore} />
                        <span id="review-score-total">/ {total}</span>
                      </div>
                      <p id="review-score-percentage" className="sr-only">{Math.round((total ? score / total : 0) * 100)} {tr("percent", "Prozent")}</p>
                    </div>
                    <ScoreRing score={score} total={total} />
                    {!validScore && <p id="review-score-error" className="review-score-error" role="alert">{tr(`Enter a score from 0 to ${total}.`, `Geben Sie einen Wert von 0 bis ${total} ein.`)}</p>}
                  </div>
                </div>
                <div className="review-flags-field">
                  <ReviewField id="review-flags" title={tr("Red flags", "Förderhinweise")} value={redFlags} onChange={(value) => { updateReview(setFlagOverride, value); if (!redFlags.trim()) setFlagStatus(null); }} placeholder={tr("No red flags identified.", "Keine Förderhinweise festgestellt.")} rows={3} />
                  <label className="review-flag-status" htmlFor="review-flag-status">
                    <span>{tr("Flag status", "Status des Hinweises")}</span>
                    <select
                      id="review-flag-status"
                      value={currentFlagStatus}
                      disabled={!redFlags.trim()}
                      aria-invalid={Boolean(flagError)}
                      aria-describedby={flagError ? "review-flag-error" : undefined}
                      onChange={(event) => updateReview(setFlagStatus, event.target.value)}
                    >
                      {!redFlags.trim() && <option value="None">{tr("No red flags", "Keine Förderhinweise")}</option>}
                      <option value="Needs review">{translateValue("Needs review", lang)}</option>
                      <option value="Confirmed">{translateValue("Confirmed", lang)}</option>
                      <option value="Dismissed">{translateValue("Dismissed", lang)}</option>
                    </select>
                  </label>
                  {flagError && (
                    <p id="review-flag-error" className="review-flag-error" role="alert">
                      {flagError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <section className="review-metrics-box" aria-labelledby="review-metrics-title">
              <h3 id="review-metrics-title">{tr("Student evaluation metrics (teacher-confirmed)", "Bewertungsmetriken des Schülers (von Lehrkraft bestätigt)")}</h3>
              <p className="review-release-note">
                {tr(
                  "Adjust individual metric scores if needed. Findings reach the student and parent only after teacher & supervisor confirmation.",
                  "Passen Sie einzelne Metriken bei Bedarf an. Ergebnisse erreichen Schüler und Eltern erst nach Bestätigung durch Lehrkraft und Fachleitung.",
                )}
              </p>
              <div className="review-metrics-grid">
                <label>
                  <span>{tr("Topic accuracy (%)", "Fachliche Genauigkeit (%)")}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={metrics.accuracy}
                    onChange={(event) => updateReview(setMetricOverrides, { ...metricOverrides, accuracy: Number(event.target.value) })}
                  />
                </label>
                <label>
                  <span>{tr("Problem solving (%)", "Problemlösung (%)")}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={metrics.problemSolving}
                    onChange={(event) => updateReview(setMetricOverrides, { ...metricOverrides, problemSolving: Number(event.target.value) })}
                  />
                </label>
                <label>
                  <span>{tr("Showing work & steps (%)", "Lösungsweg & Darstellung (%)")}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={metrics.clarity}
                    onChange={(event) => updateReview(setMetricOverrides, { ...metricOverrides, clarity: Number(event.target.value) })}
                  />
                </label>
              </div>
            </section>

            {supervisor === "Sent" && (
              <section className="review-supervisor-box" aria-labelledby="review-supervisor-panel-title">
                <h3 id="review-supervisor-panel-title">{tr("Supervisor review queue", "Prüfung durch Fachleitung")}</h3>
                <p>
                  {tr(
                    `Reviewing ${paper.student} · ${paper.paper}: Score ${score}/${total}. Confirming here automatically uploads the final grades and teacher-confirmed findings.`,
                    `Prüfung für ${paper.student} · ${paper.paper}: Punktzahl ${score}/${total}. Nach Bestätigung werden Endnote und freigegebene Hinweise automatisch hochgeladen.`,
                  )}
                </p>
                <ReviewField
                  id="review-supervisor-note"
                  title={tr("Supervisor verification note (optional)", "Prüfvermerk der Fachleitung (optional)")}
                  value={supervisorNote}
                  onChange={setSupervisorNote}
                  placeholder={tr("e.g. Verified against mark scheme; approved for publication.", "z. B. Mit Bewertungsschema abgeglichen; zur Veröffentlichung freigegeben.")}
                />
                <div className="review-supervisor-actions">
                  <button type="button" className="grade-primary" onClick={confirmSupervisorAssessment}>
                    {tr("Supervisor: Confirm assessment", "Fachleitung: Bewertung bestätigen")}
                  </button>
                  <button
                    type="button"
                    className="grade-tool"
                    onClick={() => {
                      setSupervisor("Not sent");
                      setToastKey("revision_requested");
                    }}
                  >
                    {tr("Request teacher revision", "Überarbeitung anfordern")}
                  </button>
                </div>
              </section>
            )}

            <footer className="grade-footer">
              <div className="review-supervisor-action">
                <div className="flex flex-wrap items-center gap-3">
                  {hasReviewEdits && !uploaded && (
                    <button type="button" className="grade-tool" onClick={resetToAiDefaults}>
                      {tr("Reset AI defaults", "Änderungen zurücksetzen")}
                    </button>
                  )}
                  <button ref={saveRef} type="submit" name="action" value="save" className="grade-tool" disabled={draftSaved || uploaded}>
                    {draftSaved ? tr("Teacher review saved", "Lehrkraft-Prüfung gespeichert") : tr("Save teacher review", "Lehrkraft-Prüfung speichern")}
                  </button>
                  <button type="submit" name="action" value="supervisor" className="grade-tool" disabled={supervisor === "Sent" || supervisor === "Confirmed"}>
                    {supervisor === "Confirmed"
                      ? tr("Confirmed by supervisor", "Von Fachleitung bestätigt")
                      : supervisor === "Sent"
                        ? tr("Submitted to supervisor", "An Fachleitung eingereicht")
                        : tr("Submit to supervisor", "An Fachleitung senden")}
                  </button>
                </div>
                <span className="review-supervisor-status">
                  {uploaded
                    ? tr("Supervisor confirmed · Confirmed results published", "Fachleitung bestätigt · Ergebnisse veröffentlicht")
                    : supervisor === "Confirmed"
                      ? tr("Supervisor confirmed · Ready to publish confirmed results", "Fachleitung bestätigt · Bereit zur Veröffentlichung")
                      : supervisor === "Sent"
                        ? tr("Awaiting supervisor confirmation", "Wartet auf Bestätigung der Fachleitung")
                        : draftSaved
                          ? tr("Review saved · Next, submit to supervisor", "Prüfung gespeichert · Als Nächstes an Fachleitung senden")
                          : tr("Save review or submit to supervisor", "Prüfung speichern oder an Fachleitung senden")}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {uploaded && <button type="button" className="grade-tool" onClick={() => navigate("/teacher/papers")}>{tr("Back to papers", "Zurück zu den Arbeiten")}</button>}
                <button
                  type="submit"
                  name="action"
                  value="publish"
                  className="grade-primary"
                  disabled={supervisor !== "Confirmed" || uploaded}
                >
                  {uploaded
                    ? tr("Published & uploaded", "Veröffentlicht & hochgeladen")
                    : tr("Publish confirmed results", "Bestätigte Ergebnisse veröffentlichen")}
                </button>
              </div>
            </footer>
          </form>
        </section>
      )}

      {toast && <div className="review-notice" role="status"><p>{toast}</p><button type="button" onClick={() => setToastKey(null)}>{tr("Dismiss notice", "Hinweis schließen")}</button></div>}

      <dialog ref={confirmRef} className="review-confirm" aria-labelledby="review-confirm-title" aria-describedby="review-confirm-description" onClose={() => { if (!saveRef.current?.disabled) saveRef.current?.focus(); else stageTitleRef.current?.focus(); }}>
        <h2 id="review-confirm-title">{tr("Save teacher review?", "Lehrkraft-Prüfung speichern?")}</h2>
        <p id="review-confirm-description">
          {tr(
            `Save your reviewed grade of ${score}/${total}, feedback, and edits for ${paper.student}? Next you can submit to a supervisor before publishing.`,
            `Geprüfte Bewertung ${score}/${total}, Feedback und Änderungen für ${paper.student} speichern? Danach können Sie vor der Veröffentlichung an die Fachleitung senden.`,
          )}
        </p>
        <div className="review-confirm-actions">
          <button ref={cancelRef} type="button" className="review-button review-button-outline" onClick={() => confirmRef.current.close()}>{tr("Cancel", "Abbrechen")}</button>
          <button type="button" className="review-button" onClick={saveTeacherReview}>{tr("Save review", "Prüfung speichern")}</button>
        </div>
      </dialog>
    </div>
  );
}
