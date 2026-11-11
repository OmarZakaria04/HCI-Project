import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import DashboardCarousel from "../../components/DashboardCarousel";
import RadarChart from "../../components/RadarChart";
import { CheckIcon } from "../../components/StudentIcons";
import ParentPageIntro from "./ParentPageIntro";
import { useActiveChild } from "./useActiveChild";
import { useLanguage } from "../../i18n/useLanguage";
import { getTeacherData } from "../../i18n/teacherDataDe";
import { getTeacherCommState } from "../../utils/teacherStore";
import { getParentEmergenciesMap } from "../../utils/parentStore";
import classImg from "../../assets/class.png";
import papersImg from "../../assets/papers.png";
import scheduleImg from "../../assets/schedule.png";
import "../../styles/parent.css";

export default function ParentHome() {
  const navigate = useNavigate();
  const { lang, tr } = useLanguage();
  const { activeChildId, child, selectChild } = useActiveChild();

  const storedEmergencies = getParentEmergenciesMap()[child.id] || [];
  const emergencyAlert = [...storedEmergencies, ...(child.emergencies || [])].find(
    (item) => item.severity === "alert"
  );
  const teacherCommState = getTeacherCommState();
  const teacherFixtures = getTeacherData(lang).teacherCommunication?.parentAnnouncements || [];
  const dailyUpdates = [
    ...(teacherCommState.addedParentAnnouncements || []),
    ...teacherFixtures,
  ];
  const metrics = child.metrics;
  const isMetricsReviewed =
    metrics?.teacherReview?.status === "Verified & Approved";
  const isGradesConfirmed =
    child.reportCard?.status === "Confirmed by Faculty";
  const radarValues = metrics?.radarValues || [];
  const subjects = child.subjects || [];
  const concernsCount = child.behavioralConcerns?.length || 0;
  const teachersCount = child.teachers?.length || 0;

  const slides = [
    {
      id: "grades",
      title: tr("Grades & exams", "Noten & Prüfungen"),
      subtitle: isMetricsReviewed
        ? tr(`${metrics.overallScore} overall`, `${metrics.overallScore} gesamt`)
        : tr("Pending teacher review", "Lehrkräfteprüfung ausstehend"),
      image: papersImg,
      to: "/parent/grades",
    },
    {
      id: "behavior",
      title: tr("Behavior & home plan", "Verhalten & Förderplan"),
      subtitle: `${concernsCount} ${
        concernsCount === 1
          ? tr("note", "Hinweis")
          : tr("notes", "Hinweise")
      }`,
      image: scheduleImg,
      to: "/parent/behavior",
    },
    {
      id: "teachers",
      title: tr("Teachers & meetings", "Lehrkräfte & Gespräche"),
      subtitle: `${teachersCount} ${
        teachersCount === 1
          ? tr("teacher", "Lehrkraft")
          : tr("teachers", "Lehrkräfte")
      }`,
      image: classImg,
      to: "/parent/teachers",
    },
  ];

  return (
    <div className="parent-page">
      <Header role="parent" />

      <main className="parent-container">
        <ParentPageIntro
          title={tr("Parent dashboard", "Elternübersicht")}
          subtitle={`${tr("Viewing", "Ansicht für")} ${child.name} · ${child.grade}`}
          activeChildId={activeChildId}
          onSelectChild={selectChild}
        />

        {emergencyAlert && (
          <section
            className="parent-alert-banner"
            aria-labelledby="parent-urgent-notice-title"
          >
            <div className="parent-alert-banner-copy">
              <p className="parent-alert-kicker">
                {tr("Urgent clinic notice", "Dringende Mitteilung der Krankenstation")}
              </p>
              <h2 id="parent-urgent-notice-title">{emergencyAlert.title}</h2>
              <p>{emergencyAlert.message}</p>
              <p className="parent-meta">
                {tr("From", "Von")} {emergencyAlert.sender} · {emergencyAlert.date}
              </p>
            </div>
            <Link
              to="/parent/emergency"
              className="parent-button parent-button-danger"
            >
              {tr("Open emergency channel", "Notfallkanal öffnen")}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        )}

        <DashboardCarousel
          label={tr("Parent navigation", "Eltern-Navigation")}
          slides={slides}
          onOpen={(slide) => navigate(slide.to)}
        />

        <div className="parent-progress-layout">
          <section
            className="parent-panel"
            aria-labelledby="parent-progress-title"
          >
            <div className="parent-panel-heading">
              <div className="parent-panel-heading-copy">
                <h2 id="parent-progress-title">
                  {tr("Child progress", "Lernfortschritt")}
                </h2>
                <p className="parent-meta">
                  {isMetricsReviewed
                    ? tr(
                        `Individual growth profile · Verified by ${metrics.teacherReview.reviewedBy} (${metrics.teacherReview.date})`,
                        `Individuelles Entwicklungsprofil · Geprüft von ${metrics.teacherReview.reviewedBy} (${metrics.teacherReview.date})`
                      )
                    : tr(
                        "Individual growth profile · Pending teacher review",
                        "Individuelles Entwicklungsprofil · Lehrkräfteprüfung ausstehend"
                      )}
                </p>
              </div>
              <span className="parent-meta">{tr("Demo data", "Demodaten")}</span>
            </div>

            {isMetricsReviewed ? (
              <>
                <p className="parent-progress-overall">
                  <span>{tr("Overall standing", "Gesamtstand")}</span>
                  <strong>{metrics.overallScore}</strong>
                  <span className="parent-meta">
                    {metrics.status} · {tr("Attendance", "Anwesenheit")}{" "}
                    {metrics.attendance}
                  </span>
                </p>

                {radarValues.length > 0 ? (
                  <div className="parent-progress-charts">
                    <div
                      className="parent-radar"
                      role="img"
                      aria-label={tr(
                        "Subject progress radar chart. Exact scores are listed alongside.",
                        "Netzdiagramm zum Fachfortschritt. Genaue Werte stehen daneben."
                      )}
                    >
                      <RadarChart data={radarValues} size={320} />
                    </div>

                    <ul
                      className="parent-score-bars"
                      aria-label={tr("Progress scores", "Fortschrittswerte")}
                    >
                      {radarValues.map((metric) => (
                        <li key={metric.label}>
                          <div className="parent-score-bar-label">
                            <span>{metric.label}</span>
                            <span>{metric.value}%</span>
                          </div>
                          <div
                            className="parent-score-bar-track"
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
                  <p className="parent-empty">
                    {tr("No progress scores to show yet.", "Noch keine Fortschrittswerte vorhanden.")}
                  </p>
                )}

                <div className="parent-divider-section">
                  <h3>{tr("Teacher key takeaways", "Wichtigste Einschätzung der Lehrkraft")}</h3>
                  <p>{metrics.keyTakeaways}</p>
                </div>

                <div className="parent-divider-section">
                  <h3>{tr("Evaluation details", "Details zur Auswertung")}</h3>
                  <ul className="parent-bullet-list">
                    {metrics.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>

                <div className="parent-divider-section">
                  <h3>{tr("Individual strengths", "Individuelle Stärken")}</h3>
                  <ul className="parent-check-list">
                    {metrics.strengths.map((strength, index) => (
                      <li key={index}>
                        <CheckIcon className="parent-check-icon" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p className="parent-empty">
                {tr(
                  "Individual progress metrics, strengths, and teacher observations will appear here after the teacher completes their review.",
                  "Individuelle Lernwerte, Stärken und Beobachtungen der Lehrkraft erscheinen hier nach Abschluss der Prüfung."
                )}
              </p>
            )}
          </section>

          <div className="parent-progress-sidebar">
            <section
              className="parent-panel"
              aria-labelledby="parent-focus-title"
            >
              <div className="parent-panel-heading">
                <h2 id="parent-focus-title">
                  {tr("Topics to work on", "Übungsschwerpunkte")}
                </h2>
              </div>

              {!isMetricsReviewed ? (
                <p className="parent-empty">
                  {tr(
                    "Topics to work on will appear here after teacher review.",
                    "Übungsschwerpunkte erscheinen hier nach Prüfung durch die Lehrkraft."
                  )}
                </p>
              ) : metrics.topicsToWorkOn?.length ? (
                <ul className="parent-divided-list">
                  {metrics.topicsToWorkOn.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              ) : (
                <p className="parent-empty">
                  {tr(
                    "No priority focus topics listed right now.",
                    "Derzeit sind keine vorrangigen Übungsthemen eingetragen."
                  )}
                </p>
              )}

              <Link
                to="/parent/chat"
                className="parent-button parent-sidebar-action"
              >
                {tr("Message a teacher", "Lehrkraft schreiben")}
              </Link>
            </section>

            <section
              className="parent-panel"
              aria-labelledby="parent-subjects-title"
            >
              <div className="parent-panel-heading">
                <div className="parent-panel-heading-copy">
                  <h2 id="parent-subjects-title">{tr("Subjects", "Fächer")}</h2>
                  <p className="parent-meta">
                    {tr(
                      "Upcoming deadlines and latest standings",
                      "Nächste Termine und aktueller Leistungsstand"
                    )}
                  </p>
                </div>
              </div>

              {!isGradesConfirmed ? (
                <p className="parent-empty">
                  {tr(
                    "Current subject grades will appear once confirmed by the teacher.",
                    "Aktuelle Fachnoten erscheinen nach Bestätigung durch die Lehrkraft."
                  )}
                </p>
              ) : subjects.length ? (
                <ul className="parent-divided-list">
                  {subjects.map((sub) => (
                    <li key={sub.id} className="parent-subject-item">
                      <div className="parent-subject-top">
                        <h3>{sub.name}</h3>
                        <strong className="parent-subject-grade">
                          {sub.lastGrade}
                        </strong>
                      </div>
                      <p className="parent-meta">
                        {sub.teacher} · {tr("Upcoming:", "Demnächst:")} {sub.upcoming}
                      </p>
                      <Link
                        to={`/parent/grades?subject=${sub.id}`}
                        className="parent-button parent-subject-action"
                        aria-label={tr(
                          `Inspect ${sub.name} grades`,
                          `Noten in ${sub.name} ansehen`
                        )}
                      >
                        {tr("Inspect grades", "Noten ansehen")}{" "}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="parent-empty">
                  {tr("No subject records available yet.", "Noch keine Fachdaten vorhanden.")}
                </p>
              )}

              <Link
                to="/parent/grades"
                className="parent-button parent-button-primary parent-sidebar-action"
              >
                {tr("View all grades & exams", "Alle Noten & Prüfungen ansehen")}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </section>

            {dailyUpdates.length > 0 && (
              <section
                className="parent-panel"
                aria-labelledby="parent-daily-updates-title"
              >
                <div className="parent-panel-heading">
                  <div className="parent-panel-heading-copy">
                    <h2 id="parent-daily-updates-title">
                      {tr("Daily class updates", "Tagesupdates aus dem Unterricht")}
                    </h2>
                    <p className="parent-meta">
                      {tr(
                        "Classroom summaries & upcoming quizzes from teachers",
                        "Unterrichtsrückblick & kommende Tests von Lehrkräften"
                      )}
                    </p>
                  </div>
                </div>
                <ul className="parent-divided-list">
                  {dailyUpdates.slice(0, 3).map((post) => (
                    <li key={post.id} className="parent-subject-item">
                      <p className="parent-meta">
                        {tr("Class", "Klasse")} {post.classId} · {post.date}
                      </p>
                      <p>{post.summary}</p>
                      {post.upcomingAssessments && (
                        <p className="parent-meta">
                          <strong>{tr("Upcoming:", "Demnächst:")}</strong>{" "}
                          {post.upcomingAssessments}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
