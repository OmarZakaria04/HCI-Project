import { useState, useEffect } from "react";
import Header from "../../components/Header";
import ParentChildBar from "../../components/ParentChildBar";
import RadarChart from "../../components/RadarChart";
import Toast from "../../components/Toast";
import { parentData } from "../../data/parentData";
import "../../styles/parent.css";

// Quick suggestion chips for Exam Ticket Reason (Nielsen H6 Recognition over Recall)
const REASON_SUGGESTIONS = [
  "Review calculation mistakes over the weekend",
  "Prepare for upcoming semester cumulative final",
  "Clarify multi-step proof grading with child",
  "Target specific weaknesses in problem solving",
];

export default function ParentGrades() {
  const [activeChildId, setActiveChildId] = useState(() => {
    return localStorage.getItem("parent_active_child") || "ahmed";
  });

  const handleSelectChild = (id) => {
    setActiveChildId(id);
    localStorage.setItem("parent_active_child", id);
  };

  const child =
    parentData.children.find((c) => c.id === activeChildId) ||
    parentData.children[0];

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "history" | "exams"
  const [selectedSubjectId, setSelectedSubjectId] = useState("math");
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  // Nielsen H1 (Status) & H3 (Toast)
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // P4 Ticket State
  const [examTickets, setExamTickets] = useState(child.examTickets || []);
  const [selectedExamForReview, setSelectedExamForReview] = useState(null);
  const [requestTicketModalExam, setRequestTicketModalExam] = useState(null);
  const [ticketReason, setTicketReason] = useState("");

  const selectedSubject =
    child.subjects.find((s) => s.id === selectedSubjectId) ||
    child.subjects[0];

  const subjectIndex = child.subjects.findIndex(
    (s) => s.id === selectedSubject.id
  );

  const prevSubject = () => {
    const prevIdx =
      subjectIndex === 0 ? child.subjects.length - 1 : subjectIndex - 1;
    setSelectedSubjectId(child.subjects[prevIdx].id);
  };

  const nextSubject = () => {
    const nextIdx =
      subjectIndex === child.subjects.length - 1 ? 0 : subjectIndex + 1;
    setSelectedSubjectId(child.subjects[nextIdx].id);
  };

  // Keyboard navigation for modals (KLM Efficiency Item 8 & Nielsen H3 Freedom)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowReportCardModal(false);
        setRequestTicketModalExam(null);
        setSelectedExamForReview(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Async submit ticket with progress spinner (Nielsen H1 Status)
  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!requestTicketModalExam) return;

    setIsSubmittingTicket(true);

    setTimeout(() => {
      setExamTickets((prev) =>
        prev.map((t) =>
          t.id === requestTicketModalExam.id
            ? {
                ...t,
                status: "Pending Approval",
                requestDate: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                teacherNote: "Request submitted to teacher. Awaiting review.",
              }
            : t
        )
      );

      setIsSubmittingTicket(false);
      setToastMessage(
        `Ticket submitted to ${requestTicketModalExam.teacher} for ${requestTicketModalExam.examTitle}.`
      );
      setRequestTicketModalExam(null);
      setTicketReason("");
    }, 600);
  };

  // Async Print / PDF Download with spinner (Nielsen H1 Status)
  const handlePrint = () => {
    setIsDownloadingPdf(true);
    setTimeout(() => {
      setIsDownloadingPdf(false);
      window.print();
    }, 400);
  };

  return (
    <div className="parent-page-wrapper">
      <Header role="parent" />
      <ParentChildBar
        activeChildId={activeChildId}
        onSelectChild={handleSelectChild}
        showBack={true}
        backTo="/parent"
        breadcrumbText="Grades & Assessments"
      />

      <main className="parent-container">
        {/* Wireframe Hero Banner (Item 1: Core Action Identified) */}
        <section className="wireframe-hero">
          <h2 className="wireframe-hero-title">Academic Assessment Hub</h2>
          <p className="wireframe-hero-subtitle">
            Verified report cards, multi-term progress comparison, and graded exam review for{" "}
            <strong>{child.name}</strong> ({child.grade})
          </p>
        </section>

        {/* Navigation Tabs for P2, P3, P4 */}
        <div
          className="flex border-b border-sand/40 gap-2 sm:gap-3 overflow-x-auto pb-1"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            className={`h-9 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sand ${
              activeTab === "overview"
                ? "bg-forest text-cream shadow-xs"
                : "bg-white text-forest/75 hover:bg-sand/20"
            }`}
          >
            <span>📜</span>
            <span>Current Report Card (P2)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            className={`h-9 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sand ${
              activeTab === "history"
                ? "bg-forest text-cream shadow-xs"
                : "bg-white text-forest/75 hover:bg-sand/20"
            }`}
          >
            <span>📈</span>
            <span>Progress History (P3)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "exams"}
            onClick={() => setActiveTab("exams")}
            className={`h-9 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sand ${
              activeTab === "exams"
                ? "bg-forest text-cream shadow-xs"
                : "bg-white text-forest/75 hover:bg-sand/20"
            }`}
          >
            <span>📝</span>
            <span>Exam Paper Tickets ({examTickets.length}) (P4)</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: P2. Current Report Cards & Subject Wireframe
        ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* P2 Report Card Section */}
            <section className="parent-card">
              <div className="parent-card-header">
                <div>
                  <h3 className="parent-card-title">Official Term Report Card</h3>
                  <p className="text-[11px] text-forest/70 mt-0.5">
                    {child.reportCard.term}
                  </p>
                </div>
                <div className="verified-review-badge">
                  <span>✓</span>
                  <span>
                    {child.reportCard.status} ({child.reportCard.confirmationDate})
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-sand/20 border border-sand/40">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-forest">
                    Confirmed Academic Record
                  </h4>
                  <p className="text-xs text-forest/80">
                    Cumulative GPA:{" "}
                    <span className="font-extrabold text-forest">
                      {child.reportCard.cumulativeGpa}
                    </span>{" "}
                    • Attendance:{" "}
                    <span className="font-extrabold text-forest">
                      {child.reportCard.attendancePercentage}
                    </span>{" "}
                    • Conduct:{" "}
                    <span className="font-extrabold text-forest">
                      {child.reportCard.conduct}
                    </span>
                  </p>
                  <p className="text-[10px] text-forest/60 italic">
                    Certified by: {child.reportCard.confirmedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowReportCardModal(true)}
                    className="btn-primary flex-1 sm:flex-none"
                  >
                    <span>View Full Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    disabled={isDownloadingPdf}
                    className="btn-secondary flex-1 sm:flex-none"
                  >
                    {isDownloadingPdf ? (
                      <>
                        <span className="loading-spinner" />
                        <span>Preparing PDF...</span>
                      </>
                    ) : (
                      <>
                        <span>🖨️</span>
                        <span>Print / PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Wireframe Subject Carousel */}
            <section className="parent-card">
              <div className="parent-card-header">
                <h3 className="parent-card-title">Subject's Grades</h3>
                <span className="text-xs text-forest/70">
                  Select a subject to inspect evaluation breakdown
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 py-2">
                <button
                  type="button"
                  onClick={prevSubject}
                  className="carousel-arrow-btn"
                  title="Previous Subject"
                  aria-label="Previous Subject"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {child.subjects.map((sub) => {
                    const isSelected = sub.id === selectedSubject.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubjectId(sub.id)}
                        className={`subject-pill-btn ${
                          isSelected
                            ? "subject-pill-btn-active"
                            : "subject-pill-btn-inactive"
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={nextSubject}
                  className="carousel-arrow-btn"
                  title="Next Subject"
                  aria-label="Next Subject"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </section>

            {/* Wireframe Subject Header */}
            <section className="wireframe-hero">
              <h2 className="wireframe-hero-title">{selectedSubject.name}</h2>
              <p className="wireframe-hero-subtitle">
                Teacher: {selectedSubject.teacher} • Current Standing:{" "}
                {selectedSubject.lastGrade}
              </p>
            </section>

            {/* Wireframe Evaluation Table */}
            <section className="parent-card">
              <div className="parent-card-header">
                <h3 className="parent-card-title">Grades</h3>
                <span className="text-xs font-semibold text-sage">
                  Teacher Verified Class Records
                </span>
              </div>

              <div className="grades-table-wrap">
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Evaluation</th>
                      <th>Assignment</th>
                      <th>Quiz</th>
                      <th>Class Work</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSubject.gradesTable.map((row) => (
                      <tr key={row.id}>
                        <td className="font-bold text-forest/70">Set #{row.id}</td>
                        <td>{row.assignment}</td>
                        <td>{row.quiz}</td>
                        <td>{row.classWork}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Wireframe Subject Analysis */}
            <section className="parent-card">
              <div className="parent-card-header">
                <h3 className="parent-card-title">Subject Analysis</h3>
                <span className="text-xs font-bold text-forest bg-sage/20 px-2.5 py-1 rounded-full">
                  Individual Assessment
                </span>
              </div>

              <div className="analysis-layout">
                <div className="analysis-info">
                  <div>
                    <h4 className="analysis-label">Teacher Observations:</h4>
                    <ul className="analysis-list mt-2">
                      {selectedSubject.analysis.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="analysis-label">Key Takeaways:</h4>
                    <div className="analysis-takeaway-box mt-1.5">
                      {selectedSubject.analysis.keyTakeaways}
                    </div>
                  </div>
                </div>

                <div className="analysis-chart-col">
                  <RadarChart
                    data={selectedSubject.analysis.radarValues}
                    size={210}
                  />
                  <span className="chart-title-caption">Metrics Graph</span>
                  <div className="chart-highlight-pill">
                    ⭐ Excellent work:{" "}
                    <span className="font-extrabold text-forest">
                      {selectedSubject.analysis.excellentWork}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================
            TAB 2: P3. Progress History & Comparisons
        ======================================================== */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <section className="parent-card">
              <div className="parent-card-header">
                <div>
                  <h3 className="parent-card-title">Progress Comparison</h3>
                  <p className="text-[11px] text-forest/70 mt-0.5">
                    Compare previous grades to see what has improved and what needs attention
                  </p>
                </div>
                <span className="text-xs font-bold text-forest bg-sand/30 px-3 py-1 rounded-full">
                  Historical Records
                </span>
              </div>

              <div className="comparison-table-wrap">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th className="text-left pl-4">Subject</th>
                      <th>Previous Year</th>
                      <th>Midterm</th>
                      <th>Current Term</th>
                      <th>Growth</th>
                      <th className="text-left pl-4">Teacher Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {child.progressHistory.comparisons.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-left pl-4 font-bold text-forest">
                          {item.subject}
                        </td>
                        <td>{item.previous}%</td>
                        <td>{item.midterm}%</td>
                        <td className="font-bold text-forest">{item.current}%</td>
                        <td>
                          <span className="trend-badge-up">
                            <span>▲</span>
                            <span>{item.change}</span>
                          </span>
                        </td>
                        <td className="text-left pl-4 text-forest/75 text-[11px]">
                          {item.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* What Improved vs What Still Needs Work (P3 Core) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="parent-card">
                <h4 className="text-xs font-extrabold text-forest uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="text-green-800">📈</span>
                  <span>What Has Improved</span>
                </h4>
                <ul className="space-y-2.5">
                  {child.progressHistory.improvements.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-sage/15 border border-sage/30 text-xs font-semibold text-forest leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-green-800 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="parent-card">
                <h4 className="text-xs font-extrabold text-forest uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="text-sand font-black">🎯</span>
                  <span>What Still Needs Work</span>
                </h4>
                <ul className="space-y-2.5">
                  {child.progressHistory.areasNeedingWork.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-sand/20 border border-sand/40 text-xs font-semibold text-forest leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-sand font-black">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: P4. Graded Exam & Quiz Tickets
        ======================================================== */}
        {activeTab === "exams" && (
          <div className="space-y-6">
            <section className="parent-card">
              <div className="parent-card-header">
                <div>
                  <h3 className="parent-card-title">Exam & Quiz Access Tickets</h3>
                  <p className="text-[11px] text-forest/70 mt-0.5">
                    Submit a ticket to view graded exam booklets, questions, mistakes, and teacher comments
                  </p>
                </div>
                <span className="text-xs font-bold text-forest bg-sage/20 px-3 py-1 rounded-full">
                  Confidential Verification
                </span>
              </div>

              <div className="space-y-3">
                {examTickets.map((ticket) => {
                  const isApproved = ticket.status === "Approved";
                  const isPending = ticket.status === "Pending Approval";

                  return (
                    <div key={ticket.id} className="ticket-row-card">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-forest">
                            {ticket.examTitle}
                          </h4>
                          <span
                            className={`ticket-status-badge ${
                              isApproved
                                ? "ticket-status-approved"
                                : isPending
                                ? "ticket-status-pending"
                                : "ticket-status-none"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-xs text-forest/80">
                          {ticket.subject} • Teacher:{" "}
                          <span className="font-semibold">{ticket.teacher}</span>{" "}
                          • Exam Date: {ticket.examDate} • Score:{" "}
                          <span className="font-bold text-forest">
                            {ticket.score}
                          </span>
                        </p>
                        <p className="text-[11px] text-forest/65 italic">
                          Teacher Status Note: "{ticket.teacherNote}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {isApproved ? (
                          <button
                            type="button"
                            onClick={() => setSelectedExamForReview(ticket)}
                            className="btn-primary w-full sm:w-auto"
                          >
                            <span>🔍</span>
                            <span>View Graded Paper</span>
                          </button>
                        ) : isPending ? (
                          <span className="w-full sm:w-auto text-center px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
                            Ticket Under Teacher Review
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRequestTicketModalExam(ticket)}
                            className="btn-secondary w-full sm:w-auto"
                          >
                            <span>Submit View Ticket</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: P2. Official Report Card Modal
      ======================================================== */}
      {showReportCardModal && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowReportCardModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl border border-sand/50 shadow-2xl max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-sand/30 pb-3">
              <div>
                <h3 className="text-base font-bold text-forest">
                  Official Academic Report Card
                </h3>
                <p className="text-xs text-forest/70">
                  {child.name} • {child.grade}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReportCardModal(false)}
                className="w-8 h-8 rounded-full bg-cream text-forest flex items-center justify-center font-bold text-sm hover:bg-sand/30 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-sage/10 border border-sage/30 text-xs">
              <span className="font-bold text-forest">Status: </span>
              <span className="text-forest/80">
                {child.reportCard.status} ({child.reportCard.confirmationDate})
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sand/30 text-forest/75">
                    <th className="py-1">Subject</th>
                    <th className="py-1 text-center">Credits</th>
                    <th className="py-1 text-center">Score</th>
                    <th className="py-1 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {child.reportCard.subjects.map((sub, idx) => (
                    <tr key={idx} className="border-b border-sand/15">
                      <td className="py-2 font-semibold text-forest">
                        {sub.name}
                        <span className="block text-[10px] text-forest/60">
                          {sub.teacher}
                        </span>
                      </td>
                      <td className="py-2 text-center">{sub.credits}</td>
                      <td className="py-2 text-center font-bold">{sub.grade}</td>
                      <td className="py-2 text-right font-extrabold text-forest">
                        {sub.letter}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-3 border-t border-sand/30 flex justify-between font-bold text-forest text-sm">
                <span>Cumulative GPA:</span>
                <span>{child.reportCard.cumulativeGpa}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowReportCardModal(false)}
                className="btn-ghost"
              >
                Close (Esc)
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="btn-primary"
              >
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: P4. Request View Ticket Modal (With Recognition Suggestions)
      ======================================================== */}
      {requestTicketModalExam && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setRequestTicketModalExam(null)}
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleSubmitTicket}
            className="bg-white rounded-2xl border border-sand/50 shadow-2xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-sand/30 pb-3">
              <div>
                <h3 className="text-sm font-bold text-forest">
                  Request Exam Access Ticket
                </h3>
                <p className="text-xs text-forest/70">
                  {requestTicketModalExam.examTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRequestTicketModalExam(null)}
                className="w-8 h-8 rounded-full bg-cream text-forest flex items-center justify-center font-bold text-sm hover:bg-sand/30 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-sand/20 border border-sand/30">
                <p>
                  <strong>Recipient:</strong> {requestTicketModalExam.teacher} (
                  {requestTicketModalExam.subject})
                </p>
                <p className="mt-1">
                  <strong>Exam Date:</strong> {requestTicketModalExam.examDate}
                </p>
              </div>

              {/* Nielsen H6: Recognition Suggestions */}
              <div>
                <label className="block font-bold text-forest mb-1.5">
                  Suggested Reasons (Click to apply):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REASON_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setTicketReason(sug)}
                      className={`suggestion-chip ${
                        ticketReason === sug ? "suggestion-chip-active" : ""
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="ticket-reason-input" className="block font-bold text-forest mb-1">
                  Or write specific note to teacher:
                </label>
                <textarea
                  id="ticket-reason-input"
                  autoFocus
                  value={ticketReason}
                  onChange={(e) => setTicketReason(e.target.value)}
                  placeholder="e.g. Would like to review mistakes with Ahmed over the weekend..."
                  rows={3}
                  className="w-full rounded-xl bg-cream/40 border border-sand/40 p-3 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-sand"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRequestTicketModalExam(null)}
                className="btn-ghost"
              >
                Cancel (Esc)
              </button>
              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="btn-primary"
              >
                {isSubmittingTicket ? (
                  <>
                    <span className="loading-spinner" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <span>Submit Ticket</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          MODAL 3: P4. Graded Exam Paper Viewer
      ======================================================== */}
      {selectedExamForReview && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedExamForReview(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl border border-sand/50 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-sand/30 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-forest">
                    {selectedExamForReview.examTitle}
                  </h3>
                  <span className="ticket-status-badge ticket-status-approved">
                    Teacher Approved
                  </span>
                </div>
                <p className="text-xs text-forest/70">
                  {selectedExamForReview.subject} • Scored:{" "}
                  <span className="font-bold text-forest">
                    {selectedExamForReview.score}
                  </span>{" "}
                  • Reviewed by {selectedExamForReview.teacher}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExamForReview(null)}
                className="w-8 h-8 rounded-full bg-cream text-forest flex items-center justify-center font-bold text-sm hover:bg-sand/30 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-sage/15 border border-sage/40 text-xs">
              <span className="font-bold text-forest">Teacher Annotation: </span>
              <span className="text-forest/80 italic">
                "{selectedExamForReview.teacherNote}"
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedExamForReview.questions?.map((q) => (
                <div
                  key={q.num}
                  className={`question-review-card ${
                    q.isCorrect
                      ? "question-review-correct"
                      : "question-review-mistake"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-forest">
                      Question #{q.num}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        q.isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {q.isCorrect ? `Correct (${q.points})` : `Mistake (${q.points})`}
                    </span>
                  </div>

                  <p className="text-xs text-forest font-medium">{q.prompt}</p>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-white/80 border border-sand/30">
                      <span className="block font-bold text-forest/70">
                        Ahmed's Answer:
                      </span>
                      <span
                        className={
                          q.isCorrect
                            ? "text-forest font-semibold"
                            : "text-red-700 font-semibold"
                        }
                      >
                        {q.studentAnswer}
                      </span>
                    </div>

                    {!q.isCorrect && (
                      <div className="p-2 rounded-lg bg-white/80 border border-sand/30">
                        <span className="block font-bold text-green-800">
                          Correct Solution:
                        </span>
                        <span className="text-forest font-semibold">
                          {q.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 p-2 rounded-lg bg-sand/15 text-[11px] text-forest/90">
                    <span className="font-bold">Teacher Feedback: </span>
                    <span>{q.feedback}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-sand/20">
              <button
                type="button"
                onClick={() => setSelectedExamForReview(null)}
                className="btn-primary"
              >
                Close Exam Paper (Esc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nielsen H1 & H3 Toast Notice */}
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
