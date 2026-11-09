import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { papers } from "../../data/teacherData";
import submissionDate from "../../utils/submissionDate";
import "../../styles/teacher-papers.css";

export default function TeacherPapers() {
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ grade: "", classId: "", paper: "", status: "" });

  const handleChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ grade: "", classId: "", paper: "", status: "" });
    searchRef.current?.focus();
  };

  const grades = [...new Set(papers.map((paper) => paper.grade))].sort();
  const classIds = [...new Set(papers.map((paper) => paper.classId))].sort();
  const paperNames = [...new Set(papers.map((paper) => paper.paper))].sort();
  const query = searchQuery.trim().toLowerCase();
  const visible = papers.filter((paper) => (
    (!query || paper.student.toLowerCase().includes(query) || paper.classId.toLowerCase().includes(query)) &&
    (!filters.grade || String(paper.grade) === filters.grade) &&
    (!filters.classId || paper.classId === filters.classId) &&
    (!filters.paper || paper.paper === filters.paper) &&
    (!filters.status || paper.status === filters.status)
  ));
  const pendingCount = papers.filter((paper) => paper.status === "Pending").length;
  const gradedCount = papers.filter((paper) => paper.status === "Graded").length;
  const isFiltered = searchQuery !== "" || Object.values(filters).some(Boolean);

  return (
    <div className="teacher-papers">
      <header className="papers-intro">
        <h1>Papers &amp; submissions</h1>
        <p>Review submitted work and check extracted answers before grading.</p>
      </header>

      <section className="papers-board" aria-labelledby="papers-title">
        <header className="papers-board-heading">
          <h2 id="papers-title">Submissions</h2>
          <p>{papers.length} total <span aria-hidden="true">·</span> {pendingCount} pending <span aria-hidden="true">·</span> {gradedCount} graded</p>
        </header>

        <div className="papers-filter-grid">
          <label className="papers-search">
            <span>Search students or classes</span>
            <input ref={searchRef} type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="e.g. Omar or 5A" />
          </label>
          <label>
            <span>Grade</span>
            <select name="grade" value={filters.grade} onChange={handleChange}>
              <option value="">All grades</option>
              {grades.map((grade) => <option key={grade} value={grade}>Grade {grade}</option>)}
            </select>
          </label>
          <label>
            <span>Class</span>
            <select name="classId" value={filters.classId} onChange={handleChange}>
              <option value="">All classes</option>
              {classIds.map((classId) => <option key={classId} value={classId}>{classId}</option>)}
            </select>
          </label>
          <label>
            <span>Paper</span>
            <select name="paper" value={filters.paper} onChange={handleChange}>
              <option value="">All papers</option>
              {paperNames.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select name="status" value={filters.status} onChange={handleChange}>
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Graded">Graded</option>
            </select>
          </label>
        </div>

        <div className="papers-results">
          <p role="status">Showing {visible.length} of {papers.length} submissions</p>
          <button type="button" onClick={resetFilters} disabled={!isFiltered}>Clear filters</button>
        </div>

        <div className="papers-table-scroll" role="region" aria-label="Student submissions" tabIndex={0}>
          <table>
            <caption className="papers-sr-only">Student submissions with papers, classes, submission dates, review status, and review links.</caption>
            <thead>
              <tr>
                <th scope="col">Student</th>
                <th scope="col">Paper</th>
                <th scope="col">Class</th>
                <th scope="col">Submitted</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="papers-sr-only">Review submission</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.length ? visible.map((paper) => {
                const date = submissionDate(paper.submitted);
                return (
                  <tr key={paper.id}>
                    <th scope="row">{paper.student}</th>
                    <td>{paper.paper}</td>
                    <td>{paper.classId}<span className="papers-secondary">Grade {paper.grade}</span></td>
                    <td>{date ? <time dateTime={date.iso}>{date.dayLabel}<span className="papers-secondary">{date.timeLabel}</span></time> : paper.submitted}</td>
                    <td><span className={paper.status === "Pending" ? "papers-pending" : ""}>{paper.status}</span></td>
                    <td><Link className="papers-review-link" to={`/teacher/papers/${paper.id}`} aria-label={`Review ${paper.paper} from ${paper.student}`}>Review</Link></td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="papers-empty-state">
                    <h3>{papers.length ? "No matching submissions" : "No submissions yet"}</h3>
                    <p>{papers.length ? "Try another student or class, or clear your filters." : "Student work will appear here when it is available."}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
