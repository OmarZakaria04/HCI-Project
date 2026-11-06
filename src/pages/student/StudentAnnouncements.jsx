import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { studentData } from "../../data/studentData";
import { AnnouncementIcon, NewspaperIcon } from "../../components/StudentIcons";
import "../../styles/student.css";

export default function StudentAnnouncements() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState("all");

  const filteredAnnouncements = studentData.announcements.filter((ann) => {
    if (dateFilter === "important") return ann.isImportant;
    return true;
  });

  return (
    <div className="student-page-wrapper">
      <Header role="student" />

      <main className="student-container">
        {/* Hero Card: Announcements (Wireframe Screen 6) */}
        <div className="wireframe-hero-card">
          <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <AnnouncementIcon className="w-6 h-6 text-forest" />
          </div>
          <h1 className="wireframe-hero-title">Announcements</h1>
          <p className="wireframe-hero-subtitle">
            Official school circulars, schedule changes & administrative notices
          </p>
        </div>

        {/* Announcements Feed Card */}
        <div className="student-card space-y-4">
          <div className="student-card-header">
            <h2 className="student-card-title">
              <NewspaperIcon className="w-5 h-5 text-forest" /> Broadcast Feed
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/student")}
                className="btn-ghost text-xs mr-2"
              >
                ← Back to Dashboard
              </button>

              <label htmlFor="annFilter" className="text-xs font-bold text-forest/70 hidden sm:inline">
                View By:
              </label>
              <select
                id="annFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-cream/70 border border-sand/50 rounded-lg px-2.5 py-1 text-xs text-forest font-semibold focus:outline-none focus:ring-2 focus:ring-sand"
              >
                <option value="all">All Announcements</option>
                <option value="important">Important Notices Only</option>
              </select>
            </div>
          </div>

          {/* Announcement List */}
          <div className="space-y-3">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl bg-cream/30 border border-sand/40 space-y-2 hover:bg-cream/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    {ann.isImportant && (
                      <span className="w-2.5 h-2.5 rounded-full bg-sand" title="Important notice"></span>
                    )}
                    <h3 className="text-base font-bold text-forest">{ann.title}</h3>
                    <span className="text-[10px] font-bold text-cream bg-forest px-2 py-0.5 rounded-full">
                      {ann.category}
                    </span>
                  </div>
                  <span className="text-xs text-forest/60">Date: {ann.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-forest/80 leading-relaxed pt-1">
                  {ann.content}
                </p>

                <div className="pt-2 text-[11px] text-forest/60 flex items-center justify-between border-t border-sand/20">
                  <span>
                    Posted by: <strong className="text-forest">{ann.author}</strong>
                  </span>
                  <span className="text-sand font-semibold">Verified Broadcast</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

