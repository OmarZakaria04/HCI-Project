import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { studentData } from "../../data/studentData";
import {
  TeacherIcon,
  ChatIcon,
  FeedbackIcon,
  SendIcon,
} from "../../components/StudentIcons";
import "../../styles/student.css";

export default function StudentTeachers() {
  const { teacherId } = useParams();
  const navigate = useNavigate();

  // Selected teacher in detail view
  const initialTeacher = teacherId
    ? studentData.teachers.find((t) => t.id === teacherId.toLowerCase()) || studentData.teachers[0]
    : studentData.teachers[0];

  const [activeTeacher, setActiveTeacher] = useState(initialTeacher);
  const [isDetailView, setIsDetailView] = useState(Boolean(teacherId));

  // Teachers carousel index for overview view
  const [teacherCarouselIndex, setTeacherCarouselIndex] = useState(0);

  // Chat state for the active teacher
  const [messages, setMessages] = useState(activeTeacher.initialMessages);
  const [inputMessage, setInputMessage] = useState("");

  // Feedback quiz carousel index
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const activeFeedback =
    activeTeacher.feedbackItems[feedbackIndex] || activeTeacher.feedbackItems[0];

  const handleSelectTeacher = (teacher) => {
    setActiveTeacher(teacher);
    setMessages(teacher.initialMessages);
    setFeedbackIndex(0);
    setIsDetailView(true);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "student",
      text: inputMessage.trim(),
      time: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");

    // Simulate teacher auto-response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "teacher",
          text: `Hello Ahmed, I have noted your message regarding ${activeTeacher.subject}. Let me review it and get back to you shortly.`,
          time: "Just now",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="student-page-wrapper">
      <Header role="student" />

      <main className="student-container">
        {/* ============================================================ */}
        {/* VIEW A: Teacher Detail & Chat / Feedback (Screen 4: Mr. Ahmed) */}
        {/* Reached directly by clicking a teacher card from the teachers list */}
        {/* ============================================================ */}
        {isDetailView ? (
          <div className="space-y-6">
            {/* Hero Card: Teacher Name */}
            <div className="wireframe-hero-card">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <TeacherIcon className="w-6 h-6 text-forest" />
              </div>
              <h1 className="wireframe-hero-title">{activeTeacher.name}</h1>
              <p className="wireframe-hero-subtitle">
                {activeTeacher.subject} • {activeTeacher.department} ({activeTeacher.office})
              </p>
            </div>

            {/* Section: Message (Direct Chat Thread) */}
            <div className="student-card space-y-3">
              <div className="student-card-header">
                <h2 className="student-card-title">
                  <ChatIcon className="w-5 h-5 text-forest" /> Message
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-forest/60 hidden sm:inline">
                    Chat with {activeTeacher.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDetailView(false)}
                    className="btn-ghost text-xs"
                  >
                    ← Back to Teachers
                  </button>
                </div>
              </div>

              <div className="student-chat-box">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={msg.sender === "student" ? "chat-bubble-student" : "chat-bubble-teacher"}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[10px] block mt-1 ${
                        msg.sender === "student" ? "text-cream/70 text-right" : "text-forest/50"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-forest/60 mr-1">Suggested replies:</span>
                {[
                  `Could you explain question 2 in Quiz 1?`,
                  `Is the upcoming homework due this Sunday?`,
                  `Thank you for the detailed feedback!`,
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputMessage(chip)}
                    className="suggestion-chip"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Type message to ${activeTeacher.name}...`}
                  className="flex-1 bg-cream/50 border border-sand/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-sand"
                />
                <button type="submit" className="btn-primary text-xs sm:text-sm px-5 inline-flex items-center gap-1.5">
                  Send <SendIcon className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Section: Feedback (Quiz Feedback Carousel) */}
            <div className="student-card space-y-4">
              <div className="student-card-header">
                <h2 className="student-card-title">
                  <FeedbackIcon className="w-5 h-5 text-forest" /> Feedback
                </h2>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setFeedbackIndex((prev) =>
                        prev > 0 ? prev - 1 : activeTeacher.feedbackItems.length - 1
                      )
                    }
                    className="carousel-nav-btn w-7 h-7 text-xs"
                    title="Previous Assessment Feedback"
                    aria-label="Previous Assessment Feedback"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFeedbackIndex((prev) => (prev + 1) % activeTeacher.feedbackItems.length)
                    }
                    className="carousel-nav-btn w-7 h-7 text-xs"
                    title="Next Assessment Feedback"
                    aria-label="Next Assessment Feedback"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Active Quiz Feedback Card */}
              <div className="p-5 rounded-2xl bg-cream/40 border border-sand/40 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-sand/30">
                  <h3 className="text-base font-bold text-forest">{activeFeedback.title}</h3>
                  <span className="text-xs font-bold text-cream bg-forest px-3 py-1 rounded-full">
                    Score: {activeFeedback.score}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {activeFeedback.questions.map((qItem, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-sand/30 text-xs text-forest flex items-start gap-2.5 shadow-2xs"
                    >
                      <span className="font-extrabold text-forest bg-sand/30 px-2 py-0.5 rounded text-[11px] shrink-0">
                        {qItem.q}
                      </span>
                      <p className="leading-relaxed">{qItem.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-1.5">
                {activeTeacher.feedbackItems.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      feedbackIndex === i ? "w-5 bg-forest" : "w-1.5 bg-sand/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW B: Teachers List (Screen 3 - Teacher-S)                */
          /* ============================================================ */
          <div className="space-y-6">
            {/* Hero Card: Teachers */}
            <div className="wireframe-hero-card">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <TeacherIcon className="w-6 h-6 text-forest" />
              </div>
              <h1 className="wireframe-hero-title">Teachers</h1>
              <p className="wireframe-hero-subtitle">
                Assigned course instructors & direct academic support channels
              </p>
            </div>

            {/* My Teachers Section */}
            <div className="student-card space-y-4">
              <div className="student-card-header">
                <h2 className="student-card-title">
                  <TeacherIcon className="w-5 h-5 text-forest" /> My Teachers
                </h2>
                <span className="text-xs text-forest/60">Click any teacher to message or view feedback</span>
              </div>

              {/* Horizontal Teacher Carousel with arrows */}
              <div className="flex items-center justify-between gap-2 sm:gap-4 py-4">
                <button
                  type="button"
                  onClick={() =>
                    setTeacherCarouselIndex((prev) =>
                      prev > 0 ? prev - 1 : studentData.teachers.length - 1
                    )
                  }
                  className="carousel-nav-btn"
                  title="Previous Teacher"
                  aria-label="Previous Teacher"
                >
                  ‹
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                  {studentData.teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      onClick={() => handleSelectTeacher(teacher)}
                      className="teacher-profile-card hover:border-forest/60 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-forest text-cream font-bold text-lg flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
                        {teacher.name.split(" ")[1]?.substring(0, 2).toUpperCase() || "T"}
                      </div>
                      <h3 className="text-sm font-bold text-forest">
                        {teacher.name}
                      </h3>
                      <p className="text-xs text-forest/70 font-medium">{teacher.subject}</p>
                      <span className="text-[11px] text-forest/50 mt-1">{teacher.office}</span>

                      <div className="mt-4 pt-3 border-t border-sand/30 w-full flex items-center justify-center gap-2">
                        <span className="btn-ghost text-[11px] py-1 px-3">
                          Message & Feedback →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setTeacherCarouselIndex((prev) => (prev + 1) % studentData.teachers.length)
                  }
                  className="carousel-nav-btn"
                  title="Next Teacher"
                  aria-label="Next Teacher"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

