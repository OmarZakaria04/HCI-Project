import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { users } from "../data/users";
import { notifications } from "../data/teacherData";
import { studentNotifications } from "../data/studentData";
import "../styles/header.css";

// Role-specific configuration & navigation dummy data
const ROLE_CONFIG = {
  teacher: {
    title: "Teacher Portal",
    badgeClass: "brand-badge-teacher",
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
    badgeClass: "brand-badge-student",
    basePath: "/student",
    meta: "Grade 11 • Class B",
    navItems: [
      { label: "Dashboard", path: "/student" },
      { label: "Grades", path: "/student/grades" },
      { label: "Teachers", path: "/student/teachers" },
    ],
  },
  parent: {
    title: "Parent Portal",
    badgeClass: "brand-badge-parent",
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
    <header className="site-header">
      <div className="header-container">
        {/* Left: School Logo & Portal Identifier */}
        <div className="flex items-center gap-4">
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
              >
                <path d="M21.42 10.922a1 1 0 0 0-.019-.838L12.83 2.18a2 2 0 0 0-1.66 0L2.6 10.084a1 1 0 0 0 0 1.832l8.57 7.908a2 2 0 0 0 1.66 0l8.57-7.908a1 1 0 0 0 .02-.994z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <span className="brand-title">Zinger</span>
              <span className="text-xs text-forest/70 block font-medium">School Portal</span>
            </div>
          </Link>

          {/* Role badge */}
          <span className={`brand-badge ${config.badgeClass}`}>
            {config.title}
          </span>
        </div>

        {/* Middle: Role Navigation Links */}
        <nav className="header-nav">
          {config.navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== config.basePath && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
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
    title="Notifications"
    aria-label="View notifications"
    aria-expanded={isNotifOpen}
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
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-sand/50 z-50 text-left">
      <div className="px-4 py-3 border-b border-sand/40 text-sm font-semibold text-forest">
        Notifications
      </div>
      <ul className="max-h-72 overflow-y-auto divide-y divide-sand/30">
        {notifList.length === 0 ? (
          <li className="px-4 py-3 text-xs text-forest/60">No new notifications</li>
        ) : (
          notifList.map((n) => (
            <li
              key={n.id}
              onClick={() => {
                if (n.link) {
                  setIsNotifOpen(false);
                  navigate(n.link);
                }
              }}
              className={`px-4 py-3 text-xs text-forest transition-colors ${
                n.link ? "hover:bg-cream/60 cursor-pointer" : ""
              }`}
            >
              <p className="font-medium leading-relaxed">{n.text}</p>
              <p className="text-forest/50 text-[10px] mt-0.5">{n.time}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  )}
</div>

          {/* User Profile trigger */}
          <button
            type="button"
            className="user-menu-trigger"
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
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
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
            <div className="user-dropdown">
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
                {detectedRole === "teacher" && <span className="text-[10px]">Active</span>}
              </Link>
              <Link
                to="/student"
                onClick={() => setIsDropdownOpen(false)}
                className={`dropdown-link ${detectedRole === "student" ? "dropdown-link-active" : ""}`}
              >
                <span>Student Portal</span>
                {detectedRole === "student" && <span className="text-[10px]">Active</span>}
              </Link>
              <Link
                to="/parent"
                onClick={() => setIsDropdownOpen(false)}
                className={`dropdown-link ${detectedRole === "parent" ? "dropdown-link-active" : ""}`}
              >
                <span>Parent Portal</span>
                {detectedRole === "parent" && <span className="text-[10px]">Active</span>}
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
        <div className="mobile-menu-drawer">
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
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

