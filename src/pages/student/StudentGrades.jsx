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

  const handleDownloadReport = () => {
    setToastMessage("Downloading Term 1 Official Report Card (PDF)...");
  };

  const handleViewReport = () => {
    setModalState({
      isOpen: true,
      title: "Term 1 Official Report Card",
      message: `Student: ${studentData.profile.name} • GPA: ${studentData.profile.gpa} / 4.0 • Academic Standing: Honors with Distinction. Verified by Administration.`,
      onConfirm: () => setModalState({ isOpen: false }),
    });
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
                <span className="text-xs font-bold text-forest">GPA: {studentData.profile.gpa} / 4.0</span>
              </div>

              <div className="p-5 rounded-2xl bg-linear-to-br from-cream/50 to-white border border-sand/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-forest">Term 1 Official Report Card</h3>
                  <p className="text-xs text-forest/70 mt-0.5">
                    Includes official quarterly exam grades, classwork scores, and conduct marks.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
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
                    Download
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

