import { useState } from "react";
import { Link } from "react-router-dom";
import { classes, classAnalysis } from "../../data/teacherData";
import RadarChart from "../../components/RadarChart";
import "../../styles/teacher.css";

export default function TeacherHome() {
  const [selectedId, setSelectedId] = useState(classes[0].id);
  const analysis = classAnalysis[selectedId];

  return (
    <div className="teacher-page">
      <div className="teacher-page-head">
        <h1 className="teacher-heading">Teacher Dashboard</h1>
        <div className="teacher-actions">
          <Link to="/teacher/papers" className="teacher-btn">Papers</Link>
          <Link to="/teacher/schedule" className="teacher-btn-outline">Schedule</Link>
        </div>
      </div>

      {/* Classes */}
      <section>
        <h2 className="teacher-section-title">Classes</h2>
        <div className="teacher-class-grid">
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`teacher-class-card ${
                c.id === selectedId ? "teacher-class-card-active" : ""
              }`}
            >
              <span className="teacher-class-name">{c.name}</span>
              <span className="teacher-class-meta">{c.students} students</span>
              <span className="teacher-class-avg">Avg {c.average}%</span>
            </button>
          ))}
        </div>
      </section>

    

      <section className="teacher-card">
  <h2 className="teacher-card-title">Class Analysis: {selectedId}</h2>
  <div className="teacher-analysis">
    <div className="teacher-analysis-details">
      <p><strong>Highest:</strong> {analysis.highest}%</p>
      <p><strong>Lowest:</strong> {analysis.lowest}%</p>
      <p><strong>Strengths:</strong> {analysis.strengths.join(", ")}</p>
      <p><strong>Weaknesses:</strong> {analysis.weaknesses.join(", ")}</p>
    </div>
    <RadarChart data={analysis.topics} />
  </div>
</section>
    </div>
  );
}