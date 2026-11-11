import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import keepDialogFocus from "../../utils/dialogFocus";
import {
  addParentMeeting,
  createParentId,
  getParentMeetingsState,
  setParentMeetingCancelled,
} from "../../utils/parentStore";
import { getTeacherCommState, saveTeacherCommState } from "../../utils/teacherStore";
import ParentPageIntro, {
  DialogCloseIcon,
  ParentNotice,
} from "./ParentPageIntro";
import { useActiveChild } from "./useActiveChild";
import "../../styles/parent.css";

export default function ParentTeachers() {
  const { lang, tr } = useLanguage();
  const { activeChildId, child, selectChild } = useActiveChild();
  const initialMeetingsState = getParentMeetingsState();
  const [addedMeetingsByChild, setAddedMeetingsByChild] = useState(
    () => initialMeetingsState.addedByChild || {}
  );
  const [cancelledIdsByChild, setCancelledIdsByChild] = useState(
    () => initialMeetingsState.cancelledByChild || {}
  );
  const [notice, setNotice] = useState(null);

  const AGENDA_SUGGESTIONS = [
    tr("Review recent exam performance", "Letzte Prüfungsergebnisse besprechen"),
    tr("Discuss course pacing and preparation", "Unterrichtstempo und Vorbereitung abstimmen"),
    tr("Classroom participation and focus strategies", "Mitarbeit im Unterricht und Konzentrationshilfen"),
    tr("Homework routine and study tips", "Hausaufgabenroutine und Lerntipps"),
  ];

  const [bookingTeacher, setBookingTeacher] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const bookingDialogRef = useRef(null);
  const bookingTriggerRef = useRef(null);

  const [meetingToCancel, setMeetingToCancel] = useState(null);
  const cancelDialogRef = useRef(null);
  const cancelTriggerRef = useRef(null);
  const keepConferenceRef = useRef(null);

  const teacherCommState = getTeacherCommState();
  const teacherAddedForChild = (teacherCommState.addedMeetings || [])
    .filter(
      (m) =>
        m.studentName === child.name &&
        !(addedMeetingsByChild[child.id] || []).some((pm) => pm.id === m.id)
    )
    .map((m) => ({
      id: m.id,
      teacherName: child.teachers?.[0]?.name || tr("Class teacher", "Klassenleitung"),
      subject: child.teachers?.[0]?.subject || tr("General", "Allgemein"),
      date: m.requestedSlot,
      time: "",
      type: m.note || tr("Scheduled with teacher", "Mit Lehrkraft vereinbart"),
      status: m.status || "Confirmed",
      agenda: m.topic,
    }));

  const cancelledSet = cancelledIdsByChild[child.id] || [];
  const childMeetings = [
    ...(addedMeetingsByChild[child.id] || []),
    ...teacherAddedForChild,
    ...(child.meetings || []),
  ]
    .filter((item) => !cancelledSet.includes(item.id))
    .map((item) => {
      const patch = teacherCommState.meetingPatches?.[item.id];
      return patch ? { ...item, ...patch } : item;
    });

  const activeBookingTeacher = bookingTeacher
    ? (child.teachers || []).find((t) => t.id === bookingTeacher.id) || bookingTeacher
    : null;

  useEffect(() => {
    if (!bookingTeacher) return;
    const dialog = bookingDialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [bookingTeacher]);

  useEffect(() => {
    if (!meetingToCancel) return;
    const dialog = cancelDialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    keepConferenceRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [meetingToCancel]);

  const openBooking = (teacher, event) => {
    bookingTriggerRef.current = event.currentTarget;
    setBookingTeacher(teacher);
    setSelectedSlot(teacher.availableSlots?.[0] || "");
    setMeetingType("in-person");
    setMeetingAgenda("");
    setBookingError("");
  };

  const closeBooking = () => {
    setBookingTeacher(null);
    setBookingError("");
    requestAnimationFrame(() =>
      bookingTriggerRef.current?.focus({ preventScroll: true })
    );
  };

  const resolveFormatLabel = (formatKey, room) => {
    if (formatKey === "virtual") {
      return tr("Virtual video conference", "Virtuelle Videokonferenz");
    }
    if (formatKey === "phone") {
      return tr("Phone consultation", "Telefonisches Beratungsgespräch");
    }
    return tr(`In-Person (${room})`, `Vor Ort (${room})`);
  };

  const handleBookMeeting = (event) => {
    event.preventDefault();
    if (!activeBookingTeacher) return;
    if (!selectedSlot) {
      setBookingError(
        tr(
          "Choose an available time slot before confirming.",
          "Bitte wählen Sie vor der Bestätigung einen freien Termin aus."
        )
      );
      return;
    }

    const teacher = activeBookingTeacher;
    const targetChildId = child.id;
    const formatLabel = resolveFormatLabel(meetingType, teacher.room);
    setIsBookingLoading(true);
    setBookingError("");

    setTimeout(() => {
      const [datePart, timePart] = selectedSlot.split(", ");
      const meetingId = createParentId("meet");
      const newMeeting = {
        id: meetingId,
        teacherName: teacher.name,
        subject: teacher.subject,
        date: datePart || selectedSlot,
        time: timePart || "",
        type: formatLabel,
        status: "Confirmed",
        agenda:
          meetingAgenda.trim() ||
          tr("General academic progress consultation.", "Allgemeines Gespräch zum Lernfortschritt."),
      };

      const nextMeetings = addParentMeeting(targetChildId, newMeeting);
      setAddedMeetingsByChild(nextMeetings.addedByChild || {});

      const prevTeacherComm = getTeacherCommState();
      saveTeacherCommState({
        ...prevTeacherComm,
        addedMeetings: [
          {
            id: meetingId,
            parentName: `Parent of ${child.name}`,
            studentName: child.name,
            classId: "5A",
            requestedSlot: selectedSlot,
            topic: newMeeting.agenda,
            status: "Confirmed",
            note: formatLabel,
          },
          ...(prevTeacherComm.addedMeetings || []),
        ],
      });
      setIsBookingLoading(false);
      setBookingTeacher(null);
      setSelectedSlot("");
      setMeetingAgenda("");
      setNotice({
        text: tr(
          `Conference recorded with ${teacher.name} for ${selectedSlot}.`,
          `Gesprächstermin mit ${teacher.name} am ${selectedSlot} eingetragen.`
        ),
      });
      requestAnimationFrame(() =>
        bookingTriggerRef.current?.focus({ preventScroll: true })
      );
    }, 350);
  };

  const openCancelDialog = (meeting, event) => {
    cancelTriggerRef.current = event.currentTarget;
    setMeetingToCancel(meeting);
  };

  const closeCancelDialog = () => {
    setMeetingToCancel(null);
    requestAnimationFrame(() =>
      cancelTriggerRef.current?.focus({ preventScroll: true })
    );
  };

  const confirmCancelMeeting = () => {
    if (!meetingToCancel) return;
    const removed = meetingToCancel;
    const targetChildId = child.id;

    const cancelledState = setParentMeetingCancelled(targetChildId, removed.id, true);
    setCancelledIdsByChild(cancelledState.cancelledByChild || {});
    setMeetingToCancel(null);
    setNotice({
      text: tr(
        `Cancelled conference with ${removed.teacherName}.`,
        `Gesprächstermin mit ${removed.teacherName} abgesagt.`
      ),
      undoLabel: tr("Undo cancel", "Absage rückgängig"),
      undo: () => {
        const restoredState = setParentMeetingCancelled(targetChildId, removed.id, false);
        setCancelledIdsByChild(restoredState.cancelledByChild || {});
        setNotice({
          text: tr(
            `Restored conference with ${removed.teacherName}.`,
            `Gesprächstermin mit ${removed.teacherName} wiederhergestellt.`
          ),
        });
      },
    });
  };

  return (
    <div className="parent-page">
      <Header role="parent" />

      <main className="parent-container">
        <ParentPageIntro
          title={tr("Teachers & conferences", "Lehrkräfte & Elterngespräche")}
          subtitle={tr(
            `Message teachers or book a consultation regarding ${child.name} (${child.grade}).`,
            `Schreiben Sie Lehrkräften oder buchen Sie ein Gespräch für ${child.name} (${child.grade}).`
          )}
          activeChildId={activeChildId}
          onSelectChild={selectChild}
        />

        <ParentNotice notice={notice} onDismiss={() => setNotice(null)} />

        <section
          className="parent-panel"
          aria-labelledby="parent-teachers-heading"
        >
          <div className="parent-panel-heading">
            <div className="parent-panel-heading-copy">
              <h2 id="parent-teachers-heading">
                {tr("My teachers", "Unsere Lehrkräfte")}
              </h2>
              <p className="parent-meta">
                {tr(
                  "Choose a teacher to open messages or book a conference",
                  "Wählen Sie eine Lehrkraft für Nachrichten oder zur Terminbuchung"
                )}
              </p>
            </div>
            <span className="parent-meta">
              {child.teachers.length}{" "}
              {child.teachers.length === 1
                ? tr("teacher", "Lehrkraft")
                : tr("teachers", "Lehrkräfte")}
            </span>
          </div>

          {child.teachers.length ? (
            <ul className="parent-divided-list">
              {child.teachers.map((teacher) => {
                const initials = teacher.name
                  .split(" ")
                  .slice(1)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <li key={teacher.id} className="parent-teacher-row">
                    <span className="parent-avatar" aria-hidden="true">
                      {initials}
                    </span>

                    <div>
                      <h3>{teacher.name}</h3>
                      <p className="parent-meta">
                        {teacher.subject} · {teacher.room}
                      </p>
                      <p>{teacher.lastMessage}</p>
                    </div>

                    <div className="parent-teacher-actions">
                      <Link
                        to={`/parent/chat/${teacher.id}`}
                        className="parent-button parent-button-primary"
                        aria-label={tr(`Message ${teacher.name}`, `Nachricht an ${teacher.name}`)}
                      >
                        {tr("Message", "Schreiben")}
                      </Link>
                      <button
                        type="button"
                        onClick={(event) => openBooking(teacher, event)}
                        className="parent-button"
                        aria-label={tr(
                          `Book meeting with ${teacher.name}`,
                          `Gespräch mit ${teacher.name} buchen`
                        )}
                      >
                        {tr("Book meeting", "Termin buchen")}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="parent-empty">
              {tr("No teachers listed yet.", "Noch keine Lehrkräfte hinterlegt.")}
            </p>
          )}
        </section>

        <section
          className="parent-panel"
          aria-labelledby="parent-meetings-heading"
        >
          <div className="parent-panel-heading">
            <div className="parent-panel-heading-copy">
              <h2 id="parent-meetings-heading">
                {tr("Scheduled conferences", "Vereinbarte Gesprächstermine")}
              </h2>
              <p className="parent-meta">
                {tr(
                  `Upcoming one-on-one consultations for ${child.name}`,
                  `Anstehende Einzelgespräche für ${child.name}`
                )}
              </p>
            </div>
            <span className="parent-meta">
              {childMeetings.length} {tr("upcoming", "anstehend")}
            </span>
          </div>

          {childMeetings.length ? (
            <ul className="parent-divided-list">
              {childMeetings.map((meet) => (
                <li key={meet.id} className="parent-meeting-row">
                  <div>
                    <div className="parent-ticket-head">
                      <h3>
                        {meet.teacherName} · {meet.subject}
                      </h3>
                      <span className="parent-status-tag">
                        {translateValue(meet.status, lang)}
                      </span>
                    </div>
                    <p className="parent-meta">
                      {meet.date} · {meet.time} · {meet.type}
                    </p>
                    <p>
                      {tr("Agenda:", "Thema:")} {meet.agenda}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(event) => openCancelDialog(meet, event)}
                    className="parent-button parent-button-danger-outline"
                    aria-label={tr(
                      `Cancel conference with ${meet.teacherName} on ${meet.date}`,
                      `Gespräch mit ${meet.teacherName} am ${meet.date} absagen`
                    )}
                  >
                    {tr("Cancel conference", "Termin absagen")}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="parent-empty">
              {tr(
                "No conferences scheduled yet. Select Book meeting beside any teacher above.",
                "Noch keine Gespräche gebucht. Wählen Sie oben bei einer Lehrkraft „Termin buchen“."
              )}
            </p>
          )}
        </section>
      </main>

      <dialog
        ref={bookingDialogRef}
        className="parent-dialog"
        aria-labelledby="parent-booking-dialog-title"
        onClose={closeBooking}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            bookingDialogRef.current?.close();
          }
        }}
        onKeyDown={keepDialogFocus}
      >
        {activeBookingTeacher && (
          <form className="parent-dialog-content" onSubmit={handleBookMeeting}>
            <header className="parent-dialog-header">
              <div>
                <h2 id="parent-booking-dialog-title">
                  {tr(
                    `Book conference with ${activeBookingTeacher.name}`,
                    `Gesprächstermin mit ${activeBookingTeacher.name} buchen`
                  )}
                </h2>
                <p className="parent-meta">
                  {activeBookingTeacher.subject} · {activeBookingTeacher.room}
                </p>
              </div>
              <button
                type="button"
                className="parent-dialog-close"
                aria-label={tr("Close booking dialog", "Buchungsfenster schließen")}
                autoFocus
                onClick={() => bookingDialogRef.current?.close()}
              >
                <DialogCloseIcon />
              </button>
            </header>

            <div className="parent-dialog-body">
              <fieldset className="parent-slot-fieldset">
                <legend>{tr("Available time slots", "Freie Zeitfenster")}</legend>
                <div className="parent-slot-options">
                  {activeBookingTeacher.availableSlots?.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      aria-pressed={selectedSlot === slot}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setBookingError("");
                      }}
                      className="parent-button parent-button-quiet"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {bookingError && (
                  <p className="parent-field-error" role="alert">
                    {bookingError}
                  </p>
                )}
              </fieldset>

              <div className="parent-field">
                <label htmlFor="parent-meeting-format">
                  {tr("Meeting location or format", "Ort oder Gesprächsformat")}
                </label>
                <select
                  id="parent-meeting-format"
                  className="parent-select"
                  value={meetingType}
                  onChange={(event) => setMeetingType(event.target.value)}
                >
                  <option value="in-person">
                    {tr(
                      `In-person at campus (${activeBookingTeacher.room})`,
                      `Vor Ort an der Schule (${activeBookingTeacher.room})`
                    )}
                  </option>
                  <option value="virtual">
                    {tr("Virtual video conference", "Virtuelle Videokonferenz")}
                  </option>
                  <option value="phone">
                    {tr("Phone consultation", "Telefonisches Beratungsgespräch")}
                  </option>
                </select>
              </div>

              <div className="parent-field">
                <label>{tr("Suggested agenda topics", "Themenvorschläge")}</label>
                <div className="parent-starter-group">
                  {AGENDA_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      aria-pressed={meetingAgenda === suggestion}
                      onClick={() => setMeetingAgenda(suggestion)}
                      className="parent-button parent-button-quiet"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="parent-field">
                <label htmlFor="parent-meeting-agenda">
                  {tr("Conference agenda (optional)", "Gesprächsthema (optional)")}
                </label>
                <textarea
                  id="parent-meeting-agenda"
                  rows={2}
                  className="parent-textarea"
                  value={meetingAgenda}
                  onChange={(event) => setMeetingAgenda(event.target.value)}
                  placeholder={tr(
                    "Write what you would like to discuss",
                    "Schreiben Sie, worüber Sie sprechen möchten"
                  )}
                />
              </div>

              <p className="parent-meta">
                {tr(
                  "Demo booking. Appointments stay on this page and are not sent to the teacher.",
                  "Demo-Buchung. Termine bleiben auf dieser Seite und werden nicht an die Lehrkraft gesendet."
                )}
              </p>
            </div>

            <footer className="parent-dialog-footer">
              <div className="parent-dialog-footer-actions">
                <button
                  type="button"
                  className="parent-button"
                  onClick={() => bookingDialogRef.current?.close()}
                >
                  {tr("Cancel", "Abbrechen")}
                </button>
                <button
                  type="submit"
                  disabled={isBookingLoading}
                  className="parent-button parent-button-primary"
                >
                  {isBookingLoading
                    ? tr("Confirming...", "Wird bestätigt...")
                    : tr("Confirm appointment", "Termin bestätigen")}
                </button>
              </div>
            </footer>
          </form>
        )}
      </dialog>

      <dialog
        ref={cancelDialogRef}
        className="parent-dialog"
        aria-labelledby="parent-cancel-dialog-title"
        onClose={closeCancelDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            cancelDialogRef.current?.close();
          }
        }}
        onKeyDown={keepDialogFocus}
      >
        {meetingToCancel && (
          <div className="parent-dialog-content">
            <header className="parent-dialog-header">
              <div>
                <h2 id="parent-cancel-dialog-title">
                  {tr("Cancel conference appointment?", "Gesprächstermin absagen?")}
                </h2>
                <p className="parent-meta">
                  {meetingToCancel.teacherName} · {meetingToCancel.date}
                </p>
              </div>
              <button
                type="button"
                className="parent-dialog-close"
                aria-label={tr("Close confirmation", "Bestätigung schließen")}
                onClick={() => cancelDialogRef.current?.close()}
              >
                <DialogCloseIcon />
              </button>
            </header>

            <div className="parent-dialog-body">
              <p>
                {tr(
                  `Cancel your scheduled meeting with ${meetingToCancel.teacherName} on ${meetingToCancel.date} (${meetingToCancel.time})? You can undo this immediately afterward.`,
                  `Möchten Sie Ihren vereinbarten Termin mit ${meetingToCancel.teacherName} am ${meetingToCancel.date} (${meetingToCancel.time}) absagen? Sie können dies direkt danach rückgängig machen.`
                )}
              </p>
            </div>

            <footer className="parent-dialog-footer">
              <div className="parent-dialog-footer-actions">
                <button
                  ref={keepConferenceRef}
                  type="button"
                  className="parent-button"
                  onClick={() => cancelDialogRef.current?.close()}
                >
                  {tr("Keep conference", "Termin behalten")}
                </button>
                <button
                  type="button"
                  className="parent-button parent-button-danger"
                  onClick={confirmCancelMeeting}
                >
                  {tr("Cancel conference", "Termin absagen")}
                </button>
              </div>
            </footer>
          </div>
        )}
      </dialog>
    </div>
  );
}
