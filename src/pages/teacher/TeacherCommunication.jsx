import { useState } from "react";
import { Link } from "react-router-dom";
import { getTeacherData } from "../../i18n/teacherDataDe";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import {
  createRecordId,
  getTeacherCommState,
  saveTeacherCommState,
  todayIsoDate,
} from "../../utils/teacherStore";
import "../../styles/teacher-communication.css";

export default function TeacherCommunication() {
  const { lang, tr } = useLanguage();
  const { classes, students, teacherCommunication } = getTeacherData(lang);
  const [stored, setStored] = useState(() => getTeacherCommState());
  const [tab, setTab] = useState("inbox");
  const [notice, setNotice] = useState("");

  // Compose states
  const [replyDrafts, setReplyDrafts] = useState({});
  const [newMeeting, setNewMeeting] = useState({
    studentId: String(students[0]?.id ?? "1"),
    requestedSlot: "",
    topic: "",
  });
  const [newBehavior, setNewBehavior] = useState({
    studentId: String(students[1]?.id ?? students[0]?.id ?? "2"),
    category: "Focus & Readiness",
    note: "",
    homeTip: "",
    sharedWithParent: true,
  });
  const [newParentPost, setNewParentPost] = useState({
    classId: classes[0]?.id ?? "5A",
    date: "2026-11-11",
    summary: "",
    upcomingAssessments: "",
  });
  const [newStudentAnnouncement, setNewStudentAnnouncement] = useState({
    classId: "All",
    title: "",
    priority: "Standard",
    body: "",
  });

  const updateStored = (updater) => {
    setStored((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveTeacherCommState(next);
      return next;
    });
  };

  // Derived lists merging localized fixtures + user edits/additions
  const inboxItems = [
    ...(stored.addedInboxItems ?? []),
    ...(teacherCommunication?.parentInbox ?? []),
  ].map((item) => {
    const patch = stored.inboxPatches?.[item.id];
    return patch ? { ...item, ...patch } : item;
  });

  const meetings = [...(stored.addedMeetings ?? []), ...(teacherCommunication?.meetings ?? [])].map((m) => {
    const patch = stored.meetingPatches?.[m.id];
    return patch ? { ...m, ...patch } : m;
  });

  const behaviorLogs = [...(stored.addedBehaviors ?? []), ...(teacherCommunication?.behaviorLogs ?? [])].map((b) => {
    const patch = stored.behaviorPatches?.[b.id];
    return patch ? { ...b, ...patch } : b;
  });

  const parentAnnouncements = [
    ...(stored.addedParentAnnouncements ?? []),
    ...(teacherCommunication?.parentAnnouncements ?? []),
  ];

  const studentAnnouncements = [
    ...(stored.addedStudentAnnouncements ?? []),
    ...(teacherCommunication?.studentAnnouncements ?? []),
  ];

  const handleInboxAction = (item, status, replyText) => {
    const trimmedReply = replyText !== undefined ? replyText.trim() : item.reply;
    updateStored((prev) => ({
      ...prev,
      inboxPatches: {
        ...(prev.inboxPatches ?? {}),
        [item.id]: {
          status,
          ...(trimmedReply ? { reply: trimmedReply } : {}),
        },
      },
    }));
    if (replyText !== undefined) {
      setReplyDrafts((prev) => ({ ...prev, [item.id]: "" }));
    }
    setNotice(tr(`Updated "${item.subject}" (${translateValue(status, lang)}).`, `„${item.subject}“ aktualisiert (${translateValue(status, lang)}).`));
  };

  const handleMeetingStatus = (meeting, status) => {
    updateStored((prev) => ({
      ...prev,
      meetingPatches: {
        ...(prev.meetingPatches ?? {}),
        [meeting.id]: { status },
      },
    }));
    setNotice(tr(`Meeting with ${meeting.parentName} marked as ${translateValue(status, lang)}.`, `Gespräch mit ${meeting.parentName}: ${translateValue(status, lang)}.`));
  };

  const handleCreateMeeting = (event) => {
    event.preventDefault();
    if (!newMeeting.requestedSlot.trim() || !newMeeting.topic.trim()) return;
    const student = students.find((s) => String(s.id) === newMeeting.studentId) ?? students[0];
    const entry = {
      id: createRecordId("mtg"),
      parentName: tr(`Parent of ${student.name}`, `Elternteil von ${student.name}`),
      studentName: student.name,
      classId: student.classId,
      requestedSlot: newMeeting.requestedSlot.trim(),
      topic: newMeeting.topic.trim(),
      status: "Confirmed",
      note: tr("Scheduled by teacher.", "Von Lehrkraft terminiert."),
    };
    updateStored((prev) => ({
      ...prev,
      addedMeetings: [entry, ...(prev.addedMeetings ?? [])],
    }));
    setNewMeeting({ ...newMeeting, requestedSlot: "", topic: "" });
    setNotice(tr(`Scheduled parent meeting for ${student.name}.`, `Elterngespräch für ${student.name} geplant.`));
  };

  const handleCreateBehavior = (event) => {
    event.preventDefault();
    if (!newBehavior.note.trim()) return;
    const student = students.find((s) => String(s.id) === newBehavior.studentId) ?? students[0];
    const entry = {
      id: createRecordId("beh"),
      studentId: student.id,
      studentName: student.name,
      classId: student.classId,
      category: newBehavior.category,
      date: todayIsoDate(),
      note: newBehavior.note.trim(),
      homeTip: newBehavior.homeTip.trim(),
      sharedWithParent: newBehavior.sharedWithParent,
    };
    updateStored((prev) => ({
      ...prev,
      addedBehaviors: [entry, ...(prev.addedBehaviors ?? [])],
    }));
    setNewBehavior({ ...newBehavior, note: "", homeTip: "" });
    setNotice(
      entry.sharedWithParent
        ? tr(`Behavioral note logged and shared with ${student.name}'s parent.`, `Verhaltenshinweis für ${student.name} erfasst und mit den Eltern geteilt.`)
        : tr(`Behavioral note saved privately for ${student.name}.`, `Verhaltenshinweis für ${student.name} privat gespeichert.`),
    );
  };

  const toggleBehaviorShare = (item) => {
    const nextShared = !item.sharedWithParent;
    updateStored((prev) => ({
      ...prev,
      behaviorPatches: {
        ...(prev.behaviorPatches ?? {}),
        [item.id]: { sharedWithParent: nextShared },
      },
    }));
    setNotice(
      nextShared
        ? tr(`Shared behavioral note for ${item.studentName} with parent.`, `Verhaltenshinweis für ${item.studentName} mit Eltern geteilt.`)
        : tr(`Made behavioral note for ${item.studentName} private to teacher.`, `Verhaltenshinweis für ${item.studentName} auf privat gestellt.`),
    );
  };

  const handleCreateParentAnnouncement = (event) => {
    event.preventDefault();
    if (!newParentPost.summary.trim()) return;
    const entry = {
      id: createRecordId("pa"),
      classId: newParentPost.classId,
      date: newParentPost.date,
      summary: newParentPost.summary.trim(),
      upcomingAssessments: newParentPost.upcomingAssessments.trim(),
    };
    updateStored((prev) => ({
      ...prev,
      addedParentAnnouncements: [entry, ...(prev.addedParentAnnouncements ?? [])],
    }));
    setNewParentPost({ ...newParentPost, summary: "", upcomingAssessments: "" });
    setNotice(tr(`Daily update posted for Class ${entry.classId} parents.`, `Tagesupdate für Eltern der Klasse ${entry.classId} veröffentlicht.`));
  };

  const handleCreateStudentAnnouncement = (event) => {
    event.preventDefault();
    if (!newStudentAnnouncement.title.trim() || !newStudentAnnouncement.body.trim()) return;
    const entry = {
      id: createRecordId("sa"),
      classId: newStudentAnnouncement.classId,
      title: newStudentAnnouncement.title.trim(),
      priority: newStudentAnnouncement.priority,
      body: newStudentAnnouncement.body.trim(),
      date: todayIsoDate(),
    };
    updateStored((prev) => ({
      ...prev,
      addedStudentAnnouncements: [entry, ...(prev.addedStudentAnnouncements ?? [])],
    }));
    setNewStudentAnnouncement({ ...newStudentAnnouncement, title: "", body: "" });
    setNotice(tr(`Student announcement “${entry.title}” published.`, `Schülerankündigung „${entry.title}“ veröffentlicht.`));
  };

  return (
    <div className="teacher-comm">
      <header className="comm-intro">
        <h1>{tr("Messages & announcements", "Mitteilungen & Ankündigungen")}</h1>
        <p>{tr("Reply to parent questions and exam tickets, schedule parent meetings, record behavioral concerns, and broadcast class updates.", "Beantworten Sie Elternfragen und Prüfungsanfragen, planen Sie Elterngespräche, erfassen Sie Verhaltenshinweise und senden Sie Klassenupdates.")}</p>
      </header>

      <div className="comm-tabs" role="tablist" aria-label={tr("Communication sections", "Kommunikationsbereiche")}>
        <button type="button" role="tab" aria-selected={tab === "inbox"} className="comm-tab" onClick={() => setTab("inbox")}>
          {tr(`Parent inbox & tickets (${inboxItems.length})`, `Eltern-Posteingang & Anfragen (${inboxItems.length})`)}
        </button>
        <button type="button" role="tab" aria-selected={tab === "meetings"} className="comm-tab" onClick={() => setTab("meetings")}>
          {tr("Meetings & behavior", "Gespräche & Verhalten")}
        </button>
        <button type="button" role="tab" aria-selected={tab === "parentUpdates"} className="comm-tab" onClick={() => setTab("parentUpdates")}>
          {tr("Parent daily updates", "Eltern-Tagesupdates")}
        </button>
        <button type="button" role="tab" aria-selected={tab === "studentUpdates"} className="comm-tab" onClick={() => setTab("studentUpdates")}>
          {tr("Student announcements", "Schüler-Ankündigungen")}
        </button>
      </div>

      {notice && (
        <div className="comm-notice" role="status">
          <p>{notice}</p>
          <button type="button" onClick={() => setNotice("")}>{tr("Dismiss", "Schließen")}</button>
        </div>
      )}

      {tab === "inbox" && (
        <section className="comm-board" aria-labelledby="comm-inbox-title">
          <header className="comm-board-head">
            <div>
              <h2 id="comm-inbox-title">{tr("Parent questions & exam review tickets", "Elternfragen & Anfragen zur Prüfungseinsicht")}</h2>
              <p className="comm-meta">{tr("Respond to parent inquiries and approve or decline access to graded quiz breakdowns.", "Antworten Sie auf Elternanfragen und genehmigen Sie den Zugriff auf bewertete Tests.")}</p>
            </div>
          </header>
          <ul className="comm-list" style={{ marginTop: "24px" }}>
            {inboxItems.map((item) => {
              const draftVal = replyDrafts[item.id] ?? "";
              return (
                <li key={item.id} className="comm-card">
                  <div className="comm-card-top">
                    <h3>{item.subject}</h3>
                    <span className="comm-badge">{translateValue(item.status, lang)}</span>
                  </div>
                  <p className="comm-meta">
                    {item.parentName} · {tr("Class", "Klasse")} {item.classId} · {item.time}
                    {item.assessment ? ` · ${item.assessment}` : ""}
                  </p>
                  <p>{item.message}</p>
                  {item.reply && (
                    <p className="comm-meta">
                      <strong>{tr("Your reply:", "Ihre Antwort:")}</strong> {item.reply}
                    </p>
                  )}
                  <div className="comm-reply-box">
                    <textarea
                      aria-label={tr(`Reply to ${item.parentName}`, `Antwort an ${item.parentName}`)}
                      placeholder={tr("Write a response to this parent…", "Antwort an dieses Elternteil schreiben …")}
                      value={draftVal}
                      onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    />
                    <div className="comm-actions">
                      {item.type === "exam_ticket" && (
                        <>
                          <button
                            type="button"
                            className="comm-btn"
                            disabled={item.status === "Approved"}
                            onClick={() => handleInboxAction(item, "Approved", draftVal || tr("Access approved for graded quiz breakdown.", "Zugriff auf die Aufgabenauswertung genehmigt."))}
                          >
                            {tr("Approve exam access", "Prüfungseinsicht genehmigen")}
                          </button>
                          <button
                            type="button"
                            className="comm-btn comm-btn-outline"
                            disabled={item.status === "Declined"}
                            onClick={() => handleInboxAction(item, "Declined", draftVal)}
                          >
                            {tr("Decline", "Ablehnen")}
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className="comm-btn"
                        disabled={!draftVal.trim()}
                        onClick={() => handleInboxAction(item, item.type === "exam_ticket" && item.status === "Approved" ? "Approved" : "Answered", draftVal)}
                      >
                        {tr("Send reply", "Antwort senden")}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {tab === "meetings" && (
        <div className="comm-split-stack">
          <section className="comm-board" aria-labelledby="comm-meetings-title">
            <header className="comm-board-head">
              <div>
                <h2 id="comm-meetings-title">{tr("Parent conference requests & bookings", "Elterngespräche & Terminanfragen")}</h2>
                <p className="comm-meta">{tr("Confirm incoming parent meeting slots, reschedule, or arrange a new conference.", "Bestätigen Sie Terminanfragen, schlagen Sie neue Zeiten vor oder vereinbaren Sie ein Gespräch.")}</p>
              </div>
            </header>
            <div className="comm-split">
              <form className="comm-form" onSubmit={handleCreateMeeting}>
                <h3>{tr("Arrange a parent meeting", "Neues Elterngespräch planen")}</h3>
                <label>
                  <span>{tr("Student", "Schüler")}</span>
                  <select value={newMeeting.studentId} onChange={(e) => setNewMeeting({ ...newMeeting, studentId: e.target.value })}>
                    {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.classId})</option>)}
                  </select>
                </label>
                <label>
                  <span>{tr("Date & time slot", "Datum & Uhrzeit")}</span>
                  <input type="text" required placeholder={tr("e.g. Wednesday, Nov 18 · 03:00 PM", "z. B. Mittwoch, 18. Nov. · 15:00 Uhr")} value={newMeeting.requestedSlot} onChange={(e) => setNewMeeting({ ...newMeeting, requestedSlot: e.target.value })} />
                </label>
                <label>
                  <span>{tr("Topic", "Gesprächsthema")}</span>
                  <input type="text" required placeholder={tr("e.g. Fractions progress review", "z. B. Lernstand Brüche")} value={newMeeting.topic} onChange={(e) => setNewMeeting({ ...newMeeting, topic: e.target.value })} />
                </label>
                <button type="submit" className="comm-btn">{tr("Schedule & notify parent", "Planen & Eltern benachrichtigen")}</button>
              </form>

              <ul className="comm-list">
                {meetings.map((m) => (
                  <li key={m.id} className="comm-card">
                    <div className="comm-card-top">
                      <h3>{m.studentName} · {m.requestedSlot}</h3>
                      <span className="comm-badge">{translateValue(m.status, lang)}</span>
                    </div>
                    <p className="comm-meta">{m.parentName} · {tr("Class", "Klasse")} {m.classId}</p>
                    <p>{m.topic}</p>
                    {m.note && <p className="comm-meta">{m.note}</p>}
                    <div className="comm-actions">
                      <button type="button" className="comm-btn" disabled={m.status === "Confirmed"} onClick={() => handleMeetingStatus(m, "Confirmed")}>
                        {tr("Confirm meeting", "Termin bestätigen")}
                      </button>
                      <button type="button" className="comm-btn comm-btn-outline" disabled={m.status === "Rescheduled"} onClick={() => handleMeetingStatus(m, "Rescheduled")}>
                        {tr("Propose new time", "Neue Zeit vorschlagen")}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="comm-board" aria-labelledby="comm-behavior-title">
            <header className="comm-board-head">
              <div>
                <h2 id="comm-behavior-title">{tr("Behavioral concerns & home support", "Verhaltenshinweise & Unterstützung zu Hause")}</h2>
                <p className="comm-meta">{tr("Record classroom behavior observations and choose whether to alert parents.", "Erfassen Sie Beobachtungen aus dem Unterricht und legen Sie fest, ob Eltern informiert werden.")}</p>
              </div>
            </header>
            <div className="comm-split">
              <form className="comm-form" onSubmit={handleCreateBehavior}>
                <h3>{tr("Log behavioral note", "Verhaltenshinweis erfassen")}</h3>
                <div className="comm-pair">
                  <label>
                    <span>{tr("Student", "Schüler")}</span>
                    <select value={newBehavior.studentId} onChange={(e) => setNewBehavior({ ...newBehavior, studentId: e.target.value })}>
                      {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.classId})</option>)}
                    </select>
                  </label>
                  <label>
                    <span>{tr("Category", "Kategorie")}</span>
                    <select value={newBehavior.category} onChange={(e) => setNewBehavior({ ...newBehavior, category: e.target.value })}>
                      <option value="Focus & Readiness">{tr("Focus & Readiness", "Konzentration & Vorbereitung")}</option>
                      <option value="Participation">{tr("Participation", "Mitarbeit")}</option>
                      <option value="Peer Conduct">{tr("Peer Conduct", "Sozialverhalten")}</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>{tr("Observation note", "Beobachtung")}</span>
                  <textarea rows={3} required placeholder={tr("Describe what you noticed in class…", "Beschreiben Sie Ihre Beobachtung im Unterricht …")} value={newBehavior.note} onChange={(e) => setNewBehavior({ ...newBehavior, note: e.target.value })} />
                </label>
                <label>
                  <span>{tr("Home support suggestion (optional)", "Tipp für zu Hause (optional)")}</span>
                  <input type="text" placeholder={tr("e.g. Short daily focus routine", "z. B. Kurze tägliche Übungsroutine")} value={newBehavior.homeTip} onChange={(e) => setNewBehavior({ ...newBehavior, homeTip: e.target.value })} />
                </label>
                <label className="comm-check">
                  <input type="checkbox" checked={newBehavior.sharedWithParent} onChange={(e) => setNewBehavior({ ...newBehavior, sharedWithParent: e.target.checked })} />
                  <span>{tr("Alert parent right away", "Eltern direkt informieren")}</span>
                </label>
                <button type="submit" className="comm-btn">{tr("Save behavioral note", "Verhaltenshinweis speichern")}</button>
              </form>

              <ul className="comm-list">
                {behaviorLogs.map((b) => (
                  <li key={b.id} className="comm-card">
                    <div className="comm-card-top">
                      <h3>{b.studentName} · {b.category}</h3>
                      <span className="comm-badge">
                        {b.sharedWithParent ? tr("Shared with parent", "Mit Eltern geteilt") : tr("Private to teacher", "Nur für Lehrkraft")}
                      </span>
                    </div>
                    <p className="comm-meta">{tr("Class", "Klasse")} {b.classId} · {b.date}</p>
                    <p>{b.note}</p>
                    {b.homeTip && <p className="comm-meta"><strong>{tr("Home tip:", "Tipp für zu Hause:")}</strong> {b.homeTip}</p>}
                    <div className="comm-actions">
                      <button type="button" className="comm-btn comm-btn-outline" onClick={() => toggleBehaviorShare(b)}>
                        {b.sharedWithParent ? tr("Make private to teacher", "Auf privat setzen") : tr("Share alert with parent", "An Eltern senden")}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      )}

      {tab === "parentUpdates" && (
        <section className="comm-board" aria-labelledby="comm-parent-updates-title">
          <header className="comm-board-head">
            <div>
              <h2 id="comm-parent-updates-title">{tr("Daily parent updates & upcoming quizzes/exams", "Tägliche Elternupdates & anstehende Tests/Prüfungen")}</h2>
              <p className="comm-meta">{tr("Send end-of-day summaries to parents about classwork and upcoming assessments.", "Senden Sie Tageszusammenfassungen an Eltern über Unterrichtsinhalte und anstehende Prüfungen.")}</p>
            </div>
          </header>
          <div className="comm-split">
            <form className="comm-form" onSubmit={handleCreateParentAnnouncement}>
              <h3>{tr("Send daily parent announcement", "Tagesupdate an Eltern senden")}</h3>
              <div className="comm-pair">
                <label>
                  <span>{tr("Class", "Klasse")}</span>
                  <select value={newParentPost.classId} onChange={(e) => setNewParentPost({ ...newParentPost, classId: e.target.value })}>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label>
                  <span>{tr("Date", "Datum")}</span>
                  <input type="date" required value={newParentPost.date} onChange={(e) => setNewParentPost({ ...newParentPost, date: e.target.value })} />
                </label>
              </div>
              <label>
                <span>{tr("What students did today", "Heutige Unterrichtsinhalte")}</span>
                <textarea rows={3} required placeholder={tr("Summarize today's lesson and classwork…", "Fassen Sie die heutige Stunde und Übungen zusammen …")} value={newParentPost.summary} onChange={(e) => setNewParentPost({ ...newParentPost, summary: e.target.value })} />
              </label>
              <label>
                <span>{tr("Upcoming quizzes & exams", "Anstehende Quizze & Prüfungen")}</span>
                <input type="text" placeholder={tr("e.g. Fractions quiz on Tuesday", "z. B. Bruch-Quiz am Dienstag")} value={newParentPost.upcomingAssessments} onChange={(e) => setNewParentPost({ ...newParentPost, upcomingAssessments: e.target.value })} />
              </label>
              <button type="submit" className="comm-btn">{tr("Publish parent update", "Elternupdate veröffentlichen")}</button>
            </form>

            <ul className="comm-list">
              {parentAnnouncements.map((post) => (
                <li key={post.id} className="comm-card">
                  <div className="comm-card-top">
                    <h3>{tr("Class", "Klasse")} {post.classId} · {post.date}</h3>
                    <span className="comm-badge">{tr("Sent to parents", "An Eltern gesendet")}</span>
                  </div>
                  <p>{post.summary}</p>
                  {post.upcomingAssessments && (
                    <p className="comm-meta"><strong>{tr("Upcoming assessments:", "Anstehende Leistungsnachweise:")}</strong> {post.upcomingAssessments}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {tab === "studentUpdates" && (
        <section className="comm-board" aria-labelledby="comm-student-updates-title">
          <header className="comm-board-head">
            <div>
              <h2 id="comm-student-updates-title">{tr("Student announcements & notifications", "Schüler-Ankündigungen & Benachrichtigungen")}</h2>
              <p className="comm-meta">{tr("Broadcast class announcements to students. Need to contact a single student privately? Open their profile in Classes.", "Senden Sie Ankündigungen an ganze Klassen. Für private Einzelnachrichten öffnen Sie einen Schüler unter Klassen.")}</p>
            </div>
            <Link to="/teacher/classes" className="comm-btn">{tr("Open student roster for private chat →", "Klassenliste für Einzelchat öffnen →")}</Link>
          </header>
          <div className="comm-split">
            <form className="comm-form" onSubmit={handleCreateStudentAnnouncement}>
              <h3>{tr("Post announcement to students", "Ankündigung an Schüler senden")}</h3>
              <div className="comm-pair">
                <label>
                  <span>{tr("Target audience", "Zielgruppe")}</span>
                  <select value={newStudentAnnouncement.classId} onChange={(e) => setNewStudentAnnouncement({ ...newStudentAnnouncement, classId: e.target.value })}>
                    <option value="All">{tr("All my classes", "Alle meine Klassen")}</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label>
                  <span>{tr("Priority", "Priorität")}</span>
                  <select value={newStudentAnnouncement.priority} onChange={(e) => setNewStudentAnnouncement({ ...newStudentAnnouncement, priority: e.target.value })}>
                    <option value="Standard">{translateValue("Standard", lang)}</option>
                    <option value="Important">{translateValue("Important", lang)}</option>
                  </select>
                </label>
              </div>
              <label>
                <span>{tr("Announcement title", "Titel der Ankündigung")}</span>
                <input type="text" required placeholder={tr("e.g. Bring geometry set tomorrow", "z. B. Morgen Geodreieck mitbringen")} value={newStudentAnnouncement.title} onChange={(e) => setNewStudentAnnouncement({ ...newStudentAnnouncement, title: e.target.value })} />
              </label>
              <label>
                <span>{tr("Message to students", "Nachricht an Schüler")}</span>
                <textarea rows={3} required placeholder={tr("Write clear instructions or reminders…", "Schreiben Sie klare Hinweise oder Erinnerungen …")} value={newStudentAnnouncement.body} onChange={(e) => setNewStudentAnnouncement({ ...newStudentAnnouncement, body: e.target.value })} />
              </label>
              <button type="submit" className="comm-btn">{tr("Send student announcement", "Ankündigung senden")}</button>
            </form>

            <ul className="comm-list">
              {studentAnnouncements.map((item) => (
                <li key={item.id} className="comm-card">
                  <div className="comm-card-top">
                    <h3>{item.title}</h3>
                    <span className="comm-badge">{translateValue(item.priority, lang)}</span>
                  </div>
                  <p className="comm-meta">
                    {item.classId === "All" ? tr("All classes", "Alle Klassen") : `${tr("Class", "Klasse")} ${item.classId}`} · {item.date}
                  </p>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
