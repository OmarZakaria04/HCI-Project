import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { studentData } from "../../data/studentData";
import {
  TeacherIcon,
  ChatIcon,
  FeedbackIcon,
  SendIcon,
  CheckIcon,
  StarIcon,
} from "../../components/StudentIcons";
import "../../styles/student.css";

export default function StudentTeachers() {
  const { teacherId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected teacher in detail view
  const initialTeacher = teacherId
    ? studentData.teachers.find((t) => t.id === teacherId.toLowerCase()) || studentData.teachers[0]
    : studentData.teachers[0];

  const [activeTeacher, setActiveTeacher] = useState(initialTeacher);
  const [isDetailView, setIsDetailView] = useState(Boolean(teacherId) || Boolean(location.state?.prefillMessage));

  // Teachers carousel index for overview view
  const [teacherCarouselIndex, setTeacherCarouselIndex] = useState(0);

  // Chat state for the active teacher
  const [messages, setMessages] = useState(activeTeacher.initialMessages);
  const [inputMessage, setInputMessage] = useState(location.state?.prefillMessage || "");

  // Feedback quiz carousel index
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const activeFeedback =
    activeTeacher.feedbackItems[feedbackIndex] || activeTeacher.feedbackItems[0];

  const chatInputRef = useRef(null);

  // Focus input if prefilled from location.state
  useEffect(() => {
    if (location.state?.prefillMessage) {
      setInputMessage(location.state.prefillMessage);
      setIsDetailView(true);
      setTimeout(() => chatInputRef.current?.focus(), 150);
    }
  }, [location.state]);

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
          text: `Hello Ahmed, I received your question regarding ${activeTeacher.subject}. Let me review this specific item and guide you step by step.`,
          time: "Just now",
        },
      ]);
    }, 1000);
  };

  // S9: Attach quiz review request to chat
  const handleAskQuizReview = (feedback) => {
    const text = `Hi ${activeTeacher.name}, could you please review my score on ${feedback.title}?`;
    setInputMessage(text);
    chatInputRef.current?.focus();
  };

  // S9: Attach question clarification to chat
  const handleAskQuestionClarification = (qItem, feedback) => {
    const text = `Hi ${activeTeacher.name}, regarding ${feedback.title} - ${qItem.q}: Could you please clarify this question for me?`;
    setInputMessage(text);
    chatInputRef.current?.focus();
  };

  return (
    <div className="student-page-wrapper">
      <Header role="student" />

      <main className="student-container">
        {/* ============================================================ */}
        {/* VIEW A: Teacher Detail & Chat / Feedback (Screen 4: Mr. Ahmed) */}
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

            {/* Section: Message (Direct Chat Thread with S9 attachments) */}
            <div className="student-card space-y-3">
              <div className="student-card-header">
                <div>
                  <h2 className="student-card-title">
                    <ChatIcon className="w-5 h-5 text-forest" /> Message Teacher
                  </h2>
                  <p className="text-[11px] text-forest/60">
                    Ask for a quiz review, question clarification, or general guidance
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailView(false)}
                  className="btn-ghost text-xs"
                >
                  ← Back to Teachers
                </button>
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

              {/* S9 Suggestion & Question Quick Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-forest/60 mr-1">Quick Attach:</span>
                {[
                  `Review Quiz 1 submission`,
                  `Clarify Question 2 on Fractions`,
                  `Schedule office hours meeting`,
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputMessage(
                        chip.includes("Review")
                          ? `Hi ${activeTeacher.name}, could you please review my Quiz 1 submission?`
                          : chip.includes("Question")
                          ? `Hi ${activeTeacher.name}, regarding Question 2 on Fractions: Could you please help clarify this step?`
                          : `Hi ${activeTeacher.name}, would it be possible to schedule a short meeting during office hours?`
                      );
                      chatInputRef.current?.focus();
                    }}
                    className="suggestion-chip"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Type message or question for ${activeTeacher.name}...`}
                  className="flex-1 bg-cream/50 border border-sand/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-sand"
                />
                <button type="submit" className="btn-primary text-xs sm:text-sm px-5 inline-flex items-center gap-1.5">
                  Send <SendIcon className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Section: S5 Personalized Feedback & S8 Hard-Question Markers */}
            <div className="student-card space-y-4">
              <div className="student-card-header">
                <div>
                  <h2 className="student-card-title">
                    <FeedbackIcon className="w-5 h-5 text-forest" /> Personalized Quiz Feedback
                  </h2>
                  <p className="text-[11px] text-forest/60">
                    Balanced, friendly feedback confirmed by teacher • Positive & constructive points
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-forest bg-sage/20 border border-sage/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckIcon className="w-3 h-3 text-forest" /> Teacher Confirmed
                  </span>

                  <div className="flex items-center gap-1">
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
              </div>

              {/* Active Quiz Feedback Card */}
              <div className="p-5 rounded-2xl bg-cream/40 border border-sand/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sand/30 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-forest">{activeFeedback.title}</h3>
                    <span className="text-xs text-forest/60">Confirmed on {activeFeedback.confirmedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cream bg-forest px-3 py-1 rounded-full">
                      Score: {activeFeedback.score}
                    </span>
                    {/* S9 Quiz Review Button */}
                    <button
                      type="button"
                      onClick={() => handleAskQuizReview(activeFeedback)}
                      className="text-xs font-bold text-forest bg-white hover:bg-cream border border-sand/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      Ask for Review <ChatIcon className="w-3.5 h-3.5 text-forest" />
                    </button>
                  </div>
                </div>

                {/* S5 & S8: Question Feedback with Balanced Positive & Negative Points */}
                <div className="space-y-3">
                  {activeFeedback.questions.map((qItem) => (
                    <div
                      key={qItem.id}
                      className="p-4 rounded-xl bg-white border border-sand/30 text-xs text-forest space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-forest bg-sand/30 px-2 py-0.5 rounded text-[11px]">
                            {qItem.q}
                          </span>
                          {qItem.isHardQuestion && (
                            <span className="text-[10px] font-bold text-forest bg-sand/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <StarIcon className="w-3 h-3 text-forest" /> Marked Hard
                            </span>
                          )}
                        </div>

                        {/* S9 Action: Ask clarification on this specific question */}
                        <button
                          type="button"
                          onClick={() => handleAskQuestionClarification(qItem, activeFeedback)}
                          className="text-[11px] font-semibold text-forest bg-cream/70 hover:bg-sand/30 border border-sand/40 px-2 py-0.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Ask teacher about this question"
                        >
                          <ChatIcon className="w-3 h-3 text-forest" /> Ask About Question
                        </button>
                      </div>

                      {/* Balanced Feedback: Positive & Practice Points */}
                      <div className="space-y-1 pt-1">
                        <p className="text-forest font-medium text-xs leading-relaxed">
                          {qItem.positive}
                        </p>
                        <p className="text-forest/80 text-xs leading-relaxed">
                          {qItem.constructive}
                        </p>
                      </div>
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
