import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import RadarChart from "../../components/RadarChart";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";
import { studentData } from "../../data/studentData";
import {
  AnnouncementIcon,
  HomeworkIcon,
  TeacherIcon,
  GradesIcon,
  AssessmentIcon,
  AnalysisIcon,
  CheckIcon,
} from "../../components/StudentIcons";
import "../../styles/student.css";

export default function StudentHome() {
  const navigate = useNavigate();

  // Hero carousel index: 0 = Home-Works, 1 = Teachers, 2 = Grades
  const [heroIndex, setHeroIndex] = useState(0);

  // File upload simulation & interactive modals
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [toastMessage, setToastMessage] = useState(null);

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev - 1 + studentData.heroSlides.length) % studentData.heroSlides.length);
  };

  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % studentData.heroSlides.length);
  };

  const handleHeroAction = () => {
    const currentSlide = studentData.heroSlides[heroIndex];
    if (currentSlide.id === "teachers") {
      navigate("/student/teachers");
    } else if (currentSlide.id === "grades") {
      navigate("/student/grades");
    }
  };

  const handleAssessmentAction = (item) => {
    if (item.actionLabel === "Start") {
      setModalState({
        isOpen: true,
        title: `Start ${item.type}: ${item.title}?`,
        message: `This assessment will be conducted online and has a duration of ${item.duration}. Ensure your internet connection is stable.`,
        onConfirm: () => {
          setModalState({ isOpen: false });
          setToastMessage(`Assessment started! Good luck on ${item.title}.`);
        },
      });
    } else {
      setModalState({
        isOpen: true,
        title: `Upload File for ${item.title}`,
        message: "Select your PDF or Word submission document to upload for teacher evaluation.",
        onConfirm: () => {
          setUploadedFiles((prev) => ({ ...prev, [item.id]: true }));
          setModalState({ isOpen: false });
          setToastMessage(`File successfully uploaded for ${item.title}!`);
        },
      });
    }
  };

  return (
    <div className="student-page-wrapper">
      <Header role="student" />

      <main className="student-container">
        {/* Top Hero Carousel Card: Home-Works (Screen Home-S) */}
        <div className="wireframe-hero-card">
          <div className="w-full flex items-center justify-between px-2 sm:px-4">
            <button
              type="button"
              onClick={handlePrevHero}
              className="carousel-nav-btn"
              title="Previous slide"
              aria-label="Previous slide"
            >
              ‹
            </button>

            <div className="flex-1 px-4 cursor-pointer" onClick={handleHeroAction}>
              <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-2 shadow-2xs">
                {studentData.heroSlides[heroIndex].iconType === "homeworks" && (
                  <HomeworkIcon className="w-6 h-6 text-forest" />
                )}
                {studentData.heroSlides[heroIndex].iconType === "teachers" && (
                  <TeacherIcon className="w-6 h-6 text-forest" />
                )}
                {studentData.heroSlides[heroIndex].iconType === "grades" && (
                  <GradesIcon className="w-6 h-6 text-forest" />
                )}
              </div>
              <h1 className="wireframe-hero-title">
                {studentData.heroSlides[heroIndex].title}
              </h1>
              <p className="wireframe-hero-subtitle mx-auto">
                {studentData.heroSlides[heroIndex].subtitle}
              </p>
              {studentData.heroSlides[heroIndex].id !== "homeworks" && (
                <button
                  type="button"
                  onClick={handleHeroAction}
                  className="mt-3 text-xs font-bold text-forest bg-sand/30 hover:bg-sand/50 px-3.5 py-1.5 rounded-full transition-colors inline-block cursor-pointer"
                >
                  {studentData.heroSlides[heroIndex].actionText} →
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextHero}
              className="carousel-nav-btn"
              title="Next slide"
              aria-label="Next slide"
            >
              ›
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {studentData.heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setHeroIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  heroIndex === i ? "w-6 bg-forest" : "w-2 bg-sand/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Second Card: Announcements Banner (Navigates to /student/announcements) */}
        <div
          onClick={() => navigate("/student/announcements")}
          className="student-card hover:border-forest/50 transition-all cursor-pointer bg-linear-to-r from-cream/80 to-white flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
              <AnnouncementIcon className="w-6 h-6 text-forest" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-forest">Announcements</h2>
              <p className="text-xs text-forest/70">
                Latest: <span className="font-semibold">{studentData.announcements[0].title}</span> —{" "}
                {studentData.announcements[0].content.substring(0, 75)}...
              </p>
            </div>
          </div>
          <span className="btn-ghost text-xs shrink-0 hidden sm:flex">
            View All →
          </span>
        </div>

        {/* Third Section: Pending Assessments */}
        <div className="student-card space-y-3">
          <div className="student-card-header">
            <h2 className="student-card-title">
              <AssessmentIcon className="w-5 h-5 text-forest" /> Pending Assessments
            </h2>
            <span className="text-xs font-semibold text-forest/60">
              {studentData.pendingAssessments.length} Tasks Remaining
            </span>
          </div>

          <div className="space-y-2.5">
            {studentData.pendingAssessments.map((item) => (
              <div key={item.id} className="assessment-row">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sand/30 flex items-center justify-center text-forest text-sm font-bold shrink-0">
                    {item.type === "Quiz" ? "Q" : item.type === "HW" ? "H" : "E"}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-forest">
                      Details: <span className="font-semibold">{item.type}</span> — {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-forest/70">
                      <span
                        className={`assessment-type-badge ${
                          item.type === "Quiz"
                            ? "badge-quiz"
                            : item.type === "HW"
                            ? "badge-hw"
                            : "badge-exam"
                        }`}
                      >
                        Status: {item.status}
                      </span>
                      <span className="font-semibold text-forest">Due: {item.dueDate}</span>
                      <span>• {item.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {uploadedFiles[item.id] ? (
                    <span className="text-xs text-forest font-bold bg-sage/20 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                      <CheckIcon className="w-3.5 h-3.5 text-forest" /> Uploaded
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAssessmentAction(item)}
                      className={item.actionLabel === "Start" ? "btn-primary text-xs" : "btn-secondary text-xs"}
                    >
                      {item.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fourth Section: Analysis with Metrics Graph */}
        <div className="student-card">
          <div className="student-card-header">
            <h2 className="student-card-title">
              <AnalysisIcon className="w-5 h-5 text-forest" /> Analysis
            </h2>
            <span className="text-xs font-bold text-forest bg-sand/30 px-2.5 py-1 rounded-md">
              Term 1 Mastery
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-forest/70 block uppercase tracking-wider mb-1">
                  Details:
                </span>
                <p className="text-xs font-semibold text-forest bg-cream/60 p-3 rounded-xl border border-sand/40">
                  {studentData.analysis.details}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-forest/70 block uppercase tracking-wider mb-1">
                  Excellent work on:
                </span>
                <p className="text-xs text-forest bg-sage/15 p-3 rounded-xl border border-sage/30 font-medium inline-flex items-center gap-1.5 w-full">
                  <CheckIcon className="w-4 h-4 text-forest shrink-0" /> {studentData.analysis.excellentWorkOn}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-forest/70 block uppercase tracking-wider mb-1">
                  Key Takeaways:
                </span>
                <p className="text-xs text-forest/80 bg-cream/40 p-3 rounded-xl border border-sand/30 leading-relaxed">
                  {studentData.analysis.keyTakeaways}
                </p>
              </div>
            </div>

            {/* Metrics Graph using RadarChart */}
            <div className="flex flex-col items-center justify-center p-4 bg-cream/30 rounded-2xl border border-sand/40">
              <span className="text-xs font-bold text-forest/80 uppercase tracking-wider mb-2">
                Metrics Graph
              </span>
              <RadarChart data={studentData.analysis.radarMetrics} size={230} />
              <span className="text-[11px] text-forest/60 mt-1">Multi-Subject Performance Polygon</span>
            </div>
          </div>
        </div>
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
