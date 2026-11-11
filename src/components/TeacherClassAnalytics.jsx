import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";
import { getTeacherData } from "../i18n/teacherDataDe";
import RadarChart from "./RadarChart";

export default function TeacherClassAnalytics() {
  const { lang, tr } = useLanguage();
  const { classes, classAnalysis } = getTeacherData(lang);
  const topicName = (name) => (name === "Word Probs" ? tr("Word problems", "Textaufgaben") : name);
  const score = (value) => (Number.isFinite(value) ? `${value}%` : tr("Not available", "Nicht verfügbar"));

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(classes[0]?.id);
  const searchRef = useRef(null);
  const search = query.trim().toLowerCase();
  const matchingClasses = classes.filter((item) => {
    const analysis = classAnalysis[item.id];
    return [item.id, item.name, ...(analysis?.strengths ?? []),
      ...(analysis?.weaknesses ?? []), ...(analysis?.topics ?? []).map((topic) => topicName(topic.label))]
      .join(" ").toLowerCase().includes(search);
  });
  const current = matchingClasses.find((item) => item.id === selectedId) ?? matchingClasses[0];
  const analysis = current ? classAnalysis[current.id] : null;
  const topics = (analysis?.topics ?? [])
    .filter((topic) => Number.isFinite(topic.value) && topic.value >= 0 && topic.value <= 100)
    .map((topic) => ({ ...topic, label: topicName(topic.label) }));

  function clearSearch() {
    setQuery("");
    searchRef.current?.focus();
  }

  return (
    <section className="class-analytics" aria-labelledby="class-analytics-title">
      <header className="teacher-panel-heading">
        <h2 id="class-analytics-title">{tr("Class analytics", "Klassenanalyse")}</h2>
        <span>{tr("Demo data", "Demodaten")}</span>
      </header>

      <div className="class-analytics-controls">
        <div className="class-analytics-classes" role="group" aria-label={tr("Choose a class", "Klasse auswählen")}>
          {classes.map((item) => (
            <button key={item.id} type="button" aria-pressed={item.id === current?.id}
              disabled={!matchingClasses.some((match) => match.id === item.id)}
              onClick={() => setSelectedId(item.id)}>
              {item.name}
            </button>
          ))}
        </div>
        <div className="class-analytics-search">
          <label htmlFor="class-topic-search">{tr("Search classes or topics", "Klassen oder Themen suchen")}</label>
          <div>
            <input ref={searchRef} id="class-topic-search" type="search" value={query}
              placeholder={tr("Try 5A or fractions", "z. B. 5A oder Brüche")} aria-describedby="class-search-status"
              onChange={(event) => setQuery(event.target.value)} />
            <button type="button" onClick={clearSearch} disabled={!query}>{tr("Clear search", "Suche leeren")}</button>
          </div>
        </div>
      </div>

      <p id="class-search-status" className="class-analytics-status" role="status">
        {matchingClasses.length} {matchingClasses.length === 1 ? tr("class", "Klasse") : tr("classes", "Klassen")}{" "}
        {search ? tr("matching your search", "passend zur Suche") : tr("available", "verfügbar")}
        {current ? ` · ${tr("Showing", "Angezeigt:")} ${current.name}` : ""}.
      </p>

      {!current ? (
        <div className="class-analytics-empty">
          <h3>{classes.length ? tr("No matching classes", "Keine passenden Klassen") : tr("No classes available", "Keine Klassen verfügbar")}</h3>
          <p>{classes.length ? tr("Try a class name or topic, or clear your search to see all classes.", "Versuchen Sie einen Klassennamen oder ein Thema, oder leeren Sie die Suche.") : tr("Class analytics will appear when class data is available.", "Klassenanalysen erscheinen, sobald Klassendaten vorliegen.")}</p>
        </div>
      ) : !analysis ? (
        <div className="class-analytics-empty">
          <h3>{current.name}</h3>
          <p>{tr("Analytics are not available for this class yet. Choose another class or open its details.", "Für diese Klasse sind noch keine Analysen verfügbar. Wählen Sie eine andere Klasse oder öffnen Sie die Details.")}</p>
          <Link className="teacher-dashboard-button" to={`/teacher/classes/${current.id}`}>{tr("View class details", "Klassendetails ansehen")}</Link>
        </div>
      ) : (
        <>
          <div className="class-analytics-body">
            <div className="class-analytics-summary">
              <h3>{current.name}</h3>
              <dl className="class-analytics-stats">
                {[[tr("Average", "Durchschnitt"), current.average], [tr("Highest", "Bestwert"), analysis.highest], [tr("Lowest", "Tiefstwert"), analysis.lowest]].map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{score(value)}</dd></div>
                ))}
              </dl>
              <div className="class-analytics-feedback">
                <h4>{tr("Strengths", "Stärken")}</h4>
                <p>{analysis.strengths?.length ? analysis.strengths.join(" · ") : tr("No strengths recorded.", "Keine Stärken hinterlegt.")}</p>
              </div>
              <div className="class-analytics-feedback">
                <h4>{tr("Topics needing practice", "Übungsthemen")}</h4>
                <p>{analysis.weaknesses?.length ? analysis.weaknesses.join(" · ") : tr("No practice topics recorded.", "Keine Übungsthemen hinterlegt.")}</p>
              </div>
              <Link className="teacher-dashboard-button" to={`/teacher/classes/${current.id}`}>
                {tr("View class details", "Klassendetails ansehen")} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="class-analytics-topics">
              <h4>{tr("Topic scores", "Themenwerte")}</h4>
              {topics.length ? (
                <>
                  {topics.length >= 3 && <div className="class-analytics-radar" aria-hidden="true"><RadarChart data={topics} size={400} /></div>}
                  <dl className="class-analytics-scores">
                    {topics.map((topic) => <div key={topic.label}><dt>{topic.label}</dt><dd>{topic.value}%</dd></div>)}
                  </dl>
                </>
              ) : <p>{tr("No topic scores are available for this class yet.", "Für diese Klasse liegen noch keine Themenwerte vor.")}</p>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
