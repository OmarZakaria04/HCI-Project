import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import RadarChart from "../../components/RadarChart";
import { DownloadIcon, PrinterIcon } from "../../components/StudentIcons";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import keepDialogFocus from "../../utils/dialogFocus";
import { getParentTicketsMap, saveParentTicket } from "../../utils/parentStore";
import { getTeacherCommState, saveTeacherCommState } from "../../utils/teacherStore";
import ParentPageIntro, {
  DialogCloseIcon,
  ParentNotice,
} from "./ParentPageIntro";
import { useActiveChild } from "./useActiveChild";
import "../../styles/parent.css";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildReportHtml(child, lang, tr) {
  const rows = (child.reportCard?.subjects || [])
    .map(
      (sub) => `<tr>
        <td>${escapeHtml(sub.name)}</td>
        <td>${escapeHtml(sub.teacher)}</td>
        <td>${escapeHtml(sub.credits)}</td>
        <td>${escapeHtml(sub.grade)}</td>
        <td><strong>${escapeHtml(sub.letter)}</strong></td>
      </tr>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(tr("Report Card", "Zeugnis"))} - ${escapeHtml(child.name)}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #1e3b2f; max-width: 780px; margin: 40px auto; padding: 0 24px; line-height: 1.5; }
    h1 { margin: 0 0 4px; font-size: 24px; }
    p.meta { margin: 0 0 20px; color: #54665c; }
    dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; border: 1px solid #d5ddd6; border-radius: 10px; padding: 16px; margin: 0 0 24px; }
    dt { font-size: 13px; color: #54665c; }
    dd { margin: 2px 0 0; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e2e8e3; }
    th { font-size: 13px; color: #54665c; }
  </style>
</head>
<body>
  <h1>${escapeHtml(tr("Zinger School — Official Academic Report Card", "Zinger School — Offizielles Halbjahreszeugnis"))}</h1>
  <p class="meta">${escapeHtml(child.name)} · ${escapeHtml(child.grade)} · ${escapeHtml(child.reportCard?.term)}</p>
  <dl>
    <div><dt>${escapeHtml(tr("Status", "Status"))}</dt><dd>${escapeHtml(translateValue(child.reportCard?.status, lang))} (${escapeHtml(child.reportCard?.confirmationDate)})</dd></div>
    <div><dt>${escapeHtml(tr("Certified by", "Bestätigt durch"))}</dt><dd>${escapeHtml(child.reportCard?.confirmedBy)}</dd></div>
    <div><dt>${escapeHtml(tr("Cumulative GPA", "Gesamtschnitt (GPA)"))}</dt><dd>${escapeHtml(child.reportCard?.cumulativeGpa)}</dd></div>
    <div><dt>${escapeHtml(tr("Attendance & Conduct", "Anwesenheit & Verhalten"))}</dt><dd>${escapeHtml(child.reportCard?.attendancePercentage)} · ${escapeHtml(child.reportCard?.conduct)}</dd></div>
  </dl>
  <table>
    <thead><tr><th>${escapeHtml(tr("Subject", "Fach"))}</th><th>${escapeHtml(tr("Teacher", "Lehrkraft"))}</th><th>${escapeHtml(tr("Credits", "Wochenstd."))}</th><th>${escapeHtml(tr("Score", "Punkte"))}</th><th>${escapeHtml(tr("Grade", "Note"))}</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

export default function ParentGrades() {
  const location = useLocation();
  const { lang, tr } = useLanguage();
  const { activeChildId, child, selectChild } = useActiveChild();

  const REASON_SUGGESTIONS = [
    tr("Review calculation mistakes over the weekend", "Rechenfehler am Wochenende gemeinsam ansehen"),
    tr("Prepare for upcoming cumulative assessment", "Auf die bevorstehende Gesamtklausur vorbereiten"),
    tr("Clarify multi-step proof grading together", "Bewertung mehrschrittiger Beweise gemeinsam klären"),
    tr("Focus on problem-solving steps at home", "Lösungsschritte zu Hause gezielt üben"),
  ];

  const routeSignature = `${location.search}${location.hash}`;
  const urlParams = new URLSearchParams(location.search);
  const urlSubject = urlParams.get("subject");
  const urlTab = (() => {
    const tabParam = urlParams.get("tab");
    if (tabParam === "history" || tabParam === "exams" || tabParam === "overview") {
      return tabParam;
    }
    if (location.hash === "#exams") return "exams";
    if (urlSubject) return "overview";
    return "overview";
  })();

  const [tabSelection, setTabSelection] = useState({ sig: routeSignature, tab: urlTab });
  const [subjectSelection, setSubjectSelection] = useState({
    sig: routeSignature,
    subjectId: urlSubject || "math",
  });

  const activeTab =
    tabSelection.sig === routeSignature ? tabSelection.tab : urlTab;
  const selectedSubjectId =
    subjectSelection.sig === routeSignature
      ? subjectSelection.subjectId
      : urlSubject || "math";

  const setActiveTab = (tab) => setTabSelection({ sig: routeSignature, tab });
  const setSelectedSubjectId = (subjectId) =>
    setSubjectSelection({ sig: routeSignature, subjectId });

  const [ticketRequestsByChild, setTicketRequestsByChild] = useState(() =>
    getParentTicketsMap()
  );
  const [notice, setNotice] = useState(null);

  const reportDialogRef = useRef(null);
  const reportTriggerRef = useRef(null);

  const [requestExam, setRequestExam] = useState(null);
  const [ticketReason, setTicketReason] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const requestDialogRef = useRef(null);
  const requestTriggerRef = useRef(null);

  const [reviewExam, setReviewExam] = useState(null);
  const reviewDialogRef = useRef(null);
  const reviewTriggerRef = useRef(null);

  const subjects = child.subjects || [];
  const selectedSubject =
    subjects.find((item) => item.id === selectedSubjectId) || subjects[0];
  const subjectIndex = subjects.findIndex(
    (item) => item.id === selectedSubject?.id
  );
  const teacherComm = getTeacherCommState();
  const childTickets = (child.examTickets || []).map((ticket) => {
    const req = ticketRequestsByChild[child.id]?.[ticket.id];
    const inboxId = `ptick-${child.id}-${ticket.id}`;
    const teacherDecision = teacherComm.inboxPatches?.[inboxId];
    if (teacherDecision) {
      return {
        ...ticket,
        status: teacherDecision.status,
        requestDate: req?.requestDate || ticket.requestDate,
        teacherNote: teacherDecision.reply || ticket.teacherNote,
      };
    }
    if (!req) return ticket;
    return {
      ...ticket,
      status: "Pending Approval",
      requestDate: req.requestDate,
      teacherNote: tr(
        "Request sent to teacher inbox. Awaiting teacher approval.",
        "Anfrage an das Lehrkraft-Postfach gesendet. Freigabe steht aus."
      ),
    };
  });
  const childFirstName = child.name.split(" ")[0];
  const isReportCardConfirmed =
    child.reportCard?.status === "Confirmed by Faculty";

  const stepSubject = (direction) => {
    if (subjects.length <= 1) return;
    const nextIdx =
      (subjectIndex + direction + subjects.length) % subjects.length;
    setSelectedSubjectId(subjects[nextIdx].id);
  };

  const openReportDialog = (event) => {
    reportTriggerRef.current = event.currentTarget;
    reportDialogRef.current?.showModal();
  };

  const printReport = (event) => {
    if (!isReportCardConfirmed) return;
    if (!reportDialogRef.current?.open) openReportDialog(event);
    requestAnimationFrame(() => window.print());
  };

  const downloadReport = () => {
    if (!isReportCardConfirmed) return;
    const blob = new Blob([buildReportHtml(child, lang, tr)], {
      type: "text/html;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-card-${child.id}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setNotice({
      text: tr(
        `Downloaded printable report card for ${child.name}.`,
        `Druckfähiges Zeugnis für ${child.name} heruntergeladen.`
      ),
    });
  };

  useEffect(() => {
    if (!requestExam) return;
    const dialog = requestDialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [requestExam]);

  const openRequestDialog = (ticket, event) => {
    requestTriggerRef.current = event.currentTarget;
    setTicketReason("");
    setRequestExam(ticket);
  };

  const closeRequestDialog = () => {
    setRequestExam(null);
    requestAnimationFrame(() =>
      requestTriggerRef.current?.focus({ preventScroll: true })
    );
  };

  const handleSubmitTicket = (event) => {
    event.preventDefault();
    if (!requestExam || isSubmittingTicket) return;
    const targetExam = requestExam;
    const targetChildId = child.id;
    setIsSubmittingTicket(true);

    setTimeout(() => {
      const requestDate = new Date().toLocaleDateString(
        lang === "de" ? "de-DE" : "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );
      const nextTickets = saveParentTicket(targetChildId, targetExam.id, {
        requestDate,
        reason: ticketReason.trim(),
      });
      setTicketRequestsByChild(nextTickets);

      const inboxId = `ptick-${targetChildId}-${targetExam.id}`;
      const prevTeacherComm = getTeacherCommState();
      const existingInbox = prevTeacherComm.addedInboxItems || [];
      if (!existingInbox.some((item) => item.id === inboxId)) {
        saveTeacherCommState({
          ...prevTeacherComm,
          addedInboxItems: [
            {
              id: inboxId,
              parentName: `Parent of ${child.name}`,
              studentName: child.name,
              classId: "5A",
              type: "exam_ticket",
              subject: `Request to view ${targetExam.examTitle}`,
              assessment: `${targetExam.examTitle} (${targetExam.subject})`,
              message:
                ticketReason.trim() ||
                `Please approve parent access to inspect ${child.name}'s graded booklet.`,
              time: requestDate,
              status: "Pending Approval",
              reply: "",
            },
            ...existingInbox,
          ],
        });
      }
      setIsSubmittingTicket(false);
      setNotice({
        text: tr(
          `View ticket recorded for ${targetExam.examTitle} (${targetExam.teacher}).`,
          `Einsichtsanfrage für ${targetExam.examTitle} (${targetExam.teacher}) erfasst.`
        ),
      });
      setRequestExam(null);
      setTicketReason("");
      requestAnimationFrame(() =>
        requestTriggerRef.current?.focus({ preventScroll: true })
      );
    }, 350);
  };

  useEffect(() => {
    if (!reviewExam) return;
    const dialog = reviewDialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [reviewExam]);

  const openReviewDialog = (ticket, event) => {
    reviewTriggerRef.current = event.currentTarget;
    setReviewExam(ticket);
  };

  const closeReviewDialog = () => {
    setReviewExam(null);
    requestAnimationFrame(() =>
      reviewTriggerRef.current?.focus({ preventScroll: true })
    );
  };

  const activeReviewExam = reviewExam
    ? childTickets.find((item) => item.id === reviewExam.id) || reviewExam
    : null;
  const activeRequestExam = requestExam
    ? childTickets.find((item) => item.id === requestExam.id) || requestExam
    : null;

  return (
    <div className="parent-page">
      <Header role="parent" />

      <main className="parent-container">
        <ParentPageIntro
          title={tr("Grades & exams", "Noten & Prüfungen")}
          subtitle={tr(
            `Report card, term progress, and graded exam review for ${child.name} (${child.grade}).`,
            `Zeugnis, Halbjahresverlauf und Prüfungseinsicht für ${child.name} (${child.grade}).`
          )}
          activeChildId={activeChildId}
          onSelectChild={selectChild}
        />

        <ParentNotice notice={notice} onDismiss={() => setNotice(null)} />

        <div
          className="parent-tabs"
          role="tablist"
          aria-label={tr("Grades and assessment sections", "Bereiche für Noten und Prüfungen")}
        >
          <button
            type="button"
            role="tab"
            id="tab-overview"
            aria-selected={activeTab === "overview"}
            aria-controls="panel-overview"
            onClick={() => setActiveTab("overview")}
            className="parent-tab"
          >
            {tr("Report card & subjects", "Zeugnis & Fächer")}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-history"
            aria-selected={activeTab === "history"}
            aria-controls="panel-history"
            onClick={() => setActiveTab("history")}
            className="parent-tab"
          >
            {tr("Progress history", "Entwicklungsverlauf")}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-exams"
            aria-selected={activeTab === "exams"}
            aria-controls="panel-exams"
            onClick={() => setActiveTab("exams")}
            className="parent-tab"
          >
            {tr("Exam access tickets", "Prüfungseinsicht")} ({childTickets.length})
          </button>
        </div>

        {activeTab === "overview" && (
          <div
            id="panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            className="parent-tab-panel"
          >
            <section
              className="parent-panel"
              aria-labelledby="parent-report-heading"
            >
              <div className="parent-panel-heading">
                <div className="parent-panel-heading-copy">
                  <h2 id="parent-report-heading">
                    {tr("Term report card", "Halbjahreszeugnis")}
                  </h2>
                  <p className="parent-meta">{child.reportCard?.term}</p>
                </div>
                <span className="parent-meta">
                  {isReportCardConfirmed
                    ? `${translateValue(child.reportCard.status, lang)} · ${child.reportCard.confirmationDate}`
                    : translateValue(child.reportCard?.status, lang) ||
                      tr("Pending teacher confirmation", "Bestätigung durch Lehrkraft ausstehend")}
                </span>
              </div>

              {isReportCardConfirmed ? (
                <div className="parent-report-row">
                  <div className="parent-report-copy">
                    <h3>{tr("Confirmed academic record", "Bestätigter Leistungsnachweis")}</h3>
                    <dl className="parent-report-facts">
                      <div>
                        <dt>{tr("Cumulative GPA", "Gesamtschnitt (GPA)")}</dt>
                        <dd>{child.reportCard.cumulativeGpa}</dd>
                      </div>
                      <div>
                        <dt>{tr("Attendance", "Anwesenheit")}</dt>
                        <dd>{child.reportCard.attendancePercentage}</dd>
                      </div>
                      <div>
                        <dt>{tr("Conduct", "Verhalten")}</dt>
                        <dd>{child.reportCard.conduct}</dd>
                      </div>
                    </dl>
                    <p className="parent-meta">
                      {tr("Certified by", "Bestätigt durch")}{" "}
                      {child.reportCard.confirmedBy}
                    </p>
                  </div>

                  <div className="parent-actions-row">
                    <button
                      type="button"
                      onClick={openReportDialog}
                      className="parent-button parent-button-primary"
                    >
                      {tr("View report", "Zeugnis ansehen")}
                    </button>
                    <button
                      type="button"
                      onClick={downloadReport}
                      className="parent-button"
                    >
                      <DownloadIcon className="parent-icon-inline" />
                      {tr("Download report", "Zeugnis herunterladen")}
                    </button>
                    <button
                      type="button"
                      onClick={printReport}
                      className="parent-button"
                    >
                      <PrinterIcon className="parent-icon-inline" />
                      {tr("Print report", "Zeugnis drucken")}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="parent-empty">
                  {tr(
                    "This term report card is awaiting teacher confirmation. Grades and printable/downloadable copies will appear once confirmed.",
                    "Dieses Halbjahreszeugnis wartet auf die Bestätigung der Lehrkraft. Noten sowie Druck- und Download-Optionen erscheinen danach."
                  )}
                </p>
              )}
            </section>

            <section
              className="parent-panel"
              aria-labelledby="parent-subject-breakdown-heading"
            >
              <div className="parent-panel-heading">
                <div className="parent-panel-heading-copy">
                  <h2 id="parent-subject-breakdown-heading">
                    {tr("Subject breakdown", "Fachübersicht")}
                  </h2>
                  <p className="parent-meta">
                    {tr(
                      "Select a subject to inspect evaluation scores and teacher observations",
                      "Wählen Sie ein Fach aus, um Einzelnoten und Beobachtungen anzusehen"
                    )}
                  </p>
                </div>
                <span className="parent-meta">{tr("Demo data", "Demodaten")}</span>
              </div>

              {!isReportCardConfirmed ? (
                <p className="parent-empty">
                  {tr(
                    `Current subject grades for ${child.name} will appear here once confirmed by the teacher.`,
                    `Aktuelle Fachnoten für ${child.name} erscheinen nach Bestätigung durch die Lehrkraft.`
                  )}
                </p>
              ) : selectedSubject ? (
                <>
                  <div className="parent-subject-toolbar">
                    <div className="parent-field parent-subject-select-wrap">
                      <label htmlFor="parent-subject-select">
                        {tr("Subject", "Fach")}
                      </label>
                      <select
                        id="parent-subject-select"
                        className="parent-select"
                        value={selectedSubject.id}
                        onChange={(event) =>
                          setSelectedSubjectId(event.target.value)
                        }
                      >
                        {subjects.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name} — {sub.lastGrade}
                          </option>
                        ))}
                      </select>
                    </div>

                    {subjects.length > 1 && (
                      <div className="parent-subject-step-buttons">
                        <button
                          type="button"
                          onClick={() => stepSubject(-1)}
                          className="parent-button"
                        >
                          <span aria-hidden="true">←</span>{" "}
                          {tr("Previous subject", "Vorheriges Fach")}
                        </button>
                        <button
                          type="button"
                          onClick={() => stepSubject(1)}
                          className="parent-button"
                        >
                          {tr("Next subject", "Nächstes Fach")}{" "}
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="parent-divider-section">
                    <h3>
                      {selectedSubject.name} · {selectedSubject.lastGrade}
                    </h3>
                    <p className="parent-meta">
                      {tr("Teacher:", "Lehrkraft:")} {selectedSubject.teacher} ·{" "}
                      {tr("Upcoming:", "Demnächst:")} {selectedSubject.upcoming}
                    </p>

                    <div
                      className="parent-table-scroll"
                      role="region"
                      aria-label={tr(
                        `${selectedSubject.name} evaluation scores`,
                        `Einzelbewertungen in ${selectedSubject.name}`
                      )}
                      tabIndex={0}
                    >
                      <table className="parent-table">
                        <caption className="parent-sr-only">
                          {tr(
                            `${selectedSubject.name} assignments, quizzes, and class work`,
                            `${selectedSubject.name}: Aufgaben, Kurztests und Mitarbeit`
                          )}
                        </caption>
                        <thead>
                          <tr>
                            <th scope="col">{tr("Evaluation", "Bewertung")}</th>
                            <th scope="col">{tr("Assignment", "Aufgabe")}</th>
                            <th scope="col">{tr("Quiz", "Kurztest")}</th>
                            <th scope="col">{tr("Class work", "Unterricht")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedSubject.gradesTable.map((row) => (
                            <tr key={row.id}>
                              <th scope="row">
                                {tr(`Set #${row.id}`, `Block #${row.id}`)}
                              </th>
                              <td>{row.assignment}</td>
                              <td>{row.quiz}</td>
                              <td>{row.classWork}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="parent-divider-section parent-two-col">
                    <div>
                      <h3>{tr("Teacher observations", "Beobachtungen der Lehrkraft")}</h3>
                      <ul className="parent-bullet-list">
                        {selectedSubject.analysis.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>

                      <div className="parent-divider-section">
                        <h3>{tr("Key takeaways", "Wichtigste Einschätzung")}</h3>
                        <p>{selectedSubject.analysis.keyTakeaways}</p>
                        <p className="parent-meta">
                          {tr("Notable work:", "Besondere Leistung:")}{" "}
                          {selectedSubject.analysis.excellentWork}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3>{tr("Skill metrics", "Kompetenzprofil")}</h3>
                      <div
                        className="parent-radar"
                        role="img"
                        aria-label={tr(
                          `${selectedSubject.name} metrics chart. Exact values listed below.`,
                          `Kompetenzdiagramm für ${selectedSubject.name}. Genaue Werte stehen darunter.`
                        )}
                      >
                        <RadarChart
                          data={selectedSubject.analysis.radarValues}
                          size={280}
                        />
                      </div>
                      <ul className="parent-score-bars">
                        {selectedSubject.analysis.radarValues.map((metric) => (
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
                  </div>
                </>
              ) : (
                <p className="parent-empty">
                  {tr(
                    `No subject records are available for ${child.name} yet.`,
                    `Für ${child.name} liegen noch keine Fachdaten vor.`
                  )}
                </p>
              )}
            </section>
          </div>
        )}

        {activeTab === "history" && (
          <div
            id="panel-history"
            role="tabpanel"
            aria-labelledby="tab-history"
            className="parent-tab-panel"
          >
            <section
              className="parent-panel"
              aria-labelledby="parent-history-heading"
            >
              <div className="parent-panel-heading">
                <div className="parent-panel-heading-copy">
                  <h2 id="parent-history-heading">
                    {tr("Term progress comparison", "Halbjahresvergleich")}
                  </h2>
                  <p className="parent-meta">
                    {tr(
                      "Compare previous year, midterm, and current term scores",
                      "Vergleich von Vorjahr, Zwischenstand und aktuellem Halbjahr"
                    )}
                  </p>
                </div>
                <span className="parent-meta">{tr("Demo data", "Demodaten")}</span>
              </div>

              <div
                className="parent-table-scroll"
                role="region"
                aria-label={tr("Term progress comparison table", "Vergleichstabelle Halbjahre")}
                tabIndex={0}
              >
                <table className="parent-table">
                  <caption className="parent-sr-only">
                    {tr(
                      `Term-by-term score comparison for ${child.name}`,
                      `Notenvergleich über mehrere Halbjahre für ${child.name}`
                    )}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">{tr("Subject", "Fach")}</th>
                      <th scope="col">{tr("Previous year", "Vorjahr")}</th>
                      <th scope="col">{tr("Midterm", "Zwischenstand")}</th>
                      <th scope="col">{tr("Current term", "Aktuelles Halbjahr")}</th>
                      <th scope="col">{tr("Change", "Veränderung")}</th>
                      <th scope="col">{tr("Teacher notes", "Anmerkungen")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {child.progressHistory.comparisons.map((item) => (
                      <tr key={item.subject}>
                        <th scope="row">{item.subject}</th>
                        <td>{item.previous}%</td>
                        <td>{item.midterm}%</td>
                        <td>
                          <strong>{item.current}%</strong>
                        </td>
                        <td>{item.change}</td>
                        <td>{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="parent-two-col">
              <section
                className="parent-panel"
                aria-labelledby="parent-improved-heading"
              >
                <div className="parent-panel-heading">
                  <h2 id="parent-improved-heading">
                    {tr("What has improved", "Was sich verbessert hat")}
                  </h2>
                </div>
                <ul className="parent-divided-list">
                  {child.progressHistory.improvements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>

              <section
                className="parent-panel"
                aria-labelledby="parent-needs-work-heading"
              >
                <div className="parent-panel-heading">
                  <h2 id="parent-needs-work-heading">
                    {tr("What still needs work", "Wo noch Übungsbedarf besteht")}
                  </h2>
                </div>
                <ul className="parent-divided-list">
                  {child.progressHistory.areasNeedingWork.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}

        {activeTab === "exams" && (
          <div
            id="panel-exams"
            role="tabpanel"
            aria-labelledby="tab-exams"
            className="parent-tab-panel"
          >
            <section
              className="parent-panel"
              aria-labelledby="parent-tickets-heading"
            >
              <div className="parent-panel-heading">
                <div className="parent-panel-heading-copy">
                  <h2 id="parent-tickets-heading">
                    {tr("Exam & quiz access tickets", "Anträge auf Prüfungseinsicht")}
                  </h2>
                  <p className="parent-meta">
                    {tr(
                      "Request access to view graded exam booklets, questions, and teacher comments",
                      "Beantragen Sie Einsicht in korrigierte Arbeiten, Aufgaben und Kommentare der Lehrkraft"
                    )}
                  </p>
                </div>
                <span className="parent-meta">{tr("Demo data", "Demodaten")}</span>
              </div>

              {childTickets.length ? (
                <ul className="parent-divided-list">
                  {childTickets.map((ticket) => {
                    const isApproved = ticket.status === "Approved";
                    const isPending = ticket.status === "Pending Approval";

                    return (
                      <li key={ticket.id} className="parent-ticket-row">
                        <div>
                          <div className="parent-ticket-head">
                            <h3>{ticket.examTitle}</h3>
                            <span className="parent-status-tag">
                              {translateValue(ticket.status, lang)}
                            </span>
                          </div>
                          <p className="parent-meta">
                            {ticket.subject} · {ticket.teacher} ·{" "}
                            {tr("Exam date", "Prüfungsdatum")} {ticket.examDate} ·{" "}
                            {tr("Score", "Ergebnis")} {ticket.score}
                          </p>
                          <p>{ticket.teacherNote}</p>
                        </div>

                        <div>
                          {isApproved ? (
                            <button
                              type="button"
                              onClick={(event) => openReviewDialog(ticket, event)}
                              className="parent-button parent-button-primary"
                            >
                              {tr("View graded paper", "Korrigierte Arbeit ansehen")}
                            </button>
                          ) : isPending ? (
                            <p className="parent-meta">
                              {tr("Awaiting teacher review", "Wartet auf Freigabe durch Lehrkraft")}
                              {ticket.requestDate
                                ? ` · ${tr("Requested", "Beantragt")} ${ticket.requestDate}`
                                : ""}
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={(event) => openRequestDialog(ticket, event)}
                              className="parent-button"
                            >
                              {tr("Request view ticket", "Einsicht beantragen")}
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="parent-empty">
                  {tr(
                    `No graded exam records listed for ${child.name} yet.`,
                    `Für ${child.name} sind noch keine korrigierten Prüfungen hinterlegt.`
                  )}
                </p>
              )}
            </section>
          </div>
        )}
      </main>

      <dialog
        ref={reportDialogRef}
        className="parent-dialog parent-dialog-wide"
        aria-labelledby="parent-report-dialog-title"
        aria-describedby="parent-report-demo-note"
        onClose={() =>
          reportTriggerRef.current?.focus({ preventScroll: true })
        }
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            reportDialogRef.current?.close();
          }
        }}
        onKeyDown={keepDialogFocus}
      >
        <div className="parent-dialog-content">
          <header className="parent-dialog-header">
            <div>
              <h2 id="parent-report-dialog-title">
                {tr("Official academic report card", "Offizielles Halbjahreszeugnis")}
              </h2>
              <p className="parent-meta">
                {child.name} · {child.grade} · {child.reportCard?.term}
              </p>
            </div>
            <button
              type="button"
              className="parent-dialog-close"
              aria-label={tr("Close report card", "Zeugnis schließen")}
              autoFocus
              onClick={() => reportDialogRef.current?.close()}
            >
              <DialogCloseIcon />
            </button>
          </header>

          <div className="parent-dialog-body">
            <dl className="parent-dialog-facts">
              <div>
                <dt>{tr("Status", "Status")}</dt>
                <dd>
                  {translateValue(child.reportCard?.status, lang)} (
                  {child.reportCard?.confirmationDate})
                </dd>
              </div>
              <div>
                <dt>{tr("Certified by", "Bestätigt durch")}</dt>
                <dd>{child.reportCard?.confirmedBy}</dd>
              </div>
              <div>
                <dt>{tr("Cumulative GPA", "Gesamtschnitt (GPA)")}</dt>
                <dd>{child.reportCard?.cumulativeGpa}</dd>
              </div>
              <div>
                <dt>{tr("Attendance & conduct", "Anwesenheit & Verhalten")}</dt>
                <dd>
                  {child.reportCard?.attendancePercentage} ·{" "}
                  {child.reportCard?.conduct}
                </dd>
              </div>
            </dl>

            <div
              className="parent-table-scroll"
              role="region"
              aria-label={tr("Report card subject scores", "Fachnoten im Zeugnis")}
              tabIndex={0}
            >
              <table className="parent-table">
                <caption className="parent-sr-only">
                  {tr(
                    `Term report card grades for ${child.name}`,
                    `Halbjahresnoten für ${child.name}`
                  )}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{tr("Subject", "Fach")}</th>
                    <th scope="col">{tr("Teacher", "Lehrkraft")}</th>
                    <th scope="col">{tr("Credits", "Wochenstd.")}</th>
                    <th scope="col">{tr("Score", "Punkte")}</th>
                    <th scope="col">{tr("Grade", "Note")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(child.reportCard?.subjects || []).map((sub, idx) => (
                    <tr key={idx}>
                      <th scope="row">{sub.name}</th>
                      <td>{sub.teacher}</td>
                      <td>{sub.credits}</td>
                      <td>{sub.grade}</td>
                      <td>
                        <strong>{sub.letter}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p id="parent-report-demo-note" className="parent-meta">
              {tr(
                "Demo report with example grades. Printing uses your browser's print dialog.",
                "Demo-Zeugnis mit Beispielnoten. Zum Drucken wird der Druckdialog Ihres Browsers geöffnet."
              )}
            </p>
          </div>

          <footer className="parent-dialog-footer">
            <div className="parent-dialog-footer-actions">
              <button
                type="button"
                className="parent-button"
                onClick={downloadReport}
                aria-describedby="parent-report-export-note"
              >
                <DownloadIcon className="parent-icon-inline" />
                {tr("Download report", "Zeugnis herunterladen")}
              </button>
              <button
                type="button"
                className="parent-button parent-button-primary"
                onClick={printReport}
              >
                <PrinterIcon className="parent-icon-inline" />
                {tr("Print report", "Zeugnis drucken")}
              </button>
            </div>
            <p className="parent-meta" id="parent-report-export-note">
              {tr(
                "Downloads an offline printable HTML copy, or use Print to save as PDF.",
                "Lädt eine druckfähige HTML-Kopie herunter, oder nutzen Sie Drucken zum Speichern als PDF."
              )}
            </p>
          </footer>
        </div>
      </dialog>

      <dialog
        ref={requestDialogRef}
        className="parent-dialog"
        aria-labelledby="parent-ticket-dialog-title"
        onClose={closeRequestDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            requestDialogRef.current?.close();
          }
        }}
        onKeyDown={keepDialogFocus}
      >
        {activeRequestExam && (
          <form className="parent-dialog-content" onSubmit={handleSubmitTicket}>
            <header className="parent-dialog-header">
              <div>
                <h2 id="parent-ticket-dialog-title">
                  {tr("Request exam access ticket", "Prüfungseinsicht beantragen")}
                </h2>
                <p className="parent-meta">{activeRequestExam.examTitle}</p>
              </div>
              <button
                type="button"
                className="parent-dialog-close"
                aria-label={tr("Close ticket request", "Antragsfenster schließen")}
                onClick={() => requestDialogRef.current?.close()}
              >
                <DialogCloseIcon />
              </button>
            </header>

            <div className="parent-dialog-body">
              <dl className="parent-dialog-facts">
                <div>
                  <dt>{tr("Teacher", "Lehrkraft")}</dt>
                  <dd>
                    {activeRequestExam.teacher} ({activeRequestExam.subject})
                  </dd>
                </div>
                <div>
                  <dt>{tr("Exam date", "Prüfungsdatum")}</dt>
                  <dd>{activeRequestExam.examDate}</dd>
                </div>
              </dl>

              <div className="parent-field">
                <label>{tr("Suggested reasons", "Vorgeschlagene Begründung")}</label>
                <div className="parent-starter-group">
                  {REASON_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      aria-pressed={ticketReason === suggestion}
                      onClick={() => setTicketReason(suggestion)}
                      className="parent-button parent-button-quiet"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="parent-field">
                <label htmlFor="parent-ticket-reason">
                  {tr("Note to teacher (optional)", "Nachricht an Lehrkraft (optional)")}
                </label>
                <textarea
                  id="parent-ticket-reason"
                  rows={3}
                  autoFocus
                  className="parent-textarea"
                  value={ticketReason}
                  onChange={(event) => setTicketReason(event.target.value)}
                  placeholder={tr(
                    `e.g. Would like to review mistakes with ${childFirstName} over the weekend.`,
                    `z. B. Wir möchten die Fehler am Wochenende gemeinsam mit ${childFirstName} ansehen.`
                  )}
                />
              </div>

              <p className="parent-meta">
                {tr(
                  "Demo request. Status updates stay on this page and are not sent to the teacher.",
                  "Demo-Anfrage. Statusänderungen bleiben auf dieser Seite und werden nicht an die Lehrkraft gesendet."
                )}
              </p>
            </div>

            <footer className="parent-dialog-footer">
              <div className="parent-dialog-footer-actions">
                <button
                  type="button"
                  className="parent-button"
                  onClick={() => requestDialogRef.current?.close()}
                >
                  {tr("Cancel", "Abbrechen")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="parent-button parent-button-primary"
                >
                  {isSubmittingTicket
                    ? tr("Submitting...", "Wird gesendet...")
                    : tr("Submit ticket", "Antrag senden")}
                </button>
              </div>
            </footer>
          </form>
        )}
      </dialog>

      <dialog
        ref={reviewDialogRef}
        className="parent-dialog parent-dialog-wide"
        aria-labelledby="parent-exam-review-title"
        onClose={closeReviewDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            reviewDialogRef.current?.close();
          }
        }}
        onKeyDown={keepDialogFocus}
      >
        {activeReviewExam && (
          <div className="parent-dialog-content">
            <header className="parent-dialog-header">
              <div>
                <h2 id="parent-exam-review-title">{activeReviewExam.examTitle}</h2>
                <p className="parent-meta">
                  {activeReviewExam.subject} · {tr("Score", "Ergebnis")}{" "}
                  {activeReviewExam.score} · {tr("Reviewed by", "Geprüft von")}{" "}
                  {activeReviewExam.teacher}
                </p>
              </div>
              <button
                type="button"
                className="parent-dialog-close"
                aria-label={tr("Close graded paper", "Korrigierte Arbeit schließen")}
                autoFocus
                onClick={() => reviewDialogRef.current?.close()}
              >
                <DialogCloseIcon />
              </button>
            </header>

            <div className="parent-dialog-body">
              <p>
                <strong>{tr("Teacher note:", "Hinweis der Lehrkraft:")}</strong>{" "}
                {activeReviewExam.teacherNote}
              </p>

              {activeReviewExam.questions?.length ? (
                <ul className="parent-divided-list">
                  {activeReviewExam.questions.map((q) => (
                    <li key={q.num}>
                      <div className="parent-ticket-head">
                        <h3>{tr(`Question ${q.num}`, `Aufgabe ${q.num}`)}</h3>
                        <span
                          className={`parent-status-tag ${
                            q.isCorrect ? "" : "parent-status-tag-urgent"
                          }`}
                        >
                          {q.isCorrect
                            ? tr(`Correct (${q.points})`, `Richtig (${q.points})`)
                            : tr(`Needs review (${q.points})`, `Prüfen (${q.points})`)}
                        </span>
                      </div>

                      <p>{q.prompt}</p>

                      <div className="parent-question-answer-grid">
                        <div className="parent-answer-box">
                          <p className="parent-meta">
                            {tr(`${childFirstName}'s answer`, `Antwort von ${childFirstName}`)}
                          </p>
                          <p>
                            <strong>{q.studentAnswer}</strong>
                          </p>
                        </div>

                        {!q.isCorrect && (
                          <div className="parent-answer-box">
                            <p className="parent-meta">
                              {tr("Expected solution", "Erwartete Lösung")}
                            </p>
                            <p>
                              <strong>{q.correctAnswer}</strong>
                            </p>
                          </div>
                        )}
                      </div>

                      <p className="parent-meta">
                        <strong>{tr("Teacher feedback:", "Rückmeldung:")}</strong>{" "}
                        {q.feedback}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="parent-empty">
                  {tr(
                    "No question details are attached to this paper.",
                    "Für diese Arbeit liegen keine Aufgabendetails vor."
                  )}
                </p>
              )}
            </div>

            <footer className="parent-dialog-footer">
              <div className="parent-dialog-footer-actions">
                <button
                  type="button"
                  className="parent-button parent-button-primary"
                  onClick={() => reviewDialogRef.current?.close()}
                >
                  {tr("Close", "Schließen")}
                </button>
              </div>
            </footer>
          </div>
        )}
      </dialog>
    </div>
  );
}
