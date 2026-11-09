import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { PrinterIcon } from "../../components/StudentIcons";
import { studentData } from "../../data/studentData";
import "../../styles/student-grades.css";

export default function StudentGrades() {
  const { subjectId } = useParams();
  const subjects = studentData.subjects ?? [];
  const currentSubject = subjects.find((subject) => subject.id === subjectId?.toLowerCase());
  const titleRef = useRef(null);
  const reportRef = useRef(null);
  const reportTriggerRef = useRef(null);
  const profile = studentData.profile;

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

  return (
    <div className="student-grades-page">
      <Header role="student" />
      <div className="student-grades">
        <main className="student-grades-container">
          {subjectId ? (
            <>
              <header className="grades-intro">
                <Link className="grades-back-link" to="/student/grades">← Back to grades</Link>
                <h1 ref={titleRef} tabIndex={-1}>{currentSubject?.name ?? "Subject not found"}</h1>
                <p>{currentSubject
                  ? `Grade history · Taught by ${currentSubject.teacher}`
                  : "Choose a subject from your grades overview."}</p>
              </header>

              {currentSubject && (
                <section className="grades-panel" aria-labelledby="history-title">
                  <div className="grades-panel-heading">
                    <h2 id="history-title">Grade history</h2>
                    <p className="grades-overall">Overall grade: <strong>{currentSubject.overall} ({currentSubject.gradeLetter})</strong></p>
                  </div>
                  {currentSubject.history?.length ? (
                    <div className="grades-record-table-scroll" role="region" aria-label={`${currentSubject.name} grade history`} tabIndex={0}>
                      <table className="grades-record-table">
                        <caption className="grades-sr-only">{currentSubject.name} assessment scores, Term 1</caption>
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Assignment</th>
                            <th scope="col">Quiz</th>
                            <th scope="col">Class work</th>
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
                  ) : <p className="grades-empty">No grade history available for this subject yet.</p>}
                  <div className="grades-history-notes">
                    <h3>Term 1 assessment weights</h3>
                    <p>Assignments (40%) · Quizzes (35%) · Class work &amp; lab attendance (25%)</p>
                    <p className="grades-meta">Demo data. Overall grades are provided examples, not calculated from this history.</p>
                  </div>
                </section>
              )}
            </>
          ) : (
            <>
              <header className="grades-intro">
                <h1 ref={titleRef} tabIndex={-1}>Grades</h1>
                <p>Your report card and grades for each subject.</p>
              </header>

              <section className="grades-panel" aria-labelledby="reports-title">
                <div className="grades-panel-heading">
                  <h2 id="reports-title">Report cards</h2>
                  <p className="grades-meta">Demo data</p>
                </div>
                <div className="grades-report-row">
                  <div className="grades-report-copy">
                    <h3>Term 1 report card</h3>
                    <p>Academic year 2026/2027</p>
                    <p className="grades-meta">GPA: <strong>{profile.gpa} / 4.0</strong></p>
                  </div>
                  <button type="button" className="grades-button grades-button-primary" onClick={openReport}>View report</button>
                </div>
              </section>

              <section className="grades-panel" aria-labelledby="subjects-title">
                <div className="grades-panel-heading">
                  <h2 id="subjects-title">Subject grades</h2>
                  <p className="grades-meta">View your scores for each subject.</p>
                </div>
                {subjects.length ? (
                  <ul className="grades-subject-list">
                    {subjects.map((subject) => (
                      <li key={subject.id} className="grades-subject-row">
                        <div>
                          <h3>{subject.name}</h3>
                          <p className="grades-meta">Taught by {subject.teacher}</p>
                        </div>
                        <p className="grades-subject-score">
                          <strong>{subject.overall}</strong>
                          <span className="grades-meta">Grade {subject.gradeLetter}</span>
                        </p>
                        <Link className="grades-button" to={`/student/grades/${subject.id}`} aria-label={`View ${subject.name} grades`}>View grades <span aria-hidden="true">→</span></Link>
                      </li>
                    ))}
                  </ul>
                ) : <p className="grades-empty">No subject grades available yet.</p>}
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
                <h2 id="report-title">Term 1 report card</h2>
                <p className="grades-meta">Zinger School · 2026/2027</p>
              </div>
              <button type="button" className="grades-close" aria-label="Close report" autoFocus onClick={() => reportRef.current.close()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </header>

            <div className="grades-dialog-body">
              <dl className="grades-report-details">
                <div><dt>Student</dt><dd>{profile.name}</dd></div>
                <div><dt>Student ID</dt><dd>{profile.id}</dd></div>
                <div><dt>Grade &amp; class</dt><dd>{profile.grade} · {profile.section}</dd></div>
                <div><dt>Class teacher</dt><dd>{profile.teacher}</dd></div>
                <div><dt>Term GPA</dt><dd>{profile.gpa} / 4.0</dd></div>
              </dl>

              <div className="grades-record-table-scroll" role="region" aria-label="Report card subject scores" tabIndex={0}>
                <table className="grades-record-table grades-report-table">
                  <caption className="grades-sr-only">Term 1 subject grades for {profile.name}</caption>
                  <thead><tr><th scope="col">Subject</th><th scope="col">Teacher</th><th scope="col">Score</th><th scope="col">Grade</th></tr></thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.id}>
                        <th scope="row">{subject.name}</th><td>{subject.teacher}</td><td>{subject.overall}</td><td>{subject.gradeLetter}</td>
                      </tr>
                    ))}
                    {!subjects.length && <tr><td colSpan={4}>No subject grades available yet.</td></tr>}
                  </tbody>
                </table>
              </div>
              <p id="report-demo-note" className="grades-meta">Demo report with example grades. These results are not connected to teacher approval.</p>
            </div>
            <footer className="grades-dialog-footer">
              <div className="grades-actions">
                <button type="button" className="grades-button" disabled aria-describedby="report-pdf-note">Download PDF</button>
                <button type="button" className="grades-button grades-button-primary" onClick={printReport}>
                  <PrinterIcon className="grades-print-icon" /> Print report
                </button>
              </div>
              <p className="grades-meta" id="report-pdf-note">PDF download is unavailable in this demo.</p>
            </footer>
          </div>
        </dialog>
      </div>
    </div>
  );
}
