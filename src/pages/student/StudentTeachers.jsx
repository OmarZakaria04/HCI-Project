import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import QuickPracticeWidget from "../../components/QuickPracticeWidget";
import { getOnlineWorkspaceAssessments, getStudentData } from "../../i18n/studentDataDe";
import { useLanguage } from "../../i18n/useLanguage";
import {
  createStudentId,
  getHomeworkUploads,
  getStudentMessagesMap,
  getWorkspaceSubmissions,
  saveStudentTeacherMessage,
} from "../../utils/studentStore";
import "../../styles/student-teachers.css";

function getTeacherHardMarks({ teacher, lang, tr }) {
  const results = [];
  const onlineAssessments = getOnlineWorkspaceAssessments(lang);
  const submissions = getWorkspaceSubmissions();
  Object.entries(submissions).forEach(([assessmentId, sub]) => {
    const assessment = onlineAssessments[assessmentId];
    if (!assessment || assessment.teacher !== teacher.name) return;
    const hardEntries = Object.entries(sub.markedHard || {}).filter(([, val]) => Boolean(val));
    hardEntries.forEach(([qId]) => {
      const question = assessment.questions.find((q) => q.id === qId);
      if (question) {
        results.push({
          key: `ws-${assessmentId}-${qId}`,
          assessmentTitle: assessment.title,
          questionLabel: `${tr("Question", "Aufgabe")} ${question.number} (${question.topic})`,
          detail: question.prompt,
        });
      }
    });
  });

  const uploads = getHomeworkUploads();
  Object.entries(uploads).forEach(([assessmentId, up]) => {
    if (!up?.hardQuestions?.length && !up?.hardNote) return;
    const matchesTeacher =
      teacher.subject.toLowerCase().includes((up.subject || "").toLowerCase()) ||
      (up.subject === "Science" && teacher.id === "mr-ahmed") ||
      (up.subject === "Naturwiss." && teacher.id === "mr-ahmed") ||
      (up.subject === "Math" && teacher.id === "mrs-radwa") ||
      (up.subject === "Mathe" && teacher.id === "mrs-radwa");
    if (!matchesTeacher) return;
    results.push({
      key: `hw-${assessmentId}`,
      assessmentTitle: up.title || tr("Uploaded homework", "Hochgeladene Hausaufgabe"),
      questionLabel: up.hardQuestions?.length
        ? `${tr("Homework questions", "Hausaufgaben")}: ${up.hardQuestions.join(", ")}`
        : tr("Homework note", "Notiz zur Hausaufgabe"),
      detail: up.hardNote || up.fileName,
    });
  });
  return results;
}

function TeacherConversation({ teacher, prefillMessage }) {
  const { lang, tr } = useLanguage();
  const [addedMessages, setAddedMessages] = useState(
    () => getStudentMessagesMap()[teacher.id] || []
  );
  const [inputMessage, setInputMessage] = useState(prefillMessage);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [questionFilter, setQuestionFilter] = useState("all");
  const [messageStatus, setMessageStatus] = useState("");
  const feedbackItems = (teacher.feedbackItems ?? []).filter(
    (item) => item.confirmedByTeacher !== false
  );
  const activeFeedback = feedbackItems[feedbackIndex];
  const teacherHardMarks = getTeacherHardMarks({ teacher, lang, tr });
  const chatInputRef = useRef(null);
  const chatLogRef = useRef(null);
  const replyTimers = useRef(new Set());
  const messages = [...(teacher.initialMessages ?? []), ...addedMessages];

  useEffect(() => {
    if (prefillMessage) chatInputRef.current?.focus();
  }, [prefillMessage]);

  useEffect(() => {
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    const timers = replyTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const draftMessage = (text, attachment = null) => {
    setInputMessage(text);
    setPendingAttachment(attachment);
    chatInputRef.current.focus();
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    const studentMsg = {
      id: createStudentId("msg"),
      sender: "student",
      text,
      time: tr("Just now", "Gerade eben"),
      ...(pendingAttachment ? { attachment: pendingAttachment } : {}),
    };
    const updatedList = saveStudentTeacherMessage(teacher.id, studentMsg);
    setAddedMessages(updatedList);
    setInputMessage("");
    setPendingAttachment(null);
    setMessageStatus(
      tr("Message saved and queued for your teacher.", "Nachricht gespeichert und für deine Lehrkraft vorgemerkt.")
    );
    chatInputRef.current.focus();

    const timer = setTimeout(() => {
      replyTimers.current.delete(timer);
      const replyMsg = {
        id: createStudentId("reply"),
        sender: "teacher",
        text: tr(
          `Thanks for attaching the details! Let's go through your ${teacher.subject} question step by step together.`,
          `Danke für die Details! Gehen wir deine Frage zu ${teacher.subject} zusammen Schritt für Schritt durch.`
        ),
        time: tr("Just now", "Gerade eben"),
        isSimulated: true,
      };
      const nextList = saveStudentTeacherMessage(teacher.id, replyMsg);
      setAddedMessages(nextList);
      setMessageStatus(tr("Your teacher replied.", "Deine Lehrkraft hat geantwortet."));
    }, 900);
    replyTimers.current.add(timer);
  };

  const displayedQuestions = (activeFeedback?.questions || []).filter((q) =>
    questionFilter === "needs-practice" ? q.status === "needs-practice" : true
  );

  return (
    <div className="st-detail-grid">
      <section className="st-panel" aria-labelledby="teacher-feedback-title">
        <div className="st-panel-heading">
          <h2 id="teacher-feedback-title">{tr("Your feedback", "Dein Feedback")}</h2>
          <p className="st-confirmed-pill">{tr("Teacher reviewed & confirmed", "Von Lehrkraft geprüft & bestätigt")}</p>
        </div>

        {activeFeedback ? (
          <>
            {feedbackItems.length > 1 && (
              <div className="st-assessment-picker">
                <label htmlFor="teacher-assessment">{tr("Assessment", "Leistungskontrolle")}</label>
                <select id="teacher-assessment" value={feedbackIndex} onChange={(event) => setFeedbackIndex(Number(event.target.value))}>
                  {feedbackItems.map((feedback, index) => <option key={feedback.id} value={index}>{feedback.title}</option>)}
                </select>
              </div>
            )}
            <div className="st-assessment-heading">
              <div>
                <h3>{activeFeedback.title}</h3>
                <p className="st-meta">{tr("Confirmed on:", "Bestätigt am:")} {activeFeedback.confirmedDate}</p>
              </div>
              <p className="st-score">{tr("Score:", "Ergebnis:")} <strong>{activeFeedback.score}</strong></p>
            </div>
            <div className="st-feedback-controls">
              <button
                type="button"
                className="st-button st-review-button"
                onClick={() =>
                  draftMessage(
                    tr(
                      `Hi ${teacher.name}, could you please review my score on ${activeFeedback.title}?`,
                      `Hallo ${teacher.name}, könnten Sie mein Ergebnis bei „${activeFeedback.title}“ noch einmal ansehen?`
                    ),
                    {
                      kind: tr("Quiz review request", "Überprüfungsanfrage"),
                      label: activeFeedback.title,
                      detail: `${tr("Score", "Ergebnis")}: ${activeFeedback.score}`,
                    }
                  )
                }
              >
                {tr("Ask for a review", "Überprüfung anfragen")}
              </button>
              <div className="st-filter-pills" role="group" aria-label={tr("Filter feedback items", "Feedback filtern")}>
                <button
                  type="button"
                  className={`st-filter-pill ${questionFilter === "all" ? "is-active" : ""}`}
                  onClick={() => setQuestionFilter("all")}
                >
                  {tr("All questions", "Alle Aufgaben")}
                </button>
                <button
                  type="button"
                  className={`st-filter-pill ${questionFilter === "needs-practice" ? "is-active" : ""}`}
                  onClick={() => setQuestionFilter("needs-practice")}
                >
                  {tr("Needs practice", "Zum Üben")}
                </button>
              </div>
            </div>

            <ul className="st-question-list">
              {displayedQuestions.length ? displayedQuestions.map((question) => (
                <li key={question.id} className="st-question">
                  <div className="st-question-heading">
                    <h4>{question.q}</h4>
                    <div className="st-badge-row">
                      {question.marks && (
                        <span className="st-marks-marker">{tr("Marks:", "Punkte:")} {question.marks}</span>
                      )}
                      {question.status === "needs-practice" && (
                        <span className="st-practice-marker">{tr("Let's practice this", "Üben wir das")}</span>
                      )}
                      {question.isHardQuestion && <span className="st-hard-marker">{tr("Marked as hard", "Als schwer markiert")}</span>}
                    </div>
                  </div>
                  <p>{question.positive}</p>
                  <p>{question.constructive}</p>
                  {(question.correction || question.suggestedPractice) && (
                    <details className="st-correction-details">
                      <summary>{tr("Inspect correction & suggested practice", "Korrektur & Übungsvorschlag ansehen")}</summary>
                      <div className="st-correction-body">
                        {question.studentAnswer && (
                          <p><strong>{tr("Your answer:", "Deine Antwort:")}</strong> {question.studentAnswer}</p>
                        )}
                        {question.correction && (
                          <p><strong>{tr("Correction:", "Korrektur:")}</strong> {question.correction}</p>
                        )}
                        {question.suggestedPractice && (
                          <QuickPracticeWidget practice={question.suggestedPractice} tr={tr} />
                        )}
                      </div>
                    </details>
                  )}
                  <button
                    type="button"
                    className="st-button"
                    aria-label={tr(`Ask ${teacher.name} about ${question.q}`, `${teacher.name} zu ${question.q} fragen`)}
                    onClick={() =>
                      draftMessage(
                        tr(
                          `Hi ${teacher.name}, could you please clarify this question for me?`,
                          `Hallo ${teacher.name}, könnten Sie mir diese Aufgabe noch einmal erklären?`
                        ),
                        {
                          kind: tr("Question clarification", "Rückfrage zur Aufgabe"),
                          label: `${activeFeedback.title} · ${question.q}`,
                          detail: question.constructive,
                        }
                      )
                    }
                  >
                    {tr("Ask about this question", "Zu dieser Aufgabe fragen")}
                  </button>
                </li>
              )) : <li className="st-empty">{tr("No questions match this filter yet.", "Keine Aufgaben für diesen Filter gefunden.")}</li>}
            </ul>
          </>
        ) : <p className="st-empty">{tr(`No confirmed feedback from ${teacher.name} yet.`, `Von ${teacher.name} liegt noch kein bestätigtes Feedback vor.`)}</p>}

        {teacherHardMarks.length > 0 && (
          <div className="st-saved-hard-box">
            <h3>{tr("Questions you marked as hard", "Von dir als schwer markierte Aufgaben")}</h3>
            <ul className="st-saved-hard-list">
              {teacherHardMarks.map((item) => (
                <li key={item.key} className="st-saved-hard-item">
                  <div>
                    <p className="st-saved-hard-title">{item.assessmentTitle} · {item.questionLabel}</p>
                    <p className="st-meta">{item.detail}</p>
                  </div>
                  <button
                    type="button"
                    className="st-button"
                    onClick={() =>
                      draftMessage(
                        tr(
                          `Hi ${teacher.name}, I marked this part as hard and would love help reviewing it.`,
                          `Hallo ${teacher.name}, ich habe diese Aufgabe als schwer markiert und hätte gern Hilfe dabei.`
                        ),
                        {
                          kind: tr("Hard question", "Schwere Aufgabe"),
                          label: `${item.assessmentTitle} · ${item.questionLabel}`,
                          detail: item.detail,
                        }
                      )
                    }
                  >
                    {tr("Attach & ask", "Anhängen & fragen")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="st-panel st-message-panel" aria-labelledby="teacher-message-title">
        <div className="st-panel-heading">
          <h2 id="teacher-message-title">{tr(`Message ${teacher.name}`, `Nachricht an ${teacher.name}`)}</h2>
        </div>
        <p className="st-demo-note" id="teacher-message-note">{tr("Messages and attached questions are saved in your browser so you can review them with your teacher.", "Nachrichten und angehängte Aufgaben werden in deinem Browser gespeichert, damit du sie mit deiner Lehrkraft ansehen kannst.")}</p>
        <div ref={chatLogRef} className="st-chat-log" role="log" aria-label={tr(`Conversation with ${teacher.name}`, `Unterhaltung mit ${teacher.name}`)} aria-live="polite" aria-relevant="additions" tabIndex={0}>
          {messages.length ? messages.map((message) => (
            <div key={message.id} className={`st-chat-message ${message.sender === "student" ? "st-chat-student" : "st-chat-teacher"}`}>
              <p className="st-message-author">{message.sender === "student" ? tr("You", "Du") : teacher.name}</p>
              {message.attachment && (
                <div className="st-chat-attachment">
                  <span>{message.attachment.kind}</span>
                  <strong>{message.attachment.label}</strong>
                  {message.attachment.detail && <p>{message.attachment.detail}</p>}
                </div>
              )}
              <p>{message.text}</p>
              <p className="st-message-time">{message.time}</p>
            </div>
          )) : <p className="st-meta">{tr("No messages yet. Write a question to start the conversation.", "Noch keine Nachrichten. Stelle eine Frage, um zu starten.")}</p>}
        </div>

        <div className="st-draft-actions" role="group" aria-label={tr("Message starters", "Nachrichtenvorschläge")}>
          <button type="button" className="st-button" onClick={() => draftMessage(tr(`Hi ${teacher.name}, could you help me with ${teacher.subject}?`, `Hallo ${teacher.name}, könnten Sie mir bei ${teacher.subject} helfen?`))}>{tr("Ask for help", "Um Hilfe bitten")}</button>
          <button type="button" className="st-button" onClick={() => draftMessage(tr(`Hi ${teacher.name}, would it be possible to schedule a short meeting during office hours?`, `Hallo ${teacher.name}, wäre ein kurzes Gespräch in Ihrer Sprechstunde möglich?`))}>{tr("Ask about a meeting", "Nach Gespräch fragen")}</button>
        </div>
        <form className="st-message-form" onSubmit={sendMessage}>
          {pendingAttachment && (
            <div className="st-pending-attachment" role="status">
              <div>
                <span>{pendingAttachment.kind}</span>
                <strong>{pendingAttachment.label}</strong>
              </div>
              <button
                type="button"
                className="st-attachment-remove"
                aria-label={tr("Remove attached question", "Angehängte Aufgabe entfernen")}
                onClick={() => setPendingAttachment(null)}
              >
                ×
              </button>
            </div>
          )}
          <label htmlFor="teacher-message">{tr(`Your message to ${teacher.name}`, `Deine Nachricht an ${teacher.name}`)}</label>
          <textarea id="teacher-message" ref={chatInputRef} rows={3} value={inputMessage} onChange={(event) => setInputMessage(event.target.value)} aria-describedby="teacher-message-note" placeholder={tr("Write your question here", "Schreibe deine Frage hierhin")} />
          <button type="submit" className="st-button st-button-primary" disabled={!inputMessage.trim()}>{tr("Send message", "Nachricht senden")}</button>
        </form>
        <p className="st-message-status st-meta" role="status">{messageStatus}</p>
      </section>
    </div>
  );
}

export default function StudentTeachers() {
  const { teacherId } = useParams();
  const location = useLocation();
  const { lang, tr } = useLanguage();
  const studentData = getStudentData(lang);
  const teachers = studentData.teachers ?? [];
  const prefillMessage = typeof location.state?.prefillMessage === "string" ? location.state.prefillMessage : "";
  const isDetailView = Boolean(teacherId || prefillMessage);
  const teacher = teacherId
    ? teachers.find((item) => item.id === teacherId.toLowerCase())
    : prefillMessage ? teachers[0] : null;
  const titleRef = useRef(null);

  useEffect(() => {
    if (!prefillMessage || !teacher) titleRef.current?.focus({ preventScroll: true });
  }, [teacherId, location.key, prefillMessage, teacher]);

  return (
    <div className="student-teachers-page">
      <Header role="student" />
      <div className="student-teachers">
        <main className="st-container">
          <header className="st-intro">
            {isDetailView && <Link className="st-back-link" to="/student/teachers">← {tr("Back to teachers", "Zurück zu den Lehrkräften")}</Link>}
            <h1 ref={titleRef} tabIndex={-1}>{isDetailView ? teacher?.name ?? tr("Teacher not found", "Lehrkraft nicht gefunden") : tr("Teachers", "Lehrkräfte")}</h1>
            <p>{isDetailView
              ? teacher ? `${teacher.subject} · ${teacher.department} · ${teacher.office}` : tr("Choose a teacher from your teachers list.", "Wähle eine Lehrkraft aus deiner Liste.")
              : tr("Find your teachers, read feedback, and ask for help.", "Finde deine Lehrkräfte, lies Feedback und bitte um Hilfe.")}</p>
          </header>

          {isDetailView ? teacher && (
            <TeacherConversation key={`${teacher.id}:${location.key}`} teacher={teacher} prefillMessage={prefillMessage} />
          ) : (
            <section className="st-panel" aria-labelledby="my-teachers-title">
              <div className="st-panel-heading">
                <h2 id="my-teachers-title">{tr("My teachers", "Meine Lehrkräfte")}</h2>
                <p className="st-meta">{tr("Choose a teacher to view feedback or write a message.", "Wähle eine Lehrkraft aus, um Feedback zu lesen oder zu schreiben.")}</p>
              </div>
              {teachers.length ? (
                <ul className="st-teacher-list">
                  {teachers.map((item) => (
                    <li key={item.id} className="st-teacher-row">
                      <span className="st-avatar" aria-hidden="true">{item.name.split(" ").slice(1).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
                      <div className="st-teacher-name"><h3>{item.name}</h3><p className="st-meta">{item.subject}</p></div>
                      <p className="st-meta st-office">{item.office}</p>
                      <Link className="st-button" to={`/student/teachers/${item.id}`} aria-label={tr(`View ${item.name}'s feedback and messages`, `Feedback & Nachrichten von ${item.name}`)}>{tr("Feedback & messages", "Feedback & Nachrichten")} <span aria-hidden="true">→</span></Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="st-empty">{tr("No teachers available yet.", "Noch keine Lehrkräfte verfügbar.")}</p>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
