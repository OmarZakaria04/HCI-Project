import { useState } from "react";
import { classes, classAnalysis } from "../data/teacherData";
import RadarChart from "./RadarChart";

export default function AnalyticsCarousel() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const q = query.trim().toLowerCase();

  // Classes matching the search (all of them when the box is empty)
  const pool = q
    ? classes.filter((c) => {
        const a = classAnalysis[c.id];
        const text = [c.id, c.name, ...a.strengths, ...a.weaknesses, ...a.topics.map((t) => t.label)]
          .join(" ")
          .toLowerCase();
        return text.includes(q);
      })
    : classes;

  const current = pool.length ? pool[index % pool.length] : null;
  const analysis = current ? classAnalysis[current.id] : null;

  // The progress bar's animation is the timer: when it finishes, go to the next class
  const stopped = paused || q !== "";
  const next = () => setIndex((i) => (i + 1) % classes.length);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setIndex(0);
  };

  return (
    <section
      className="analytics"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="analytics-head">
        <h2 className="analytics-title">Class Analytics</h2>
        <input
          type="search"
          value={query}
          onChange={handleSearch}
          placeholder="Search a class or topic (5A, fractions...)"
          className="analytics-search"
        />
      </div>

      {!current ? (
        <p className="analytics-empty">No class matches that search.</p>
      ) : (
        <>
          <div key={current.id} className="analytics-body">
            <div className="analytics-details">
              <h3 className="analytics-class">{current.name}</h3>

              <div className="analytics-stats">
                <div className="analytics-stat">
                  <span className="analytics-stat-value">{current.average}%</span>
                  <span className="analytics-stat-label">Average</span>
                </div>
                <div className="analytics-stat">
                  <span className="analytics-stat-value">{analysis.highest}%</span>
                  <span className="analytics-stat-label">Highest</span>
                </div>
                <div className="analytics-stat">
                  <span className="analytics-stat-value">{analysis.lowest}%</span>
                  <span className="analytics-stat-label">Lowest</span>
                </div>
              </div>

              <div>
                <p className="analytics-label">Strengths</p>
                <div className="analytics-badges">
                  {analysis.strengths.map((s) => (
                    <span key={s} className="analytics-badge-good">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="analytics-label">Weaknesses</p>
                <div className="analytics-badges">
                  {analysis.weaknesses.map((w) => (
                    <span key={w} className="analytics-badge-warn">{w}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="analytics-chart">
              <RadarChart data={analysis.topics} size={320} />
            </div>
          </div>

          <div className="analytics-tabs">
            {pool.map((c, i) => {
              const active = c.id === current.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setIndex(i)}
                  className={`analytics-tab ${active ? "analytics-tab-active" : ""}`}
                >
                  <span className="analytics-tab-name">{c.name}</span>
                  <span className="analytics-tab-avg">Avg {c.average}%</span>
                  {active && (
                    <span
                      key={c.id}
                      onAnimationEnd={next}
                      className={`analytics-progress ${stopped ? "analytics-progress-paused" : ""}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}