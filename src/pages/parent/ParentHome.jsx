import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import ParentChildBar from "../../components/ParentChildBar";
import RadarChart from "../../components/RadarChart";
import { parentData } from "../../data/parentData";
import "../../styles/parent.css";

export default function ParentHome() {
  const [activeChildId, setActiveChildId] = useState(() => {
    return localStorage.getItem("parent_active_child") || "ahmed";
  });

  const handleSelectChild = (id) => {
    setActiveChildId(id);
    localStorage.setItem("parent_active_child", id);
  };

  const child =
    parentData.children.find((c) => c.id === activeChildId) ||
    parentData.children[0];

  const emergencyAlert = child.emergencies?.find((e) => e.severity === "alert");

  return (
    <div className="parent-page-wrapper">
      <Header role="parent" />
      <ParentChildBar
        activeChildId={activeChildId}
        onSelectChild={handleSelectChild}
        showBack={false}
      />

      <main className="parent-container">
        {/* P7 Quick Emergency Notice if active */}
        {emergencyAlert && (
          <div className="emergency-banner-alert">
            <div className="flex items-start gap-3">
              <span className="p-2 bg-red-100 text-red-700 rounded-xl font-bold text-lg">
                ⚠️
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-red-950">
                  {emergencyAlert.title}
                </h4>
                <p className="text-xs text-red-800 mt-0.5 line-clamp-2">
                  {emergencyAlert.message}
                </p>
                <span className="text-[10px] text-red-700 font-semibold mt-1 inline-block">
                  From: {emergencyAlert.sender} • {emergencyAlert.date}
                </span>
              </div>
            </div>
            <Link
              to="/parent/emergency"
              className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-red-800 transition-all shrink-0 text-center"
            >
              View Urgent Channel →
            </Link>
          </div>
        )}

        {/* 1. Hero Card: Student Progress Carousel Banner */}
        <section className="wireframe-hero">
          {/* Wireframe carousel quick links */}
          <Link to="/parent/teachers" className="hero-nav-link-left">
            ← Teachers
          </Link>
          <Link to="/parent/grades" className="hero-nav-link-right">
            Grades →
          </Link>

          <h2 className="wireframe-hero-title">Student Progress</h2>
          <p className="wireframe-hero-subtitle">
            {child.name} • {child.grade}
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-4">
            <span className="w-2.5 h-2.5 rounded-full bg-forest shadow-xs" />
            <span className="w-2 h-2 rounded-full bg-sand/60" />
            <span className="w-2 h-2 rounded-full bg-sand/60" />
          </div>
        </section>

        {/* Quick Portal Feature Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/parent/grades"
            className="p-3.5 rounded-xl bg-white border border-sand/40 hover:border-forest hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <span className="text-xl mb-1">📊</span>
            <span className="text-xs font-bold text-forest group-hover:text-forest">
              Grades & History
            </span>
            <span className="text-[10px] text-forest/60">P2 & P3</span>
          </Link>

          <Link
            to="/parent/grades#exams"
            className="p-3.5 rounded-xl bg-white border border-sand/40 hover:border-forest hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <span className="text-xl mb-1">📝</span>
            <span className="text-xs font-bold text-forest group-hover:text-forest">
              Exam Tickets
            </span>
            <span className="text-[10px] text-forest/60">P4 Details</span>
          </Link>

          <Link
            to="/parent/teachers"
            className="p-3.5 rounded-xl bg-white border border-sand/40 hover:border-forest hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <span className="text-xl mb-1">📅</span>
            <span className="text-xs font-bold text-forest group-hover:text-forest">
              Book Meeting
            </span>
            <span className="text-[10px] text-forest/60">P6 Scheduler</span>
          </Link>

          <Link
            to="/parent/behavior"
            className="p-3.5 rounded-xl bg-white border border-sand/40 hover:border-forest hover:shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <span className="text-xl mb-1">🤝</span>
            <span className="text-xs font-bold text-forest group-hover:text-forest">
              Behavior Notes
            </span>
            <span className="text-[10px] text-forest/60">P8 Home Plan</span>
          </Link>
        </section>

        {/* 2. Subjects Section */}
        <section className="parent-card">
          <div className="parent-card-header">
            <h3 className="parent-card-title">Subjects</h3>
            <Link
              to="/parent/grades"
              className="text-xs font-bold text-sage hover:text-forest transition-colors flex items-center gap-1"
            >
              <span>View All Grades & Exams</span>
              <span>→</span>
            </Link>
          </div>

          <div className="subjects-grid">
            {child.subjects.map((sub) => (
              <div key={sub.id} className="subject-item-card">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="subject-badge-title">{sub.name}</span>
                    <span className="text-[11px] font-semibold text-forest/60">
                      {sub.teacher}
                    </span>
                  </div>

                  <div className="subject-deadline-box">
                    <span className="subject-subhead">Upcoming Deadlines</span>
                    <p className="subject-subtext">{sub.upcoming}</p>
                  </div>
                </div>

                <div className="subject-grade-box">
                  <span className="subject-subhead">Last Grade</span>
                  <span className="subject-grade-val">{sub.lastGrade}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-4">
            <span className="w-2.5 h-2.5 rounded-full bg-forest" />
            <span className="w-2 h-2 rounded-full bg-sand/60" />
            <span className="w-2 h-2 rounded-full bg-sand/60" />
          </div>
        </section>

        {/* 3. P1: Child Progress Metrics (Strictly individual & teacher verified) */}
        <section className="parent-card">
          <div className="parent-card-header">
            <div>
              <h3 className="parent-card-title">
                <span>Child Progress Metrics</span>
              </h3>
              <p className="text-[11px] text-forest/60 mt-0.5">
                Individual growth profile only • Confidential to parent & teachers
              </p>
            </div>

            {/* P1 Teacher Review Verification Badge */}
            <div className="verified-review-badge">
              <span>✓</span>
              <span>
                Verified by {child.metrics.teacherReview.reviewedBy} (
                {child.metrics.teacherReview.date})
              </span>
            </div>
          </div>

          <div className="analysis-layout">
            {/* Left: Individual details & Key takeaways */}
            <div className="analysis-info">
              <div>
                <h4 className="analysis-label">Evaluation Details:</h4>
                <ul className="analysis-list mt-2">
                  {child.metrics.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="analysis-label">Teacher Key Takeaways:</h4>
                <div className="analysis-takeaway-box mt-1.5">
                  {child.metrics.keyTakeaways}
                </div>
              </div>
            </div>

            {/* Right: Child Graph */}
            <div className="analysis-chart-col">
              <RadarChart data={child.metrics.radarValues} size={210} />
              <span className="chart-title-caption">Child Graph</span>
              <div className="chart-highlight-pill">
                ⭐ Overall Standing:{" "}
                <span className="font-extrabold text-forest">
                  {child.metrics.status} ({child.metrics.overallScore})
                </span>
              </div>
            </div>
          </div>

          {/* Strengths & Topics to Work On (P1 Core Requirements) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-sand/30">
            <div>
              <h4 className="text-xs font-extrabold text-forest uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="text-green-700">★</span>
                <span>Individual Strengths</span>
              </h4>
              <div className="space-y-2">
                {child.metrics.strengths.map((str, idx) => (
                  <div key={idx} className="strength-card">
                    <span className="text-sage font-bold text-sm">✓</span>
                    <span className="text-xs font-semibold text-forest leading-relaxed">
                      {str}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-forest uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="text-sand font-black">🎯</span>
                <span>Topics To Work On</span>
              </h4>
              <div className="space-y-2">
                {child.metrics.topicsToWorkOn.map((topic, idx) => (
                  <div key={idx} className="work-on-card">
                    <span className="text-sand font-black text-sm">→</span>
                    <span className="text-xs font-semibold text-forest leading-relaxed">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
