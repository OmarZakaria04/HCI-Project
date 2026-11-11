import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { getStudentData } from "../../i18n/studentDataDe";
import { useLanguage } from "../../i18n/useLanguage";
import { getTeacherCommState } from "../../utils/teacherStore";
import { AnnouncementIcon, NewspaperIcon } from "../../components/StudentIcons";
import "../../styles/student.css";

export default function StudentAnnouncements() {
  const navigate = useNavigate();
  const { lang, tr } = useLanguage();
  const studentData = getStudentData(lang);
  const [dateFilter, setDateFilter] = useState("all");

  const teacherPosts = (getTeacherCommState().addedStudentAnnouncements || []).map((post) => ({
    id: post.id,
    title: post.title,
    date: post.date,
    category: post.classId === "all" ? tr("Class Notice", "Klassenhinweis") : `${tr("Class", "Klasse")} ${post.classId}`,
    content: post.body,
    author: studentData.profile.teacher,
    isImportant: post.priority === "Important",
  }));

  const allAnnouncements = [...teacherPosts, ...studentData.announcements];

  const filteredAnnouncements = allAnnouncements.filter((ann) => {
    if (dateFilter === "important") return ann.isImportant;
    return true;
  });

  return (
    <div className="student-page-wrapper">
      <Header role="student" />

      <main className="student-container">
        <div className="wireframe-hero-card">
          <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <AnnouncementIcon className="w-6 h-6 text-forest" />
          </div>
          <h1 className="wireframe-hero-title">{tr("Announcements", "Ankündigungen")}</h1>
          <p className="wireframe-hero-subtitle">
            {tr(
              "Official school circulars, schedule changes & administrative notices",
              "Offizielle Schulmitteilungen, Stundenplanänderungen & Hinweise der Verwaltung"
            )}
          </p>
        </div>

        <div className="student-card space-y-4">
          <div className="student-card-header">
            <h2 className="student-card-title">
              <NewspaperIcon className="w-5 h-5 text-forest" /> {tr("Broadcast Feed", "Mitteilungsfeed")}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/student")}
                className="btn-ghost text-xs mr-2"
              >
                ← {tr("Back to Dashboard", "Zurück zur Übersicht")}
              </button>

              <label htmlFor="annFilter" className="text-xs font-bold text-forest/70 hidden sm:inline">
                {tr("View By:", "Anzeigen:")}
              </label>
              <select
                id="annFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-cream/70 border border-sand/50 rounded-lg px-2.5 py-1 text-xs text-forest font-semibold focus:outline-none focus:ring-2 focus:ring-sand"
              >
                <option value="all">{tr("All Announcements", "Alle Ankündigungen")}</option>
                <option value="important">{tr("Important Notices Only", "Nur wichtige Hinweise")}</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl bg-cream/30 border border-sand/40 space-y-2 hover:bg-cream/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    {ann.isImportant && (
                      <span className="w-2.5 h-2.5 rounded-full bg-sand" title={tr("Important notice", "Wichtiger Hinweis")}></span>
                    )}
                    <h3 className="text-base font-bold text-forest">{ann.title}</h3>
                    <span className="text-[10px] font-bold text-cream bg-forest px-2 py-0.5 rounded-full">
                      {ann.category}
                    </span>
                  </div>
                  <span className="text-xs text-forest/60">{tr("Date:", "Datum:")} {ann.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-forest/80 leading-relaxed pt-1">
                  {ann.content}
                </p>

                <div className="pt-2 text-[11px] text-forest/60 flex items-center justify-between border-t border-sand/20">
                  <span>
                    {tr("Posted by:", "Veröffentlicht von:")} <strong className="text-forest">{ann.author}</strong>
                  </span>
                  <span className="text-sand font-semibold">{tr("Verified Broadcast", "Bestätigte Meldung")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
