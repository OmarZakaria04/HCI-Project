import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { papers } from "../../data/teacherData";
import "../../styles/teacher.css";

export default function TeacherPapers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    grade: "",
    classId: "",
    paper: "",
    status: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ grade: "", classId: "", paper: "", status: "" });
  };

  const grades = [...new Set(papers.map((p) => p.grade))].sort();
  const classIds = [...new Set(papers.map((p) => p.classId))].sort();
  const paperNames = [...new Set(papers.map((p) => p.paper))].sort();

  const visible = papers.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      q === "" || p.student.toLowerCase().includes(q) || p.classId.toLowerCase().includes(q);
    const matchGrade = filters.grade === "" || String(p.grade) === filters.grade;
    const matchClass = filters.classId === "" || p.classId === filters.classId;
    const matchPaper = filters.paper === "" || p.paper === filters.paper;
    const matchStatus = filters.status === "" || p.status === filters.status;

    return matchSearch && matchGrade && matchClass && matchPaper && matchStatus;
  });

  const totalCount = papers.length;
  const pendingCount = papers.filter((p) => p.status === "Pending").length;
  const gradedCount = papers.filter((p) => p.status === "Graded").length;

  const isFiltered =
    searchQuery !== "" ||
    filters.grade !== "" ||
    filters.classId !== "" ||
    filters.paper !== "" ||
    filters.status !== "";

  const openPaper = (id) => navigate(`/teacher/papers/${id}`);

  return (
    <div className="teacher-page">
      <div className="teacher-page-head">
        <div>
          <h1 className="teacher-heading">Papers & Submissions</h1>
          <p className="text-xs text-forest/70 mt-1">
            Review student homework, quiz papers, AI analysis, and grade assessments.
          </p>
        </div>
      </div>

      <section className="papers-board-card">
        <div className="papers-board-header">
          <div className="papers-board-title">
            <span>📋</span>
            <span>Submissions Log</span>
          </div>

          <div className="papers-stats-bar">
            <span className="papers-stat-chip">Total: {totalCount}</span>
            <span className="papers-stat-chip papers-stat-chip-pending">⏳ Pending: {pendingCount}</span>
            <span className="papers-stat-chip papers-stat-chip-done">✓ Graded: {gradedCount}</span>
          </div>
        </div>

        <div className="papers-filters-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or class (e.g. Omar, 5A)..."
            className="papers-search-input"
          />

          <select name="grade" value={filters.grade} onChange={handleChange} className="papers-select-modern" aria-label="Filter by Grade">
            <option value="">All Grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>

          <select name="classId" value={filters.classId} onChange={handleChange} className="papers-select-modern" aria-label="Filter by Class">
            <option value="">All Classes</option>
            {classIds.map((c) => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>

          <select name="paper" value={filters.paper} onChange={handleChange} className="papers-select-modern" aria-label="Filter by Paper">
            <option value="">All Papers</option>
            {paperNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <select name="status" value={filters.status} onChange={handleChange} className="papers-select-modern" aria-label="Filter by Status">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Graded">Graded</option>
          </select>

          {isFiltered && (
            <button type="button" onClick={resetFilters} className="papers-reset-btn">
              Reset Filters
            </button>
          )}
        </div>

        <div className="papers-table-container">
          <table className="papers-modern-table">
            <thead>
              <tr>
                <th style={{ width: "26%" }}>Student</th>
                <th style={{ width: "16%" }}>Paper</th>
                <th style={{ width: "16%" }}>Class & Grade</th>
                <th style={{ width: "22%" }}>Submitted</th>
                <th style={{ width: "12%" }}>Status</th>
                <th style={{ width: "8%" }} className="text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="papers-empty">
                    No submissions match your filters.{" "}
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="underline text-sand font-bold cursor-pointer"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                visible.map((p) => {
                  const initials = p.student.split(" ").map((w) => w[0]).join("");
                  const isDone = p.status === "Graded";

                  return (
                    <tr key={p.id} onClick={() => openPaper(p.id)} title="Click to view & grade paper">
                      <td>
                        <div className="papers-student-cell">
                          <div className="papers-avatar-mini">{initials}</div>
                          <span className="font-bold text-cream">{p.student}</span>
                        </div>
                      </td>

                      <td>
                        <span className="papers-paper-tag">{p.paper}</span>
                      </td>

                      <td>
                        <span className="papers-class-badge">
                          {p.classId} · Grade {p.grade}
                        </span>
                      </td>

                      <td>
                        <span className="text-cream/75 text-[11px]">{p.submitted}</span>
                      </td>

                      <td>
                        <span className={`papers-status-badge ${isDone ? "papers-status-done" : "papers-status-pending"}`}>
                          <span>{isDone ? "✓" : "⏳"}</span>
                          <span>{p.status}</span>
                        </span>
                      </td>

                      <td className="text-right pr-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPaper(p.id);
                          }}
                          className="papers-action-btn"
                        >
                          <span>Review</span>
                          <span>→</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}