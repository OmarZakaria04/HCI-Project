import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import { studentData } from "../../data/studentData";
import {
  GradesIcon,
  ReportCardIcon,
  HomeworkIcon,
  ScienceIcon,
  MathIcon,
  EnglishIcon,
  PrinterIcon,
  CheckIcon,
} from "../../components/StudentIcons";
import "../../styles/student.css";

export default function StudentGrades() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  // Selected subject index in carousel (0: Science, 1: Math, 2: English)
  const initialIndex = subjectId
    ? studentData.subjects.findIndex((s) => s.id === subjectId.toLowerCase())
    : 0;
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  // Drilldown state: when true, renders the detailed matrix view for that subject (Wireframe Screen 5)
  const [isDetailView, setIsDetailView] = useState(Boolean(subjectId));

  const currentSubject = studentData.subjects[selectedSubjectIndex] || studentData.subjects[0];

  // Modals & toast states
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [toastMessage, setToastMessage] = useState(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleDownloadReport = () => {
    setToastMessage("Downloading Term 1 Official Report Card (PDF)...");
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleViewReport = () => {
    setIsReportModalOpen(true);
  };

  const handleOpenSubjectDetail = (idx) => {
    setSelectedSubjectIndex(idx);
    setIsDetailView(true);
  };

  return (
    <div className="student-page-wrapper">
      <Header role="student" />

      <main className="student-container">
        {/* ============================================================ */}
        {/* VIEW A: Detailed Subject Matrix (Screen 5 - Science History) */}
        {/* Reached directly from clicking a subject, no redundant header button! */}
        {/* ============================================================ */}
        {isDetailView ? (
          <div className="space-y-6">
            {/* Hero Card: Subject Name (e.g. Science) */}
            <div className="wireframe-hero-card">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-2 shadow-2xs">
                {currentSubject.id === "science" && <ScienceIcon className="w-6 h-6 text-forest" />}
                {currentSubject.id === "math" && <MathIcon className="w-6 h-6 text-forest" />}
                {currentSubject.id === "english" && <EnglishIcon className="w-6 h-6 text-forest" />}
              </div>
              <h1 className="wireframe-hero-title">{currentSubject.name}</h1>
              <p className="wireframe-hero-subtitle">
                Subject Grade History • Taught by {currentSubject.teacher} • Overall: {currentSubject.overall} ({currentSubject.gradeLetter})
              </p>
            </div>

            {/* Matrix Table */}
            <div className="student-card space-y-4">
              <div className="student-card-header">
                <h2 className="student-card-title">
                  <GradesIcon className="w-5 h-5 text-forest" /> Subjects Grades History
                </h2>
                <button
                  type="button"
                  onClick={() => setIsDetailView(false)}
                  className="btn-ghost text-xs"
                >
                  ← Back to Overview
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-sand/40">
                <table className="grades-history-table">
                  <thead>
                    <tr>
                      <th className="grades-th w-14">#</th>
                      <th className="grades-th">Assignment</th>
                      <th className="grades-th">Quiz</th>
                      <th className="grades-th">Class Work</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubject.history.map((row) => (
                      <tr key={row.rowNumber} className="hover:bg-cream/40 transition-colors">
                        <td className="grades-td font-bold text-forest/70">{row.rowNumber}</td>
                        <td className="grades-td">
                          <span className="font-semibold text-forest">{row.assignment}</span>
                        </td>
                        <td className="grades-td">
                          <span className="font-semibold text-forest">{row.quiz}</span>
                        </td>
                        <td className="grades-td">
                          <span className="font-semibold text-forest">{row.classWork}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Assessment Breakdown Summary */}
              <div className="p-4 rounded-xl bg-cream/30 border border-sand/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-forest">Term 1 Assessment Weightage:</span>
                  <p className="text-forest/70 mt-0.5">
                    Assignments (40%) • Quizzes (35%) • Class Work & Lab Attendance (25%)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailView(false)}
                  className="btn-primary text-xs"
                >
                  Return to Overview
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW B: Grades Overview (Screen 2 - Grades-S)                */
          /* ============================================================ */
          <div className="space-y-6">
            {/* Hero Card: Grades */}
            <div className="wireframe-hero-card">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <GradesIcon className="w-6 h-6 text-forest" />
              </div>
              <h1 className="wireframe-hero-title">Grades</h1>
              <p className="wireframe-hero-subtitle">
                Official quarterly report cards & subject assessment ledger
              </p>
            </div>

            {/* Report Cards Section */}
            <div className="student-card space-y-4">
              <div className="student-card-header">
                <h2 className="student-card-title">
                  <ReportCardIcon className="w-5 h-5 text-forest" /> Report Cards
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-forest bg-sage/20 border border-sage/30 px-2.5 py-0.5 rounded-full">
                    Teacher Confirmed & Verified
                  </span>
                  <span className="text-xs font-bold text-forest">GPA: {studentData.profile.gpa} / 4.0</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-linear-to-br from-cream/50 to-white border border-sand/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-forest">Term 1 Official Report Card</h3>
                  <p className="text-xs text-forest/70 mt-0.5">
                    Verified and confirmed by class teachers. Ready to download or print to bring home.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleViewReport}
                    className="btn-primary text-xs flex-1 sm:flex-none"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="btn-secondary text-xs flex-1 sm:flex-none"
                  >
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintReport}
                    className="btn-ghost text-xs flex-1 sm:flex-none inline-flex items-center gap-1.5"
                    title="Print report to bring home"
                  >
                    <PrinterIcon className="w-3.5 h-3.5" /> Print
                  </button>
                </div>
              </div>
            </div>

            {/* Subjects Grades History Section */}
            <div className="student-card space-y-4">
              <div className="student-card-header">
                <h2 className="student-card-title">
                  <HomeworkIcon className="w-5 h-5 text-forest" /> Subjects Grades History
                </h2>
                <span className="text-xs text-forest/60">Click any subject to view detailed grade history</span>
              </div>

              {/* Subject carousel pills with arrows */}
              <div className="flex items-center justify-center gap-3 py-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSubjectIndex((prev) =>
                      prev > 0 ? prev - 1 : studentData.subjects.length - 1
                    )
                  }
                  className="carousel-nav-btn w-8 h-8 text-sm"
                  title="Previous Subject"
                  aria-label="Previous Subject"
                >
                  ‹
                </button>

                <div className="flex items-center gap-2 overflow-x-auto">
                  {studentData.subjects.map((subj, idx) => (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => setSelectedSubjectIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSubjectIndex === idx
                          ? "bg-forest text-cream shadow-sm scale-105"
                          : "bg-cream/80 text-forest border border-sand/40 hover:bg-sand/30"
                      }`}
                    >
                      {subj.name} ({subj.overall})
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSubjectIndex((prev) => (prev + 1) % studentData.subjects.length)
                  }
                  className="carousel-nav-btn w-8 h-8 text-sm"
                  title="Next Subject"
                  aria-label="Next Subject"
                >
                  ›
                </button>
              </div>

              {/* Subject Summary Card with action to open the detailed matrix */}
              <div className="p-4 rounded-xl bg-cream/30 border border-sand/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-forest/70 block">Selected Subject</span>
                  <h3 className="text-base font-bold text-forest">
                    {currentSubject.name} — Taught by {currentSubject.teacher}
                  </h3>
                  <span className="text-xs text-forest/80 font-medium">
                    Overall Grade: <strong className="text-forest">{currentSubject.gradeLetter} ({currentSubject.overall})</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenSubjectDetail(selectedSubjectIndex)}
                  className="btn-primary text-xs w-full sm:w-auto"
                >
                  Open {currentSubject.name} Grade Matrix →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* S1: Official Report Card Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-sand/50 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-sand/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                  <ReportCardIcon className="w-5 h-5 text-forest" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-forest">Zinger School Official Report Card</h3>
                  <span className="text-[11px] text-forest/60">Term 1 • Academic Year 2026/2027</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="w-7 h-7 rounded-full bg-cream hover:bg-sand/30 text-forest text-xs flex items-center justify-center cursor-pointer font-bold"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-cream/40 rounded-xl border border-sand/30">
              <div>
                <span className="text-forest/60 block">Student Name:</span>
                <strong className="text-forest">{studentData.profile.name}</strong>
              </div>
              <div>
                <span className="text-forest/60 block">Student ID & Grade:</span>
                <strong className="text-forest">{studentData.profile.id} • {studentData.profile.grade}</strong>
              </div>
              <div>
                <span className="text-forest/60 block">Class Teacher:</span>
                <strong className="text-forest">{studentData.profile.teacher}</strong>
              </div>
              <div>
                <span className="text-forest/60 block">Term GPA:</span>
                <strong className="text-forest">{studentData.profile.gpa} / 4.0 (A)</strong>
              </div>
            </div>

            {/* Subject Grades Table */}
            <div className="border border-sand/40 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-sand/20 text-forest uppercase font-bold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Instructor</th>
                    <th className="py-2.5 px-3 text-center">Score</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/20">
                  {studentData.subjects.map((subj) => (
                    <tr key={subj.id} className="hover:bg-cream/30">
                      <td className="py-2.5 px-3 font-semibold text-forest">{subj.name}</td>
                      <td className="py-2.5 px-3 text-forest/70">{subj.teacher}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-forest">{subj.overall}</td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-forest">{subj.gradeLetter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-sage/15 border border-sage/30 text-xs text-forest space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckIcon className="w-3.5 h-3.5 text-forest" /> Verified by School Academic Board & Class Teachers
              </div>
              <p className="text-forest/80 text-[11px]">
                Report confirmed. Suitable for printing to bring home for parent signature.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/30">
              <button
                type="button"
                onClick={handlePrintReport}
                className="btn-ghost text-xs inline-flex items-center gap-1.5"
              >
                <PrinterIcon className="w-3.5 h-3.5" /> Print Report
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadReport();
                  setIsReportModalOpen(false);
                }}
                className="btn-primary text-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
        onCancel={() => setModalState({ isOpen: false })}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

