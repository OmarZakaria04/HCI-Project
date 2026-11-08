import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classes, students } from "../../data/teacherData";
import "../../styles/teacher.css";

// Turn a percentage into a letter grade
const letter = (pct) => (pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F");

export default function TeacherClassDetails() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const cls = classes.find((c) => c.id === classId);

  if (!cls) {
    return (
      <div className="teacher-page">
        <h1 className="teacher-heading">Class not found</h1>
        <Link to="/teacher/classes" className="teacher-btn-outline">Back to classes</Link>
      </div>
    );
  }

  const roster = students.filter(
    (s) => s.classId === classId && s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="teacher-page">
      <div className="teacher-page-head">
        <h1 className="teacher-heading">{cls.name} Students</h1>
        <Link to="/teacher/classes" className="teacher-btn-outline">← Back</Link>
      </div>

      <section className="papers-board-card">
        <div className="papers-board-header">
          <div className="papers-board-title">
            <span>👩‍🎓</span>
            <span>My Students</span>
          </div>
          <div className="papers-stats-bar">
            <span className="papers-stat-chip">Students: {cls.students}</span>
            <span className="papers-stat-chip papers-stat-chip-done">Class average: {cls.average}%</span>
          </div>
        </div>

        <div className="papers-filters-bar">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a student..."
            className="papers-search-input"
          />
        </div>

        <div className="papers-table-container">
          <table className="papers-modern-table">
            <thead>
              <tr>
                <th style={{ width: "36%" }}>Student</th>
                <th style={{ width: "22%" }}>Attendance</th>
                <th style={{ width: "22%" }}>Overall Grade</th>
                <th style={{ width: "20%" }} className="text-right pr-4">Analytics</th>
              </tr>
            </thead>
            <tbody>
              {roster.length === 0 ? (
                <tr>
                  <td colSpan={4} className="papers-empty">No students found.</td>
                </tr>
              ) : (
                roster.map((s) => {
                  const initials = s.name.split(" ").map((w) => w[0]).join("");
                  const lowAttendance = s.attendance < 75;
                  const failing = s.grade < 60;

                  return (
                    <tr
                      key={s.id}
                      onClick={() => navigate(`/teacher/classes/${classId}/students/${s.id}`)}
                    >
                      <td>
                        <div className="papers-student-cell">
                          <div className="papers-avatar-mini">{initials}</div>
                          <span className="font-bold text-cream">{s.name}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`papers-status-badge ${
                            lowAttendance ? "papers-status-pending" : "papers-status-done"
                          }`}
                        >
                          {s.attendance}%
                        </span>
                      </td>
                      <td>
                        <span
                          className={`papers-status-badge ${
                            failing ? "papers-status-pending" : "papers-status-done"
                          }`}
                        >
                          {letter(s.grade)} · {s.grade}%
                        </span>
                      </td>
                      <td className="text-right pr-4">
                        <button type="button" className="papers-action-btn">
                          <span>View</span>
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