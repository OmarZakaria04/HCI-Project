import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import RadarChart from "../../components/RadarChart";
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
  ChatIcon,
  StarIcon,
} from "../../components/StudentIcons";
import "../../styles/student.css";

export default function StudentHome() {
  const navigate = useNavigate();

  // Hero carousel index: 0 = Home-Works, 1 = Teachers, 2 = Grades
  const [heroIndex, setHeroIndex] = useState(0);

  // S2 & S3: File upload simulation for answer extraction scanner
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [activeUploadItem, setActiveUploadItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

  // S3 & S4 Assessment Action
  const handleAssessmentAction = (item) => {
    if (item.isOnline) {
      // S4: Quizzes and exams are submitted only through the online solving workspace
      navigate(`/student/workspace/${item.id}`);
    } else {
      // S3: Assignment upload for teacher to run through answer extraction scanner
      setActiveUploadItem(item);
      setSelectedFile(null);
    }
  };

  const handleConfirmUpload = () => {
    if (!activeUploadItem) return;
    setUploadedFiles((prev) => ({
      ...prev,
      [activeUploadItem.id]: selectedFile ? selectedFile.name : "Homework_Scan_Ahmed.pdf",
    }));
    const itemTitle = activeUploadItem.title;
    setActiveUploadItem(null);
    setSelectedFile(null);
    setToastMessage(`${itemTitle} submitted for teacher review & answer extraction scanner!`);
  };

  const handleAskTeacherPractice = (topic) => {
    navigate("/student/teachers", {
      state: { prefillMessage: topic.suggestedHelpMessage },
    });
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

        {/* Third Section: Pending Assessments matching wireframe */}
        <div className="student-card space-y-3">
          <div className="student-card-header">
            <div>
              <h2 className="student-card-title">
                <AssessmentIcon className="w-5 h-5 text-forest" /> Pending Assessments
              </h2>
              <p className="text-[11px] text-forest/60">
                Track pending quizzes, exams, and homework submissions
              </p>
            </div>
            <span className="text-xs font-semibold text-forest/70">
              {studentData.pendingAssessments.length} Pending
            </span>
          </div>

          <div className="space-y-2.5">
            {studentData.pendingAssessments.map((item) => (
              <div key={item.id} className="assessment-row">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sand/30 flex items-center justify-center text-forest text-sm font-bold shrink-0">
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
                      <CheckIcon className="w-3.5 h-3.5 text-forest" />
                      Uploaded
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAssessmentAction(item)}
                      className={item.isOnline ? "btn-primary text-xs px-4" : "btn-secondary text-xs px-4"}
                    >
                      {item.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fourth Section: Analysis & Learning Progress (Wireframe 1:1 with Circular Metrics Graph + S6 Encouragement) */}
        <div className="student-card space-y-5">
          <div className="student-card-header">
            <div>
              <h2 className="student-card-title">
                <AnalysisIcon className="w-5 h-5 text-forest" /> Analysis
              </h2>
              <p className="text-[11px] text-forest/60">
                Performance analysis & encouraging growth • Designed for Grades 1–5
              </p>
            </div>
            <span className="text-xs font-bold text-forest bg-sage/20 border border-sage/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-forest" />
              {studentData.progressView?.confirmedBadge || "Teacher Confirmed"}
            </span>
          </div>

          {/* Wireframe 2-Column Grid: Left = Encouraging Details & Topics, Right = Circular Metrics Graph */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Left Column: Details, Strength, and Short Topics to Practice */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-forest/70 block uppercase tracking-wider mb-1">
                  Details:
                </span>
                <p className="text-xs font-semibold text-forest bg-cream/50 p-3 rounded-xl border border-sand/40 leading-relaxed">
                  {studentData.analysis?.details || "Mathematics (92%) • Science (95%) • English (88%)"}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-forest/70 block uppercase tracking-wider mb-1">
                  Excellent work on:
                </span>
                <p className="text-xs text-forest bg-sage/15 p-3 rounded-xl border border-sage/30 font-bold inline-flex items-center gap-2 w-full">
                  <CheckIcon className="w-4 h-4 text-forest shrink-0" />
                  {studentData.analysis?.excellentWorkOn || studentData.progressView?.strength?.title || "Linear Equations & Finding Common Denominators"}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-forest/70 block uppercase tracking-wider mb-1">
                  Key Takeaways:
                </span>
                <p className="text-xs text-forest/80 bg-cream/40 p-3 rounded-xl border border-sand/40 leading-relaxed font-medium">
                  {studentData.analysis?.keyTakeaways || "Great consistency across assignments. Maintain current momentum!"}
                </p>
              </div>

              {/* S6: 1 or 2 Relevant Topics to Practice with Direct Teacher Help */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest uppercase tracking-wider">
                    Topics to Practice (Short & Encouraging):
                  </span>
                  <span className="text-[11px] text-forest/50">Only 2 key topics</span>
                </div>

                <div className="space-y-2">
                  {(studentData.progressView?.practiceTopics || []).map((topic) => (
                    <div
                      key={topic.id}
                      className="p-3 rounded-xl bg-cream/40 border border-sand/40 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-forest">{topic.title}</h4>
                        <p className="text-[11px] text-forest/70 mt-0.5 leading-snug">{topic.tip}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAskTeacherPractice(topic)}
                        className="btn-ghost text-xs px-2.5 py-1 shrink-0"
                      >
                        <ChatIcon className="w-3.5 h-3.5 text-forest" /> Ask Help
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Wireframe Circular Metrics Graph (RadarChart) */}
            <div className="flex flex-col items-center justify-center p-6 bg-linear-to-b from-cream/40 to-white rounded-2xl border border-sand/40 shadow-xs text-center">
              <span className="text-xs font-bold text-forest uppercase tracking-wider mb-2">
                Metrics Graph
              </span>
              <RadarChart
                data={studentData.analysis?.radarMetrics || [
                  { label: "Math", value: 92 },
                  { label: "Science", value: 95 },
                  { label: "English", value: 88 },
                  { label: "History", value: 85 },
                  { label: "Classwork", value: 91 },
                ]}
                size={220}
              />
              <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-forest">
                <StarIcon className="w-4 h-4 text-sand" />
                <span>Overall Grade: {studentData.progressView?.overallGrade || "A (92%)"}</span>
              </div>
              <span className="text-[11px] text-forest/60 mt-0.5">
                {studentData.progressView?.growthMessage || "You improved in Multiplication & Fractions!"}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* S3: Assignment Upload Modal for Scanner */}
      {activeUploadItem && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-sand/50 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sand/30 text-forest flex items-center justify-center shrink-0">
                <HomeworkIcon className="w-5 h-5 text-forest" />
              </div>
              <div>
                <h3 className="text-base font-bold text-forest">
                  Upload Assignment for Extraction Scanner
                </h3>
                <p className="text-xs text-forest/70 mt-0.5">
                  {activeUploadItem.title}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cream/40 border border-sand/40 text-xs text-forest/80 space-y-1">
              <p>
                <strong>How it works:</strong> Upload your completed handwritten or typed assignment.
                The system will process your pages through the teacher&apos;s answer extraction scanner
                for verified scoring and feedback.
              </p>
            </div>

            {/* File Input */}
            <div className="border-2 border-dashed border-sand/50 rounded-xl p-4 text-center space-y-2 bg-cream/20">
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer text-xs font-bold text-forest bg-white hover:bg-cream border border-sand/50 px-4 py-2 rounded-xl inline-block shadow-2xs"
              >
                Choose PDF or Image File
              </label>
              {selectedFile ? (
                <p className="text-xs font-semibold text-forest mt-1">
                  Selected: {selectedFile.name}
                </p>
              ) : (
                <p className="text-[11px] text-forest/50">
                  Supported formats: PDF, DOCX, JPG, PNG (Max 15MB)
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/30">
              <button
                type="button"
                onClick={() => {
                  setActiveUploadItem(null);
                  setSelectedFile(null);
                }}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpload}
                className="btn-primary text-xs"
              >
                Upload & Send to Scanner
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

