import { useEffect, useRef, useState } from "react";
import { getTeacherData } from "../../i18n/teacherDataDe";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import keepDialogFocus from "../../utils/dialogFocus";
import "../../styles/teacher-schedule.css";

const activityTypes = ["Assignment", "Quiz", "Exam", "Lesson"];

export default function TeacherSchedule() {
  const { lang, tr } = useLanguage();
  const {
    scheduleDays,
    schedulePeriods,
    scheduleTimetable,
    teacherScheduleEvents: initialEvents,
    classes,
  } = getTeacherData(lang);

  const dateLabel = (value) =>
    value
      ? new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(`${value}T12:00:00Z`))
      : tr("Date not set", "Kein Datum festgelegt");

  const [addedEvents, setAddedEvents] = useState([]);
  const [editedById, setEditedById] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);
  const [statusOverrides, setStatusOverrides] = useState({});
  const [typeFilter, setTypeFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState(null);
  const searchRef = useRef(null);
  const completedFilterRef = useRef(null);

  const eventsList = [...addedEvents, ...initialEvents]
    .filter((item) => !deletedIds.includes(item.id))
    .map((item) => (editedById[item.id] ? { ...item, ...editedById[item.id] } : item))
    .map((item) => (statusOverrides[item.id] ? { ...item, status: statusOverrides[item.id] } : item));

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
      type: "Assignment", deliveryMode: "Online", date: "", time: tr("11:59 PM", "23:59 Uhr"),
      description: "", status: "Upcoming", questions: [],
    } });
  }

  function saveEvent(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const titleInput = form.elements.namedItem("title");
    if (!modal.draft.title.trim()) {
      titleInput.setCustomValidity(tr("Enter an activity title.", "Geben Sie einen Aktivitätstitel ein."));
      titleInput.reportValidity();
      return;
    }
    const saved = { ...modal.draft, title: modal.draft.title.trim(), description: modal.draft.description.trim() };
    if (modal.kind === "edit") {
      if (addedEvents.some((item) => item.id === saved.id)) {
        setAddedEvents((previous) => previous.map((item) => (item.id === saved.id ? saved : item)));
      } else {
        setEditedById((previous) => ({ ...previous, [saved.id]: saved }));
      }
      setNotice({ kind: "updated", title: saved.title, classId: saved.classId });
    } else {
      saved.id = Date.now();
      setAddedEvents((previous) => [saved, ...previous]);
      setNotice({ kind: "created", title: saved.title, classId: saved.classId });
    }
    setModal(null);
  }

  function toggleComplete(item) {
    const status = item.status === "Completed" ? "Upcoming" : "Completed";
    setStatusOverrides((previous) => ({ ...previous, [item.id]: status }));
    setNotice({ kind: "toggled", title: item.title, status });
    if (hideCompleted && status === "Completed") requestAnimationFrame(() => completedFilterRef.current?.focus());
  }

  function deleteEvent() {
    const removed = modal.event;
    setDeletedIds((previous) => [...previous, removed.id]);
    setModal(null);
    setNotice({
      kind: "deleted",
      title: removed.title,
      undo: () => {
        setDeletedIds((previous) => previous.filter((id) => id !== removed.id));
        setNotice({ kind: "restored", title: removed.title });
      },
    });
  }

  function updateDraft(changes) {
    setModal((previous) => ({ ...previous, draft: { ...previous.draft, ...changes } }));
  }

  const noticeText = notice
    ? notice.kind === "updated"
      ? tr(`Updated “${notice.title}” for class ${notice.classId}.`, `„${notice.title}“ für Klasse ${notice.classId} aktualisiert.`)
      : notice.kind === "created"
        ? tr(`Created “${notice.title}” for class ${notice.classId}.`, `„${notice.title}“ für Klasse ${notice.classId} erstellt.`)
        : notice.kind === "toggled"
          ? tr(
              `“${notice.title}” marked as ${notice.status.toLowerCase()}.`,
              `„${notice.title}“ als ${translateValue(notice.status, lang).toLowerCase()} markiert.`,
            )
          : notice.kind === "deleted"
            ? tr(`Deleted “${notice.title}”.`, `„${notice.title}“ gelöscht.`)
            : tr(`Restored “${notice.title}”.`, `„${notice.title}“ wiederhergestellt.`)
    : "";

  return (
    <div className="teacher-schedule">
      <header className="schedule-intro">
        <div>
          <h1>{tr("Schedule & lesson planner", "Stundenplan & Unterrichtsplanung")}</h1>
          <p>{tr("Weekly classes, homework deadlines, and scheduled activities.", "Wöchentliche Stunden, Hausaufgabenfristen und geplante Aktivitäten.")}</p>
        </div>
        <button type="button" className="schedule-button schedule-primary" onClick={() => openCreate()}>{tr("Schedule activity", "Aktivität planen")}</button>
      </header>

      <section className="schedule-board" aria-labelledby="schedule-timetable-title">
        <header className="schedule-board-heading">
          <h2 id="schedule-timetable-title">{tr("Weekly class timetable", "Wöchentlicher Klassenstundenplan")}</h2>
          <label className="schedule-class-filter">
            <span>{tr("Class", "Klasse")}</span>
            <select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} aria-describedby="schedule-class-help">
              <option value="All">{tr("All classes", "Alle Klassen")}</option>
              {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </header>
        <p id="schedule-class-help" className="schedule-meta schedule-table-help">
          {tr(
            "Choose a class to highlight its lessons and filter the activities below. Select a period for details.",
            "Wählen Sie eine Klasse aus, um ihre Stunden hervorzuheben und die Aktivitäten unten zu filtern. Wählen Sie eine Stunde für Details.",
          )}
        </p>
        <div className="schedule-table-scroll" role="region" aria-label={tr("Weekly class timetable, scroll horizontally to view all days", "Wöchentlicher Stundenplan, horizontal scrollen für alle Tage")} tabIndex={0}>
          <table>
            <thead><tr><th scope="col">{tr("Period / time", "Stunde / Zeit")}</th>{scheduleDays.map((day) => <th scope="col" key={day}>{translateValue(day, lang)}</th>)}</tr></thead>
            <tbody>{schedulePeriods.map((period) => (
              <tr key={period.id}>
                <th scope="row"><span>{period.name}</span><span className="schedule-meta">{period.time}</span></th>
                {period.isBreak ? <td colSpan={scheduleDays.length} className="schedule-break"><span>{tr("Break", "Pause")}</span></td> : scheduleDays.map((day) => {
                  const slot = scheduleTimetable[day]?.[period.id];
                  if (!slot) return <td key={day}>—</td>;
                  const free = slot.classId === "Free";
                  const highlighted = classFilter !== "All" && slot.classId === classFilter;
                  const dayLabel = translateValue(day, lang);
                  return <td key={day}>
                    <button type="button" className={`schedule-slot${free ? " schedule-slot-free" : ""}${highlighted ? " schedule-slot-selected" : ""}`}
                      aria-label={tr(
                        `${dayLabel}, ${period.name} period, ${free ? "Free / preparation" : `Class ${slot.classId}`}: ${slot.subject}, ${slot.room}`,
                        `${dayLabel}, ${period.name}, ${free ? "Freistunde / Vorbereitung" : `Klasse ${slot.classId}`}: ${slot.subject}, ${slot.room}`,
                      )}
                      onClick={() => setModal({ kind: "slot", slot: { ...slot, day, period: period.name, time: period.time } })}>
                      {free ? <span>{tr("Free / prep", "Frei / Vorb.")}</span> : <>
                        <span className="schedule-slot-class">{tr("Class", "Klasse")} {slot.classId}</span>
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
          <h2 id="schedule-activities-title" tabIndex={-1}>{tr("Upcoming deadlines & scheduled activities", "Anstehende Fristen & geplante Aktivitäten")}</h2>
          <button type="button" className="schedule-button" onClick={() => openCreate()}>{tr("Add activity", "Aktivität hinzufügen")}</button>
        </header>
        <div className="schedule-filters">
          <label><span>{tr("Activity type", "Aktivitätstyp")}</span>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="All">{tr("All types", "Alle Typen")}</option>
              {activityTypes.map((type) => <option key={type} value={type}>{translateValue(type, lang)}</option>)}
            </select>
          </label>
          <label className="schedule-search"><span>{tr("Search activities", "Aktivitäten suchen")}</span>
            <input ref={searchRef} type="search" placeholder={tr("Search by title or class", "Nach Titel oder Klasse suchen")} value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)} aria-describedby="schedule-results" />
          </label>
          <label className="schedule-completed-toggle"><input ref={completedFilterRef} type="checkbox" checked={hideCompleted} onChange={(event) => setHideCompleted(event.target.checked)} />{tr("Hide completed events", "Erledigte ausblenden")}</label>
        </div>
        <div className="schedule-results">
          <p id="schedule-results" role="status">
            {tr(
              `Showing ${filteredEvents.length} of ${eventsList.length} activities${classFilter !== "All" ? ` · Class ${classFilter}` : ""} · ${completedCount} completed`,
              `${filteredEvents.length} von ${eventsList.length} Aktivitäten angezeigt${classFilter !== "All" ? ` · Klasse ${classFilter}` : ""} · ${completedCount} erledigt`,
            )}
          </p>
          <button type="button" className="schedule-text-button" disabled={!hasFilters} onClick={resetFilters}>{tr("Reset filters", "Filter zurücksetzen")}</button>
        </div>
        {filteredEvents.length ? <ul className="schedule-events">{filteredEvents.map((item) => (
          <li key={item.id} className="schedule-event">
            <label className="schedule-completion">
              <input type="checkbox" checked={item.status === "Completed"} onChange={() => toggleComplete(item)} />
              <span className="schedule-sr-only">
                {tr(
                  `Mark “${item.title}” as ${item.status === "Completed" ? "upcoming" : "completed"}`,
                  `„${item.title}“ als ${item.status === "Completed" ? "anstehend" : "erledigt"} markieren`,
                )}
              </span>
            </label>
            <div className="schedule-event-content">
              <p className="schedule-meta">
                {translateValue(item.type, lang)}
                {item.type !== "Lesson" && ` · ${translateValue(item.deliveryMode ?? (item.type === "Assignment" ? "Paper" : "Online"), lang)}`}
                {" · "}{tr("Class", "Klasse")} {item.classId} · {translateValue(item.status === "Completed" ? "Completed" : "Upcoming", lang)}
              </p>
              <h3>{item.title}</h3>
              <p className="schedule-event-date">{item.type === "Lesson" ? tr("Scheduled", "Geplant") : tr("Due", "Fällig")}: <time dateTime={item.date}>{dateLabel(item.date)}</time>{item.time ? ` · ${item.time}` : ""}</p>
              {item.description && <p className="schedule-meta">{item.description}</p>}
              {item.questions?.length > 0 && (
                <ol className="schedule-builder-questions">
                  {item.questions.map((q, idx) => (
                    <li key={idx}>
                      {q.prompt} {q.answerKey ? `(${tr("Key:", "Lösung:")} ${q.answerKey})` : ""}
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div className="schedule-event-actions">
              <button type="button" className="schedule-button" aria-label={tr(`Edit ${item.title}`, `${item.title} bearbeiten`)} onClick={() => setModal({ kind: "edit", draft: { ...item } })}>{tr("Edit", "Bearbeiten")}</button>
              <button type="button" className="schedule-text-button" aria-label={tr(`Delete ${item.title}`, `${item.title} löschen`)} onClick={() => setModal({ kind: "delete", event: item })}>{tr("Delete", "Löschen")}</button>
            </div>
          </li>
        ))}</ul> : <div className="schedule-empty">
          <h3>{eventsList.length ? tr("No matching activities", "Keine passenden Aktivitäten") : tr("No activities scheduled", "Keine Aktivitäten geplant")}</h3>
          <p>{eventsList.length ? tr("Change your filters or search to see more activities.", "Ändern Sie Ihre Filter oder Suche, um weitere Aktivitäten anzuzeigen.") : tr("Add an activity to start planning your class deadlines.", "Fügen Sie eine Aktivität hinzu, um Ihre Klassenfristen zu planen.")}</p>
        </div>}
        <p className="schedule-meta schedule-demo">{tr("Demo schedule. Changes last until you leave or refresh this page; they are not sent to students or parents.", "Demo-Stundenplan. Änderungen bleiben bis zum Verlassen oder Neuladen dieser Seite bestehen und werden nicht an Schüler oder Eltern gesendet.")}</p>
      </section>

      <div className="schedule-notice" role="status" aria-atomic="true">
        {notice && <><p>{noticeText}</p><div>
          {notice.undo && <button type="button" className="schedule-button" onClick={notice.undo}>{tr("Undo delete", "Löschen rückgängig machen")}</button>}
          <button type="button" className="schedule-text-button" onClick={() => setNotice(null)}>{tr("Dismiss notice", "Hinweis schließen")}</button>
        </div></>}
      </div>

      {modal && <ScheduleDialog key={modal.kind} closeLabel={tr("Close dialog", "Dialog schließen")} title={modal.kind === "create" ? tr("Schedule activity", "Aktivität planen") : modal.kind === "edit" ? tr("Edit activity", "Aktivität bearbeiten") : modal.kind === "delete" ? tr("Delete activity?", "Aktivität löschen?") : modal.slot.classId === "Free" ? tr("Free / preparation period", "Freistunde / Vorbereitung") : tr(`Class ${modal.slot.classId}`, `Klasse ${modal.slot.classId}`)}
        onClose={() => setModal(null)}>
        {modal.kind === "create" || modal.kind === "edit" ? <form onSubmit={saveEvent}>
          <div className="schedule-dialog-body">
            <p className="schedule-meta">{modal.kind === "edit" ? tr("Update the details below. Cancel keeps the saved activity.", "Aktualisieren Sie die Angaben unten. Mit Abbrechen bleibt die gespeicherte Aktivität erhalten.") : tr("Choose a class and enter the activity details. Title and date are required.", "Wählen Sie eine Klasse und geben Sie die Aktivitätsdetails ein. Titel und Datum sind erforderlich.")}</p>
            <div className="schedule-form-grid">
              <label><span>{tr("Grade", "Stufe")}</span><select value={modal.draft.grade} onChange={(event) => {
                const grade = Number(event.target.value);
                updateDraft({ grade, classId: classes.find((item) => item.grade === grade)?.id ?? "" });
              }}>
                {[...new Set(classes.map((item) => item.grade))].map((grade) => <option key={grade} value={grade}>{tr(`Grade ${grade}`, `Stufe ${grade}`)}</option>)}
              </select></label>
              <label><span>{tr("Class", "Klasse")}</span><select value={modal.draft.classId} required onChange={(event) => updateDraft({ classId: event.target.value })}>
                {classes.filter((item) => item.grade === Number(modal.draft.grade)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select></label>
              <label><span>{tr("Activity type", "Aktivitätstyp")}</span><select value={modal.draft.type} onChange={(event) => updateDraft({ type: event.target.value })}>
                {activityTypes.map((type) => <option key={type} value={type}>{translateValue(type, lang)}</option>)}
              </select></label>
            </div>
            {modal.draft.type !== "Lesson" && (
              <label>
                <span>{tr("Format (online or paper)", "Format (online oder Papier)")}</span>
                <select
                  value={modal.draft.deliveryMode ?? "Online"}
                  onChange={(event) => updateDraft({ deliveryMode: event.target.value })}
                >
                  <option value="Online">{tr("Online assessment / digital submission", "Online-Test / digitale Abgabe")}</option>
                  <option value="Paper">{tr("Paper worksheet / printed exam", "Papier-Arbeitsblatt / gedruckte Prüfung")}</option>
                </select>
              </label>
            )}
            <label><span>{tr("Activity title (required)", "Aktivitätstitel (erforderlich)")}</span><input name="title" type="text" value={modal.draft.title} required data-initial-focus
              onChange={(event) => { event.target.setCustomValidity(""); updateDraft({ title: event.target.value }); }} /></label>
            <div className="schedule-form-grid schedule-form-pair">
              <label><span>{tr("Scheduled / due date (required)", "Geplantes / Fälligkeitsdatum (erforderlich)")}</span><input type="date" value={modal.draft.date} required max="9999-12-31" onChange={(event) => updateDraft({ date: event.target.value })} /></label>
              <label><span>{tr("Time / notes", "Uhrzeit / Hinweise")}</span><input type="text" value={modal.draft.time} placeholder={tr("e.g. 9:00 AM", "z. B. 09:00 Uhr")} onChange={(event) => updateDraft({ time: event.target.value })} /></label>
            </div>
            <label><span>{tr("Instructions (optional)", "Anweisungen (optional)")}</span><textarea rows={2} value={modal.draft.description} onChange={(event) => updateDraft({ description: event.target.value })} /></label>
            {modal.draft.type !== "Lesson" && (
              <div className="schedule-builder">
                <div className="schedule-builder-head">
                  <h3>{tr("Questions & answer key (optional)", "Aufgaben & Lösungsschlüssel (optional)")}</h3>
                  <button
                    type="button"
                    className="schedule-button"
                    onClick={() =>
                      updateDraft({
                        questions: [...(modal.draft.questions ?? []), { prompt: "", answerKey: "" }],
                      })
                    }
                  >
                    {tr("+ Add question", "+ Aufgabe hinzufügen")}
                  </button>
                </div>
                {(modal.draft.questions ?? []).length > 0 ? (
                  <ul className="schedule-builder-list">
                    {modal.draft.questions.map((q, idx) => (
                      <li key={idx} className="schedule-builder-row">
                        <label>
                          <span>{tr(`Question ${idx + 1}`, `Aufgabe ${idx + 1}`)}</span>
                          <input
                            type="text"
                            value={q.prompt}
                            placeholder={tr("e.g. Simplify 6/8", "z. B. Kürze 6/8")}
                            onChange={(event) => {
                              const next = modal.draft.questions.map((item, i) =>
                                i === idx ? { ...item, prompt: event.target.value } : item,
                              );
                              updateDraft({ questions: next });
                            }}
                          />
                        </label>
                        <label>
                          <span>{tr("Expected answer", "Erwartete Lösung")}</span>
                          <input
                            type="text"
                            value={q.answerKey}
                            placeholder={tr("e.g. 3/4", "z. B. 3/4")}
                            onChange={(event) => {
                              const next = modal.draft.questions.map((item, i) =>
                                i === idx ? { ...item, answerKey: event.target.value } : item,
                              );
                              updateDraft({ questions: next });
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="schedule-text-button"
                          aria-label={tr(`Remove question ${idx + 1}`, `Aufgabe ${idx + 1} entfernen`)}
                          onClick={() =>
                            updateDraft({
                              questions: modal.draft.questions.filter((_, i) => i !== idx),
                            })
                          }
                        >
                          {tr("Remove", "Entfernen")}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="schedule-meta">{tr("Add prompts and keys to attach directly to this quiz or assignment.", "Fügen Sie Aufgaben und Lösungen direkt für dieses Quiz oder diese Aufgabe hinzu.")}</p>
                )}
              </div>
            )}
          </div>
          <footer className="schedule-dialog-footer"><p className="schedule-meta">{tr("Saved on this page only in this demo.", "Wird in dieser Demo nur auf dieser Seite gespeichert.")}</p><div>
            <button type="button" className="schedule-button" onClick={() => setModal(null)}>{tr("Cancel", "Abbrechen")}</button>
            <button type="submit" className="schedule-button schedule-primary">{modal.kind === "edit" ? tr("Save changes", "Änderungen speichern") : tr("Create activity", "Aktivität erstellen")}</button>
          </div></footer>
        </form> : modal.kind === "slot" ? <>
          <div className="schedule-dialog-body">
            <p>{translateValue(modal.slot.day, lang)} · {modal.slot.period} {tr("period", "Stunde")} · {modal.slot.time}</p>
            <dl><div><dt>{tr("Subject / focus", "Fach / Schwerpunkt")}</dt><dd>{modal.slot.subject}</dd></div><div><dt>{tr("Location", "Raum")}</dt><dd>{modal.slot.room}</dd></div>
              {modal.slot.grade && <div><dt>{tr("Grade", "Stufe")}</dt><dd>{modal.slot.grade}</dd></div>}
            </dl>
          </div>
          <footer className="schedule-dialog-footer"><div>
            <button type="button" className="schedule-button" data-initial-focus onClick={() => setModal(null)}>{tr("Close", "Schließen")}</button>
            {modal.slot.classId !== "Free" && <button type="button" className="schedule-button schedule-primary" onClick={() => openCreate(modal.slot)}>{tr(`Schedule for class ${modal.slot.classId}`, `Für Klasse ${modal.slot.classId} planen`)}</button>}
          </div></footer>
        </> : <>
          <div className="schedule-dialog-body"><p>{tr(`Remove “${modal.event.title}” for class ${modal.event.classId} from this schedule? You can undo this after deleting.`, `„${modal.event.title}“ für Klasse ${modal.event.classId} aus diesem Plan entfernen? Sie können dies anschließend rückgängig machen.`)}</p></div>
          <footer className="schedule-dialog-footer"><div>
            <button type="button" className="schedule-button" data-initial-focus onClick={() => setModal(null)}>{tr("Keep activity", "Aktivität behalten")}</button>
            <button type="button" className="schedule-button schedule-primary" onClick={deleteEvent}>{tr("Delete activity", "Aktivität löschen")}</button>
          </div></footer>
        </>}
      </ScheduleDialog>}
    </div>
  );
}

function ScheduleDialog({ title, closeLabel, onClose, children }) {
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
      <button type="button" className="schedule-dialog-close" aria-label={closeLabel} onClick={() => dialogRef.current.close()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </header>
    {children}
  </dialog>;
}
