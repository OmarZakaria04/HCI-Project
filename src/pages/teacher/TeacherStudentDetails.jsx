import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { students, studentDetails } from "../../data/teacherData";
import RadarChart from "../../components/RadarChart";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import "../../styles/teacher.css";
import ParentMessageModal from "../../components/ParentMessageModal";
// Shown for students that have no entry in studentDetails
const emptyDetails = {
  gaps: [],
  redFlags: [],
  repeated: [],
  topics: [
    { label: "Multiplication", value: 80 },
    { label: "Word Probs", value: 78 },
    { label: "Fractions", value: 75 },
    { label: "Decimals", value: 79 },
    { label: "Geometry", value: 82 },
  ],
  assessments: [
    {
      id: "quiz1", title: "Quiz 1", score: "3/3",
      feedback: "Great work. No issues found.",
      items: [
        { q: "15 × 8", answer: "120", correct: true },
        { q: "Simplify 6/8", answer: "3/4", correct: true },
        { q: "0.75 as a percentage", answer: "75%", correct: true },
      ],
    },
  ],
  messages: { student: [], parent: [] },
};

// The wrapper's key makes React start fresh when you open a different student
export default function TeacherStudentDetails() {
  const { studentId } = useParams();
  return <StudentView key={studentId} />;
}

function StudentView() {
  const { classId, studentId } = useParams();
  const student = students.find((s) => String(s.id) === studentId && s.classId === classId);
  const details = studentDetails[studentId] || emptyDetails;

  const [flags, setFlags] = useState(details.redFlags.map((f) => ({ ...f, status: "open" })));
  const [dismissing, setDismissing] = useState(null);
  const [toast, setToast] = useState(null);
  const [slide, setSlide] = useState(0);
  const [parentOpen, setParentOpen] = useState(false);
  const [messages, setMessages] = useState(details.messages);
  const [draft, setDraft] = useState("");

  const closeToast = useCallback(() => setToast(null), []);

  if (!student) {
    return (
      <div className="teacher-page">
        <h1 className="teacher-heading">Student not found</h1>
        <Link to={`/teacher/classes/${classId}`} className="teacher-btn-outline">Back to class</Link>
      </div>
    );
  }

  const parentName = student.parent ?? `Parent of ${student.name}`;
  const assessment = details.assessments[slide];

  const confirmFlag = (id) => {
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, status: "confirmed" } : f)));
    setToast({ message: "Red flag confirmed. The student will be notified." });
  };

  const dismissFlag = () => {
    const flag = dismissing;
    setFlags((prev) => prev.filter((f) => f.id !== flag.id));
    setDismissing(null);
    setToast({
      message: "Red flag dismissed.",
      undo: () => setFlags((prev) => [...prev, flag]),
    });
  };

const sendStudentMessage = (e) => {
  e.preventDefault();
  if (!draft.trim()) return;
  setMessages((prev) => ({
    ...prev,
    student: [...prev.student, { from: "teacher", text: draft.trim(), time: "Just now" }],
  }));
  setDraft("");
};

const sendParentMessage = (text, emergency) => {
  setMessages((prev) => ({
    ...prev,
    parent: [...prev.parent, { from: "teacher", text, time: "Just now", emergency }],
  }));
  setToast({ message: emergency ? "Emergency text sent to the parent." : "Message sent to the parent." });
};

  return (
    <div className="teacher-page">
      <div className="teacher-page-head">
        <div>
          <h1 className="teacher-heading">{student.name} ({classId})</h1>
          <div className="papers-stats-bar mt-2">
            <span className={`papers-stat-chip ${student.attendance < 75 ? "papers-stat-chip-pending" : "papers-stat-chip-done"}`}>
              Attendance {student.attendance}%
            </span>
            <span className={`papers-stat-chip ${student.grade < 60 ? "papers-stat-chip-pending" : "papers-stat-chip-done"}`}>
              Overall {student.grade}%
            </span>
          </div>
        </div>
        <div className="teacher-actions">
          <button type="button" className="teacher-btn" onClick={() => setParentOpen(true)}>
            Contact Parent
          </button>
          <Link to={`/teacher/classes/${classId}`} className="teacher-btn-outline">← Back</Link>
        </div>
      </div>

      <div className="stu-grid">
        {/* LEFT: feedback + messages */}
        <div className="stu-col">
          <section className="stu-card">
            <h2 className="stu-card-title">Feedback</h2>
            <div className="stu-carousel-head">
              <button type="button" className="stu-nav" disabled={slide === 0} onClick={() => setSlide(slide - 1)} aria-label="Previous assessment">‹</button>
              <div className="text-center">
                <p className="stu-assess-title">{assessment.title}</p>
                <p className="stu-assess-score">Score {assessment.score}</p>
              </div>
              <button type="button" className="stu-nav" disabled={slide === details.assessments.length - 1} onClick={() => setSlide(slide + 1)} aria-label="Next assessment">›</button>
            </div>

            <ul className="space-y-2">
              {assessment.items.map((it, i) => (
                <li key={i} className="stu-item flex items-center justify-between">
                  <span>{it.q}</span>
                  <span className={it.correct ? "stu-answer-ok" : "stu-answer-bad"}>
                    {it.answer} {it.correct ? "✓" : "✗"}
                  </span>
                </li>
              ))}
            </ul>
            <p className="stu-feedback">"{assessment.feedback}"</p>
          </section>

          <section className="stu-card">
  <h2 className="stu-card-title">Message {student.name}</h2>
  <div className="stu-chat">
    {messages.student.length === 0 && (
      <p className="text-xs text-cream/60">No messages yet. Start the conversation below.</p>
    )}
    {messages.student.map((m, i) => (
      <div key={i} className="stu-msg">
        <p>{m.text}</p>
        <span className="stu-msg-time">{m.time}</span>
      </div>
    ))}
  </div>
  <form onSubmit={sendStudentMessage} className="flex gap-2 mt-3">
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      placeholder="Message the student..."
      className="papers-search-input"
    />
    <button type="submit" className="papers-action-btn">Send</button>
  </form>
</section>
        </div>

        {/* RIGHT: analysis + red flags */}
        <div className="stu-col">
          <section className="stu-card">
            <h2 className="stu-card-title">Student Analysis</h2>
            <div className="analytics-chart">
              <RadarChart data={details.topics} size={260} />
            </div>

            <h3 className="stu-sub">Learning gaps</h3>
            {details.gaps.length === 0 ? (
              <p className="text-xs text-cream/60">None detected.</p>
            ) : (
              <div className="analytics-badges">
                {details.gaps.map((g) => <span key={g} className="analytics-badge-warn">{g}</span>)}
              </div>
            )}

            <h3 className="stu-sub">Repeated mistakes</h3>
            {details.repeated.length === 0 ? (
              <p className="text-xs text-cream/60">None detected.</p>
            ) : (
              <ul className="space-y-2">
                {details.repeated.map((r) => <li key={r} className="stu-item">{r}</li>)}
              </ul>
            )}
          </section>

          <section className="stu-card">
            <h2 className="stu-card-title">Red Flags</h2>
            {flags.length === 0 ? (
              <p className="text-xs text-cream/60">No active red flags.</p>
            ) : (
              <ul className="space-y-2">
                {flags.map((f) => (
                  <li key={f.id} className="stu-item stu-flag">
                    <span>{f.text}</span>
                    {f.status === "confirmed" ? (
                      <span className="papers-status-badge papers-status-done">Confirmed</span>
                    ) : (
                      <div className="flex gap-2 shrink-0">
                        <button type="button" className="papers-action-btn" onClick={() => confirmFlag(f.id)}>Confirm</button>
                        <button type="button" className="stu-btn-ghost" onClick={() => setDismissing(f)}>Dismiss</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
<ParentMessageModal
  isOpen={parentOpen}
  parentName={parentName}
  studentName={student.name}
  messages={messages.parent}
  onSend={sendParentMessage}
  onClose={() => setParentOpen(false)}
/>
      <ConfirmModal
        isOpen={dismissing !== null}
        title="Dismiss this red flag?"
        message="The student will not be notified. You can undo this right after."
        confirmLabel="Dismiss"
        isDestructive
        onConfirm={dismissFlag}
        onCancel={() => setDismissing(null)}
      />

      <Toast
        message={toast?.message}
        undoAction={toast?.undo}
        onClose={closeToast}
      />
    </div>
  );
}