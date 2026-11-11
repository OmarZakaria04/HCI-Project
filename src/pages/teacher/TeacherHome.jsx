import { Link } from "react-router-dom";
import TeacherQuickLinks from "../../components/TeacherQuickLinks";
import TeacherClassAnalytics from "../../components/TeacherClassAnalytics";
import { getTeacherData } from "../../i18n/teacherDataDe";
import { useLanguage } from "../../i18n/useLanguage";
import submissionDate from "../../utils/submissionDate";
import { getUploadedPapersMap } from "../../utils/teacherStore";
import "../../styles/teacher.css";
import "../../styles/teacher-dashboard.css";

export default function TeacherHome() {
  const { lang, tr } = useLanguage();
  const { papers: basePapers } = getTeacherData(lang);
  const uploadedMap = getUploadedPapersMap();
  const papers = basePapers.map((paper) =>
    uploadedMap[String(paper.id)]?.uploaded ? { ...paper, status: "Graded" } : paper,
  );
  const pending = papers.filter((paper) => paper.status === "Pending")
    .map((paper) => ({ ...paper, date: submissionDate(paper.submitted, lang) }))
    .sort((a, b) => (a.date?.order ?? Infinity) - (b.date?.order ?? Infinity));

  return (
    <div className="teacher-dashboard">
      <header className="teacher-dashboard-welcome">
        <h1>{tr("Teacher dashboard", "Lehrkräfte-Übersicht")}</h1>
        <p>
          {pending.length
            ? lang === "de"
              ? `${pending.length} ${pending.length === 1 ? "Arbeit wartet" : "Arbeiten warten"} auf Ihre Prüfung.`
              : `${pending.length} ${pending.length === 1 ? "paper awaits" : "papers await"} your review.`
            : tr("No papers are awaiting review.", "Derzeit warten keine Arbeiten auf Prüfung.")}
        </p>
      </header>
      <TeacherQuickLinks pendingCount={pending.length} />
      <section className="teacher-review-queue" aria-labelledby="teacher-review-title">
        <header className="teacher-panel-heading">
          <div>
            <h2 id="teacher-review-title">{tr("Papers awaiting review", "Zu prüfende Arbeiten")}</h2>
            <p>
              {pending.length} {tr("pending", "ausstehend")}
              {pending.length ? tr(" · Oldest first", " · Älteste zuerst") : ""}
            </p>
          </div>
          <Link className="teacher-dashboard-button" to="/teacher/papers">
            {tr("View all papers", "Alle Arbeiten ansehen")}
          </Link>
        </header>
        <p className="teacher-review-note">
          {tr(
            "Check extracted answers before grading. Confirmed and published papers update this list automatically.",
            "Prüfen Sie ausgelesene Antworten vor der Bewertung. Bestätigte und veröffentlichte Arbeiten aktualisieren diese Liste automatisch.",
          )}
        </p>
        {pending.length ? (
          <ul className="teacher-review-list">
            {pending.map((paper) => (
              <li key={paper.id}>
                <div>
                  <p className="teacher-review-meta">
                    {paper.paper} · {tr("Class", "Klasse")} {paper.classId}
                  </p>
                  <h3>{paper.student}</h3>
                  <p className="teacher-review-meta">
                    {tr("Submitted", "Eingereicht")}{" "}
                    {paper.date ? <time dateTime={paper.date.iso}>{paper.date.label}</time> : paper.submitted}
                  </p>
                </div>
                <Link
                  className="teacher-dashboard-button"
                  to={`/teacher/papers/${paper.id}`}
                  aria-label={tr(
                    `Review ${paper.paper} by ${paper.student}, class ${paper.classId}`,
                    `${paper.paper} von ${paper.student}, Klasse ${paper.classId} prüfen`,
                  )}
                >
                  {tr("Review paper", "Arbeit prüfen")} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="teacher-review-empty">
            {tr(
              "There are no pending submissions. You can still view previously graded papers.",
              "Es gibt keine ausstehenden Abgaben. Bereits bewertete Arbeiten können weiterhin eingesehen werden.",
            )}
          </p>
        )}
      </section>
      <TeacherClassAnalytics />
    </div>
  );
}
