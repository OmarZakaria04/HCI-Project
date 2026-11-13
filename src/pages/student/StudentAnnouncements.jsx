import { useRef, useState } from "react";
import Header from "../../components/Header";
import { getStudentData } from "../../i18n/studentDataDe";
import { useLanguage } from "../../i18n/useLanguage";
import { getTeacherCommState } from "../../utils/teacherStore";
import { announcementDate } from "../../utils/announcementDate";
import "../../styles/student-announcements.css";

export default function StudentAnnouncements() {
  const { lang, tr } = useLanguage();
  const studentData = getStudentData(lang);
  const [filter, setFilter] = useState("all");
  const filterRef = useRef(null);
  const dateFormatter = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

  const teacherPosts = (getTeacherCommState().addedStudentAnnouncements || []).map((post) => ({
    id: post.id,
    title: post.title,
    date: post.date,
    category: post.classId?.toLowerCase() === "all"
      ? tr("All classes", "Alle Klassen")
      : `${tr("Class", "Klasse")} ${post.classId}`,
    content: post.body,
    author: studentData.profile.teacher,
    isImportant: post.priority === "Important",
  }));

  const announcements = [...teacherPosts, ...studentData.announcements]
    .map((ann) => ({ ...ann, isoDate: announcementDate(ann.date) }))
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  const visibleAnnouncements = announcements.filter((ann) => filter !== "important" || ann.isImportant);

  return (
    <div className="student-announcements-page">
      <Header role="student" />
      <main className="student-announcements">
        <div className="announcements-container">
          <header className="announcements-intro">
            <h1>{tr("Announcements", "Ankündigungen")}</h1>
            <p>{tr("School news, class notices, and important updates.", "Schulnachrichten, Klassenmitteilungen und wichtige Neuigkeiten.")}</p>
          </header>

          <section className="announcements-panel" aria-labelledby="announcements-title">
            <div className="announcements-toolbar">
              <div>
                <h2 id="announcements-title">{tr("Latest announcements", "Neueste Ankündigungen")}</h2>
                <p className="announcements-meta announcements-count" role="status" aria-live="polite" aria-atomic="true">
                  {tr(
                    `${visibleAnnouncements.length} of ${announcements.length} announcements · Newest first`,
                    `${visibleAnnouncements.length} von ${announcements.length} Ankündigungen · Neueste zuerst`
                  )}
                </p>
              </div>
              <div className="announcements-filter">
                <label htmlFor="announcement-filter">{tr("Show", "Anzeigen")}</label>
                <select ref={filterRef} id="announcement-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
                  <option value="all">{tr("All announcements", "Alle Ankündigungen")}</option>
                  <option value="important">{tr("Important only", "Nur wichtige")}</option>
                </select>
              </div>
            </div>

            {visibleAnnouncements.length ? (
              <ul className="announcements-list">
                {visibleAnnouncements.map((ann) => (
                  <li key={ann.id} className="announcement-row">
                    <article className="announcement-item" aria-labelledby={`announcement-${ann.id}`}>
                      <div className="announcement-header">
                        <span className="announcement-marker" aria-hidden="true">
                          {ann.author.replace(/^(?:Mrs|Mr|Ms|Miss|Dr|Prof)\.?\s+/i, "").trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase()}
                        </span>
                        <div className="announcement-overview">
                          <div className="announcement-title">
                            <h3 id={`announcement-${ann.id}`}>{ann.title}</h3>
                            {ann.isImportant && <span className="announcement-important">{tr("Important", "Wichtig")}</span>}
                          </div>
                          <p className="announcements-meta announcement-byline">
                            {ann.category} · {tr("Posted by", "Veröffentlicht von")} <strong>{ann.author}</strong>
                          </p>
                        </div>
                        {ann.isoDate ? (
                          <time className="announcements-meta announcement-date" dateTime={ann.isoDate}>
                            {dateFormatter.format(new Date(`${ann.isoDate}T00:00:00Z`))}
                          </time>
                        ) : <span className="announcements-meta announcement-date">{tr("Date unavailable", "Datum nicht verfügbar")}</span>}
                      </div>
                      <div className="announcement-body">
                        <p className="announcement-content">{ann.content}</p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="announcements-empty">
                <h3>{filter === "important" ? tr("No important announcements", "Keine wichtigen Ankündigungen") : tr("No announcements yet", "Noch keine Ankündigungen")}</h3>
                <p>{filter === "important"
                  ? tr("There are no important notices to show. You can still view all school and class updates.", "Es gibt keine wichtigen Hinweise. Du kannst weiterhin alle Schul- und Klassenmitteilungen ansehen.")
                  : tr("School and class updates will appear here when they are posted.", "Schul- und Klassenmitteilungen erscheinen hier, sobald sie veröffentlicht werden.")}</p>
                {filter === "important" && (
                  <button type="button" onClick={() => { setFilter("all"); filterRef.current?.focus(); }}>
                    {tr("Show all announcements", "Alle Ankündigungen anzeigen")}
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
