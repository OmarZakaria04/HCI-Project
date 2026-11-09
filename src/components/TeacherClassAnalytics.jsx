import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { classes, classAnalysis } from "../data/teacherData";
import RadarChart from "./RadarChart";

const topicName = (name) => name === "Word Probs" ? "Word problems" : name;
const score = (value) => Number.isFinite(value) ? `${value}%` : "Not available";

export default function TeacherClassAnalytics() {
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
        <h2 id="class-analytics-title">Class analytics</h2>
        <span>Demo data</span>
      </header>

      <div className="class-analytics-controls">
        <div className="class-analytics-classes" role="group" aria-label="Choose a class">
          {classes.map((item) => (
            <button key={item.id} type="button" aria-pressed={item.id === current?.id}
              disabled={!matchingClasses.some((match) => match.id === item.id)}
              onClick={() => setSelectedId(item.id)}>
              {item.name}
            </button>
          ))}
        </div>
        <div className="class-analytics-search">
          <label htmlFor="class-topic-search">Search classes or topics</label>
          <div>
            <input ref={searchRef} id="class-topic-search" type="search" value={query}
              placeholder="Try 5A or fractions" aria-describedby="class-search-status"
              onChange={(event) => setQuery(event.target.value)} />
            <button type="button" onClick={clearSearch} disabled={!query}>Clear search</button>
          </div>
        </div>
      </div>

      <p id="class-search-status" className="class-analytics-status" role="status">
        {matchingClasses.length} {matchingClasses.length === 1 ? "class" : "classes"}
        {search ? " matching your search" : " available"}
        {current ? ` · Showing ${current.name}` : ""}.
      </p>

      {!current ? (
        <div className="class-analytics-empty">
          <h3>{classes.length ? "No matching classes" : "No classes available"}</h3>
          <p>{classes.length ? "Try a class name or topic, or clear your search to see all classes." : "Class analytics will appear when class data is available."}</p>
        </div>
      ) : !analysis ? (
        <div className="class-analytics-empty">
          <h3>{current.name}</h3>
          <p>Analytics are not available for this class yet. Choose another class or open its details.</p>
          <Link className="teacher-dashboard-button" to={`/teacher/classes/${current.id}`}>View class details</Link>
        </div>
      ) : (
        <>
          <div className="class-analytics-body">
            <div className="class-analytics-summary">
              <h3>{current.name}</h3>
              <dl className="class-analytics-stats">
                {[['Average', current.average], ['Highest', analysis.highest], ['Lowest', analysis.lowest]].map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{score(value)}</dd></div>
                ))}
              </dl>
              <div className="class-analytics-feedback">
                <h4>Strengths</h4>
                <p>{analysis.strengths?.length ? analysis.strengths.join(" · ") : "No strengths recorded."}</p>
              </div>
              <div className="class-analytics-feedback">
                <h4>Topics needing practice</h4>
                <p>{analysis.weaknesses?.length ? analysis.weaknesses.join(" · ") : "No practice topics recorded."}</p>
              </div>
              <Link className="teacher-dashboard-button" to={`/teacher/classes/${current.id}`}>
                View class details <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="class-analytics-topics">
              <h4>Topic scores</h4>
              {topics.length ? (
                <>
                  {topics.length >= 3 && <div className="class-analytics-radar" aria-hidden="true"><RadarChart data={topics} size={400} /></div>}
                  <dl className="class-analytics-scores">
                    {topics.map((topic) => <div key={topic.label}><dt>{topic.label}</dt><dd>{topic.value}%</dd></div>)}
                  </dl>
                </>
              ) : <p>No topic scores are available for this class yet.</p>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
