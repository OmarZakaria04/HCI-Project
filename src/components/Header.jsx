import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { users } from "../data/users";
import { notifications } from "../data/teacherData";
import { studentData, studentNotifications } from "../data/studentData";
import "../styles/header.css";

// Role-specific configuration & navigation dummy data
const ROLE_CONFIG = {
  teacher: {
    title: "Teacher Portal",
    basePath: "/teacher",
    meta: "Mathematics Dept",
    navItems: [
      { label: "Dashboard", path: "/teacher" },
      { label: "Papers", path: "/teacher/papers" },
      { label: "Classes", path: "/teacher/classes" },
      { label: "Schedule", path: "/teacher/schedule" },
    ],
  },
  student: {
    title: "Student Portal",
    basePath: "/student",
    meta: `${studentData.profile.grade} • ${studentData.profile.section}`,
    navItems: [
      { label: "Dashboard", path: "/student" },
      { label: "Grades", path: "/student/grades" },
      { label: "Teachers", path: "/student/teachers" },
    ],
  },
  parent: {
    title: "Parent Portal",
    basePath: "/parent",
    meta: "Parent of Ahmed Ehab",
    navItems: [
      { label: "Dashboard", path: "/parent" },
      { label: "Grades & Exams", path: "/parent/grades" },
      { label: "Teachers & Meetings", path: "/parent/teachers" },
      { label: "Messages", path: "/parent/chat" },
      { label: "Behavior", path: "/parent/behavior" },
      { label: "Emergency", path: "/parent/emergency" },
    ],
  },
};

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const accountButtonRef = useRef(null);
  const mobileButtonRef = useRef(null);

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
  const notifList =
    detectedRole === "teacher"
      ? notifications
      : detectedRole === "student"
      ? studentNotifications
      : [];
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

  // Close dropdown when clicking outside
 useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
      setIsNotifOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

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
        <nav className="header-nav" aria-label={`${config.title} navigation`}>
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
          <div className="relative">
  <button
    type="button"
    className="notification-btn"
    ref={notificationButtonRef}
    title="Notifications"
    aria-label="View notifications"
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
    <span className="notification-dot" />
  </button>

  {isNotifOpen && (
    <section className="notification-dropdown" id="header-notifications" aria-label="Notifications">
      <div className="notification-heading">
        Notifications
      </div>
      <ul className="notification-list">
        {notifList.length === 0 ? (
          <li className="notification-entry">No new notifications</li>
        ) : (
          notifList.map((n) => (
            <li key={n.id}>
              {n.link ? (
                <Link className="notification-entry" to={n.link} onClick={() => setIsNotifOpen(false)}>
                  <span>{n.text}</span>
                  <span className="notification-time">{n.time}</span>
                </Link>
              ) : (
                <div className="notification-entry">
                  <span>{n.text}</span>
                  <span className="notification-time">{n.time}</span>
                </div>
              )}
            </li>
          ))
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
            aria-label={`Account menu for ${currentUser?.name}`}
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
            aria-label="Toggle navigation menu"
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
              <div className="dropdown-section-title">Switch Portal Role</div>
              <Link
                to="/teacher"
                onClick={() => setIsDropdownOpen(false)}
                className={`dropdown-link ${detectedRole === "teacher" ? "dropdown-link-active" : ""}`}
              >
                <span>Teacher Portal</span>
                {detectedRole === "teacher" && <span>Active</span>}
              </Link>
              <Link
                to="/student"
                onClick={() => setIsDropdownOpen(false)}
                className={`dropdown-link ${detectedRole === "student" ? "dropdown-link-active" : ""}`}
              >
                <span>Student Portal</span>
                {detectedRole === "student" && <span>Active</span>}
              </Link>
              <Link
                to="/parent"
                onClick={() => setIsDropdownOpen(false)}
                className={`dropdown-link ${detectedRole === "parent" ? "dropdown-link-active" : ""}`}
              >
                <span>Parent Portal</span>
                {detectedRole === "parent" && <span>Active</span>}
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
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <nav className="mobile-menu-drawer" id="header-mobile-navigation" aria-label="Mobile navigation">
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
    </header>
  );
}

