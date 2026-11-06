import { useState } from "react";
import { Link } from "react-router-dom";
import { papers } from "../../data/teacherData";
import "../../styles/teacher.css";

export default function TeacherPapers() {
  // One state object for all three dropdowns. "" means "no filter".
  const [filters, setFilters] = useState({ grade: "", classId: "", paper: "" });

  // Update one filter without touching the others
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Build dropdown options from the data. Set removes duplicates.
  const grades = [...new Set(papers.map((p) => p.grade))].sort();
  const classIds = [...new Set(papers.map((p) => p.classId))].sort();
  const paperNames = [...new Set(papers.map((p) => p.paper))].sort();

  // Keep a paper only if every filter is empty OR matches it
  const visible = papers.filter(
    (p) =>
      (filters.grade === "" || String(p.grade) === filters.grade) &&
      (filters.classId === "" || p.classId === filters.classId) &&
      (filters.paper === "" || p.paper === filters.paper)
  );

  return (
    <div className="teacher-page">
      <h1 className="teacher-heading">Papers</h1>

      <section className="dash-card">
        <div className="papers-filters">
          <select name="grade" value={filters.grade} onChange={handleChange} className="papers-select">
            <option value="">All grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>

          <select name="classId" value={filters.classId} onChange={handleChange} className="papers-select">
            <option value="">All classes</option>
            {classIds.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select name="paper" value={filters.paper} onChange={handleChange} className="papers-select">
            <option value="">All papers</option>
            {paperNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <ul className="papers-list">
          {visible.length === 0 && (
            <li className="papers-empty">No papers match these filters.</li>
          )}
          {visible.map((p) => (
            <li key={p.id}>
              <Link to={`/teacher/papers/${p.id}`} className="papers-row">
                <span className="papers-student">{p.student}</span>
                <span className="papers-meta">{p.paper} · {p.classId}</span>
                <span className="papers-meta">{p.submitted}</span>
                <span
                  className={
                    p.status === "Graded" ? "papers-badge-done" : "papers-badge-pending"
                  }
                >
                  {p.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}