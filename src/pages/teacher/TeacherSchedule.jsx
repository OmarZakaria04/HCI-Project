import { useEffect, useRef, useState } from "react";
import {
  scheduleDays, schedulePeriods, scheduleTimetable,
  teacherScheduleEvents as initialEvents, classes,
} from "../../data/teacherData";
import keepDialogFocus from "../../utils/dialogFocus";
import "../../styles/teacher-schedule.css";

const activityTypes = ["Assignment", "Quiz", "Exam", "Lesson"];
const dateLabel = (value) => value ? new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${value}T12:00:00Z`)) : "Date not set";

export default function TeacherSchedule() {
  const [eventsList, setEventsList] = useState(initialEvents);
  const [typeFilter, setTypeFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState(null);
  const searchRef = useRef(null);
  const completedFilterRef = useRef(null);

  const query = searchQuery.trim().toLowerCase();
  const filteredEvents = eventsList.filter((item) =>
    (typeFilter === "All" || item.type === typeFilter) &&
    (classFilter === "All" || item.classId === classFilter) &&
    (!hideCompleted || item.status !== "Completed") &&
    `${item.title} ${item.classId}`.toLowerCase().includes(query)
  );
  const completedCount = eventsList.filter((item) => item.status === "Completed").length;
  const hasFilters = typeFilter !== "All" || classFilter !== "All" || searchQuery !== "" || hideCompleted;

  function resetFilters() {
    setTypeFilter("All");
    setClassFilter("All");
    setSearchQuery("");
    setHideCompleted(false);
    searchRef.current?.focus();
  }

  function openCreate(slot) {
    const selectedClass = classes.find((item) => item.id === slot?.classId) ??
      classes.find((item) => item.id === classFilter) ?? classes[0];
    setModal({ kind: "create", draft: {
      title: "", classId: selectedClass?.id ?? "", grade: selectedClass?.grade ?? "",
      type: "Assignment", date: "", time: "11:59 PM", description: "", status: "Upcoming",
    } });
  }

  function saveEvent(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const titleInput = form.elements.namedItem("title");
    if (!modal.draft.title.trim()) {
      titleInput.setCustomValidity("Enter an activity title.");
      titleInput.reportValidity();
      return;
    }
    const saved = { ...modal.draft, title: modal.draft.title.trim(), description: modal.draft.description.trim() };
    if (modal.kind === "edit") {
      setEventsList((previous) => previous.map((item) => item.id === saved.id ? saved : item));
    } else {
      saved.id = Date.now();
      setEventsList((previous) => [saved, ...previous]);
    }
    setNotice({ message: `${modal.kind === "edit" ? "Updated" : "Created"} “${saved.title}” for class ${saved.classId}.` });
    setModal(null);
  }

  function toggleComplete(item) {
    const status = item.status === "Completed" ? "Upcoming" : "Completed";
    setEventsList((previous) => previous.map((entry) => entry.id === item.id ? { ...entry, status } : entry));
    setNotice({ message: `“${item.title}” marked as ${status.toLowerCase()}.` });
    if (hideCompleted && status === "Completed") requestAnimationFrame(() => completedFilterRef.current?.focus());
  }

  function deleteEvent() {
    const removed = modal.event;
    const position = eventsList.findIndex((item) => item.id === removed.id);
    setEventsList((previous) => previous.filter((item) => item.id !== removed.id));
    setModal(null);
    setNotice({ message: `Deleted “${removed.title}”.`, undo: () => {
      setEventsList((previous) => {
        const restored = [...previous];
        restored.splice(position, 0, removed);
        return restored;
      });
      setNotice({ message: `Restored “${removed.title}”.` });
    } });
  }

  function updateDraft(changes) {
    setModal((previous) => ({ ...previous, draft: { ...previous.draft, ...changes } }));
  }

  return (
    <div className="teacher-schedule">
      <header className="schedule-intro">
        <div>
          <h1>Schedule &amp; lesson planner</h1>
          <p>Weekly classes, homework deadlines, and scheduled activities.</p>
        </div>
        <button type="button" className="schedule-button schedule-primary" onClick={() => openCreate()}>Schedule activity</button>
      </header>

      <section className="schedule-board" aria-labelledby="schedule-timetable-title">
        <header className="schedule-board-heading">
          <h2 id="schedule-timetable-title">Weekly class timetable</h2>
          <label className="schedule-class-filter">
            <span>Class</span>
            <select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} aria-describedby="schedule-class-help">
              <option value="All">All classes</option>
              {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </header>
        <p id="schedule-class-help" className="schedule-meta schedule-table-help">Choose a class to highlight its lessons and filter the activities below. Select a period for details.</p>
        <div className="schedule-table-scroll" role="region" aria-label="Weekly class timetable, scroll horizontally to view all days" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">Period / time</th>{scheduleDays.map((day) => <th scope="col" key={day}>{day}</th>)}</tr></thead>
            <tbody>{schedulePeriods.map((period) => (
              <tr key={period.id}>
                <th scope="row"><span>{period.name}</span><span className="schedule-meta">{period.time}</span></th>
                {period.isBreak ? <td colSpan={scheduleDays.length} className="schedule-break"><span>Break</span></td> : scheduleDays.map((day) => {
                  const slot = scheduleTimetable[day]?.[period.id];
                  if (!slot) return <td key={day}>—</td>;
                  const free = slot.classId === "Free";
                  const highlighted = classFilter !== "All" && slot.classId === classFilter;
                  return <td key={day}>
                    <button type="button" className={`schedule-slot${free ? " schedule-slot-free" : ""}${highlighted ? " schedule-slot-selected" : ""}`}
                      aria-label={`${day}, ${period.name} period, ${free ? "Free / preparation" : `Class ${slot.classId}`}: ${slot.subject}, ${slot.room}`}
                      onClick={() => setModal({ kind: "slot", slot: { ...slot, day, period: period.name, time: period.time } })}>
                      {free ? <span>Free / prep</span> : <>
                        <span className="schedule-slot-class">Class {slot.classId}</span>
                        <span className="schedule-slot-subject">{slot.subject}</span>
                        <span className="schedule-meta">{slot.room}</span>
                      </>}
                    </button>
                  </td>;
                })}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="schedule-board" aria-labelledby="schedule-activities-title">
        <header className="schedule-board-heading">
          <h2 id="schedule-activities-title" tabIndex={-1}>Upcoming deadlines &amp; scheduled activities</h2>
          <button type="button" className="schedule-button" onClick={() => openCreate()}>Add activity</button>
        </header>
        <div className="schedule-filters">
          <label><span>Activity type</span>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="All">All types</option>
              {activityTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="schedule-search"><span>Search activities</span>
            <input ref={searchRef} type="search" placeholder="Search by title or class" value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)} aria-describedby="schedule-results" />
          </label>
          <label className="schedule-completed-toggle"><input ref={completedFilterRef} type="checkbox" checked={hideCompleted} onChange={(event) => setHideCompleted(event.target.checked)} />Hide completed events</label>
        </div>
        <div className="schedule-results">
          <p id="schedule-results" role="status">Showing {filteredEvents.length} of {eventsList.length} activities{classFilter !== "All" ? ` · Class ${classFilter}` : ""} · {completedCount} completed</p>
          <button type="button" className="schedule-text-button" disabled={!hasFilters} onClick={resetFilters}>Reset filters</button>
        </div>
        {filteredEvents.length ? <ul className="schedule-events">{filteredEvents.map((item) => (
          <li key={item.id} className="schedule-event">
            <label className="schedule-completion">
              <input type="checkbox" checked={item.status === "Completed"} onChange={() => toggleComplete(item)} />
              <span className="schedule-sr-only">Mark “{item.title}” as {item.status === "Completed" ? "upcoming" : "completed"}</span>
            </label>
            <div className="schedule-event-content">
              <p className="schedule-meta">{item.type} · Class {item.classId} · {item.status === "Completed" ? "Completed" : "Upcoming"}</p>
              <h3>{item.title}</h3>
              <p className="schedule-event-date">{item.type === "Lesson" ? "Scheduled" : "Due"}: <time dateTime={item.date}>{dateLabel(item.date)}</time>{item.time ? ` · ${item.time}` : ""}</p>
              {item.description && <p className="schedule-meta">{item.description}</p>}
            </div>
            <div className="schedule-event-actions">
              <button type="button" className="schedule-button" aria-label={`Edit ${item.title}`} onClick={() => setModal({ kind: "edit", draft: { ...item } })}>Edit</button>
              <button type="button" className="schedule-text-button" aria-label={`Delete ${item.title}`} onClick={() => setModal({ kind: "delete", event: item })}>Delete</button>
            </div>
          </li>
        ))}</ul> : <div className="schedule-empty">
          <h3>{eventsList.length ? "No matching activities" : "No activities scheduled"}</h3>
          <p>{eventsList.length ? "Change your filters or search to see more activities." : "Add an activity to start planning your class deadlines."}</p>
        </div>}
        <p className="schedule-meta schedule-demo">Demo schedule. Changes last until you leave or refresh this page; they are not sent to students or parents.</p>
      </section>

      <div className="schedule-notice" role="status" aria-atomic="true">
        {notice && <><p>{notice.message}</p><div>
          {notice.undo && <button type="button" className="schedule-button" onClick={notice.undo}>Undo delete</button>}
          <button type="button" className="schedule-text-button" onClick={() => setNotice(null)}>Dismiss notice</button>
        </div></>}
      </div>

      {modal && <ScheduleDialog key={modal.kind} title={modal.kind === "create" ? "Schedule activity" : modal.kind === "edit" ? "Edit activity" : modal.kind === "delete" ? "Delete activity?" : modal.slot.classId === "Free" ? "Free / preparation period" : `Class ${modal.slot.classId}`}
        onClose={() => setModal(null)}>
        {modal.kind === "create" || modal.kind === "edit" ? <form onSubmit={saveEvent}>
          <div className="schedule-dialog-body">
            <p className="schedule-meta">{modal.kind === "edit" ? "Update the details below. Cancel keeps the saved activity." : "Choose a class and enter the activity details. Title and date are required."}</p>
            <div className="schedule-form-grid">
              <label><span>Grade</span><select value={modal.draft.grade} onChange={(event) => {
                const grade = Number(event.target.value);
                updateDraft({ grade, classId: classes.find((item) => item.grade === grade)?.id ?? "" });
              }}>
                {[...new Set(classes.map((item) => item.grade))].map((grade) => <option key={grade} value={grade}>Grade {grade}</option>)}
              </select></label>
              <label><span>Class</span><select value={modal.draft.classId} required onChange={(event) => updateDraft({ classId: event.target.value })}>
                {classes.filter((item) => item.grade === Number(modal.draft.grade)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select></label>
              <label><span>Activity type</span><select value={modal.draft.type} onChange={(event) => updateDraft({ type: event.target.value })}>
                {activityTypes.map((type) => <option key={type}>{type}</option>)}
              </select></label>
            </div>
            <label><span>Activity title (required)</span><input name="title" type="text" value={modal.draft.title} required data-initial-focus
              onChange={(event) => { event.target.setCustomValidity(""); updateDraft({ title: event.target.value }); }} /></label>
            <div className="schedule-form-grid schedule-form-pair">
              <label><span>Scheduled / due date (required)</span><input type="date" value={modal.draft.date} required max="9999-12-31" onChange={(event) => updateDraft({ date: event.target.value })} /></label>
              <label><span>Time / notes</span><input type="text" value={modal.draft.time} placeholder="e.g. 9:00 AM" onChange={(event) => updateDraft({ time: event.target.value })} /></label>
            </div>
            <label><span>Instructions (optional)</span><textarea rows={3} value={modal.draft.description} onChange={(event) => updateDraft({ description: event.target.value })} /></label>
          </div>
          <footer className="schedule-dialog-footer"><p className="schedule-meta">Saved on this page only in this demo.</p><div>
            <button type="button" className="schedule-button" onClick={() => setModal(null)}>Cancel</button>
            <button type="submit" className="schedule-button schedule-primary">{modal.kind === "edit" ? "Save changes" : "Create activity"}</button>
          </div></footer>
        </form> : modal.kind === "slot" ? <>
          <div className="schedule-dialog-body">
            <p>{modal.slot.day} · {modal.slot.period} period · {modal.slot.time}</p>
            <dl><div><dt>Subject / focus</dt><dd>{modal.slot.subject}</dd></div><div><dt>Location</dt><dd>{modal.slot.room}</dd></div>
              {modal.slot.grade && <div><dt>Grade</dt><dd>{modal.slot.grade}</dd></div>}
            </dl>
          </div>
          <footer className="schedule-dialog-footer"><div>
            <button type="button" className="schedule-button" data-initial-focus onClick={() => setModal(null)}>Close</button>
            {modal.slot.classId !== "Free" && <button type="button" className="schedule-button schedule-primary" onClick={() => openCreate(modal.slot)}>Schedule for class {modal.slot.classId}</button>}
          </div></footer>
        </> : <>
          <div className="schedule-dialog-body"><p>Remove “{modal.event.title}” for class {modal.event.classId} from this schedule? You can undo this after deleting.</p></div>
          <footer className="schedule-dialog-footer"><div>
            <button type="button" className="schedule-button" data-initial-focus onClick={() => setModal(null)}>Keep activity</button>
            <button type="button" className="schedule-button schedule-primary" onClick={deleteEvent}>Delete activity</button>
          </div></footer>
        </>}
      </ScheduleDialog>}
    </div>
  );
}

function ScheduleDialog({ title, onClose, children }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector("[data-initial-focus]")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (dialog.open) dialog.close();
      if (trigger?.isConnected) trigger.focus();
      else document.getElementById("schedule-activities-title")?.focus();
    };
  }, []);
  return <dialog ref={dialogRef} className="schedule-dialog" aria-labelledby="schedule-dialog-title" onKeyDown={keepDialogFocus}
    onClose={(event) => { if (!event.currentTarget.open) onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current.close(); }}>
    <header className="schedule-dialog-header"><h2 id="schedule-dialog-title">{title}</h2>
      <button type="button" className="schedule-dialog-close" aria-label="Close dialog" onClick={() => dialogRef.current.close()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </header>
    {children}
  </dialog>;
}
