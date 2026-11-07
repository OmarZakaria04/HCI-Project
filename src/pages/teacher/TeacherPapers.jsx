import { useState, useEffect } from "react";
import { papers as initialPapers, paperDetails } from "../../data/teacherData";
import "../../styles/teacher.css";

export default function TeacherPapers() {
  const [papersList, setPapersList] = useState(initialPapers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    grade: "",
    classId: "",
    paper: "",
    status: "",
  });

  const [activePaperForReview, setActivePaperForReview] = useState(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActivePaperForReview(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ grade: "", classId: "", paper: "", status: "" });
  };

  const grades = [...new Set(papersList.map((p) => p.grade))].sort();
  const classIds = [...new Set(papersList.map((p) => p.classId))].sort();
  const paperNames = [...new Set(papersList.map((p) => p.paper))].sort();

  // Filter criteria
  const visible = papersList.filter((p) => {
    const matchSearch =
      searchQuery === "" ||
      p.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.classId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = filters.grade === "" || String(p.grade) === filters.grade;
    const matchClass = filters.classId === "" || p.classId === filters.classId;
    const matchPaper = filters.paper === "" || p.paper === filters.paper;
    const matchStatus = filters.status === "" || p.status === filters.status;

    return matchSearch && matchGrade && matchClass && matchPaper && matchStatus;
  });

  const totalCount = papersList.length;
  const pendingCount = papersList.filter((p) => p.status === "Pending").length;
  const gradedCount = papersList.filter((p) => p.status === "Graded").length;

  const toggleGradeStatus = (paperId) => {
    setPapersList((prev) =>
      prev.map((p) => {
        if (p.id === paperId) {
          const newStatus = p.status === "Graded" ? "Pending" : "Graded";
          return { ...p, status: newStatus };
        }
        return p;
      })
    );

    if (activePaperForReview && activePaperForReview.id === paperId) {
      setActivePaperForReview((prev) => ({
        ...prev,
        status: prev.status === "Graded" ? "Pending" : "Graded",
      }));
    }
  };

  // Get details or fallback details for paper
  const getDetails = (paper) => {
    if (!paper) return null;
    return (
      paperDetails[paper.id] || {
        answers: [
          { q: 1, question: "Calculate 15 × 8 = ?", text: "120" },
          { q: 2, question: "Simplify the fraction 6/8.", text: "3/4" },
          { q: 3, question: "Convert 0.75 to a percentage.", text: "75%" },
        ],
        ai: {
          score: 3,
          total: 3,
          gaps: [],
          redFlags: [],
          feedback: "Great job! Accurate calculations across all problems.",
        },
      }
    );
  };

  const isFiltered =
    searchQuery !== "" ||
    filters.grade !== "" ||
    filters.classId !== "" ||
    filters.paper !== "" ||
    filters.status !== "";

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

      {/* Chalkboard Box: Green blackboard theme with warm beige/sand edges */}
      <section className="papers-board-card">
        {/* Board Header & Stats */}
        <div className="papers-board-header">
          <div className="papers-board-title">
            <span>📋</span>
            <span>Submissions Log</span>
          </div>

          <div className="papers-stats-bar">
            <span className="papers-stat-chip">
              Total: {totalCount}
            </span>
            <span className="papers-stat-chip papers-stat-chip-pending">
              ⏳ Pending: {pendingCount}
            </span>
            <span className="papers-stat-chip papers-stat-chip-done">
              ✓ Graded: {gradedCount}
            </span>
          </div>
        </div>

        {/* Modern & Simple Filters Bar */}
        <div className="papers-filters-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or class (e.g. Omar, 5A)..."
            className="papers-search-input"
          />

          <select
            name="grade"
            value={filters.grade}
            onChange={handleChange}
            className="papers-select-modern"
            aria-label="Filter by Grade"
          >
            <option value="">All Grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>

          <select
            name="classId"
            value={filters.classId}
            onChange={handleChange}
            className="papers-select-modern"
            aria-label="Filter by Class"
          >
            <option value="">All Classes</option>
            {classIds.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          <select
            name="paper"
            value={filters.paper}
            onChange={handleChange}
            className="papers-select-modern"
            aria-label="Filter by Paper"
          >
            <option value="">All Papers</option>
            {paperNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="papers-select-modern"
            aria-label="Filter by Status"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Graded">Graded</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="papers-reset-btn"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Modern Simple Table */}
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
                  const initials = p.student
                    .split(" ")
                    .map((w) => w[0])
                    .join("");
                  const isDone = p.status === "Graded";

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setActivePaperForReview(p)}
                      title="Click to view & grade paper"
                    >
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
                        <span
                          className={`papers-status-badge ${
                            isDone ? "papers-status-done" : "papers-status-pending"
                          }`}
                        >
                          <span>{isDone ? "✓" : "⏳"}</span>
                          <span>{p.status}</span>
                        </span>
                      </td>

                      <td className="text-right pr-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePaperForReview(p);
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

      {/* Paper Review Modal (Allows teacher to inspect answers and toggle grade status) */}
      {activePaperForReview && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActivePaperForReview(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#183126] border-2 border-sand/70 rounded-2xl shadow-2xl max-w-xl w-full p-6 text-cream space-y-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-sand/30 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-cream">
                    {activePaperForReview.paper} Submission
                  </h3>
                  <span
                    className={`papers-status-badge ${
                      activePaperForReview.status === "Graded"
                        ? "papers-status-done"
                        : "papers-status-pending"
                    }`}
                  >
                    {activePaperForReview.status}
                  </span>
                </div>
                <p className="text-xs text-sand mt-0.5">
                  Student: <strong>{activePaperForReview.student}</strong> · Class {activePaperForReview.classId} (Grade {activePaperForReview.grade})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePaperForReview(null)}
                className="w-8 h-8 rounded-full bg-cream/10 text-cream flex items-center justify-center hover:bg-cream/20 text-sm font-bold cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* AI & Submission Summary */}
              {(() => {
                const details = getDetails(activePaperForReview);
                if (!details) return null;

                return (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-cream/10 border border-sand/30">
                        <span className="block text-[10px] uppercase font-bold text-sand/80">
                          AI Suggested Score
                        </span>
                        <span className="text-lg font-extrabold text-cream">
                          {details.ai.score} / {details.ai.total} (
                          {Math.round((details.ai.score / details.ai.total) * 100)}%)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-cream/10 border border-sand/30">
                        <span className="block text-[10px] uppercase font-bold text-sand/80">
                          Submission Timestamp
                        </span>
                        <span className="text-xs font-semibold text-cream">
                          {activePaperForReview.submitted}
                        </span>
                      </div>
                    </div>

                    {/* Gaps / Red Flags */}
                    {details.ai.gaps?.length > 0 && (
                      <div className="p-3 rounded-xl bg-sand/20 border border-sand/40">
                        <span className="font-bold text-sand block mb-1">
                          Learning Gaps Detected:
                        </span>
                        <ul className="list-disc pl-4 space-y-0.5 text-cream/90">
                          {details.ai.gaps.map((gap, i) => (
                            <li key={i}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Feedback */}
                    <div className="p-3 rounded-xl bg-sage/20 border border-sage/40">
                      <span className="font-bold text-cream block mb-1">
                        Teacher Feedback Recommendation:
                      </span>
                      <p className="text-cream/90 italic">
                        "{details.ai.feedback}"
                      </p>
                    </div>

                    {/* Answers Breakdown */}
                    <div>
                      <h4 className="font-bold text-sand mb-2 text-xs uppercase tracking-wider">
                        Submitted Question Answers:
                      </h4>
                      <div className="space-y-2">
                        {details.answers?.map((ans) => (
                          <div
                            key={ans.q}
                            className="p-3 rounded-xl bg-cream/5 border border-sand/20 flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-sand mr-2">
                                Q{ans.q}:
                              </span>
                              <span className="text-cream">{ans.question}</span>
                            </div>
                            <span className="font-mono bg-cream/15 px-2.5 py-1 rounded-md text-xs font-bold text-sand">
                              {ans.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-sand/30 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleGradeStatus(activePaperForReview.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  activePaperForReview.status === "Graded"
                    ? "bg-sand/30 hover:bg-sand/50 text-sand border border-sand/50"
                    : "bg-sage hover:bg-sage/80 text-cream"
                }`}
              >
                {activePaperForReview.status === "Graded"
                  ? "Mark as Pending Review"
                  : "✓ Approve & Mark as Graded"}
              </button>

              <button
                type="button"
                onClick={() => setActivePaperForReview(null)}
                className="px-4 py-2 rounded-xl bg-cream/10 hover:bg-cream/20 text-cream font-bold text-xs transition-colors cursor-pointer"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
