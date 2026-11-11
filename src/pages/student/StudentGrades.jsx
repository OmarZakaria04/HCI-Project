import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { PrinterIcon } from "../../components/StudentIcons";
import { getStudentData } from "../../i18n/studentDataDe";
import { useLanguage } from "../../i18n/useLanguage";
import { getUploadedPapersMap } from "../../utils/teacherStore";
import "../../styles/student-grades.css";

function buildPrintableReportHtml({ profile, subjects, newlyConfirmed, tr }) {
  const rows = subjects
    .map(
      (s) =>
        `<tr><td>${s.name}</td><td>${s.teacher}</td><td>${s.overall}</td><td>${s.gradeLetter}</td></tr>`
    )
    .join("");
  const extraRows = newlyConfirmed
    .map(
      (item) =>
        `<tr><td>${item.title}</td><td>${item.teacher}</td><td>${item.score}%</td><td>${tr("Confirmed", "Bestätigt")}</td></tr>`
    )
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${profile.name} - ${tr("Term 1 report card", "Halbjahreszeugnis")}</title>
<style>
  body { font-family: "Segoe UI", Arial, sans-serif; color: #1e3b2f; max-width: 760px; margin: 40px auto; padding: 0 24px; }
  h1 { margin-bottom: 4px; }
  .meta { color: #40584e; margin-top: 0; }
  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 24px; margin: 20px 0; padding: 16px; background: #f8f5ef; border-radius: 10px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th, td { padding: 10px 12px; border-bottom: 1px solid #d9d0c1; text-align: left; }
  th { background: #f8f5ef; }
  .badge { margin-top: 20px; font-size: 0.9rem; color: #40584e; }
</style>
</head>
<body>
  <h1>${tr("Term 1 report card", "Halbjahreszeugnis (1. Halbjahr)")}</h1>
  <p class="meta">Zinger School · 2026/2027 · ${tr("Confirmed by teachers", "Von Lehrkräften bestätigt")}</p>
  <div class="grid">
    <div><strong>${tr("Student", "Schüler")}:</strong> ${profile.name}</div>
    <div><strong>${tr("Student ID", "Schüler-ID")}:</strong> ${profile.id}</div>
    <div><strong>${tr("Grade & class", "Klassenstufe & Klasse")}:</strong> ${profile.grade} · ${profile.section}</div>
    <div><strong>${tr("Class teacher", "Klassenleitung")}:</strong> ${profile.teacher}</div>
    <div><strong>${tr("Term GPA", "Halbjahresschnitt")}:</strong> ${profile.gpa} / 4.0</div>
  </div>
  <table>
    <thead><tr><th>${tr("Subject", "Fach")}</th><th>${tr("Teacher", "Lehrkraft")}</th><th>${tr("Score", "Punkte")}</th><th>${tr("Grade", "Note")}</th></tr></thead>
    <tbody>${rows}${extraRows}</tbody>
  </table>
  <p class="badge">${tr("Official Zinger student report card generated for home review and printing.", "Offizielles Zinger-Schülerzeugnis zum Speichern und Ausdrucken für zu Hause.")}</p>
</body>
</html>`;
}

export default function StudentGrades() {
  const { subjectId } = useParams();
  const { lang, tr } = useLanguage();
  const studentData = getStudentData(lang);
  const allSubjects = studentData.subjects ?? [];
  const subjects = allSubjects.filter((subject) => subject.confirmedByTeacher !== false);
  const currentSubject = subjects.find((subject) => subject.id === subjectId?.toLowerCase());
  const titleRef = useRef(null);
  const reportRef = useRef(null);
  const reportTriggerRef = useRef(null);
  const [downloadFeedback, setDownloadFeedback] = useState("");
  const profile = studentData.profile;

  const newlyConfirmed = Object.entries(getUploadedPapersMap())
    .filter(([, record]) => record?.uploaded && record?.supervisor === "Confirmed")
    .map(([paperId, record]) => ({
      id: paperId,
      title: record.title || tr("Confirmed class assessment", "Bestätigte Klassenarbeit"),
      teacher: record.teacher || profile.teacher,
      score: record.finalScore ?? 92,
      confirmedDate: record.confirmedDate || tr("Recently confirmed", "Kürzlich bestätigt"),
    }));

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [subjectId]);

  const openReport = (event) => {
    reportTriggerRef.current = event.currentTarget;
    reportRef.current.showModal();
  };

  const printReport = (event) => {
    if (!reportRef.current.open) openReport(event);
    requestAnimationFrame(() => window.print());
  };

  const downloadReport = () => {
    const html = buildPrintableReportHtml({ profile, subjects, newlyConfirmed, tr });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, "_")}_Term1_Report_Card.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDownloadFeedback(
      tr(
        "Report card downloaded. Open it anytime to view or print at home.",
        "Zeugnis heruntergeladen. Du kannst es jederzeit zu Hause öffnen oder drucken."
      )
    );
  };

  return (
    <div className="student-grades-page">
      <Header role="student" />
      <div className="student-grades">
        <main className="student-grades-container">
          {subjectId ? (
            <>
              <header className="grades-intro">
                <Link className="grades-back-link" to="/student/grades">← {tr("Back to grades", "Zurück zu den Noten")}</Link>
                <h1 ref={titleRef} tabIndex={-1}>{currentSubject?.name ?? tr("Subject not found", "Fach nicht gefunden")}</h1>
                <p>{currentSubject
                  ? tr(`Grade history · Taught by ${currentSubject.teacher}`, `Notenverlauf · Unterrichtet von ${currentSubject.teacher}`)
                  : tr("Choose a subject from your grades overview.", "Wähle ein Fach aus deiner Notenübersicht.")}</p>
              </header>

              {currentSubject && (
                <section className="grades-panel" aria-labelledby="history-title">
                  <div className="grades-panel-heading">
                    <h2 id="history-title">{tr("Grade history", "Notenverlauf")}</h2>
                    <p className="grades-overall">{tr("Overall grade:", "Gesamtnote:")} <strong>{currentSubject.overall} ({currentSubject.gradeLetter})</strong></p>
                  </div>
                  {currentSubject.history?.length ? (
                    <div className="grades-record-table-scroll" role="region" aria-label={`${currentSubject.name} ${tr("grade history", "Notenverlauf")}`} tabIndex={0}>
                      <table className="grades-record-table">
                        <caption className="grades-sr-only">{currentSubject.name} {tr("assessment scores, Term 1", "Bewertungen, 1. Halbjahr")}</caption>
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">{tr("Assignment", "Aufgabe")}</th>
                            <th scope="col">{tr("Quiz", "Kurztest")}</th>
                            <th scope="col">{tr("Class work", "Unterricht")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentSubject.history.map((row) => (
                            <tr key={row.rowNumber}>
                              <th scope="row">{row.rowNumber}</th>
                              <td>{row.assignment}</td>
                              <td>{row.quiz}</td>
                              <td>{row.classWork}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <p className="grades-empty">{tr("No grade history available for this subject yet.", "Für dieses Fach liegt noch kein Notenverlauf vor.")}</p>}
                  <div className="grades-history-notes">
                    <h3>{tr("Term 1 assessment weights", "Gewichtung im 1. Halbjahr")}</h3>
                    <p>{tr("Assignments (40%) · Quizzes (35%) · Class work & lab attendance (25%)", "Aufgaben (40 %) · Kurztests (35 %) · Mitarbeit & Labor (25 %)")}</p>
                    <p className="grades-meta">{tr("Demo data. Overall grades are provided examples, not calculated from this history.", "Demodaten. Gesamtnoten sind Beispielwerte und werden nicht aus dieser Tabelle berechnet.")}</p>
                  </div>
                </section>
              )}
            </>
          ) : (
            <>
              <header className="grades-intro">
                <h1 ref={titleRef} tabIndex={-1}>{tr("Grades", "Noten")}</h1>
                <p>{tr("Your report card and grades for each subject.", "Dein Zeugnis und deine Noten für jedes Fach.")}</p>
              </header>

              <section className="grades-panel" aria-labelledby="reports-title">
                <div className="grades-panel-heading">
                  <h2 id="reports-title">{tr("Report cards", "Zeugnisse")}</h2>
                  <p className="grades-confirmed-pill">{tr("Confirmed by teachers", "Von Lehrkräften bestätigt")}</p>
                </div>
                <div className="grades-report-row">
                  <div className="grades-report-copy">
                    <h3>{tr("Term 1 report card", "Halbjahreszeugnis (1. Halbjahr)")}</h3>
                    <p>{tr("Academic year 2026/2027", "Schuljahr 2026/2027")}</p>
                    <p className="grades-meta">{tr("GPA:", "Schnitt:")} <strong>{profile.gpa} / 4.0</strong></p>
                  </div>
                  <button type="button" className="grades-button grades-button-primary" onClick={openReport}>{tr("View & download report", "Zeugnis ansehen & laden")}</button>
                </div>
              </section>

              {newlyConfirmed.length > 0 && (
                <section className="grades-panel" aria-labelledby="recent-confirmed-title">
                  <div className="grades-panel-heading">
                    <h2 id="recent-confirmed-title">{tr("Newly confirmed assessments", "Neu bestätigte Ergebnisse")}</h2>
                    <p className="grades-confirmed-pill">{tr("Teacher & supervisor approved", "Durch Lehrkraft & Leitung bestätigt")}</p>
                  </div>
                  <ul className="grades-subject-list">
                    {newlyConfirmed.map((item) => (
                      <li key={item.id} className="grades-subject-row">
                        <div>
                          <h3>{item.title}</h3>
                          <p className="grades-meta">{tr("Released by", "Freigegeben von")} {item.teacher} · {item.confirmedDate}</p>
                        </div>
                        <p className="grades-subject-score">
                          <strong>{item.score}%</strong>
                          <span className="grades-meta">{tr("Confirmed", "Bestätigt")}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="grades-panel" aria-labelledby="subjects-title">
                <div className="grades-panel-heading">
                  <h2 id="subjects-title">{tr("Subject grades", "Fachnoten")}</h2>
                  <p className="grades-meta">{tr("View your scores for each subject.", "Sieh dir deine Ergebnisse pro Fach an.")}</p>
                </div>
                {subjects.length ? (
                  <ul className="grades-subject-list">
                    {subjects.map((subject) => (
                      <li key={subject.id} className="grades-subject-row">
                        <div>
                          <h3>{subject.name}</h3>
                          <p className="grades-meta">{tr("Taught by", "Unterrichtet von")} {subject.teacher}</p>
                        </div>
                        <p className="grades-subject-score">
                          <strong>{subject.overall}</strong>
                          <span className="grades-meta">{tr("Grade", "Note")} {subject.gradeLetter}</span>
                        </p>
                        <Link className="grades-button" to={`/student/grades/${subject.id}`} aria-label={tr(`View ${subject.name} grades`, `Noten in ${subject.name} ansehen`)}>{tr("View grades", "Noten ansehen")} <span aria-hidden="true">→</span></Link>
                      </li>
                    ))}
                  </ul>
                ) : <p className="grades-empty">{tr("No subject grades available yet.", "Noch keine Fachnoten vorhanden.")}</p>}
              </section>
            </>
          )}
        </main>

        <dialog
          ref={reportRef}
          className="student-grades-dialog"
          aria-labelledby="report-title"
          aria-describedby="report-demo-note"
          onClose={() => reportTriggerRef.current?.focus({ preventScroll: true })}
          onClick={(event) => {
            if (event.target === event.currentTarget) reportRef.current.close();
          }}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const controls = event.currentTarget.querySelectorAll("button:not(:disabled), [tabindex='0']");
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }}
        >
          <div className="grades-dialog-content">
            <header className="grades-dialog-heading">
              <div>
                <h2 id="report-title">{tr("Term 1 report card", "Halbjahreszeugnis (1. Halbjahr)")}</h2>
                <p className="grades-meta">Zinger School · 2026/2027</p>
              </div>
              <button type="button" className="grades-close" aria-label={tr("Close report", "Zeugnis schließen")} autoFocus onClick={() => reportRef.current.close()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </header>

            <div className="grades-dialog-body">
              <dl className="grades-report-details">
                <div><dt>{tr("Student", "Schüler")}</dt><dd>{profile.name}</dd></div>
                <div><dt>{tr("Student ID", "Schüler-ID")}</dt><dd>{profile.id}</dd></div>
                <div><dt>{tr("Grade & class", "Klassenstufe & Klasse")}</dt><dd>{profile.grade} · {profile.section}</dd></div>
                <div><dt>{tr("Class teacher", "Klassenleitung")}</dt><dd>{profile.teacher}</dd></div>
                <div><dt>{tr("Term GPA", "Halbjahresschnitt")}</dt><dd>{profile.gpa} / 4.0</dd></div>
              </dl>

              <div className="grades-record-table-scroll" role="region" aria-label={tr("Report card subject scores", "Fachnoten im Zeugnis")} tabIndex={0}>
                <table className="grades-record-table grades-report-table">
                  <caption className="grades-sr-only">{tr(`Term 1 subject grades for ${profile.name}`, `Fachnoten für ${profile.name}`)}</caption>
                  <thead><tr><th scope="col">{tr("Subject", "Fach")}</th><th scope="col">{tr("Teacher", "Lehrkraft")}</th><th scope="col">{tr("Score", "Punkte")}</th><th scope="col">{tr("Grade", "Note")}</th></tr></thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.id}>
                        <th scope="row">{subject.name}</th><td>{subject.teacher}</td><td>{subject.overall}</td><td>{subject.gradeLetter}</td>
                      </tr>
                    ))}
                    {!subjects.length && <tr><td colSpan={4}>{tr("No subject grades available yet.", "Noch keine Fachnoten vorhanden.")}</td></tr>}
                  </tbody>
                </table>
              </div>
              <p id="report-demo-note" className="grades-meta">{tr("Only grades reviewed and confirmed by your teachers appear on this report card.", "Auf diesem Zeugnis erscheinen nur Noten, die von deinen Lehrkräften geprüft und bestätigt wurden.")}</p>
            </div>
            <footer className="grades-dialog-footer">
              <div className="grades-actions">
                <button type="button" className="grades-button" onClick={downloadReport}>{tr("Download report card", "Zeugnis herunterladen")}</button>
                <button type="button" className="grades-button grades-button-primary" onClick={printReport}>
                  <PrinterIcon className="grades-print-icon" /> {tr("Print report", "Zeugnis drucken")}
                </button>
              </div>
              {downloadFeedback && <p className="grades-meta" role="status">{downloadFeedback}</p>}
            </footer>
          </div>
        </dialog>
      </div>
    </div>
  );
}
