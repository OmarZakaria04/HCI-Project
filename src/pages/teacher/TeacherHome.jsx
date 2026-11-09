import { Link } from "react-router-dom";
import TeacherQuickLinks from "../../components/TeacherQuickLinks";
import TeacherClassAnalytics from "../../components/TeacherClassAnalytics";
import { papers } from "../../data/teacherData";
import "../../styles/teacher.css";
import "../../styles/teacher-dashboard.css";

// The fixtures use day-month-year school-local times; avoid locale-dependent date parsing.
function submissionDate(value) {
  const match = /^(\d{2})-(\d{2})-(\d{4}) (\d{1,2}):(\d{2}) (AM|PM)$/.exec(value);
  if (!match) return null;
  const [, day, month, year, hour, minute, period] = match;
  if (Number(hour) < 1 || Number(hour) > 12 || Number(minute) > 59) return null;
  const hours = Number(hour) % 12 + (period === "PM" ? 12 : 0);
  const date = new Date(Number(year), Number(month) - 1, Number(day), hours, Number(minute));
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null;
  return {
    order: date.getTime(),
    iso: `${year}-${month}-${day}T${String(hours).padStart(2, "0")}:${minute}`,
    label: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).format(date),
  };
}

export default function TeacherHome() {
  const pending = papers.filter((paper) => paper.status === "Pending")
    .map((paper) => ({ ...paper, date: submissionDate(paper.submitted) }))
    .sort((a, b) => (a.date?.order ?? Infinity) - (b.date?.order ?? Infinity));

  return (
    <div className="teacher-dashboard">
      <header className="teacher-dashboard-welcome">
        <h1>Teacher dashboard</h1>
        <p>{pending.length ? `${pending.length} ${pending.length === 1 ? "paper awaits" : "papers await"} your review.` : "No papers are awaiting review."}</p>
      </header>
      <TeacherQuickLinks pendingCount={pending.length} />
      <section className="teacher-review-queue" aria-labelledby="teacher-review-title">
        <header className="teacher-panel-heading">
          <div><h2 id="teacher-review-title">Papers awaiting review</h2><p>{pending.length} pending{pending.length ? " · Oldest first" : ""}</p></div>
          <Link className="teacher-dashboard-button" to="/teacher/papers">View all papers</Link>
        </header>
        <p className="teacher-review-note">Check extracted answers before grading. Demo review changes do not update this list.</p>
        {pending.length ? (
          <ul className="teacher-review-list">
            {pending.map((paper) => (
              <li key={paper.id}>
                <div>
                  <p className="teacher-review-meta">{paper.paper} · Class {paper.classId}</p>
                  <h3>{paper.student}</h3>
                  <p className="teacher-review-meta">Submitted {paper.date ? <time dateTime={paper.date.iso}>{paper.date.label}</time> : paper.submitted}</p>
                </div>
                <Link className="teacher-dashboard-button" to={`/teacher/papers/${paper.id}`} aria-label={`Review ${paper.paper} by ${paper.student}, class ${paper.classId}`}>Review paper <span aria-hidden="true">→</span></Link>
              </li>
            ))}
          </ul>
        ) : <p className="teacher-review-empty">There are no pending submissions. You can still view previously graded papers.</p>}
      </section>
      <TeacherClassAnalytics />
    </div>
  );
}
