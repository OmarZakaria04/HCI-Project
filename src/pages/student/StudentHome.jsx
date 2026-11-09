import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import DashboardCarousel from "../../components/DashboardCarousel";
import RadarChart from "../../components/RadarChart";
import Toast from "../../components/Toast";
import HomeworkUploadModal from "../../components/HomeworkUploadModal";
import { studentData } from "../../data/studentData";
import { CheckIcon } from "../../components/StudentIcons";
import classImg from "../../assets/class.png";
import papersImg from "../../assets/papers.png";
import scheduleImg from "../../assets/schedule.png";
import "../../styles/student.css";
import "../../styles/student-dashboard.css";

const heroImages = { homeworks: papersImg, teachers: classImg, grades: scheduleImg };
const taskMarkers = { Quiz: "Q", Homework: "HW", Exam: "E" };
const deadlineFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});

export default function StudentHome() {
  const navigate = useNavigate();

  const schoolworkRef = useRef(null);
  const uploadTriggerRef = useRef(null);
  const uploadRowRef = useRef(null);

  // S2 & S3: File upload simulation for answer extraction scanner
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [activeUploadItem, setActiveUploadItem] = useState(null);
  const isReplacingUpload = Boolean(activeUploadItem && uploadedFiles[activeUploadItem.id]);

  const [toastMessage, setToastMessage] = useState(null);

  const schoolwork = [...studentData.pendingAssessments].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const pendingCount = schoolwork.filter(
    (item) => !item.isSubmitted && !uploadedFiles[item.id]
  ).length;
  const progressMetrics = studentData.analysis?.radarMetrics || [];
  const overallAverage = progressMetrics.length > 0
    ? (progressMetrics.reduce((total, metric) => total + metric.value, 0) / progressMetrics.length).toFixed(1)
    : null;

  const handleHeroAction = (currentSlide) => {
    if (currentSlide.id === "teachers") {
      navigate("/student/teachers");
    } else if (currentSlide.id === "grades") {
      navigate("/student/grades");
    } else {
      schoolworkRef.current.focus({ preventScroll: true });
      schoolworkRef.current.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    }
  };

  // S3 & S4 Assessment Action
  const handleAssessmentAction = (item, event) => {
    if (item.isOnline) {
      // S4: Quizzes and exams are submitted only through the online solving workspace
      navigate(`/student/workspace/${item.id}`);
    } else {
      // S3: Assignment upload for teacher to run through answer extraction scanner
      uploadTriggerRef.current = event.currentTarget;
      uploadRowRef.current = event.currentTarget.closest(".student-schoolwork-row");
      setActiveUploadItem(item);
    }
  };

  const closeUpload = () => {
    setActiveUploadItem(null);
    requestAnimationFrame(() => {
      const target = uploadTriggerRef.current?.isConnected
        ? uploadTriggerRef.current
        : uploadRowRef.current?.querySelector("button");
      target?.focus({ preventScroll: true });
    });
  };

  const handleConfirmUpload = (fileName) => {
    if (!activeUploadItem || !fileName) return;
    setUploadedFiles((prev) => ({
      ...prev,
      [activeUploadItem.id]: fileName,
    }));
    const itemTitle = activeUploadItem.title;
    closeUpload();
    setToastMessage(`${itemTitle} ${isReplacingUpload ? "upload replaced" : "uploaded"} for this demo.`);
  };

  const handleAskTeacherPractice = (topic) => {
    navigate(`/student/teachers/${topic.teacherId}`, {
      state: { prefillMessage: topic.suggestedHelpMessage },
    });
  };

  return (
    <div className="student-page-wrapper student-themed-page">
      <Header role="student" />
      <div className="student-dashboard">
      <main className="student-container">
        <div className="student-dashboard-welcome">
          <h1>Hi {studentData.profile.name.split(" ")[0]}</h1>
          <p aria-live="polite">
            You have {pendingCount} {pendingCount === 1 ? "task" : "tasks"} to complete.
          </p>
        </div>

        <DashboardCarousel label="Student navigation"
          slides={studentData.heroSlides.map((slide) => ({ ...slide,
            image: heroImages[slide.id],
            subtitle: slide.id === "homeworks" ? `${pendingCount} pending ${pendingCount === 1 ? "task" : "tasks"}` : undefined,
          }))}
          onOpen={handleHeroAction} />

        {/* Schoolwork */}
        <div
          ref={schoolworkRef}
          id="student-schoolwork"
          role="region"
          tabIndex={-1}
          aria-labelledby="student-schoolwork-title"
          className="student-card student-dashboard-schoolwork"
        >
          <div className="student-card-header">
            <h2 id="student-schoolwork-title" className="student-card-title">
              Your schoolwork
            </h2>
            <span className="text-xs font-semibold text-forest/70">
              {pendingCount} pending
            </span>
          </div>

          <ul className="student-schoolwork-list">
            {schoolwork.map((item) => {
              return (
                <li key={item.id} className="student-schoolwork-row">
                  <div className="student-schoolwork-marker" aria-hidden="true">
                    {taskMarkers[item.type] || item.type.charAt(0)}
                  </div>
                  <div className="student-schoolwork-content">
                    <p className="student-schoolwork-subject">{item.subject} · {item.isOnline ? "Online " : ""}{item.type}</p>
                    <h3>{item.title}</h3>
                    <div className="student-schoolwork-meta">
                      <span>Due <time dateTime={item.dueDate}>{deadlineFormatter.format(new Date(`${item.dueDate}T00:00:00Z`))}</time></span>
                      <span aria-hidden="true">·</span>
                      <span>{item.duration}</span>
                    </div>
                  </div>

                  <div className="student-schoolwork-action">
                    {uploadedFiles[item.id] || item.isSubmitted ? (
                      <>
                        <div className="student-schoolwork-uploaded" role="status">
                          <span><CheckIcon className="w-4 h-4" /> {uploadedFiles[item.id] ? "Uploaded" : "Submitted"}</span>
                          {uploadedFiles[item.id] && <p>{uploadedFiles[item.id]}</p>}
                        </div>
                        {uploadedFiles[item.id] && !item.isOnline && (
                          <button
                            type="button"
                            onClick={(event) => handleAssessmentAction(item, event)}
                            className="btn-secondary student-schoolwork-replace"
                            aria-label={`Replace upload: ${item.title}`}
                          >
                            Replace upload
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={(event) => handleAssessmentAction(item, event)}
                        className={item.isOnline ? "btn-primary" : "btn-secondary"}
                        aria-label={`${item.actionLabel}: ${item.title}`}
                      >
                        {item.actionLabel}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          {schoolwork.length === 0 && <p className="student-schoolwork-empty">You're all caught up. New schoolwork will appear here.</p>}
        </div>

        <div className="student-dashboard-progress-layout">
          <section className="student-card student-progress" aria-labelledby="student-progress-title">
            <div className="student-card-header">
              <h2 id="student-progress-title" className="student-card-title">Your progress</h2>
              <span className="student-progress-demo">Demo data</span>
            </div>

            {overallAverage !== null && (
              <p className="student-progress-overall" aria-label={`Overall average across ${progressMetrics.length} equally weighted subjects`}>
                <span>Overall average</span>
                <strong>{overallAverage}%</strong>
                <span className="student-progress-subject-count">{progressMetrics.length} {progressMetrics.length === 1 ? "subject" : "subjects"}</span>
              </p>
            )}

            {progressMetrics.length > 0 ? (
              <div className="student-progress-charts">
                <div
                  className="student-progress-radar"
                  role="img"
                  aria-label="Progress overview radar chart. Exact scores are listed alongside."
                >
                  <RadarChart data={progressMetrics} size={320} />
                </div>
                <ul className="student-progress-scores" aria-label="Progress scores">
                  {progressMetrics.map((metric) => (
                    <li key={metric.label}>
                      <div className="student-progress-score-label">
                        <span>{metric.label}</span>
                        <span>{metric.value}%</span>
                      </div>
                      <div
                        className="student-progress-bar"
                        role="meter"
                        aria-label={metric.label}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={metric.value}
                      >
                        <span style={{ width: `${metric.value}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="student-progress-empty">No progress scores to show yet.</p>
            )}

            <div className="student-progress-takeaways">
              <h3>Key takeaways</h3>
              <p className="student-progress-excellent">Excellent work on</p>
              <dl>
                {(studentData.progressView?.keyTakeaways || []).map((takeaway) => (
                  <div key={takeaway.subject}>
                    <dt>{takeaway.subject}</dt>
                    <dd>{takeaway.comment}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="student-card student-practice" aria-labelledby="student-practice-title">
            <div className="student-card-header">
              <h2 id="student-practice-title" className="student-card-title">Topics to practice</h2>
            </div>
            <ul className="student-practice-topics">
              {(studentData.progressView?.practiceTopics || []).map((topic) => (
                <li key={topic.id}>
                  <p className="student-practice-subject">{topic.subject}</p>
                  <h3>{topic.title}</h3>
                  <p>{topic.tip}</p>
                  <button
                    type="button"
                    onClick={() => handleAskTeacherPractice(topic)}
                    className="btn-secondary student-practice-help"
                    aria-label={`Ask Help: ${topic.title}`}
                  >
                    Ask Help
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {activeUploadItem && (
        <HomeworkUploadModal
          key={activeUploadItem.id}
          assignment={activeUploadItem}
          currentFile={uploadedFiles[activeUploadItem.id]}
          onConfirm={handleConfirmUpload}
          onClose={closeUpload}
        />
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </div>
    </div>
  );
}

