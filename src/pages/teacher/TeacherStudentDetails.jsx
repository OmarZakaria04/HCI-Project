import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { classes, students, studentDetails } from "../../data/teacherData";
import RadarChart from "../../components/RadarChart";
import ParentMessageModal from "../../components/ParentMessageModal";
import keepDialogFocus from "../../utils/dialogFocus";
import "../../styles/teacher-student-details.css";

const percentage = (value) => Number.isFinite(value) ? `${value}%` : "Not available";

export default function TeacherStudentDetails() {
  const { classId, studentId } = useParams();
  return <StudentView key={`${classId}:${studentId}`} />;
}

function StudentView() {
  const { classId, studentId } = useParams();
  const student = students.find((item) => String(item.id) === studentId && item.classId === classId);
  const currentClass = classes.find((item) => item.id === classId);
  const details = student ? studentDetails[studentId] : null;
  const assessments = details?.assessments ?? [];
  const gaps = details?.gaps ?? [];
  const repeated = details?.repeated ?? [];
  const topics = (details?.topics ?? []).map((topic) => ({
    ...topic, label: topic.label === "Word Probs" ? "Word problems" : topic.label,
  }));
  const chartTopics = topics.filter((topic) => Number.isFinite(topic.value) && topic.value >= 0 && topic.value <= 100);

  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [flags, setFlags] = useState(() => (details?.redFlags ?? []).map((flag) => ({ ...flag, status: "open" })));
  const [dismissing, setDismissing] = useState(null);
  const [notice, setNotice] = useState(null);
  const [parentOpen, setParentOpen] = useState(false);
  const [messages, setMessages] = useState(() => ({
    student: details?.messages?.student ?? [], parent: details?.messages?.parent ?? [],
  }));
  const [draft, setDraft] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const titleRef = useRef(null);
  const overviewRef = useRef(null);
  const composerRef = useRef(null);
  const logRef = useRef(null);
  const dismissRef = useRef(null);
  const cancelRef = useRef(null);
  const flagTriggerRef = useRef(null);
  const parentTriggerRef = useRef(null);

  useEffect(() => { titleRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages.student]);

  const backLink = (
    <Link to={currentClass ? `/teacher/classes/${classId}` : "/teacher/classes"} className="tsd-back-link">
      <span aria-hidden="true">←</span> Back to {currentClass?.name ?? "classes"}
    </Link>
  );

  if (!student) return (
    <div className="teacher-student-details">
      {backLink}
      <h1 ref={titleRef} tabIndex={-1}>Student not found</h1>
      <p className="tsd-intro-note">Choose a student from the class roster to view their feedback.</p>
    </div>
  );

  const assessment = assessments[assessmentIndex];
  const visibleFlags = flags.filter((flag) => flag.status !== "dismissed");
  const pendingFlags = visibleFlags.filter((flag) => flag.status === "open").length;
  const findingsAvailable = details && [details.gaps, details.repeated, details.redFlags].every(Array.isArray);
  const hasFindings = gaps.length || repeated.length || visibleFlags.length;
  const parentName = student.parent ?? `Parent of ${student.name}`;

  const confirmFlag = (id) => {
    setFlags((previous) => previous.map((flag) => flag.id === id ? { ...flag, status: "confirmed" } : flag));
    setNotice({ text: "Support flag confirmed." });
    overviewRef.current?.focus({ preventScroll: true });
  };

  const dismissFlag = () => {
    const flag = dismissing;
    setFlags((previous) => previous.map((item) => item.id === flag.id ? { ...item, status: "dismissed" } : item));
    setNotice({
      text: "Support flag dismissed.",
      undo: () => {
        setFlags((previous) => previous.map((item) => item.id === flag.id ? flag : item));
        setNotice({ text: "Support flag restored." });
        overviewRef.current?.focus({ preventScroll: true });
      },
    });
    dismissRef.current.close();
  };

  const sendStudentMessage = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setMessages((previous) => ({ ...previous, student: [...previous.student,
      { from: "teacher", text: draft.trim(), time: "Just now" }],
    }));
    setDraft("");
    setMessageStatus("Message added to this conversation.");
    composerRef.current.focus();
  };

  const sendParentMessage = (text, emergency) => {
    setMessages((previous) => ({ ...previous, parent: [...previous.parent,
      { from: "teacher", text, time: "Just now", emergency }],
    }));
  };

  return (
    <div className="teacher-student-details">
      <header className="tsd-intro">
        {backLink}
        <div className="tsd-identity">
          <div>
            <h1 ref={titleRef} tabIndex={-1}>{student.name}</h1>
            <dl className="tsd-summary">
              <div><dt>Class</dt><dd>{classId}</dd></div>
              <div><dt>Attendance</dt><dd>{percentage(student.attendance)}</dd></div>
              <div><dt>Overall grade</dt><dd>{percentage(student.grade)}</dd></div>
            </dl>
          </div>
          <button ref={parentTriggerRef} type="button" className="tsd-button tsd-primary" onClick={() => setParentOpen(true)}>Contact parent</button>
        </div>
      </header>

      <div className="tsd-notice" hidden={!notice}>
        <p role="status">{notice?.text}</p>
        {notice?.undo && <button type="button" className="tsd-button" onClick={notice.undo}>Undo dismissal</button>}
        <button type="button" className="tsd-button" onClick={() => { setNotice(null); overviewRef.current?.focus({ preventScroll: true }); }}>Dismiss notice</button>
      </div>

      <div className="tsd-sections">
        <section className="tsd-board tsd-objectives" aria-labelledby="tsd-overview-title">
          <header className="tsd-panel-heading"><h2 ref={overviewRef} tabIndex={-1} id="tsd-overview-title">Learning Objectives</h2></header>
          <div className="tsd-objectives-grid">
            <div className="tsd-topics">
              {topics.length > 0 ? (
                <div className="tsd-topic-inset">
                  <h3>Topic scores</h3>
                  {chartTopics.length >= 3 && <div className="tsd-radar" aria-hidden="true"><RadarChart data={chartTopics} size={400} /></div>}
                  <dl className="tsd-topic-scores">
                    {topics.map((topic) => <div key={topic.label}><dt>{topic.label}</dt><dd>{chartTopics.includes(topic) ? percentage(topic.value) : "Not available"}</dd></div>)}
                  </dl>
                </div>
              ) : <p className="tsd-empty">No topic analysis available.</p>}

            </div>
            <div className="tsd-support">
              {visibleFlags.length > 0 && (
                <div className="tsd-findings">
                  <h3>Support flags</h3>
                  <p className="tsd-meta">{pendingFlags ? `${pendingFlags} ${pendingFlags === 1 ? "flag needs" : "flags need"} review.` : "All active flags reviewed."}</p>
                  <ul className="tsd-flags">
                    {visibleFlags.map((flag) => (
                      <li key={flag.id}>
                        <p>{flag.text}</p>
                        {flag.status === "confirmed" ? <p className="tsd-flag-status">Confirmed</p> : (
                          <div className="tsd-flag-actions">
                            <button type="button" className="tsd-button" aria-label={`Confirm support flag: ${flag.text}`} onClick={() => confirmFlag(flag.id)}>Confirm</button>
                            <button type="button" className="tsd-button tsd-outline" aria-label={`Dismiss support flag: ${flag.text}`} onClick={(event) => {
                              flagTriggerRef.current = event.currentTarget;
                              setDismissing(flag);
                              dismissRef.current.showModal();
                              cancelRef.current.focus();
                            }}>Dismiss</button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {gaps.length > 0 && <div className="tsd-findings"><h3>Topics needing practice</h3><ul className="tsd-finding-list">{gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul></div>}
              {repeated.length > 0 && <div className="tsd-findings"><h3>Repeated mistakes</h3><ul className="tsd-finding-list">{repeated.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul></div>}
              {!hasFindings && <p className="tsd-empty">{findingsAvailable ? "No learning gaps, repeated mistakes, or active support flags recorded." : "Learning gaps, repeated mistakes, and support flags are not available yet."}</p>}
            </div>
          </div>
        </section>

        <section className="tsd-board" aria-labelledby="tsd-feedback-title">
          <header className="tsd-panel-heading"><h2 id="tsd-feedback-title">Assessment feedback</h2></header>
          {assessment ? (
            <>
              <div className="tsd-assessment-heading">
                {assessments.length > 1 ? (
                  <div className="tsd-assessment-picker">
                    <label htmlFor="tsd-assessment">Assessment</label>
                    <select id="tsd-assessment" value={assessmentIndex} onChange={(event) => setAssessmentIndex(Number(event.target.value))}>
                      {assessments.map((item, index) => <option key={item.id} value={index}>{item.title}</option>)}
                    </select>
                  </div>
                ) : <h3>{assessment.title}</h3>}
                <p className="tsd-score" role="status">{assessments.length > 1 && <span className="tsd-sr-only">{assessment.title}. </span>}Score <strong>{assessment.score ?? "Not available"}</strong></p>
              </div>
              <ol className="tsd-questions" aria-label={`${assessment.title} question results`}>
                {assessment.items?.length ? assessment.items.map((item, index) => (
                  <li key={index}>
                    <div className="tsd-question-heading">
                      <h3><span className="tsd-question-number">{index + 1}.</span> {item.q}</h3>
                      <p className="tsd-result">{item.correct === true ? "✓ Correct" : item.correct === false ? "× Incorrect" : "Not reviewed"}</p>
                    </div>
                    <p><span className="tsd-meta">Student answer:</span> {item.answer ?? "No answer recorded"}</p>
                  </li>
                )) : <li>No question details available for this assessment.</li>}
              </ol>
              <div className="tsd-feedback"><h3>Teacher feedback</h3><p>{assessment.feedback || "No written feedback available."}</p></div>
            </>
          ) : <p className="tsd-empty">No assessment feedback available.</p>}
        </section>
      </div>

      <section className="tsd-board tsd-messages" aria-labelledby="tsd-message-title">
        <header className="tsd-panel-heading"><h2 id="tsd-message-title">Message {student.name}</h2></header>
        <p id="tsd-message-note" className="tsd-message-note">Messages stay on this page and are not delivered.</p>
        <div ref={logRef} className="tsd-chat-log" role="log" aria-label={`Conversation with ${student.name}`} aria-live="polite" aria-relevant="additions" tabIndex={0}>
          {messages.student.length ? messages.student.map((message, index) => (
            <div key={index} className="tsd-chat-message">
              <div className="tsd-message-heading"><p>{message.from === "teacher" ? "You" : student.name}</p><p>{message.time}</p></div>
              <p>{message.text}</p>
            </div>
          )) : <p className="tsd-meta">No messages yet. Write a message to start the conversation.</p>}
        </div>
        <form className="tsd-message-form" onSubmit={sendStudentMessage}>
          <label htmlFor="tsd-message">Your message to {student.name}</label>
          <textarea id="tsd-message" ref={composerRef} rows={3} value={draft} onChange={(event) => setDraft(event.target.value)} aria-describedby="tsd-message-note" placeholder="Write your message" />
          <button type="submit" className="tsd-button" disabled={!draft.trim()}>Send message</button>
        </form>
        <p className="tsd-message-status" role="status">{messageStatus}</p>
      </section>

      <ParentMessageModal isOpen={parentOpen} parentName={parentName} studentName={student.name} messages={messages.parent} onSend={sendParentMessage} onClose={() => {
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
        <h2 id="tsd-dismiss-title">Dismiss this support flag?</h2>
        <p>{dismissing?.text}</p>
        <p id="tsd-dismiss-description">You can undo the dismissal using the notice on this page.</p>
        <div className="tsd-dialog-actions">
          <button ref={cancelRef} type="button" className="tsd-button" onClick={() => dismissRef.current.close()}>Cancel</button>
          <button type="button" className="tsd-button tsd-primary" onClick={dismissFlag}>Dismiss flag</button>
        </div>
      </dialog>
    </div>
  );
}
