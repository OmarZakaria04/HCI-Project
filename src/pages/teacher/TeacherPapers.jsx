import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getTeacherData } from "../../i18n/teacherDataDe";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import submissionDate from "../../utils/submissionDate";
import keepDialogFocus from "../../utils/dialogFocus";
import {
  getArchiveAdded,
  getArchiveEdits,
  getUploadedPapersMap,
  saveArchiveAdded,
  saveArchiveEdit,
} from "../../utils/teacherStore";
import "../../styles/teacher-papers.css";

export default function TeacherPapers() {
  const { lang, tr } = useLanguage();
  const { papers: basePapers, archiveRecords: baseArchive, classes } = getTeacherData(lang);
  const uploadedMap = getUploadedPapersMap();
  const papers = basePapers.map((p) =>
    uploadedMap[String(p.id)]?.uploaded
      ? { ...p, status: "Graded", uploadedScore: uploadedMap[String(p.id)].score }
      : p,
  );

  const [activeTab, setActiveTab] = useState("current");
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ grade: "", classId: "", paper: "", status: "" });
  const [sortOrder, setSortOrder] = useState("newest");

  // Archive state (T11)
  const [archiveEdits, setArchiveEdits] = useState(() => getArchiveEdits());
  const [addedArchive, setAddedArchive] = useState(() => getArchiveAdded());
  const [archiveQuery, setArchiveQuery] = useState("");
  const [archiveFilters, setArchiveFilters] = useState({ term: "", type: "", classId: "" });
  const [editingRecord, setEditingRecord] = useState(null);
  const [archiveNotice, setArchiveNotice] = useState("");
  const archiveDialogRef = useRef(null);

  useEffect(() => {
    const dialog = archiveDialogRef.current;
    if (!dialog) return;
    if (editingRecord && !dialog.open) dialog.showModal();
    if (!editingRecord && dialog.open) dialog.close();
  }, [editingRecord]);

  const archiveList = [...addedArchive, ...(baseArchive ?? [])].map((rec) =>
    archiveEdits[String(rec.id)] ? { ...rec, ...archiveEdits[String(rec.id)] } : rec,
  );

  const handleChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ grade: "", classId: "", paper: "", status: "" });
    setSortOrder("newest");
    searchRef.current?.focus();
  };

  const grades = [...new Set(papers.map((paper) => paper.grade))].sort();
  const classIds = [...new Set(papers.map((paper) => paper.classId))].sort();
  const paperNames = [...new Set(papers.map((paper) => paper.paper))].sort();
  const query = searchQuery.trim().toLowerCase();
  const visible = papers
    .filter((paper) => (
      (!query || paper.student.toLowerCase().includes(query) || paper.classId.toLowerCase().includes(query)) &&
      (!filters.grade || String(paper.grade) === filters.grade) &&
      (!filters.classId || paper.classId === filters.classId) &&
      (!filters.paper || paper.paper === filters.paper) &&
      (!filters.status || paper.status === filters.status)
    ))
    .sort((a, b) => {
      const aOrder = submissionDate(a.submitted, lang)?.order;
      const bOrder = submissionDate(b.submitted, lang)?.order;
      if (aOrder == null && bOrder == null) return String(a.id).localeCompare(String(b.id));
      if (aOrder == null) return 1;
      if (bOrder == null) return -1;
      return sortOrder === "oldest" ? aOrder - bOrder : bOrder - aOrder;
    });
  const pendingCount = papers.filter((paper) => paper.status === "Pending").length;
  const gradedCount = papers.filter((paper) => paper.status === "Graded").length;
  const isFiltered = searchQuery !== "" || Object.values(filters).some(Boolean) || sortOrder !== "newest";

  // Archive filtering
  const archiveTerms = [...new Set(archiveList.map((r) => r.term))];
  const archiveTypes = [...new Set(archiveList.map((r) => r.type))];
  const archiveSearch = archiveQuery.trim().toLowerCase();
  const visibleArchive = archiveList.filter((rec) => (
    (!archiveSearch || `${rec.title} ${rec.classId} ${rec.notes}`.toLowerCase().includes(archiveSearch)) &&
    (!archiveFilters.term || rec.term === archiveFilters.term) &&
    (!archiveFilters.type || rec.type === archiveFilters.type) &&
    (!archiveFilters.classId || rec.classId === archiveFilters.classId)
  ));

  const saveArchiveRecord = (event) => {
    event.preventDefault();
    if (!editingRecord.title.trim()) return;
    if (editingRecord.isNew) {
      const created = { ...editingRecord, id: `arch-${Date.now()}`, isNew: undefined };
      const nextAdded = saveArchiveAdded([created, ...addedArchive]);
      setAddedArchive(nextAdded);
      setArchiveNotice(tr(`Added “${created.title}” to the records archive.`, `„${created.title}“ zum Archiv hinzugefügt.`));
    } else if (addedArchive.some((r) => r.id === editingRecord.id)) {
      const nextAdded = saveArchiveAdded(addedArchive.map((r) => (r.id === editingRecord.id ? editingRecord : r)));
      setAddedArchive(nextAdded);
      setArchiveNotice(tr(`Updated archived record “${editingRecord.title}”.`, `Archivierten Eintrag „${editingRecord.title}“ aktualisiert.`));
    } else {
      const nextEdits = saveArchiveEdit(editingRecord.id, editingRecord);
      setArchiveEdits(nextEdits);
      setArchiveNotice(tr(`Updated archived record “${editingRecord.title}”.`, `Archivierten Eintrag „${editingRecord.title}“ aktualisiert.`));
    }
    setEditingRecord(null);
  };

  return (
    <div className="teacher-papers">
      <header className="papers-intro">
        <h1>{tr("Papers & records archive", "Abgaben & Archiv")}</h1>
        <p>{tr("Review current submissions or open and update older quizzes, exams, assignments, and grades.", "Prüfen Sie aktuelle Abgaben oder öffnen und aktualisieren Sie ältere Quizze, Prüfungen, Aufgaben und Noten.")}</p>
      </header>

      <div className="papers-tabs" role="tablist" aria-label={tr("Papers views", "Ansichten für Abgaben")}>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "current"}
          className="papers-tab"
          onClick={() => setActiveTab("current")}
        >
          {tr(`Current submissions (${papers.length})`, `Aktuelle Abgaben (${papers.length})`)}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "archive"}
          className="papers-tab"
          onClick={() => setActiveTab("archive")}
        >
          {tr(`Records archive (${archiveList.length})`, `Archiv (${archiveList.length})`)}
        </button>
      </div>

      {activeTab === "current" ? (
      <section className="papers-board" aria-labelledby="papers-title">
        <header className="papers-board-heading">
          <div>
            <h2 id="papers-title">{tr("Submissions", "Abgaben")}</h2>
            <p>
              {papers.length} {tr("total", "gesamt")} <span aria-hidden="true">·</span> {pendingCount} {tr("pending", "ausstehend")} <span aria-hidden="true">·</span> {gradedCount} {tr("graded", "bewertet")}
            </p>
          </div>
          <div className="papers-quick-pills" role="group" aria-label={tr("Filter by status", "Nach Status filtern")}>
            {[
              { id: "", label: tr(`All (${papers.length})`, `Alle (${papers.length})`) },
              { id: "Pending", label: tr(`Pending assessments (${pendingCount})`, `Ausstehende Abgaben (${pendingCount})`) },
              { id: "Graded", label: tr(`Graded (${gradedCount})`, `Bewertet (${gradedCount})`) },
            ].map((pill) => (
              <button
                key={pill.id || "all"}
                type="button"
                aria-pressed={filters.status === pill.id}
                className={`papers-quick-pill${filters.status === pill.id ? " is-active" : ""}`}
                onClick={() => setFilters((prev) => ({ ...prev, status: pill.id }))}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </header>

        <div className="papers-filter-grid">
          <label className="papers-search">
            <span>{tr("Search students or classes", "Schüler oder Klassen suchen")}</span>
            <input ref={searchRef} type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={tr("e.g. Omar or 5A", "z. B. Omar oder 5A")} />
          </label>
          <label>
            <span>{tr("Grade", "Klassenstufe")}</span>
            <select name="grade" value={filters.grade} onChange={handleChange}>
              <option value="">{tr("All grades", "Alle Stufen")}</option>
              {grades.map((grade) => <option key={grade} value={grade}>{tr(`Grade ${grade}`, `Stufe ${grade}`)}</option>)}
            </select>
          </label>
          <label>
            <span>{tr("Class", "Klasse")}</span>
            <select name="classId" value={filters.classId} onChange={handleChange}>
              <option value="">{tr("All classes", "Alle Klassen")}</option>
              {classIds.map((classId) => <option key={classId} value={classId}>{classId}</option>)}
            </select>
          </label>
          <label>
            <span>{tr("Paper", "Arbeit")}</span>
            <select name="paper" value={filters.paper} onChange={handleChange}>
              <option value="">{tr("All papers", "Alle Arbeiten")}</option>
              {paperNames.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label>
            <span>{tr("Status", "Status")}</span>
            <select name="status" value={filters.status} onChange={handleChange}>
              <option value="">{tr("All statuses", "Alle Status")}</option>
              <option value="Pending">{translateValue("Pending", lang)}</option>
              <option value="Graded">{translateValue("Graded", lang)}</option>
            </select>
          </label>
          <label>
            <span>{tr("Sort by", "Sortieren nach")}</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="newest">{tr("Newest first", "Neueste zuerst")}</option>
              <option value="oldest">{tr("Oldest first", "Älteste zuerst")}</option>
            </select>
          </label>
        </div>

        <div className="papers-results">
          <p role="status">
            {tr(
              `Showing ${visible.length} of ${papers.length} submissions`,
              `${visible.length} von ${papers.length} Abgaben angezeigt`,
            )}
          </p>
          <button type="button" onClick={resetFilters} disabled={!isFiltered}>{tr("Clear filters", "Filter zurücksetzen")}</button>
        </div>

        <div className="papers-table-scroll" role="region" aria-label={tr("Student submissions", "Schülerabgaben")} tabIndex={0}>
          <table>
            <caption className="papers-sr-only">
              {tr(
                "Student submissions with papers, classes, submission dates, review status, and review links.",
                "Schülerabgaben mit Arbeiten, Klassen, Abgabedaten, Prüfungsstatus und Prüflinks.",
              )}
            </caption>
            <thead>
              <tr>
                <th scope="col">{tr("Student", "Schüler")}</th>
                <th scope="col">{tr("Paper", "Arbeit")}</th>
                <th scope="col">{tr("Class", "Klasse")}</th>
                <th scope="col">{tr("Submitted", "Eingereicht")}</th>
                <th scope="col">{tr("Status", "Status")}</th>
                <th scope="col"><span className="papers-sr-only">{tr("Review submission", "Abgabe prüfen")}</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.length ? visible.map((paper) => {
                const date = submissionDate(paper.submitted, lang);
                return (
                  <tr key={paper.id}>
                    <th scope="row">{paper.student}</th>
                    <td>{paper.paper}</td>
                    <td>{paper.classId}<span className="papers-secondary">{tr(`Grade ${paper.grade}`, `Stufe ${paper.grade}`)}</span></td>
                    <td>{date ? <time dateTime={date.iso}>{date.dayLabel}<span className="papers-secondary">{date.timeLabel}</span></time> : paper.submitted}</td>
                    <td>
                      <span className={paper.status === "Pending" ? "papers-pending" : ""}>{translateValue(paper.status, lang)}</span>
                      {paper.uploadedScore && <span className="papers-secondary">{paper.uploadedScore} · {translateValue("Uploaded", lang)}</span>}
                    </td>
                    <td><Link className="papers-review-link" to={`/teacher/papers/${paper.id}`} aria-label={tr(`Review ${paper.paper} from ${paper.student}`, `${paper.paper} von ${paper.student} prüfen`)}>{tr("Review", "Prüfen")}</Link></td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="papers-empty-state">
                    <h3>{papers.length ? tr("No matching submissions", "Keine passenden Abgaben") : tr("No submissions yet", "Noch keine Abgaben")}</h3>
                    <p>{papers.length ? tr("Try another student or class, or clear your filters.", "Versuchen Sie einen anderen Schüler oder eine andere Klasse, oder setzen Sie Ihre Filter zurück.") : tr("Student work will appear here when it is available.", "Schülerarbeiten erscheinen hier, sobald sie vorliegen.")}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      ) : (
        <section className="papers-board" aria-labelledby="archive-title">
          <header className="papers-board-heading papers-archive-toolbar">
            <div>
              <h2 id="archive-title">{tr("Records archive", "Archiv älterer Leistungen")}</h2>
              <p>{tr("Open and update older quizzes, exams, assignments, and gradebooks.", "Ältere Quizze, Prüfungen, Aufgaben und Notenbücher öffnen und aktualisieren.")}</p>
            </div>
            <button
              type="button"
              className="papers-archive-btn"
              onClick={() =>
                setEditingRecord({
                  isNew: true,
                  term: archiveTerms[0] ?? tr("Fall 2026 · Term 1", "Herbst 2026 · 1. Halbjahr"),
                  classId: classes[0]?.id ?? "5A",
                  grade: classes[0]?.grade ?? 5,
                  type: "Quiz",
                  title: "",
                  date: "2026-10-01",
                  averageScore: "80%",
                  status: "Uploaded",
                  notes: "",
                })
              }
            >
              {tr("+ Archive record", "+ Archiv-Eintrag anlegen")}
            </button>
          </header>

          <div className="papers-filter-grid">
            <label className="papers-search">
              <span>{tr("Search archive", "Archiv durchsuchen")}</span>
              <input type="search" value={archiveQuery} onChange={(e) => setArchiveQuery(e.target.value)} placeholder={tr("Title, class, or note", "Titel, Klasse oder Notiz")} />
            </label>
            <label>
              <span>{tr("Term", "Zeitraum")}</span>
              <select value={archiveFilters.term} onChange={(e) => setArchiveFilters({ ...archiveFilters, term: e.target.value })}>
                <option value="">{tr("All terms", "Alle Zeiträume")}</option>
                {archiveTerms.map((term) => <option key={term} value={term}>{term}</option>)}
              </select>
            </label>
            <label>
              <span>{tr("Type", "Typ")}</span>
              <select value={archiveFilters.type} onChange={(e) => setArchiveFilters({ ...archiveFilters, type: e.target.value })}>
                <option value="">{tr("All types", "Alle Typen")}</option>
                {archiveTypes.map((type) => <option key={type} value={type}>{translateValue(type, lang)}</option>)}
              </select>
            </label>
            <label>
              <span>{tr("Class", "Klasse")}</span>
              <select value={archiveFilters.classId} onChange={(e) => setArchiveFilters({ ...archiveFilters, classId: e.target.value })}>
                <option value="">{tr("All classes", "Alle Klassen")}</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}
              </select>
            </label>
          </div>

          <div className="papers-results">
            <p role="status">{tr(`Showing ${visibleArchive.length} of ${archiveList.length} archived records`, `${visibleArchive.length} von ${archiveList.length} Archiveinträgen`)}</p>
            <button
              type="button"
              disabled={!archiveQuery && !Object.values(archiveFilters).some(Boolean)}
              onClick={() => {
                setArchiveQuery("");
                setArchiveFilters({ term: "", type: "", classId: "" });
              }}
            >
              {tr("Clear filters", "Filter zurücksetzen")}
            </button>
          </div>

          <div className="papers-table-scroll" role="region" aria-label={tr("Archived records", "Archivierte Einträge")} tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">{tr("Title & notes", "Titel & Notizen")}</th>
                  <th scope="col">{tr("Type", "Typ")}</th>
                  <th scope="col">{tr("Class", "Klasse")}</th>
                  <th scope="col">{tr("Date / Term", "Datum / Zeitraum")}</th>
                  <th scope="col">{tr("Average / Status", "Schnitt / Status")}</th>
                  <th scope="col"><span className="papers-sr-only">{tr("Update record", "Eintrag bearbeiten")}</span></th>
                </tr>
              </thead>
              <tbody>
                {visibleArchive.map((rec) => (
                  <tr key={rec.id}>
                    <th scope="row">
                      {rec.title}
                      {rec.notes && <span className="papers-secondary">{rec.notes}</span>}
                    </th>
                    <td>{translateValue(rec.type, lang)}</td>
                    <td>{rec.classId}<span className="papers-secondary">{tr(`Grade ${rec.grade}`, `Stufe ${rec.grade}`)}</span></td>
                    <td>{rec.date}<span className="papers-secondary">{rec.term}</span></td>
                    <td>{rec.averageScore}<span className="papers-secondary">{translateValue(rec.status, lang)}</span></td>
                    <td>
                      <button
                        type="button"
                        className="papers-review-link"
                        onClick={() => setEditingRecord({ ...rec })}
                      >
                        {tr("Open & update", "Öffnen & ändern")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {archiveNotice && (
        <div className="papers-notice" role="status">
          <p>{archiveNotice}</p>
          <button type="button" onClick={() => setArchiveNotice("")}>{tr("Dismiss", "Schließen")}</button>
        </div>
      )}

      <dialog
        ref={archiveDialogRef}
        className="papers-dialog"
        aria-labelledby="archive-dialog-title"
        onKeyDown={keepDialogFocus}
        onClose={() => setEditingRecord(null)}
        onClick={(e) => { if (e.target === e.currentTarget) setEditingRecord(null); }}
      >
        {editingRecord && (
          <form onSubmit={saveArchiveRecord}>
            <header className="papers-dialog-head">
              <h2 id="archive-dialog-title">
                {editingRecord.isNew
                  ? tr("Add record to archive", "Eintrag zum Archiv hinzufügen")
                  : tr("Update archived record", "Archivierten Eintrag aktualisieren")}
              </h2>
              <button type="button" className="papers-dialog-close" aria-label={tr("Close dialog", "Dialog schließen")} onClick={() => setEditingRecord(null)}>×</button>
            </header>
            <div className="papers-dialog-body">
              <label>
                <span>{tr("Title", "Titel")}</span>
                <input type="text" required value={editingRecord.title} onChange={(e) => setEditingRecord({ ...editingRecord, title: e.target.value })} />
              </label>
              <div className="papers-dialog-pair">
                <label>
                  <span>{tr("Type", "Typ")}</span>
                  <select value={editingRecord.type} onChange={(e) => setEditingRecord({ ...editingRecord, type: e.target.value })}>
                    <option value="Quiz">{translateValue("Quiz", lang)}</option>
                    <option value="Exam">{translateValue("Exam", lang)}</option>
                    <option value="Assignment">{translateValue("Assignment", lang)}</option>
                    <option value="Gradebook">{translateValue("Gradebook", lang)}</option>
                  </select>
                </label>
                <label>
                  <span>{tr("Class", "Klasse")}</span>
                  <select value={editingRecord.classId} onChange={(e) => setEditingRecord({ ...editingRecord, classId: e.target.value })}>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              </div>
              <div className="papers-dialog-pair">
                <label>
                  <span>{tr("Average / recorded grade", "Durchschnitt / Note")}</span>
                  <input type="text" value={editingRecord.averageScore} onChange={(e) => setEditingRecord({ ...editingRecord, averageScore: e.target.value })} />
                </label>
                <label>
                  <span>{tr("Status", "Status")}</span>
                  <select value={editingRecord.status} onChange={(e) => setEditingRecord({ ...editingRecord, status: e.target.value })}>
                    <option value="Uploaded">{translateValue("Uploaded", lang)}</option>
                    <option value="Confirmed">{translateValue("Confirmed", lang)}</option>
                    <option value="Pending">{translateValue("Pending", lang)}</option>
                  </select>
                </label>
              </div>
              <label>
                <span>{tr("Teacher notes", "Notizen der Lehrkraft")}</span>
                <textarea rows={3} value={editingRecord.notes} onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })} />
              </label>
            </div>
            <footer className="papers-dialog-foot">
              <button type="button" className="papers-archive-btn" onClick={() => setEditingRecord(null)}>{tr("Cancel", "Abbrechen")}</button>
              <button type="submit" className="papers-archive-btn papers-dialog-primary">{tr("Save update", "Änderung speichern")}</button>
            </footer>
          </form>
        )}
      </dialog>
    </div>
  );
}
