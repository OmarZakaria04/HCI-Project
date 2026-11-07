import { useState } from "react";
import { Link } from "react-router-dom";
import { classes, classAnalysis } from "../../data/teacherData";
import "../../styles/teacher.css";

export default function TeacherClasses() {
  const [grade, setGrade] = useState("");
  const [classId, setClassId] = useState("");

  const grades = [...new Set(classes.map((c) => c.grade))].sort();

  // Class dropdown only offers classes from the chosen grade
  const classOptions = classes.filter((c) => grade === "" || String(c.grade) === grade);

  const visible = classes.filter(
    (c) =>
      (grade === "" || String(c.grade) === grade) &&
      (classId === "" || c.id === classId)
  );

  // Changing the grade resets the class so you can't end up with Grade 4 + 5A
  const handleGrade = (e) => {
    setGrade(e.target.value);
    setClassId("");
  };

  return (
    <div className="teacher-page">
      <h1 className="teacher-heading">Classes</h1>

      <div className="papers-filters">
        <select value={grade} onChange={handleGrade} className="papers-select">
          <option value="">All grades</option>
          {grades.map((g) => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </select>

        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="papers-select">
          <option value="">All classes</option>
          {classOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="papers-empty">No classes match these filters.</p>
      ) : (
        <div className="classes-grid">
          {visible.map((c) => (
            <Link key={c.id} to={`/teacher/classes/${c.id}`} className="classes-card">
              <div className="classes-card-top">
                <div>
                  <h2 className="classes-name">{c.name}</h2>
                  <p className="classes-meta">{c.students} students</p>
                </div>
                <div className="classes-circle">
                  <span className="classes-circle-value">{c.average}%</span>
                  <span className="classes-circle-label">avg</span>
                </div>
              </div>
              <p className="classes-focus">
                Needs work: {classAnalysis[c.id].weaknesses.join(", ")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}