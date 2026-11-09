import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { studentData } from "../../data/studentData";
import "../../styles/student-teachers.css";

function TeacherConversation({ teacher, prefillMessage }) {
  const [messages, setMessages] = useState(teacher.initialMessages ?? []);
  const [inputMessage, setInputMessage] = useState(prefillMessage);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [messageStatus, setMessageStatus] = useState("");
  const feedbackItems = teacher.feedbackItems ?? [];
  const activeFeedback = feedbackItems[feedbackIndex];
  const chatInputRef = useRef(null);
  const chatLogRef = useRef(null);
  const replyTimers = useRef(new Set());

  useEffect(() => {
    if (prefillMessage) chatInputRef.current?.focus();
  }, [prefillMessage]);

  useEffect(() => {
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const timers = replyTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const draftMessage = (text) => {
    setInputMessage(text);
    chatInputRef.current.focus();
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    setMessages((previous) => [...previous, {
      id: crypto.randomUUID(), sender: "student", text, time: "Just now",
    }]);
    setInputMessage("");
    setMessageStatus("Message added to this demo conversation.");
    chatInputRef.current.focus();

    const timer = setTimeout(() => {
      replyTimers.current.delete(timer);
      setMessages((previous) => [...previous, {
        id: crypto.randomUUID(),
        sender: "teacher",
        text: `Let's work through your ${teacher.subject} question step by step. Tell me which part you would like to practise.`,
        time: "Just now",
        isSimulated: true,
      }]);
      setMessageStatus("A demo reply was added.");
    }, 1000);
    replyTimers.current.add(timer);
  };

  return (
    <div className="st-detail-grid">
      <section className="st-panel" aria-labelledby="teacher-feedback-title">
        <div className="st-panel-heading">
          <h2 id="teacher-feedback-title">Your feedback</h2>
          <p className="st-meta">Demo data</p>
        </div>

        {activeFeedback ? (
          <>
            {feedbackItems.length > 1 && (
              <div className="st-assessment-picker">
                <label htmlFor="teacher-assessment">Assessment</label>
                <select id="teacher-assessment" value={feedbackIndex} onChange={(event) => setFeedbackIndex(Number(event.target.value))}>
                  {feedbackItems.map((feedback, index) => <option key={feedback.id} value={index}>{feedback.title}</option>)}
                </select>
              </div>
            )}
            <div className="st-assessment-heading">
              <div>
                <h3>{activeFeedback.title}</h3>
                <p className="st-meta">Feedback date: {activeFeedback.confirmedDate}</p>
              </div>
              <p className="st-score">Score: <strong>{activeFeedback.score}</strong></p>
            </div>
            <button type="button" className="st-button st-review-button" onClick={() => draftMessage(`Hi ${teacher.name}, could you please review my score on ${activeFeedback.title}?`)}>Ask for a review</button>

            <ul className="st-question-list">
              {activeFeedback.questions?.length ? activeFeedback.questions.map((question) => (
                <li key={question.id} className="st-question">
                  <div className="st-question-heading">
                    <h4>{question.q}</h4>
                    {question.isHardQuestion && <span className="st-hard-marker">Marked as hard</span>}
                  </div>
                  <p>{question.positive}</p>
                  <p>{question.constructive}</p>
                  <button
                    type="button"
                    className="st-button"
                    aria-label={`Ask ${teacher.name} about ${question.q}`}
                    onClick={() => draftMessage(`Hi ${teacher.name}, regarding ${activeFeedback.title} - ${question.q}: Could you please clarify this question for me?`)}
                  >Ask about this question</button>
                </li>
              )) : <li className="st-empty">No question feedback available for this assessment yet.</li>}
            </ul>
          </>
        ) : <p className="st-empty">No feedback available from {teacher.name} yet.</p>}
      </section>

      <section className="st-panel st-message-panel" aria-labelledby="teacher-message-title">
        <div className="st-panel-heading">
          <h2 id="teacher-message-title">Message {teacher.name}</h2>
        </div>
        <p className="st-demo-note" id="teacher-message-note">Demo conversation. Messages stay on this page and are not sent to a teacher. Replies are simulated.</p>
        <div ref={chatLogRef} className="st-chat-log" role="log" aria-label={`Demo conversation with ${teacher.name}`} aria-live="polite" aria-relevant="additions" tabIndex={0}>
          {messages.length ? messages.map((message) => (
            <div key={message.id} className={`st-chat-message ${message.sender === "student" ? "st-chat-student" : "st-chat-teacher"}`}>
              <p className="st-message-author">{message.sender === "student" ? "You" : message.isSimulated ? `Demo reply · ${teacher.name}` : teacher.name}</p>
              <p>{message.text}</p>
              <p className="st-message-time">{message.time}</p>
            </div>
          )) : <p className="st-meta">No messages yet. Write a question to start this demo conversation.</p>}
        </div>

        <div className="st-draft-actions" role="group" aria-label="Message starters">
          <button type="button" className="st-button" onClick={() => draftMessage(`Hi ${teacher.name}, could you help me with ${teacher.subject}?`)}>Ask for help</button>
          <button type="button" className="st-button" onClick={() => draftMessage(`Hi ${teacher.name}, would it be possible to schedule a short meeting during office hours?`)}>Ask about a meeting</button>
        </div>
        <form className="st-message-form" onSubmit={sendMessage}>
          <label htmlFor="teacher-message">Your message to {teacher.name}</label>
          <textarea id="teacher-message" ref={chatInputRef} rows={3} value={inputMessage} onChange={(event) => setInputMessage(event.target.value)} aria-describedby="teacher-message-note" placeholder="Write your question here" />
          <button type="submit" className="st-button st-button-primary" disabled={!inputMessage.trim()}>Send message</button>
        </form>
        <p className="st-message-status st-meta" role="status">{messageStatus}</p>
      </section>
    </div>
  );
}

export default function StudentTeachers() {
  const { teacherId } = useParams();
  const location = useLocation();
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
            {isDetailView && <Link className="st-back-link" to="/student/teachers">← Back to teachers</Link>}
            <h1 ref={titleRef} tabIndex={-1}>{isDetailView ? teacher?.name ?? "Teacher not found" : "Teachers"}</h1>
            <p>{isDetailView
              ? teacher ? `${teacher.subject} · ${teacher.department} · ${teacher.office}` : "Choose a teacher from your teachers list."
              : "Find your teachers, read feedback, and ask for help."}</p>
          </header>

          {isDetailView ? teacher && (
            <TeacherConversation key={`${teacher.id}:${location.key}`} teacher={teacher} prefillMessage={prefillMessage} />
          ) : (
            <section className="st-panel" aria-labelledby="my-teachers-title">
              <div className="st-panel-heading">
                <h2 id="my-teachers-title">My teachers</h2>
                <p className="st-meta">Choose a teacher to view feedback or write a message.</p>
              </div>
              {teachers.length ? (
                <ul className="st-teacher-list">
                  {teachers.map((item) => (
                    <li key={item.id} className="st-teacher-row">
                      <span className="st-avatar" aria-hidden="true">{item.name.split(" ").slice(1).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
                      <div className="st-teacher-name"><h3>{item.name}</h3><p className="st-meta">{item.subject}</p></div>
                      <p className="st-meta st-office">{item.office}</p>
                      <Link className="st-button" to={`/student/teachers/${item.id}`} aria-label={`View ${item.name}'s feedback and messages`}>Feedback &amp; messages <span aria-hidden="true">→</span></Link>
                    </li>
                  ))}
                </ul>
              ) : <p className="st-empty">No teachers available yet.</p>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
