import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeacherData } from "../../i18n/teacherDataDe";
import { useLanguage } from "../../i18n/useLanguage";
import { formatDuration, getStruggleSignal } from "../../utils/struggleSignals";
import RadarChart from "../../components/RadarChart";
import ParentMessageModal from "../../components/ParentMessageModal";
import keepDialogFocus from "../../utils/dialogFocus";
import "../../styles/teacher-student-details.css";

export default function TeacherStudentDetails() {
  const { classId, studentId } = useParams();
  return <StudentView key={`${classId}:${studentId}`} />;
}

function StudentView() {
  const { lang, tr } = useLanguage();
  const { classes, students, studentDetails } = getTeacherData(lang);
  const percentage = (value) => (Number.isFinite(value) ? `${value}%` : tr("Not available", "Nicht verfügbar"));

  const { classId, studentId } = useParams();
  const student = students.find((item) => String(item.id) === studentId && item.classId === classId);
  const currentClass = classes.find((item) => item.id === classId);
  const details = student ? studentDetails[studentId] : null;
  const assessments = details?.assessments ?? [];
  const gaps = details?.gaps ?? [];
  const repeated = details?.repeated ?? [];
  const topics = (details?.topics ?? []).map((topic) => ({
    ...topic,
    label: topic.label === "Word Probs" ? tr("Word problems", "Textaufgaben") : topic.label,
  }));
  const chartTopics = topics.filter((topic) => Number.isFinite(topic.value) && topic.value >= 0 && topic.value <= 100);

  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [flagStatuses, setFlagStatuses] = useState({});
  const [signalDecisions, setSignalDecisions] = useState({});
  const [dismissing, setDismissing] = useState(null);
  const [noticeKey, setNoticeKey] = useState(null);
  const [parentOpen, setParentOpen] = useState(false);
  const [addedStudentMsgs, setAddedStudentMsgs] = useState([]);
  const [addedParentMsgs, setAddedParentMsgs] = useState([]);
  const [draft, setDraft] = useState("");
  const [messageStatusKey, setMessageStatusKey] = useState("");
  const titleRef = useRef(null);
  const overviewRef = useRef(null);
  const composerRef = useRef(null);
  const logRef = useRef(null);
  const dismissRef = useRef(null);
  const cancelRef = useRef(null);
  const flagTriggerRef = useRef(null);
  const parentTriggerRef = useRef(null);

  const flags = (details?.redFlags ?? []).map((flag) => ({ ...flag, status: flagStatuses[flag.id] ?? "open" }));
  const messages = {
    student: [...(details?.messages?.student ?? []), ...addedStudentMsgs],
    parent: [...(details?.messages?.parent ?? []), ...addedParentMsgs],
  };

  useEffect(() => { titleRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [addedStudentMsgs.length, details?.messages?.student?.length]);

  const backLink = (
    <Link to={currentClass ? `/teacher/classes/${classId}` : "/teacher/classes"} className="tsd-back-link">
      <span aria-hidden="true">←</span>{" "}
      {tr(`Back to ${currentClass?.name ?? "classes"}`, `Zurück zu ${currentClass?.name ?? "Klassen"}`)}
    </Link>
  );

  if (!student) return (
    <div className="teacher-student-details">
      {backLink}
      <h1 ref={titleRef} tabIndex={-1}>{tr("Student not found", "Schüler nicht gefunden")}</h1>
      <p className="tsd-intro-note">{tr("Choose a student from the class roster to view their feedback.", "Wählen Sie einen Schüler aus der Klassenliste aus, um sein Feedback anzuzeigen.")}</p>
    </div>
  );

  const assessment = assessments[assessmentIndex];
  const visibleFlags = flags.filter((flag) => flag.status !== "dismissed");
  const pendingFlags = visibleFlags.filter((flag) => flag.status === "open").length;
  const findingsAvailable = details && [details.gaps, details.repeated, details.redFlags].every(Array.isArray);
  const hasFindings = gaps.length || repeated.length || visibleFlags.length;
  const parentName = student.parent ?? tr(`Parent of ${student.name}`, `Elternteil von ${student.name}`);

  const confirmFlag = (id) => {
    setFlagStatuses((previous) => ({ ...previous, [id]: "confirmed" }));
    setNoticeKey({ kind: "confirmed" });
    overviewRef.current?.focus({ preventScroll: true });
  };

  const dismissFlag = () => {
    const flag = dismissing;
    const prevStatus = flag.status;
    setFlagStatuses((previous) => ({ ...previous, [flag.id]: "dismissed" }));
    setNoticeKey({
      kind: "dismissed",
      undo: () => {
        setFlagStatuses((previous) => ({ ...previous, [flag.id]: prevStatus }));
        setNoticeKey({ kind: "restored" });
        overviewRef.current?.focus({ preventScroll: true });
      },
    });
    dismissRef.current.close();
  };

  const noticeText =
    noticeKey?.kind === "confirmed"
      ? tr("Support flag confirmed.", "Förderhinweis bestätigt.")
      : noticeKey?.kind === "dismissed"
        ? tr("Support flag dismissed.", "Förderhinweis verworfen.")
        : noticeKey?.kind === "restored"
          ? tr("Support flag restored.", "Förderhinweis wiederhergestellt.")
          : "";

  const sendStudentMessage = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setAddedStudentMsgs((previous) => [...previous, { from: "teacher", text: draft.trim(), isJustNow: true }]);
    setDraft("");
    setMessageStatusKey("sent");
    composerRef.current.focus();
  };

  const sendParentMessage = (text, emergency) => {
    setAddedParentMsgs((previous) => [...previous, { from: "teacher", text, isJustNow: true, emergency }]);
  };

  return (
    <div className="teacher-student-details">
      <header className="tsd-intro">
        {backLink}
        <div className="tsd-identity">
          <div>
            <h1 ref={titleRef} tabIndex={-1}>{student.name}</h1>
            <dl className="tsd-summary">
              <div><dt>{tr("Class", "Klasse")}</dt><dd>{classId}</dd></div>
              <div><dt>{tr("Attendance", "Anwesenheit")}</dt><dd>{percentage(student.attendance)}</dd></div>
              <div><dt>{tr("Overall grade", "Gesamtnote")}</dt><dd>{percentage(student.grade)}</dd></div>
            </dl>
          </div>
          <button ref={parentTriggerRef} type="button" className="tsd-button tsd-primary" onClick={() => setParentOpen(true)}>{tr("Contact parent", "Eltern kontaktieren")}</button>
        </div>
      </header>

      <div className="tsd-notice" hidden={!noticeKey}>
        <p role="status">{noticeText}</p>
        {noticeKey?.undo && <button type="button" className="tsd-button" onClick={noticeKey.undo}>{tr("Undo dismissal", "Verwerfen rückgängig machen")}</button>}
        <button type="button" className="tsd-button" onClick={() => { setNoticeKey(null); overviewRef.current?.focus({ preventScroll: true }); }}>{tr("Dismiss notice", "Hinweis schließen")}</button>
      </div>

      <div className="tsd-sections">
        <section className="tsd-board tsd-objectives" aria-labelledby="tsd-overview-title">
          <header className="tsd-panel-heading"><h2 ref={overviewRef} tabIndex={-1} id="tsd-overview-title">{tr("Learning Objectives", "Lernziele")}</h2></header>
          <div className="tsd-objectives-grid">
            <div className="tsd-topics">
              {topics.length > 0 ? (
                <div className="tsd-topic-inset">
                  <h3>{tr("Topic scores", "Themenwerte")}</h3>
                  {chartTopics.length >= 3 && <div className="tsd-radar" aria-hidden="true"><RadarChart data={chartTopics} size={400} /></div>}
                  <dl className="tsd-topic-scores">
                    {topics.map((topic) => <div key={topic.label}><dt>{topic.label}</dt><dd>{chartTopics.includes(topic) ? percentage(topic.value) : tr("Not available", "Nicht verfügbar")}</dd></div>)}
                  </dl>
                </div>
              ) : <p className="tsd-empty">{tr("No topic analysis available.", "Keine Themenanalyse verfügbar.")}</p>}

            </div>
            <div className="tsd-support">
              {visibleFlags.length > 0 && (
                <div className="tsd-findings">
                  <h3>{tr("Support flags", "Förderhinweise")}</h3>
                  <p className="tsd-meta">
                    {pendingFlags
                      ? lang === "de"
                        ? `${pendingFlags} ${pendingFlags === 1 ? "Hinweis muss" : "Hinweise müssen"} geprüft werden.`
                        : `${pendingFlags} ${pendingFlags === 1 ? "flag needs" : "flags need"} review.`
                      : tr("All active flags reviewed.", "Alle aktiven Hinweise wurden geprüft.")}
                  </p>
                  <ul className="tsd-flags">
                    {visibleFlags.map((flag) => (
                      <li key={flag.id}>
                        <p>{flag.text}</p>
                        {flag.status === "confirmed" ? <p className="tsd-flag-status">{tr("Confirmed", "Bestätigt")}</p> : (
                          <div className="tsd-flag-actions">
                            <button type="button" className="tsd-button" aria-label={tr(`Confirm support flag: ${flag.text}`, `Förderhinweis bestätigen: ${flag.text}`)} onClick={() => confirmFlag(flag.id)}>{tr("Confirm", "Bestätigen")}</button>
                            <button type="button" className="tsd-button tsd-outline" aria-label={tr(`Dismiss support flag: ${flag.text}`, `Förderhinweis verwerfen: ${flag.text}`)} onClick={(event) => {
                              flagTriggerRef.current = event.currentTarget;
                              setDismissing(flag);
                              dismissRef.current.showModal();
                              cancelRef.current.focus();
                            }}>{tr("Dismiss", "Verwerfen")}</button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {gaps.length > 0 && <div className="tsd-findings"><h3>{tr("Topics needing practice", "Themen mit Übungsbedarf")}</h3><ul className="tsd-finding-list">{gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul></div>}
              {repeated.length > 0 && <div className="tsd-findings"><h3>{tr("Repeated mistakes", "Wiederholte Fehler")}</h3><ul className="tsd-finding-list">{repeated.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul></div>}
              {!hasFindings && <p className="tsd-empty">{findingsAvailable ? tr("No learning gaps, repeated mistakes, or active support flags recorded.", "Keine Lernlücken, wiederholten Fehler oder aktiven Förderhinweise erfasst.") : tr("Learning gaps, repeated mistakes, and support flags are not available yet.", "Lernlücken, wiederholte Fehler und Förderhinweise sind noch nicht verfügbar.")}</p>}
            </div>
          </div>
        </section>

        <section className="tsd-board" aria-labelledby="tsd-feedback-title">
          <header className="tsd-panel-heading"><h2 id="tsd-feedback-title">{tr("Assessment feedback", "Bewertungsfeedback")}</h2></header>
          {assessment ? (
            <>
              <div className="tsd-assessment-heading">
                {assessments.length > 1 ? (
                  <div className="tsd-assessment-picker">
                    <label htmlFor="tsd-assessment">{tr("Assessment", "Leistungsnachweis")}</label>
                    <select id="tsd-assessment" value={assessmentIndex} onChange={(event) => setAssessmentIndex(Number(event.target.value))}>
                      {assessments.map((item, index) => <option key={item.id} value={index}>{item.title}</option>)}
                    </select>
                  </div>
                ) : <h3>{assessment.title}</h3>}
                <p className="tsd-score" role="status">{assessments.length > 1 && <span className="tsd-sr-only">{assessment.title}. </span>}{tr("Score", "Punktzahl")} <strong>{assessment.score ?? tr("Not available", "Nicht verfügbar")}</strong></p>
              </div>
              <ol className="tsd-questions" aria-label={tr(`${assessment.title} question results`, `Aufgabenergebnisse für ${assessment.title}`)}>
                {assessment.items?.length ? assessment.items.map((item, index) => {
                  const subType = assessment.submissionType ?? (assessment.id === "quiz1" ? "online" : "scan");
                  const sig = getStruggleSignal(item, subType);
                  return (
                    <li key={index}>
                      <div className="tsd-question-heading">
                        <h3><span className="tsd-question-number">{index + 1}.</span> {item.q}</h3>
                        <p className="tsd-result">{item.correct === true ? tr("✓ Correct", "✓ Richtig") : item.correct === false ? tr("× Incorrect", "× Falsch") : tr("Not reviewed", "Nicht geprüft")}</p>
                      </div>
                      <p><span className="tsd-meta">{tr("Student answer:", "Schülerantwort:")}</span> {item.answer ?? tr("No answer recorded", "Keine Antwort erfasst")}</p>
                      {sig.hasSignal && (
                        <p className="tsd-signal-pill">
                          {sig.hasHighNoise
                            ? tr(
                                `Struggle signal · Erasing noise: ${sig.noisePercent}% (advisory)`,
                                `Schwierigkeitshinweis · Radier-Rauschen: ${sig.noisePercent} % (Orientierung)`,
                              )
                            : tr(
                                `Struggle signal · Time spent: ${formatDuration(sig.timeSpentSec, lang)} (typical ${formatDuration(sig.expectedTimeSec, lang)})`,
                                `Schwierigkeitshinweis · Zeit: ${formatDuration(sig.timeSpentSec, lang)} (üblich ${formatDuration(sig.expectedTimeSec, lang)})`,
                              )}
                        </p>
                      )}
                    </li>
                  );
                }) : <li>{tr("No question details available for this assessment.", "Keine Aufgabendetails für diesen Leistungsnachweis verfügbar.")}</li>}
              </ol>
              {(() => {
                const subType = assessment.submissionType ?? (assessment.id === "quiz1" ? "online" : "scan");
                const highlighted = (assessment.items ?? [])
                  .map((item, index) => ({ item, index, sig: getStruggleSignal(item, subType) }))
                  .filter(({ sig }) => sig.hasSignal);
                if (!highlighted.length) return null;
                return (
                  <div className="tsd-struggle-box">
                    <h3>{tr("Struggle signals (teacher review only)", "Schwierigkeitshinweise (nur für Lehrkraft)")}</h3>
                    <p className="tsd-struggle-note">
                      {tr(
                        "Pointing to questions worth a closer look based on erasing noise or unusually long response time. Never creates a grade or red flag automatically.",
                        "Weist auf Aufgaben hin, die aufgrund von Radier-Rauschen oder langer Bearbeitungszeit genauer betrachtet werden sollten. Erzeugt niemals automatisch Noten oder Förderhinweise.",
                      )}
                    </p>
                    <ul className="tsd-struggle-list">
                      {highlighted.map(({ item, index, sig }) => {
                        const key = `${assessment.id}:${index}`;
                        const decision = signalDecisions[key] ?? "unreviewed";
                        return (
                          <li key={key} className="tsd-struggle-item">
                            <div className="tsd-struggle-top">
                              <strong>{index + 1}. {item.q}</strong>
                              <span className="tsd-struggle-metric">
                                {sig.hasHighNoise
                                  ? tr(`Erasing noise: ${sig.noisePercent}%`, `Radier-Rauschen: ${sig.noisePercent} %`)
                                  : tr(`Time spent: ${formatDuration(sig.timeSpentSec, lang)}`, `Zeit: ${formatDuration(sig.timeSpentSec, lang)}`)}
                              </span>
                            </div>
                            <div className="tsd-struggle-controls">
                              <label htmlFor={`tsd-signal-${key}`}>
                                <span>{tr("Your interpretation", "Ihre Einordnung")}</span>
                                <select
                                  id={`tsd-signal-${key}`}
                                  value={decision}
                                  onChange={(event) => setSignalDecisions((prev) => ({ ...prev, [key]: event.target.value }))}
                                >
                                  <option value="unreviewed">{tr("Needs teacher decision (private)", "Noch nicht entschieden (privat)")}</option>
                                  <option value="concept_struggle">{tr("Concept struggle — follow up with student", "Verständnisschwierigkeit — nachbesprechen")}</option>
                                  <option value="hesitation">{tr("Hesitation / took extra care", "Unsicherheit / sorgfältig gearbeitet")}</option>
                                  <option value="benign">{tr("Benign — ignore signal", "Unkritisch — Hinweis ignorieren")}</option>
                                </select>
                              </label>
                              <span className="tsd-struggle-status">
                                {decision === "unreviewed"
                                  ? tr("Private — not shared", "Privat — nicht geteilt")
                                  : tr("Reviewed by teacher (kept private)", "Von Lehrkraft eingeordnet (privat)")}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}
              <div className="tsd-feedback"><h3>{tr("Teacher feedback", "Feedback der Lehrkraft")}</h3><p>{assessment.feedback || tr("No written feedback available.", "Kein schriftliches Feedback verfügbar.")}</p></div>
            </>
          ) : <p className="tsd-empty">{tr("No assessment feedback available.", "Kein Bewertungsfeedback verfügbar.")}</p>}
        </section>
      </div>

      <section className="tsd-board tsd-messages" aria-labelledby="tsd-message-title">
        <header className="tsd-panel-heading"><h2 id="tsd-message-title">{tr(`Message ${student.name}`, `Nachricht an ${student.name}`)}</h2></header>
        <p id="tsd-message-note" className="tsd-message-note">{tr("Messages stay on this page and are not delivered.", "Nachrichten bleiben auf dieser Seite und werden nicht zugestellt.")}</p>
        <div ref={logRef} className="tsd-chat-log" role="log" aria-label={tr(`Conversation with ${student.name}`, `Gespräch mit ${student.name}`)} aria-live="polite" aria-relevant="additions" tabIndex={0}>
          {messages.student.length ? messages.student.map((message, index) => (
            <div key={index} className="tsd-chat-message">
              <div className="tsd-message-heading"><p>{message.from === "teacher" ? tr("You", "Sie") : student.name}</p><p>{message.isJustNow ? tr("Just now", "Gerade eben") : message.time}</p></div>
              <p>{message.text}</p>
            </div>
          )) : <p className="tsd-meta">{tr("No messages yet. Write a message to start the conversation.", "Noch keine Nachrichten. Schreiben Sie eine Nachricht, um die Unterhaltung zu beginnen.")}</p>}
        </div>
        <form className="tsd-message-form" onSubmit={sendStudentMessage}>
          <label htmlFor="tsd-message">{tr(`Your message to ${student.name}`, `Ihre Nachricht an ${student.name}`)}</label>
          <textarea id="tsd-message" ref={composerRef} rows={3} value={draft} onChange={(event) => setDraft(event.target.value)} aria-describedby="tsd-message-note" placeholder={tr("Write your message", "Schreiben Sie Ihre Nachricht")} />
          <button type="submit" className="tsd-button" disabled={!draft.trim()}>{tr("Send message", "Nachricht senden")}</button>
        </form>
        <p className="tsd-message-status" role="status">{messageStatusKey === "sent" ? tr("Message added to this conversation.", "Nachricht zu dieser Unterhaltung hinzugefügt.") : ""}</p>
      </section>

      <ParentMessageModal isOpen={parentOpen} parentName={parentName} studentName={student.name} messages={messages.parent.map((m) => ({ ...m, time: m.isJustNow ? tr("Just now", "Gerade eben") : m.time }))} onSend={sendParentMessage} onClose={() => {
        setParentOpen(false);
        parentTriggerRef.current?.focus();
      }} />

      <dialog ref={dismissRef} className="tsd-dialog" aria-labelledby="tsd-dismiss-title" aria-describedby="tsd-dismiss-description" onKeyDown={keepDialogFocus} onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }} onClose={() => {
        setDismissing(null);
        const target = flagTriggerRef.current?.isConnected ? flagTriggerRef.current : overviewRef.current;
        target?.focus({ preventScroll: true });
      }}>
        <h2 id="tsd-dismiss-title">{tr("Dismiss this support flag?", "Diesen Förderhinweis verwerfen?")}</h2>
        <p>{dismissing?.text}</p>
        <p id="tsd-dismiss-description">{tr("You can undo the dismissal using the notice on this page.", "Sie können das Verwerfen über den Hinweis auf dieser Seite rückgängig machen.")}</p>
        <div className="tsd-dialog-actions">
          <button ref={cancelRef} type="button" className="tsd-button" onClick={() => dismissRef.current.close()}>{tr("Cancel", "Abbrechen")}</button>
          <button type="button" className="tsd-button tsd-primary" onClick={dismissFlag}>{tr("Dismiss flag", "Hinweis verwerfen")}</button>
        </div>
      </dialog>
    </div>
  );
}
