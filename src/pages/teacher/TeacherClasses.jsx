import { useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getTeacherData } from "../../i18n/teacherDataDe";
import { useLanguage } from "../../i18n/useLanguage";
import "../../styles/teacher-classes.css";

const letter = (value) => value >= 90 ? "A" : value >= 80 ? "B" : value >= 70 ? "C" : value >= 60 ? "D" : "F";

export default function TeacherClasses() {
  const { lang, tr } = useLanguage();
  const { classes, students } = getTeacherData(lang);
  const { classId } = useParams();
  const defaultClass = classes.find((item) => item.id === "5A") ?? classes[0];
  const selected = classes.find((item) => item.id === classId);
  const roster = students.filter((student) => student.classId === selected?.id);
  const percentage = (value) => (Number.isFinite(value) ? `${value}%` : tr("Not available", "Nicht verfügbar"));

  if (!classId && defaultClass) {
    return <Navigate to={`/teacher/classes/${defaultClass.id}`} replace />;
  }

  return (
    <div className="teacher-classes">
      <h1>{tr("Classes", "Klassen")}</h1>
      <p className="classes-sr-only" role="status">
        {selected ? tr(`Showing ${selected.name} students.`, `Schüler der Klasse ${selected.name} werden angezeigt.`) : ""}
      </p>
      {selected ? (
        <section className="classes-board" aria-labelledby="classes-roster-title">
          <header className="classes-board-heading">
            <h2 id="classes-roster-title" className="classes-roster-heading" aria-label={tr(`${selected.name} Students`, `${selected.name} Schüler`)}>
              <ClassSelector selectedId={selected.id} />
              <span>{tr("Students", "Schüler")}</span>
            </h2>
            <div className="classes-summary">
              <p>
                {roster.length}{" "}
                {lang === "de"
                  ? "Schüler in der Klasse"
                  : `${roster.length === 1 ? "student" : "students"} in class`}
              </p>
              <p>{tr("Class average:", "Klassendurchschnitt:")} {percentage(selected.average)}</p>
            </div>
          </header>
          <ClassRoster key={selected.id} selected={selected} roster={roster} />
        </section>
      ) : (
        <section className="classes-board classes-empty" aria-labelledby="classes-empty-title">
          <h2 id="classes-empty-title">
            {classes.length ? tr("Class not found", "Klasse nicht gefunden") : tr("No classes available", "Keine Klassen verfügbar")}
          </h2>
          <p>
            {classes.length
              ? tr("Choose a class below to view its students.", "Wählen Sie unten eine Klasse aus, um ihre Schüler anzuzeigen.")
              : tr("Your classes will appear here when they are available.", "Ihre Klassen erscheinen hier, sobald sie verfügbar sind.")}
          </p>
          {classes.length > 0 && <ClassSelector />}
        </section>
      )}
    </div>
  );
}

function ClassSelector({ selectedId = "" }) {
  const { lang, tr } = useLanguage();
  const { classes } = getTeacherData(lang);
  const navigate = useNavigate();
  return (
    <select id="teacher-class-select" className="classes-selector" aria-label={tr("Class", "Klasse")} value={selectedId}
      onChange={(event) => navigate(`/teacher/classes/${event.target.value}`)}>
      {!selectedId && <option value="" disabled>{tr("Select a class", "Klasse auswählen")}</option>}
      {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
    </select>
  );
}

function ClassRoster({ selected, roster }) {
  const { lang, tr } = useLanguage();
  const { classAnalysis } = getTeacherData(lang);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const query = search.trim().toLowerCase();
  const visible = roster.filter((student) => student.name.toLowerCase().includes(query));
  const analysis = classAnalysis[selected.id];
  const topics = analysis?.weaknesses;
  const percentage = (value) => (Number.isFinite(value) ? `${value}%` : tr("Not available", "Nicht verfügbar"));

  function clearSearch() {
    setSearch("");
    searchRef.current?.focus();
  }

  return (
    <>
      <p className="classes-practice"><strong>{tr("Topics needing practice:", "Themen mit Übungsbedarf:")} </strong>
        {topics?.length
          ? topics.join(" · ")
          : analysis
            ? tr("No practice topics recorded.", "Keine Übungsthemen erfasst.")
            : tr("Not available.", "Nicht verfügbar.")}
      </p>

      <div className="classes-search">
        <label htmlFor="classes-student-search">{tr("Search students", "Schüler suchen")}</label>
        <input ref={searchRef} id="classes-student-search" type="search" value={search}
          placeholder={tr("e.g. Omar", "z. B. Omar")} aria-describedby="classes-results"
          onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="classes-results">
        <p id="classes-results" role="status">
          {roster.length
            ? lang === "de"
              ? `${query ? `${visible.length} von ${roster.length}` : `Alle ${roster.length}`} Schüler angezeigt`
              : `Showing ${query ? `${visible.length} of ${roster.length}` : `all ${roster.length}`} ${roster.length === 1 ? "student" : "students"}`
            : tr("No students in this class", "Keine Schüler in dieser Klasse")}
        </p>
        <button type="button" onClick={clearSearch} disabled={!search}>{tr("Clear search", "Suche löschen")}</button>
      </div>

      <div className="classes-table-scroll" role="region" aria-label={tr(`${selected.name} student roster`, `${selected.name} Schülerliste`)} tabIndex={0}>
        <table>
          <caption className="classes-sr-only">
            {tr(
              `${selected.name} student attendance, overall grades, and individual details.`,
              `Anwesenheit, Gesamtnoten und Einzeldetails der Schüler von ${selected.name}.`,
            )}
          </caption>
          <thead>
            <tr>
              <th scope="col">{tr("Student", "Schüler")}</th>
              <th scope="col">{tr("Attendance", "Anwesenheit")}</th>
              <th scope="col">{tr("Overall grade", "Gesamtnote")}</th>
              <th scope="col">{tr("View student", "Schüler ansehen")}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length ? visible.map((student) => (
              <tr key={student.id}>
                <th scope="row">{student.name}</th>
                <td>{percentage(student.attendance)}</td>
                <td>{Number.isFinite(student.grade) ? `${letter(student.grade)} · ${student.grade}%` : tr("Not available", "Nicht verfügbar")}</td>
                <td><Link className="classes-student-link" to={`/teacher/classes/${selected.id}/students/${student.id}`}
                  aria-label={tr(`View student ${student.name}`, `Schüler ${student.name} ansehen`)}>{tr("View student", "Schüler ansehen")}</Link></td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="classes-empty">
                <h3>{roster.length ? tr("No matching students", "Keine passenden Schüler") : tr("No students in this class", "Keine Schüler in dieser Klasse")}</h3>
                <p>{roster.length ? tr("Try another name, or clear your search to see all students.", "Versuchen Sie einen anderen Namen oder löschen Sie Ihre Suche.") : tr("Choose another class to view its students.", "Wählen Sie eine andere Klasse aus, um ihre Schüler anzuzeigen.")}</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
