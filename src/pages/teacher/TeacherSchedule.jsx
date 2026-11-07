import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  scheduleDays,
  schedulePeriods,
  scheduleTimetable,
  teacherScheduleEvents as initialEvents,
  classes,
} from "../../data/teacherData";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import "../../styles/teacher.css";

export default function TeacherSchedule() {
  const [eventsList, setEventsList] = useState(initialEvents);
  const [activeFilter, setActiveFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEvents, setShowEvents] = useState(true);

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [deleteModalEvent, setDeleteModalEvent] = useState(null);
  const [editModalEvent, setEditModalEvent] = useState(null);
  const [toast, setToast] = useState(null);

  // New Event Form State (inside Modal)
  const [formGrade, setFormGrade] = useState("5");
  const [formClassId, setFormClassId] = useState("5A");
  const [formType, setFormType] = useState("Assignment");
  const [formDate, setFormDate] = useState("2026-10-25");
  const [formTime, setFormTime] = useState("11:59 PM");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsScheduleModalOpen(false);
        setSelectedSlot(null);
        setEditModalEvent(null);
        setDeleteModalEvent(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update class options when grade changes
  const handleGradeChange = (gradeVal) => {
    setFormGrade(gradeVal);
    if (gradeVal === "5") setFormClassId("5A");
    else if (gradeVal === "4") setFormClassId("4A");
    else if (gradeVal === "3") setFormClassId("3B");
  };

  // Create new scheduled event from modal
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setToast({
        message: "Please enter an activity title or topic.",
        type: "warning",
      });
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: formTitle.trim(),
      classId: formClassId,
      grade: parseInt(formGrade, 10),
      type: formType,
      date: formDate || "2026-10-30",
      time: formTime || "11:59 PM",
      status: "Upcoming",
      description: formDesc.trim() || `Scheduled ${formType} for ${formClassId}.`,
    };

    setEventsList([newEvent, ...eventsList]);
    setFormTitle("");
    setFormDesc("");
    setIsScheduleModalOpen(false);

    setToast({
      message: `Created "${newEvent.title}" for class ${newEvent.classId}!`,
      type: "success",
    });
  };

  // Toggle completed status
  const handleToggleComplete = (eventId) => {
    setEventsList((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextStatus = ev.status === "Completed" ? "Upcoming" : "Completed";
          return { ...ev, status: nextStatus };
        }
        return ev;
      })
    );
  };

  // Delete event with undo
  const confirmDelete = () => {
    if (!deleteModalEvent) return;
    const deletedId = deleteModalEvent.id;
    const deletedTitle = deleteModalEvent.title;
    const backupEvent = deleteModalEvent;

    setEventsList((prev) => prev.filter((ev) => ev.id !== deletedId));
    setDeleteModalEvent(null);

    setToast({
      message: `Deleted "${deletedTitle}"`,
      type: "info",
      undoAction: () => {
        setEventsList((prev) => [backupEvent, ...prev]);
        setToast({ message: `Restored "${deletedTitle}"`, type: "success" });
      },
      undoLabel: "Undo",
    });
  };

  // Save edited event
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editModalEvent) return;

    setEventsList((prev) =>
      prev.map((ev) => (ev.id === editModalEvent.id ? editModalEvent : ev))
    );
    const updatedTitle = editModalEvent.title;
    setEditModalEvent(null);
    setToast({
      message: `Updated "${updatedTitle}" successfully!`,
      type: "success",
    });
  };

  // Filtered scheduled events
  const filteredEvents = eventsList.filter((ev) => {
    const matchesType =
      activeFilter === "All" ||
      (activeFilter === "Completed" && ev.status === "Completed") ||
      (activeFilter !== "Completed" && ev.type === activeFilter);

    const matchesClass =
      classFilter === "All" || ev.classId === classFilter;

    const matchesSearch =
      searchQuery === "" ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.classId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesClass && matchesSearch;
  });

  return (
    <div className="teacher-page space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            to="/teacher"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest/75 hover:text-forest transition-colors mb-1"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
            Schedule & Lesson Planner
          </h1>
          <p className="text-xs text-forest/70 mt-0.5">
            Weekly timetable, classroom allocations, homework deadlines, and quiz dates.
          </p>
        </div>

        {/* Primary Action Button: Opens Clean Popup (No Cluster on Page) */}
        <div>
          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest/90 text-[#F5F0E6] font-extrabold text-xs shadow-md border-2 border-[#C8B48A] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-sm font-bold leading-none text-[#C8B48A]">+</span>
            <span>Schedule Activity / Exam</span>
          </button>
        </div>
      </div>

      {/* Chalkboard Card: Weekly Timetable */}
      <section className="schedule-board-card">
        {/* Header with Title and Class Highlight Controls */}
        <div className="schedule-board-header">
          <div className="schedule-board-title">
            <span className="text-2xl">📅</span>
            <span>Weekly Class Timetable</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#E8D5B5] font-bold mr-1">
              Filter by Class:
            </span>
            {["All", "5A", "4A", "3B"].map((cId) => (
              <button
                key={cId}
                type="button"
                onClick={() => setClassFilter(cId)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  classFilter === cId
                    ? "bg-[#C8B48A] text-[#163327] shadow-sm font-extrabold"
                    : "bg-black/25 text-[#F5F0E6] hover:bg-black/40 border border-[#C8B48A]/40"
                }`}
              >
                {cId === "All" ? "All Classes" : `Class ${cId}`}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Timetable Grid */}
        <div className="timetable-container">
          <table className="timetable-table" aria-label="Weekly Timetable">
            <thead>
              <tr>
                <th className="timetable-period-th">Period / Time</th>
                {scheduleDays.map((day) => (
                  <th key={day} className="text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedulePeriods.map((period) => (
                <tr key={period.id}>
                  {/* Row Header (Period Name & Time) */}
                  <td className="timetable-period-th">
                    <div className="font-extrabold text-[#E8D5B5]">{period.name}</div>
                    <div className="text-[10px] text-white/70 mt-0.5">{period.time}</div>
                  </td>

                  {/* Day Slots */}
                  {scheduleDays.map((day) => {
                    const slotData = scheduleTimetable[day]?.[period.id];
                    if (!slotData) {
                      return (
                        <td key={day} className="text-center text-white/30 text-xs">
                          —
                        </td>
                      );
                    }

                    // Break Period
                    if (period.isBreak) {
                      return (
                        <td key={day} className="p-1.5">
                          <div className="timetable-slot-break">
                            <span className="text-[11px] font-extrabold text-[#F5F0E6]">
                              ☕ {slotData.label}
                            </span>
                          </div>
                        </td>
                      );
                    }

                    const isFree = slotData.classId === "Free";
                    const isHighlighted =
                      classFilter !== "All" && slotData.classId === classFilter;
                    const isDimmed =
                      classFilter !== "All" &&
                      slotData.classId !== classFilter &&
                      !isFree;

                    // Realistic Free Slot (Spacious, Airy, Non-clustered)
                    if (isFree) {
                      return (
                        <td key={day} className="p-1.5">
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              setSelectedSlot({
                                day,
                                period: period.name,
                                time: period.time,
                                ...slotData,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedSlot({
                                  day,
                                  period: period.name,
                                  time: period.time,
                                  ...slotData,
                                });
                              }
                            }}
                            className="timetable-slot-free"
                            title="Free / Office period. Click to view."
                          >
                            <span className="text-[10px] tracking-wider uppercase font-semibold">
                              — Free / Prep —
                            </span>
                          </div>
                        </td>
                      );
                    }

                    // Teaching Class Slot (High Contrast, Bold, Clear)
                    return (
                      <td key={day} className="p-1.5">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            setSelectedSlot({
                              day,
                              period: period.name,
                              time: period.time,
                              ...slotData,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedSlot({
                                day,
                                period: period.name,
                                time: period.time,
                                ...slotData,
                              });
                            }
                          }}
                          className={`timetable-slot ${
                            isHighlighted
                              ? "timetable-slot-active"
                              : isDimmed
                              ? "opacity-35"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#0D1F17] text-[#F5F0E6] border border-[#C8B48A]">
                              {slotData.classId}
                            </span>
                            <span className="text-[10px] text-[#DCEAE2] font-semibold truncate max-w-[75px]">
                              {slotData.room}
                            </span>
                          </div>
                          <div className="text-[12px] font-extrabold text-white line-clamp-1 leading-snug">
                            {slotData.subject}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Chalkboard Section: Scheduled Events & Deadlines in Cards with Option to Hide/Show */}
      <section className="schedule-board-card">
        {/* Section Header with Show/Hide Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C8B48A]/40">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📋</span>
            <h2 className="text-lg font-extrabold text-[#F5F0E6]">
              Upcoming Deadlines & Scheduled Activities
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8B48A] text-[#163327] text-xs font-black">
              {filteredEvents.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEvents((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 border border-[#C8B48A]/60 text-xs font-bold text-[#F5F0E6] transition-colors cursor-pointer"
            >
              <span>{showEvents ? "Hide Events ▲" : "Show Events ▼"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#C8B48A] hover:bg-[#F5F0E6] text-[#163327] font-extrabold text-xs transition-colors cursor-pointer shadow-xs"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {!showEvents ? (
          <div className="py-4 px-3 rounded-xl bg-black/20 border border-[#C8B48A]/30 flex items-center justify-between text-xs text-white/80">
            <span>
              <strong>{filteredEvents.length}</strong> scheduled activities are currently hidden.
            </span>
            <button
              type="button"
              onClick={() => setShowEvents(true)}
              className="text-[#C8B48A] font-bold hover:underline cursor-pointer"
            >
              Show all cards →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filter Tabs & Quick Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {["All", "Assignment", "Quiz", "Exam", "Lesson", "Completed"].map(
                  (filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeFilter === filter
                          ? "bg-[#C8B48A] text-[#163327] shadow-sm font-extrabold"
                          : "bg-black/25 text-[#F5F0E6] hover:bg-black/40 border border-[#C8B48A]/30"
                      }`}
                    >
                      {filter === "All" ? "All Items" : filter}
                    </button>
                  )
                )}
              </div>

              <div className="w-full md:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities..."
                  className="w-full schedule-modal-input"
                />
              </div>
            </div>

            {/* List of Cards */}
            {filteredEvents.length === 0 ? (
              <div className="py-10 text-center text-xs text-white/60 bg-black/15 rounded-xl border border-white/10">
                No scheduled activities found matching your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredEvents.map((item) => {
                  const isCompleted = item.status === "Completed";
                  const badgeColor =
                    item.type === "Assignment"
                      ? "bg-[#2A5946] text-white border-[#7F8C6A]"
                      : item.type === "Quiz"
                      ? "bg-[#8C6D33] text-white border-[#C8B48A]"
                      : item.type === "Exam"
                      ? "bg-[#8C333A] text-white border-[#E07A5F]"
                      : "bg-[#256349] text-white border-[#52B788]";

                  return (
                    <div
                      key={item.id}
                      className={`schedule-item-card ${
                        isCompleted ? "schedule-item-card-done" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(item.id)}
                          title={
                            isCompleted
                              ? "Mark as upcoming"
                              : "Mark as completed"
                          }
                          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs border-2 transition-colors cursor-pointer ${
                            isCompleted
                              ? "bg-sage text-cream border-cream"
                              : "bg-black/30 text-transparent hover:text-white/60 border-[#C8B48A]/60"
                          }`}
                        >
                          ✓
                        </button>

                        {/* Card Content */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider ${badgeColor}`}
                            >
                              {item.type}
                            </span>
                            <span className="font-extrabold text-white text-sm">
                              {item.title}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-black/40 border border-[#C8B48A]/60 text-[11px] text-[#F5F0E6] font-bold">
                              Class {item.classId}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
                            <span>
                              📅 Due: <strong className="text-[#E8D5B5]">{item.date}</strong>{" "}
                              {item.time && `• ${item.time}`}
                            </span>
                            {item.description && (
                              <span className="text-white/65">
                                • {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditModalEvent(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-black/30 hover:bg-black/50 text-[#F5F0E6] border border-[#C8B48A]/50 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModalEvent(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 border border-rose-500/50 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* =========================================================================
          POPUP MODAL: Schedule New Activity / Quiz / Exam (Avoids On-page Cluster)
          ========================================================================= */}
      {isScheduleModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsScheduleModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#163327] border-2 border-[#C8B48A] rounded-2xl shadow-2xl max-w-lg w-full p-6 text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#C8B48A]/40 pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C8B48A]">
                  New Entry
                </span>
                <h3 className="text-xl font-extrabold text-[#F5F0E6] mt-0.5">
                  Schedule Activity or Assessment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white font-bold cursor-pointer border border-[#C8B48A]/40"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Grade */}
                <div>
                  <label className="block text-white/90 font-bold mb-1">
                    Select Grade
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => handleGradeChange(e.target.value)}
                    className="w-full schedule-modal-input"
                  >
                    <option value="5">Grade 5</option>
                    <option value="4">Grade 4</option>
                    <option value="3">Grade 3</option>
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-white/90 font-bold mb-1">
                    Select Class
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full schedule-modal-input"
                  >
                    {classes
                      .filter((c) =>
                        formGrade ? String(c.id).startsWith(formGrade) : true
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.id})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-white/90 font-bold mb-1">
                    Activity Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full schedule-modal-input"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Exam">Exam</option>
                    <option value="Lesson">Lesson / Lab</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white/90 font-bold mb-1">
                  Activity Title / Topic *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quiz 2: Multiplying Fractions..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full schedule-modal-input"
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/90 font-bold mb-1">
                    Due / Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full schedule-modal-input"
                  />
                </div>
                <div>
                  <label className="block text-white/90 font-bold mb-1">
                    Due Time / Notes
                  </label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 11:59 PM or 09:00 AM"
                    className="w-full schedule-modal-input"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/90 font-bold mb-1">
                  Instructions / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Additional details for students and parents..."
                  className="w-full schedule-modal-input"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#C8B48A]/30">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black/30 text-white font-bold hover:bg-black/50 border border-[#C8B48A]/40 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C8B48A] hover:bg-[#F5F0E6] text-[#163327] font-extrabold transition-colors shadow-sm cursor-pointer"
                >
                  Create & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slot Details Modal */}
      {selectedSlot && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedSlot(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#163327] border-2 border-[#C8B48A] rounded-2xl shadow-2xl max-w-md w-full p-6 text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#C8B48A]/40 pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C8B48A]">
                  {selectedSlot.day} • {selectedSlot.period} ({selectedSlot.time})
                </span>
                <h3 className="text-xl font-extrabold text-[#F5F0E6] mt-0.5">
                  {selectedSlot.classId === "Free"
                    ? "Free / Preparation Period"
                    : `Class ${selectedSlot.classId}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white font-bold cursor-pointer border border-[#C8B48A]/40"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#C8B48A]/20">
                <span className="text-white/70">Subject / Focus:</span>
                <span className="font-extrabold text-white">{selectedSlot.subject}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#C8B48A]/20">
                <span className="text-white/70">Assigned Location:</span>
                <span className="font-extrabold text-[#E8D5B5]">{selectedSlot.room}</span>
              </div>
              {selectedSlot.grade && (
                <div className="flex justify-between py-1.5 border-b border-[#C8B48A]/20">
                  <span className="text-white/70">Grade Level:</span>
                  <span className="font-extrabold text-white">Grade {selectedSlot.grade}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              {selectedSlot.classId !== "Free" && (
                <button
                  type="button"
                  onClick={() => {
                    setFormClassId(selectedSlot.classId);
                    if (selectedSlot.grade) setFormGrade(String(selectedSlot.grade));
                    setSelectedSlot(null);
                    setIsScheduleModalOpen(true);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#C8B48A] text-[#163327] font-extrabold text-xs hover:bg-[#F5F0E6] transition-colors cursor-pointer"
                >
                  Schedule for Class {selectedSlot.classId}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 rounded-xl bg-black/30 text-white font-bold text-xs hover:bg-black/50 border border-[#C8B48A]/40 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editModalEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setEditModalEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#163327] border-2 border-[#C8B48A] rounded-2xl shadow-2xl max-w-lg w-full p-6 text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#C8B48A]/40 pb-3">
              <h3 className="text-lg font-extrabold text-[#F5F0E6]">
                Edit Scheduled Activity
              </h3>
              <button
                type="button"
                onClick={() => setEditModalEvent(null)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white font-bold cursor-pointer border border-[#C8B48A]/40"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/90 font-bold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editModalEvent.title}
                  onChange={(e) =>
                    setEditModalEvent({ ...editModalEvent, title: e.target.value })
                  }
                  className="w-full schedule-modal-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/90 font-bold mb-1">
                    Activity Type
                  </label>
                  <select
                    value={editModalEvent.type}
                    onChange={(e) =>
                      setEditModalEvent({ ...editModalEvent, type: e.target.value })
                    }
                    className="w-full schedule-modal-input"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Exam">Exam</option>
                    <option value="Lesson">Lesson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 font-bold mb-1">
                    Class
                  </label>
                  <select
                    value={editModalEvent.classId}
                    onChange={(e) =>
                      setEditModalEvent({ ...editModalEvent, classId: e.target.value })
                    }
                    className="w-full schedule-modal-input"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/90 font-bold mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editModalEvent.date}
                    onChange={(e) =>
                      setEditModalEvent({ ...editModalEvent, date: e.target.value })
                    }
                    className="w-full schedule-modal-input"
                  />
                </div>

                <div>
                  <label className="block text-white/90 font-bold mb-1">
                    Time / Notes
                  </label>
                  <input
                    type="text"
                    value={editModalEvent.time || ""}
                    onChange={(e) =>
                      setEditModalEvent({ ...editModalEvent, time: e.target.value })
                    }
                    className="w-full schedule-modal-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/90 font-bold mb-1">
                  Description / Topic Notes
                </label>
                <textarea
                  rows={3}
                  value={editModalEvent.description || ""}
                  onChange={(e) =>
                    setEditModalEvent({
                      ...editModalEvent,
                      description: e.target.value,
                    })
                  }
                  className="w-full schedule-modal-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#C8B48A]/30">
                <button
                  type="button"
                  onClick={() => setEditModalEvent(null)}
                  className="px-4 py-2 rounded-xl bg-black/30 text-white font-bold hover:bg-black/50 border border-[#C8B48A]/40 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C8B48A] hover:bg-[#F5F0E6] text-[#163327] font-extrabold transition-colors shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteModalEvent)}
        title="Delete Scheduled Activity?"
        message={`Are you sure you want to remove "${deleteModalEvent?.title}" for class ${deleteModalEvent?.classId}? This will remove it from the schedule.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Activity"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalEvent(null)}
      />

      {/* Toast Feedback */}
      <Toast
        message={toast?.message}
        type={toast?.type}
        undoAction={toast?.undoAction}
        undoLabel={toast?.undoLabel}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
