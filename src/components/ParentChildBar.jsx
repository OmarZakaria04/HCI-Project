import { useNavigate, useLocation } from "react-router-dom";
import { getParentData } from "../i18n/parentDataDe";
import { useLanguage } from "../i18n/useLanguage";

/**
 * Information Architecture Breadcrumbs & Child Selector Tablist (Item 2 & Item 8 KLM)
 */
export default function ParentChildBar({
  activeChildId,
  onSelectChild,
  backTo,
  showBack = false,
  breadcrumbText,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, tr } = useLanguage();
  const parentData = getParentData(lang);

  // Compute breadcrumb trail for Information Architecture (Item 2)
  const getBreadcrumb = () => {
    if (breadcrumbText) return breadcrumbText;
    const path = location.pathname;
    if (path.includes("/grades")) return tr("Grades & Assessment Hub", "Noten- & Prüfungsbereich");
    if (path.includes("/teachers")) return tr("Faculty & Conferences", "Lehrkräfte & Gespräche");
    if (path.includes("/chat")) return tr("Direct Teacher Messages", "Direkte Nachrichten an Lehrkräfte");
    if (path.includes("/behavior")) return tr("Behavioral Observations", "Verhaltensbeobachtungen");
    if (path.includes("/emergency")) return tr("Emergency Channel", "Notfallkanal");
    return tr("Dashboard", "Übersicht");
  };

  return (
    <div className="parent-subbar" role="navigation" aria-label={tr("Parent Portal Subnavigation", "Untermenü des Elternportals")}>
      <div className="parent-subbar-inner">
        {/* Left: Back button & Breadcrumb (Item 2 & Item 4) */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              type="button"
              onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
              className="back-btn"
              aria-label={tr("Navigate back", "Zurück navigieren")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>{tr("Back", "Zurück")}</span>
            </button>
          ) : null}

          {/* Hierarchical Breadcrumb (Item 2) */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-forest/70 font-medium">
            <span
              onClick={() => navigate("/parent")}
              className="hover:underline cursor-pointer font-bold text-forest"
            >
              {tr("Parent Portal", "Elternportal")}
            </span>
            <span>/</span>
            <span className="font-semibold text-forest/90">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Center: Child Switcher Tabs (Accessible Tablist) */}
        <div
          className="child-selector-group"
          role="tablist"
          aria-label={tr("Select Child Profile", "Kinderprofil auswählen")}
        >
          {parentData.children.map((child) => {
            const isActive = child.id === activeChildId;
            return (
              <button
                key={child.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => onSelectChild(child.id)}
                className={`child-tab-btn ${
                  isActive ? "child-tab-btn-active" : ""
                }`}
              >
                {child.name}
              </button>
            );
          })}
        </div>

        {/* Right status badge */}
        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-bold text-sage bg-sage/15 px-2.5 py-1 rounded-full border border-sage/30">
            {tr("Term 1 Active", "1. Halbjahr aktiv")}
          </span>
        </div>
      </div>
    </div>
  );
}
