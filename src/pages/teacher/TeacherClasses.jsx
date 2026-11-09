import { useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { classes, classAnalysis, students } from "../../data/teacherData";
import "../../styles/teacher-classes.css";

const percentage = (value) => Number.isFinite(value) ? `${value}%` : "Not available";
const letter = (value) => value >= 90 ? "A" : value >= 80 ? "B" : value >= 70 ? "C" : value >= 60 ? "D" : "F";

export default function TeacherClasses() {
  const { classId } = useParams();
  const defaultClass = classes.find((item) => item.id === "5A") ?? classes[0];
  const selected = classes.find((item) => item.id === classId);
  const roster = students.filter((student) => student.classId === selected?.id);

  if (!classId && defaultClass) {
    return <Navigate to={`/teacher/classes/${defaultClass.id}`} replace />;
  }

  return (
    <div className="teacher-classes">
      <h1>Classes</h1>
      <p className="classes-sr-only" role="status">
        {selected ? `Showing ${selected.name} students.` : ""}
      </p>
      {selected ? (
        <section className="classes-board" aria-labelledby="classes-roster-title">
          <header className="classes-board-heading">
            <h2 id="classes-roster-title" className="classes-roster-heading" aria-label={`${selected.name} Students`}>
              <ClassSelector selectedId={selected.id} />
              <span>Students</span>
            </h2>
            <div className="classes-summary">
              <p>{roster.length} {roster.length === 1 ? "student" : "students"} in class</p>
              <p>Class average: {percentage(selected.average)}</p>
            </div>
          </header>
          <ClassRoster key={selected.id} selected={selected} roster={roster} />
        </section>
      ) : (
        <section className="classes-board classes-empty" aria-labelledby="classes-empty-title">
          <h2 id="classes-empty-title">{classes.length ? "Class not found" : "No classes available"}</h2>
          <p>{classes.length ? "Choose a class below to view its students." : "Your classes will appear here when they are available."}</p>
          {classes.length > 0 && <ClassSelector />}
        </section>
      )}
    </div>
  );
}

function ClassSelector({ selectedId = "" }) {
  const navigate = useNavigate();
  return (
    <select id="teacher-class-select" className="classes-selector" aria-label="Class" value={selectedId}
      onChange={(event) => navigate(`/teacher/classes/${event.target.value}`)}>
      {!selectedId && <option value="" disabled>Select a class</option>}
      {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
    </select>
  );
}

function ClassRoster({ selected, roster }) {
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const query = search.trim().toLowerCase();
  const visible = roster.filter((student) => student.name.toLowerCase().includes(query));
  const analysis = classAnalysis[selected.id];
  const topics = analysis?.weaknesses;

  function clearSearch() {
    setSearch("");
    searchRef.current?.focus();
  }

  return (
    <>
      <p className="classes-practice"><strong>Topics needing practice: </strong>
        {topics?.length ? topics.join(" · ") : analysis ? "No practice topics recorded." : "Not available."}
      </p>

      <div className="classes-search">
        <label htmlFor="classes-student-search">Search students</label>
        <input ref={searchRef} id="classes-student-search" type="search" value={search}
          placeholder="e.g. Omar" aria-describedby="classes-results"
          onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="classes-results">
        <p id="classes-results" role="status">
          {roster.length ? `Showing ${query ? `${visible.length} of ${roster.length}` : `all ${roster.length}`} ${roster.length === 1 ? "student" : "students"}` : "No students in this class"}
        </p>
        <button type="button" onClick={clearSearch} disabled={!search}>Clear search</button>
      </div>

      <div className="classes-table-scroll" role="region" aria-label={`${selected.name} student roster`} tabIndex={0}>
        <table>
          <caption className="classes-sr-only">{selected.name} student attendance, overall grades, and individual details.</caption>
          <thead>
            <tr><th scope="col">Student</th><th scope="col">Attendance</th><th scope="col">Overall grade</th><th scope="col">View student</th></tr>
          </thead>
          <tbody>
            {visible.length ? visible.map((student) => (
              <tr key={student.id}>
                <th scope="row">{student.name}</th>
                <td>{percentage(student.attendance)}</td>
                <td>{Number.isFinite(student.grade) ? `${letter(student.grade)} · ${student.grade}%` : "Not available"}</td>
                <td><Link className="classes-student-link" to={`/teacher/classes/${selected.id}/students/${student.id}`}
                  aria-label={`View student ${student.name}`}>View student</Link></td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="classes-empty">
                <h3>{roster.length ? "No matching students" : "No students in this class"}</h3>
                <p>{roster.length ? "Try another name, or clear your search to see all students." : "Choose another class to view its students."}</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
