import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { users } from "../data/users";
import { useLanguage } from "../i18n/useLanguage";
import LanguageSwitcher from "../i18n/LanguageSwitcher";
import { getTeacherData } from "../i18n/teacherDataDe";
import { getStudentData, getStudentNotifications } from "../i18n/studentDataDe";
import { getParentData } from "../i18n/parentDataDe";
import { getTeacherCommState, getUploadedPapersMap } from "../utils/teacherStore";
import { getReadNotificationIds, markNotificationIdsRead } from "../utils/studentStore";
import { getParentEmergenciesMap } from "../utils/parentStore";
import "../styles/header.css";

function getRoleConfig(tr, studentProfile) {
  return {
    teacher: {
      title: tr("Teacher Portal", "Lehrkräfteportal"),
      basePath: "/teacher",
      meta: tr("Mathematics Dept", "Fachbereich Mathematik"),
      navItems: [
        { label: tr("Dashboard", "Übersicht"), path: "/teacher" },
        { label: tr("Papers", "Abgaben"), path: "/teacher/papers" },
        { label: tr("Classes", "Klassen"), path: "/teacher/classes" },
        { label: tr("Schedule", "Stundenplan"), path: "/teacher/schedule" },
        { label: tr("Messages", "Mitteilungen"), path: "/teacher/messages" },
      ],
    },
    student: {
      title: tr("Student Portal", "Schülerportal"),
      basePath: "/student",
      meta: `${studentProfile.grade} • ${studentProfile.section}`,
      navItems: [
        { label: tr("Dashboard", "Übersicht"), path: "/student" },
        { label: tr("Grades", "Noten"), path: "/student/grades" },
        { label: tr("Teachers", "Lehrkräfte"), path: "/student/teachers" },
        { label: tr("Announcements", "Ankündigungen"), path: "/student/announcements" },
      ],
    },
    parent: {
      title: tr("Parent Portal", "Elternportal"),
      basePath: "/parent",
      meta: tr("Parent of Ahmed Ehab", "Elternteil von Ahmed Ehab"),
      navItems: [
        { label: tr("Dashboard", "Übersicht"), path: "/parent" },
        { label: tr("Grades & Exams", "Noten & Prüfungen"), path: "/parent/grades" },
        { label: tr("Teachers & Meetings", "Lehrkräfte & Termine"), path: "/parent/teachers" },
        { label: tr("Messages", "Nachrichten"), path: "/parent/chat" },
        { label: tr("Behavior", "Verhalten"), path: "/parent/behavior" },
        { label: tr("Emergency", "Notfall"), path: "/parent/emergency" },
      ],
    },
  };
}

/**
 * Header component that automatically catches the active role:
 * 1. Explicit `role` prop (if passed)
 * 2. Current URL path (/teacher, /student, /parent)
 * 3. Logged-in user in localStorage
 * 4. Fallback default ("teacher")
 */
export default function Header({ role: propRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, tr } = useLanguage();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState(() => getReadNotificationIds());
  const [, setStoreSyncTick] = useState(0);
  const dropdownRef = useRef(null);
  const helpDialogRef = useRef(null);
  const helpButtonRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const accountButtonRef = useRef(null);
  const mobileButtonRef = useRef(null);

  const studentLocalized = getStudentData(lang);
  const ROLE_CONFIG = getRoleConfig(tr, studentLocalized.profile);

  // 1. Detect role
  const detectedRole = (() => {
    if (propRole && ROLE_CONFIG[propRole.toLowerCase()]) {
      return propRole.toLowerCase();
    }
    const path = location.pathname.toLowerCase();
    if (path.startsWith("/teacher")) return "teacher";
    if (path.startsWith("/student")) return "student";
    if (path.startsWith("/parent")) return "parent";

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role && ROLE_CONFIG[parsed.role.toLowerCase()]) {
          return parsed.role.toLowerCase();
        }
      }
    } catch {
      // ignore JSON parse error
    }

    return "teacher";
  })();

  const config = ROLE_CONFIG[detectedRole] || ROLE_CONFIG.teacher;
  const localizedParent = getParentData(lang);
  const storedParentEmergencies = getParentEmergenciesMap();
  const parentNotifications = localizedParent.children.flatMap((child) =>
    [...(storedParentEmergencies[child.id] || []), ...(child.emergencies || [])]
      .filter((item) => item.severity === "alert")
      .map((item) => ({
        id: `${child.id}-${item.id}`,
        text: `${child.name.split(" ")[0]}: ${item.title} (${item.sender})`,
        time: item.date,
        link: "/parent/emergency",
      }))
  );
  const studentDynamicNotifs = [
    ...(getTeacherCommState().addedStudentAnnouncements || []).map((post) => ({
      id: `teacher-ann-${post.id}`,
      text: `${tr("New announcement", "Neue Ankündigung")}: ${post.title}`,
      time: post.date || tr("Just now", "Gerade eben"),
      link: "/student/announcements",
    })),
    ...Object.entries(getUploadedPapersMap())
      .filter(([, record]) => record?.uploaded && record?.supervisor === "Confirmed")
      .map(([paperId, record]) => ({
        id: `teacher-grade-${paperId}`,
        text: `${tr("New confirmed grade", "Neue bestätigte Note")}: ${record.title || tr("Assessment", "Leistungskontrolle")} (${record.finalScore ?? 92}%)`,
        time: tr("Confirmed", "Bestätigt"),
        link: "/student/grades",
      })),
  ];

  const notifList =
    detectedRole === "teacher"
      ? getTeacherData(lang).notifications
      : detectedRole === "student"
      ? [...studentDynamicNotifs, ...getStudentNotifications(lang)]
      : detectedRole === "parent"
      ? parentNotifications
      : [];
  const unreadNotifCount =
    detectedRole === "student"
      ? notifList.filter((item) => !readNotifIds.includes(String(item.id))).length
      : notifList.length;
  // 2. Resolve user data (from localStorage if matches role, otherwise use role's dummy user)
  const currentUser = (() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role?.toLowerCase() === detectedRole) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return users.find((u) => u.role === detectedRole) || users[0];
  })();

  // Close dropdown when clicking outside & refresh badge on cross-portal store updates
 useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
      setIsNotifOpen(false);
    }
  }
  const handleStoreSync = () => setStoreSyncTick((n) => n + 1);
  document.addEventListener("mousedown", handleClickOutside);
  window.addEventListener("zinger:parent-store-updated", handleStoreSync);
  window.addEventListener("zinger:student-store-updated", handleStoreSync);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    window.removeEventListener("zinger:parent-store-updated", handleStoreSync);
    window.removeEventListener("zinger:student-store-updated", handleStoreSync);
  };
}, []);

  useEffect(() => {
    const dialog = helpDialogRef.current;
    if (!dialog) return;
    if (isHelpOpen && !dialog.open) dialog.showModal();
    if (!isHelpOpen && dialog.open) dialog.close();
  }, [isHelpOpen]);

  const roleHelpItems = {
    student: [
      tr("Schoolwork: Online quizzes & exams open in the solving workspace; paper homework opens the upload dialog.", "Schulaufgaben: Online-Quizze & Prüfungen starten direkt im Arbeitsbereich; Papieraufgaben nutzen den Datei-Upload."),
      tr("Feedback & Help: Open Teachers to check teacher-confirmed marks, practice weak topics, or attach a question in chat.", "Feedback & Hilfe: Unter Lehrkräfte finden Sie bestätigte Bewertungen, Übungen und den Frage-Chat."),
      tr("Shortcuts: Press Esc to close any open menu or dialog.", "Tastatur: Mit Esc schließen Sie jedes offene Menü oder Fenster."),
    ],
    parent: [
      tr("Confirmed updates: Only teacher-confirmed grades, report cards, and child-level progress appear in your view.", "Bestätigte Daten: Nur von Lehrkräften geprüfte Noten, Zeugnisse und Lernstände werden angezeigt."),
      tr("Grades & Tickets: Use Grades & Exams to download/print report cards or submit an access ticket to see detailed paper mistakes.", "Noten & Anträge: Unter Noten & Prüfungen laden Sie Zeugnisse herunter oder fragen Einblick in korrigierte Arbeiten an."),
      tr("Communication & Safety: Use Messages or Teachers & Meetings for routine topics; use Emergency only for urgent alerts.", "Kommunikation & Notfall: Nutzen Sie Nachrichten/Termine für normale Anliegen und Notfall nur für akute Meldungen."),
    ],
    teacher: [
      tr("Grading workflow: 1) Check & edit extracted answers -> 2) Review AI grades, mark scheme & Struggle Signals -> 3) Save review, submit to supervisor, then publish.", "Prüfablauf: 1) Ausgelesene Antworten prüfen -> 2) KI-Noten, Bewertungsschema & Hinweise prüfen -> 3) Speichern, an Fachleitung senden & veröffentlichen."),
      tr("Privacy boundaries: Struggle Signals stay private to you unless you add a note; class weaknesses stay in Teacher views only.", "Datenschutz: Schwierigkeitshinweise bleiben privat, bis Sie Notizen übernehmen; Klassenschwächen bleiben nur in der Lehrkräfteansicht."),
      tr("Quick navigation: Use EN/DE at the top right to switch language at any time, or Esc to close dialogs.", "Schnellzugriff: Mit EN/DE wechseln Sie jederzeit die Sprache; Esc schließt offene Dialoge."),
    ],
  }[detectedRole];

  // Helper for initials
  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ZS";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="site-header" data-role={detectedRole} onKeyDown={(event) => {
      if (event.key !== "Escape") return;
      if (isNotifOpen) notificationButtonRef.current?.focus();
      else if (isDropdownOpen) accountButtonRef.current?.focus();
      else if (isMobileMenuOpen) mobileButtonRef.current?.focus();
      setIsNotifOpen(false);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }}>
      <div className="header-container">
        {/* Left: School Logo & Portal Identifier */}
          <Link to={config.basePath} className="header-brand">
            <div className="brand-icon-box">
              {/* Academic graduation cap icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M21.42 10.922a1 1 0 0 0-.019-.838L12.83 2.18a2 2 0 0 0-1.66 0L2.6 10.084a1 1 0 0 0 0 1.832l8.57 7.908a2 2 0 0 0 1.66 0l8.57-7.908a1 1 0 0 0 .02-.994z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <span className="brand-title">ZINGER</span>
              <span className="brand-portal">{config.title}</span>
            </div>
          </Link>

        {/* Middle: Role Navigation Links */}
        <nav className="header-nav" aria-label={`${config.title} ${tr("navigation", "Navigation")}`}>
          {config.navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== config.basePath && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => { setIsNotifOpen(false); setIsDropdownOpen(false); }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Notifications & Profile */}
        <div className="header-actions" ref={dropdownRef}>
          <LanguageSwitcher />
          <button
            type="button"
            className="notification-btn"
            ref={helpButtonRef}
            title={tr("Help & quick guide", "Hilfe & Kurzanleitung")}
            aria-label={tr("Open help and quick guide", "Hilfe und Kurzanleitung öffnen")}
            aria-expanded={isHelpOpen}
            onClick={() => {
              setIsNotifOpen(false);
              setIsDropdownOpen(false);
              setIsHelpOpen(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 17.25h.008v.008H12v-.008z" />
              <circle cx="12" cy="12" r="9.5" />
            </svg>
          </button>
          <div className="relative">
  <button
    type="button"
    className="notification-btn"
    ref={notificationButtonRef}
    title={tr("Notifications", "Benachrichtigungen")}
    aria-label={tr("View notifications", "Benachrichtigungen anzeigen")}
    aria-expanded={isNotifOpen}
    aria-controls="header-notifications"
  onClick={() => {
  setIsDropdownOpen(false);
  setIsNotifOpen((prev) => !prev);
}}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
    {unreadNotifCount > 0 && <span className="notification-dot" />}
  </button>

  {isNotifOpen && (
    <section className="notification-dropdown" id="header-notifications" aria-label={tr("Notifications", "Benachrichtigungen")}>
      <div className="notification-heading">
        <span>{tr("Notifications", "Benachrichtigungen")}</span>
        {detectedRole === "student" && unreadNotifCount > 0 && (
          <button
            type="button"
            className="notification-mark-read"
            onClick={() => setReadNotifIds(markNotificationIdsRead(notifList.map((n) => n.id)))}
          >
            {tr("Mark all read", "Alle gelesen")}
          </button>
        )}
      </div>
      <ul className="notification-list">
        {notifList.length === 0 ? (
          <li className="notification-entry">{tr("No new notifications", "Keine neuen Benachrichtigungen")}</li>
        ) : (
          notifList.map((n) => {
            const isRead = detectedRole === "student" && readNotifIds.includes(String(n.id));
            return (
            <li key={n.id}>
              {n.link ? (
                <Link
                  className={`notification-entry ${isRead ? "is-read" : "is-unread"}`}
                  to={n.link}
                  onClick={() => {
                    if (detectedRole === "student") {
                      setReadNotifIds(markNotificationIdsRead([n.id]));
                    }
                    setIsNotifOpen(false);
                  }}
                >
                  <span>{n.text}</span>
                  <span className="notification-time">{n.time}</span>
                </Link>
              ) : (
                <div className={`notification-entry ${isRead ? "is-read" : "is-unread"}`}>
                  <span>{n.text}</span>
                  <span className="notification-time">{n.time}</span>
                </div>
              )}
            </li>
            );
          })
        )}
      </ul>
    </section>
  )}
</div>

          {/* User Profile trigger */}
          <button
            type="button"
            className="user-menu-trigger"
            ref={accountButtonRef}
            aria-label={`${tr("Account menu for", "Kontomenü für")} ${currentUser?.name}`}
            aria-controls="header-account-menu"
            onClick={() => {
  setIsNotifOpen(false);
  setIsDropdownOpen((prev) => !prev);
}}
            aria-expanded={isDropdownOpen}
          >
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name">{currentUser?.name}</span>
              <span className="user-role-label">{config.meta}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 text-forest/60 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            ref={mobileButtonRef}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={tr("Toggle navigation menu", "Navigationsmenü umschalten")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="header-mobile-navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div className="user-dropdown" id="header-account-menu">
              <div className="dropdown-header">
                <p className="dropdown-title">{currentUser?.name}</p>
                <p className="dropdown-subtitle">{currentUser?.email}</p>
                <span className="dropdown-meta">{config.title}</span>
              </div>

              {/* Role Switcher Demo Links */}
              <div className="dropdown-section-title">{tr("Switch Portal Role", "Portalrolle wechseln")}</div>
              <Link
                to="/teacher"
                onClick={() => setIsDropdownOpen(false)}
                className={`dropdown-link ${detectedRole === "teacher" ? "dropdown-link-active" : ""}`}
              >
                <span>{tr("Teacher Portal", "Lehrkräfteportal")}</span>
                {detectedRole === "teacher" && <span>{tr("Active", "Aktiv")}</span>}
              </Link>
              <Link
                to="/student"
                onClick={() => setIsDropdownOpen(false)}
                className={`dropdown-link ${detectedRole === "student" ? "dropdown-link-active" : ""}`}
              >
                <span>{tr("Student Portal", "Schülerportal")}</span>
                {detectedRole === "student" && <span>{tr("Active", "Aktiv")}</span>}
              </Link>
              <Link
                to="/parent"
                onClick={() => setIsDropdownOpen(false)}
                className={`dropdown-link ${detectedRole === "parent" ? "dropdown-link-active" : ""}`}
              >
                <span>{tr("Parent Portal", "Elternportal")}</span>
                {detectedRole === "parent" && <span>{tr("Active", "Aktiv")}</span>}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="dropdown-logout-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {tr("Sign out", "Abmelden")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <nav className="mobile-menu-drawer" id="header-mobile-navigation" aria-label={tr("Mobile navigation", "Mobile Navigation")}>
          {config.navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== config.basePath && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`mobile-menu-item ${isActive ? "mobile-menu-item-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      <dialog
        ref={helpDialogRef}
        className="portal-help-dialog"
        aria-labelledby="portal-help-title"
        onClose={() => {
          setIsHelpOpen(false);
          helpButtonRef.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="portal-help-head">
          <div>
            <h2 id="portal-help-title">{tr("Quick Help & Guide", "Kurzhilfe & Anleitung")}</h2>
            <p>{config.title}</p>
          </div>
          <button
            type="button"
            className="portal-help-close"
            aria-label={tr("Close help", "Hilfe schließen")}
            onClick={() => helpDialogRef.current?.close()}
          >
            ×
          </button>
        </div>
        <ul className="portal-help-list">
          {roleHelpItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="portal-help-foot">
          <button type="button" className="portal-help-btn" onClick={() => helpDialogRef.current?.close()}>
            {tr("Got it", "Verstanden")}
          </button>
        </div>
      </dialog>
    </header>
  );
}

