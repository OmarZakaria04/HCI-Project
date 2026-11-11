import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import DashboardCarousel from "../../components/DashboardCarousel";
import RadarChart from "../../components/RadarChart";
import Toast from "../../components/Toast";
import HomeworkUploadModal from "../../components/HomeworkUploadModal";
import QuickPracticeWidget from "../../components/QuickPracticeWidget";
import { getStudentData } from "../../i18n/studentDataDe";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import { CheckIcon } from "../../components/StudentIcons";
import {
  getHomeworkUploads,
  getWorkspaceSubmissions,
  nowIsoTimestamp,
  saveHomeworkUpload,
} from "../../utils/studentStore";
import classImg from "../../assets/class.png";
import papersImg from "../../assets/papers.png";
import scheduleImg from "../../assets/schedule.png";
import "../../styles/student.css";
import "../../styles/student-dashboard.css";

const heroImages = { homeworks: papersImg, teachers: classImg, grades: scheduleImg };
const taskMarkers = { Quiz: "Q", Homework: "HW", Exam: "E" };
const taskMarkersDe = { Quiz: "Q", Homework: "HA", Exam: "P" };

export default function StudentHome() {
  const navigate = useNavigate();
  const { lang, tr } = useLanguage();
  const studentData = getStudentData(lang);
  const deadlineFormatter = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

  const schoolworkRef = useRef(null);
  const uploadTriggerRef = useRef(null);
  const uploadRowRef = useRef(null);

  const [uploadedFiles, setUploadedFiles] = useState(() => getHomeworkUploads());
  const [workspaceSubmissions] = useState(() => getWorkspaceSubmissions());
  const [activeUploadItem, setActiveUploadItem] = useState(null);
  const [openPracticeId, setOpenPracticeId] = useState(null);
  const isReplacingUpload = Boolean(activeUploadItem && uploadedFiles[activeUploadItem.id]?.fileName);
  const [toastMessage, setToastMessage] = useState(null);

  const schoolwork = [...studentData.pendingAssessments].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const pendingCount = schoolwork.filter(
    (item) => !item.isSubmitted && !uploadedFiles[item.id]?.fileName && !workspaceSubmissions[item.id]
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

  const handleAssessmentAction = (item, event) => {
    if (item.isOnline) {
      navigate(`/student/workspace/${item.id}`);
    } else {
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

  const handleConfirmUpload = (payload) => {
    const uploadRecord = typeof payload === "string"
      ? { fileName: payload, hardQuestions: [], hardNote: "" }
      : payload;
    if (!activeUploadItem || !uploadRecord?.fileName) return;
    const saved = saveHomeworkUpload(activeUploadItem.id, {
      ...uploadRecord,
      title: activeUploadItem.title,
      subject: activeUploadItem.subject,
      submittedAt: nowIsoTimestamp(),
    });
    setUploadedFiles(saved);
    const itemTitle = activeUploadItem.title;
    closeUpload();
    setToastMessage(
      `${itemTitle} ${
        isReplacingUpload
          ? tr("upload replaced & saved.", "Upload ersetzt und gespeichert.")
          : tr("uploaded for teacher extraction review.", "für die Lehrkraft-Prüfung hochgeladen.")
      }`
    );
  };

  const handleAskTeacherPractice = (topic) => {
    navigate(`/student/teachers/${topic.teacherId}`, {
      state: { prefillMessage: topic.suggestedHelpMessage },
    });
  };

  const activeMarkers = lang === "de" ? taskMarkersDe : taskMarkers;

  return (
    <div className="student-page-wrapper student-themed-page">
      <Header role="student" />
      <div className="student-dashboard">
      <main className="student-container">
        <div className="student-dashboard-welcome">
          <h1>{tr("Hi", "Hallo")} {studentData.profile.name.split(" ")[0]}</h1>
          <p aria-live="polite">
            {tr(
              `You have ${pendingCount} ${pendingCount === 1 ? "task" : "tasks"} to complete.`,
              `Du hast ${pendingCount} ${pendingCount === 1 ? "Aufgabe" : "Aufgaben"} zu erledigen.`
            )}
          </p>
        </div>

        <DashboardCarousel label={tr("Student navigation", "Schüler-Navigation")}
          slides={studentData.heroSlides.map((slide) => ({ ...slide,
            image: heroImages[slide.id],
            subtitle: slide.id === "homeworks"
              ? tr(
                  `${pendingCount} pending ${pendingCount === 1 ? "task" : "tasks"}`,
                  `${pendingCount} offene ${pendingCount === 1 ? "Aufgabe" : "Aufgaben"}`
                )
              : undefined,
          }))}
          onOpen={handleHeroAction} />

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
              {tr("Your schoolwork", "Deine Schulaufgaben")}
            </h2>
            <span className="text-xs font-semibold text-forest/70">
              {pendingCount} {tr("pending", "offen")}
            </span>
          </div>

          <ul className="student-schoolwork-list">
            {schoolwork.map((item) => {
              const typeLabel = translateValue(item.type, lang);
              return (
                <li key={item.id} className="student-schoolwork-row">
                  <div className="student-schoolwork-marker" aria-hidden="true">
                    {activeMarkers[item.type] || typeLabel.charAt(0)}
                  </div>
                  <div className="student-schoolwork-content">
                    <p className="student-schoolwork-subject">{item.subject} · {item.isOnline ? tr("Online ", "Online-") : ""}{typeLabel}</p>
                    <h3>{item.title}</h3>
                    <div className="student-schoolwork-meta">
                      <span>{tr("Due", "Fällig:")} <time dateTime={item.dueDate}>{deadlineFormatter.format(new Date(`${item.dueDate}T00:00:00Z`))}</time></span>
                      <span aria-hidden="true">·</span>
                      <span>{item.duration}</span>
                    </div>
                    {item.instructions && (
                      <p className="student-schoolwork-instructions">{item.instructions}</p>
                    )}
                  </div>

                  <div className="student-schoolwork-action">
                    {uploadedFiles[item.id]?.fileName || workspaceSubmissions[item.id] || item.isSubmitted ? (
                      <>
                        <div className="student-schoolwork-uploaded" role="status">
                          <span><CheckIcon className="w-4 h-4" /> {uploadedFiles[item.id]?.fileName ? tr("Uploaded", "Hochgeladen") : tr("Submitted", "Eingereicht")}</span>
                          {uploadedFiles[item.id]?.fileName && <p>{uploadedFiles[item.id].fileName}</p>}
                          {uploadedFiles[item.id]?.hardQuestions?.length > 0 && (
                            <p className="student-schoolwork-hard-tags">
                              {tr("Marked hard:", "Schwer markiert:")} {uploadedFiles[item.id].hardQuestions.join(", ")}
                            </p>
                          )}
                          {workspaceSubmissions[item.id] && (
                            <p>
                              {tr(
                                `${workspaceSubmissions[item.id].answeredCount}/${workspaceSubmissions[item.id].totalQuestions} answered`,
                                `${workspaceSubmissions[item.id].answeredCount}/${workspaceSubmissions[item.id].totalQuestions} beantwortet`
                              )}
                            </p>
                          )}
                        </div>
                        {uploadedFiles[item.id]?.fileName && !item.isOnline && (
                          <button
                            type="button"
                            onClick={(event) => handleAssessmentAction(item, event)}
                            className="btn-secondary student-schoolwork-replace"
                            aria-label={`${tr("Replace upload", "Upload ersetzen")}: ${item.title}`}
                          >
                            {tr("Replace upload", "Upload ersetzen")}
                          </button>
                        )}
                        {workspaceSubmissions[item.id] && item.isOnline && (
                          <Link
                            to={`/student/workspace/${item.id}`}
                            className="btn-secondary student-schoolwork-replace"
                          >
                            {tr("View summary", "Übersicht")}
                          </Link>
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
          {schoolwork.length === 0 && <p className="student-schoolwork-empty">{tr("You're all caught up. New schoolwork will appear here.", "Alles erledigt! Neue Schulaufgaben erscheinen hier.")}</p>}
        </div>

        <div className="student-dashboard-progress-layout">
          <section className="student-card student-progress" aria-labelledby="student-progress-title">
            <div className="student-card-header">
              <h2 id="student-progress-title" className="student-card-title">{tr("Your progress", "Dein Lernfortschritt")}</h2>
              <span className="student-progress-demo">
                {studentData.progressView?.confirmedSummary?.statusLabel || tr("Confirmed by teachers", "Von Lehrkräften bestätigt")}
              </span>
            </div>

            {studentData.progressView?.confirmedSummary && (
              <div className="student-progress-confirmed-banner">
                <div>
                  <span className="student-progress-confirmed-kicker">{tr("Confirmed standing", "Bestätigter Stand")}</span>
                  <strong>{studentData.progressView.confirmedSummary.overallStanding}</strong>
                </div>
                <p>{studentData.progressView.confirmedSummary.latestExamLabel}</p>
              </div>
            )}

            {overallAverage !== null && (
              <p className="student-progress-overall" aria-label={tr(`Overall average across ${progressMetrics.length} equally weighted subjects`, `Gesamtdurchschnitt über ${progressMetrics.length} gleich gewichtete Fächer`)}>
                <span>{tr("Overall average", "Gesamtdurchschnitt")}</span>
                <strong>{overallAverage}%</strong>
                <span className="student-progress-subject-count">
                  {progressMetrics.length} {progressMetrics.length === 1 ? tr("subject", "Fach") : tr("subjects", "Fächer")}
                </span>
              </p>
            )}

            {progressMetrics.length > 0 ? (
              <div className="student-progress-charts">
                <div
                  className="student-progress-radar"
                  role="img"
                  aria-label={tr("Progress overview radar chart. Exact scores are listed alongside.", "Netzdiagramm zum Lernfortschritt. Genaue Werte stehen daneben.")}
                >
                  <RadarChart data={progressMetrics} size={320} />
                </div>
                <ul className="student-progress-scores" aria-label={tr("Progress scores", "Fortschrittswerte")}>
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
              <p className="student-progress-empty">{tr("No progress scores to show yet.", "Noch keine Fortschrittswerte vorhanden.")}</p>
            )}

            {(studentData.progressView?.progressAcrossExams || []).length > 0 && (
              <div className="student-exam-milestones">
                <h3>{tr("Your progress across quizzes & exams", "Dein Fortschritt über Tests & Prüfungen")}</h3>
                <ul className="student-milestone-list">
                  {studentData.progressView.progressAcrossExams.map((milestone) => (
                    <li key={milestone.id} className="student-milestone-item">
                      <div className="student-milestone-top">
                        <span className="student-milestone-subject">{milestone.subject}</span>
                        <span className="student-milestone-range">{milestone.fromLabel} → {milestone.toLabel}</span>
                      </div>
                      <p className="student-milestone-message">{milestone.message}</p>
                      <div className="student-milestone-track" aria-hidden="true">
                        <span style={{ width: `${milestone.currentValue}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="student-progress-takeaways">
              <h3>{tr("Key takeaways", "Wichtigste Rückmeldungen")}</h3>
              <p className="student-progress-excellent">{tr("Excellent work on", "Sehr gute Leistung in")}</p>
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
              <h2 id="student-practice-title" className="student-card-title">{tr("Topics to practice", "Themen zum Üben")}</h2>
            </div>
            <ul className="student-practice-topics">
              {(studentData.progressView?.practiceTopics || []).slice(0, 2).map((topic) => (
                <li key={topic.id}>
                  <p className="student-practice-subject">{topic.subject}</p>
                  <h3>{topic.title}</h3>
                  <p>{topic.tip}</p>
                  {topic.quickPractice && openPracticeId === topic.id && (
                    <QuickPracticeWidget practice={topic.quickPractice} tr={tr} />
                  )}
                  <div className="student-practice-actions">
                    {topic.quickPractice && (
                      <button
                        type="button"
                        onClick={() => setOpenPracticeId((prev) => (prev === topic.id ? null : topic.id))}
                        className="btn-primary student-practice-help"
                      >
                        {openPracticeId === topic.id
                          ? tr("Hide practice", "Übung ausblenden")
                          : tr("Practise topic", "Thema üben")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleAskTeacherPractice(topic)}
                      className="btn-secondary student-practice-help"
                      aria-label={`${tr("Ask Help", "Hilfe anfragen")}: ${topic.title}`}
                    >
                      {tr("Ask Help", "Hilfe anfragen")}
                    </button>
                  </div>
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
          dueDateLabel={deadlineFormatter.format(new Date(`${activeUploadItem.dueDate}T00:00:00Z`))}
          currentUpload={uploadedFiles[activeUploadItem.id]}
          onConfirm={handleConfirmUpload}
          onClose={closeUpload}
        />
      )}

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
      </div>
    </div>
  );
}
