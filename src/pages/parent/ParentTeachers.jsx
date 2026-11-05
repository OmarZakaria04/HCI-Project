import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import ParentChildBar from "../../components/ParentChildBar";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import { parentData } from "../../data/parentData";
import "../../styles/parent.css";

// Nielsen H6 (Recognition over Recall) Suggestion Chips for Agenda
const AGENDA_SUGGESTIONS = [
  "Review recent calculus exam performance",
  "Discussion on AP course registration & pacing",
  "Classroom participation & focus strategies",
  "Homework routine and preparation tips",
];

export default function ParentTeachers() {
  const navigate = useNavigate();

  const [activeChildId, setActiveChildId] = useState(() => {
    return localStorage.getItem("parent_active_child") || "ahmed";
  });

  const handleSelectChild = (id) => {
    setActiveChildId(id);
    localStorage.setItem("parent_active_child", id);
  };

  const child =
    parentData.children.find((c) => c.id === activeChildId) ||
    parentData.children[0];

  const [carouselIndex, setCarouselIndex] = useState(0);

  // P6 Meeting Booking State
  const [bookingTeacher, setBookingTeacher] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [meetingType, setMeetingType] = useState("In-Person (School Room)");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [meetings, setMeetings] = useState(child.meetings || []);

  // Nielsen H1 (Status) & H5 (Error Prevention) & H3 (Freedom / Undo)
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [meetingToCancel, setMeetingToCancel] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [lastCancelledMeeting, setLastCancelledMeeting] = useState(null);

  // Keyboard navigation for modal (KLM Efficiency Item 8 & Nielsen H3 Freedom)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setBookingTeacher(null);
        setMeetingToCancel(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const prevTeacher = () => {
    setCarouselIndex((prev) =>
      prev === 0 ? child.teachers.length - 1 : prev - 1
    );
  };

  const nextTeacher = () => {
    setCarouselIndex((prev) =>
      prev === child.teachers.length - 1 ? 0 : prev + 1
    );
  };

  // Async meeting booking with spinner (Nielsen H1 Status)
  const handleBookMeeting = (e) => {
    e.preventDefault();
    if (!bookingTeacher || !selectedSlot) {
      alert("Please choose an available time slot.");
      return;
    }

    setIsBookingLoading(true);

    setTimeout(() => {
      const newMeeting = {
        id: `meet-${Date.now()}`,
        teacherName: bookingTeacher.name,
        subject: bookingTeacher.subject,
        date: selectedSlot.split(", ")[0] || "Nov 15, 2026",
        time: selectedSlot.split(", ")[1] || "1:30 PM",
        type: meetingType,
        status: "Confirmed",
        agenda: meetingAgenda || "General academic progress consultation.",
      };

      setMeetings((prev) => [newMeeting, ...prev]);
      setIsBookingLoading(false);
      setToastMessage(
        `Appointment confirmed with ${bookingTeacher.name} for ${selectedSlot}.`
      );
      setBookingTeacher(null);
      setSelectedSlot("");
      setMeetingAgenda("");
    }, 500);
  };

  // Safe cancellation with Undo support (Nielsen H3 Freedom & H5 Error Prevention)
  const confirmCancelMeeting = () => {
    if (!meetingToCancel) return;
    const removed = meetingToCancel;
    setMeetings((prev) => prev.filter((m) => m.id !== removed.id));
    setLastCancelledMeeting(removed);
    setMeetingToCancel(null);
    setToastMessage(`Cancelled meeting with ${removed.teacherName}.`);
  };

  const handleUndoCancel = () => {
    if (!lastCancelledMeeting) return;
    setMeetings((prev) => [lastCancelledMeeting, ...prev]);
    setLastCancelledMeeting(null);
    setToastMessage("Meeting appointment restored successfully.");
  };

  return (
    <div className="parent-page-wrapper">
      <Header role="parent" />
      <ParentChildBar
        activeChildId={activeChildId}
        onSelectChild={handleSelectChild}
        showBack={true}
        backTo="/parent"
        breadcrumbText="Teachers & Conferences"
      />

      <main className="parent-container">
        {/* Wireframe Hero Banner (Item 1: Core Action Identified) */}
        <section className="wireframe-hero">
          <h2 className="wireframe-hero-title">Faculty & Conferences</h2>
          <p className="wireframe-hero-subtitle">
            Consultations, appointments, and direct teacher liaison for{" "}
            <strong>{child.name}</strong>
          </p>
        </section>

        {/* Section: My Teachers (Wireframe Screen 2) */}
        <section className="parent-card">
          <div className="parent-card-header">
            <div>
              <h3 className="parent-card-title">My Teachers</h3>
              <p className="text-[11px] text-forest/70 mt-0.5">
                Contact or schedule a one-on-one conference with any instructor
              </p>
            </div>
            <span className="text-xs text-forest/80 font-bold bg-sand/30 px-3 py-1 rounded-full">
              {child.teachers.length} Active Instructors
            </span>
          </div>

          <div className="teachers-carousel-wrap">
            <button
              type="button"
              onClick={prevTeacher}
              className="carousel-arrow-btn"
              title="Previous Teacher"
              aria-label="Previous Teacher"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="teacher-cards-grid">
              {child.teachers.map((teacher, index) => {
                const initials = teacher.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("");

                return (
                  <div
                    key={teacher.id}
                    className={`teacher-card ${
                      index === carouselIndex ? "ring-2 ring-forest/30" : ""
                    }`}
                  >
                    <div
                      className="teacher-avatar-circle"
                      style={{
                        backgroundColor: teacher.avatarColor || "#1E3B2F",
                      }}
                    >
                      {initials}
                    </div>

                    <h4 className="teacher-name">{teacher.name}</h4>
                    <p className="teacher-subject-tag">
                      {teacher.subject} • {teacher.room}
                    </p>

                    <p className="text-[11px] text-forest/75 italic mb-4 line-clamp-2 px-2">
                      "{teacher.lastMessage}"
                    </p>

                    <div className="w-full space-y-2">
                      {/* P5 Direct Chat */}
                      <button
                        type="button"
                        onClick={() => navigate(`/parent/chat/${teacher.id}`)}
                        className="btn-primary w-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span>Message (P5)</span>
                      </button>

                      {/* P6 Meeting Booking */}
                      <button
                        type="button"
                        onClick={() => {
                          setBookingTeacher(teacher);
                          setSelectedSlot(teacher.availableSlots?.[0] || "");
                        }}
                        className="btn-secondary w-full"
                      >
                        <span>📅</span>
                        <span>Book Meeting (P6)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={nextTeacher}
              className="carousel-arrow-btn"
              title="Next Teacher"
              aria-label="Next Teacher"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* P6. Scheduled Meetings Section */}
        <section className="parent-card">
          <div className="parent-card-header">
            <div>
              <h3 className="parent-card-title">
                <span>Scheduled Parent-Teacher Conferences</span>
              </h3>
              <p className="text-[11px] text-forest/70 mt-0.5">
                Upcoming one-on-one appointments
              </p>
            </div>
            <span className="text-xs font-bold text-forest bg-sage/20 px-3 py-1 rounded-full">
              {meetings.length} Upcoming
            </span>
          </div>

          {meetings.length === 0 ? (
            <div className="text-center py-8 text-xs text-forest/65 bg-cream/30 rounded-xl border border-sand/30">
              No meetings scheduled yet. Click <strong>Book Meeting</strong> on any teacher above.
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.map((meet) => (
                <div
                  key={meet.id}
                  className="p-4 rounded-xl border border-sand/40 bg-cream/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-forest">
                        {meet.teacherName} ({meet.subject})
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
                        {meet.status}
                      </span>
                    </div>
                    <p className="text-xs text-forest/80">
                      <strong>Date & Time:</strong> {meet.date} • {meet.time}
                    </p>
                    <p className="text-xs text-forest/75">
                      <strong>Location / Format:</strong> {meet.type}
                    </p>
                    <p className="text-[11px] text-forest/70 italic">
                      Agenda: "{meet.agenda}"
                    </p>
                  </div>

                  {/* Nielsen H5 Error Prevention Guarded Cancel */}
                  <button
                    type="button"
                    onClick={() => setMeetingToCancel(meet)}
                    className="h-9 px-3.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel Conference
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* P6 Meeting Booking Modal (With Recognition Suggestions) */}
      {bookingTeacher && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setBookingTeacher(null)}
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleBookMeeting}
            className="bg-white rounded-2xl border border-sand/50 shadow-2xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-sand/30 pb-3">
              <div>
                <h3 className="text-sm font-bold text-forest">
                  Book Conference with {bookingTeacher.name}
                </h3>
                <p className="text-xs text-forest/70">
                  {bookingTeacher.subject} • {bookingTeacher.room}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookingTeacher(null)}
                className="w-8 h-8 rounded-full bg-cream text-forest flex items-center justify-center font-bold text-sm hover:bg-sand/30 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-forest mb-1.5">
                  1. Select Available Time Slot:
                </label>
                <div className="flex flex-wrap gap-2">
                  {bookingTeacher.availableSlots?.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`meeting-slot-pill ${
                        selectedSlot === slot ? "meeting-slot-pill-active" : ""
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="meeting-format-select" className="block font-bold text-forest mb-1">
                  2. Meeting Location / Format:
                </label>
                <select
                  id="meeting-format-select"
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="w-full h-10 rounded-xl bg-cream/40 border border-sand/40 px-3 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-sand"
                >
                  <option value={`In-Person (${bookingTeacher.room})`}>
                    In-Person at Campus ({bookingTeacher.room})
                  </option>
                  <option value="Virtual Video Conference (Google Meet)">
                    Virtual Video Conference (Google Meet)
                  </option>
                  <option value="Phone Call Consultation">
                    Phone Consultation
                  </option>
                </select>
              </div>

              {/* Nielsen H6: Recognition Suggestions for Agenda */}
              <div>
                <label className="block font-bold text-forest mb-1.5">
                  3. Suggested Agenda Topics (Click to fill):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {AGENDA_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setMeetingAgenda(sug)}
                      className={`suggestion-chip ${
                        meetingAgenda === sug ? "suggestion-chip-active" : ""
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                <textarea
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  placeholder="Or write custom agenda..."
                  rows={2}
                  className="w-full rounded-xl bg-cream/40 border border-sand/40 p-3 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-sand"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setBookingTeacher(null)}
                className="btn-ghost"
              >
                Cancel (Esc)
              </button>
              <button
                type="submit"
                disabled={isBookingLoading}
                className="btn-primary"
              >
                {isBookingLoading ? (
                  <>
                    <span className="loading-spinner" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <span>Confirm Appointment</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Nielsen H5 Error Prevention Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(meetingToCancel)}
        title="Cancel Conference Appointment?"
        message={`Are you sure you want to cancel your scheduled meeting with ${meetingToCancel?.teacherName} on ${meetingToCancel?.date}? You can undo this action immediately after.`}
        confirmLabel="Yes, Cancel Conference"
        cancelLabel="Keep Conference (Safe)"
        isDestructive={true}
        onConfirm={confirmCancelMeeting}
        onCancel={() => setMeetingToCancel(null)}
      />

      {/* Nielsen H1 & H3 Toast with Undo Action */}
      <Toast
        message={toastMessage}
        type="info"
        undoAction={lastCancelledMeeting ? handleUndoCancel : null}
        undoLabel="Undo Cancel"
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
