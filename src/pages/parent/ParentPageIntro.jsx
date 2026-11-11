import { Link } from "react-router-dom";
import { getParentData } from "../../i18n/parentDataDe";
import { useLanguage } from "../../i18n/useLanguage";

export function DialogCloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ParentNotice({ notice, onDismiss }) {
  const { tr } = useLanguage();
  if (!notice) return null;

  return (
    <div className="parent-notice" role="status" aria-live="polite">
      <p>{notice.text}</p>
      <div className="parent-notice-actions">
        {notice.undo && (
          <button
            type="button"
            className="parent-button"
            onClick={notice.undo}
          >
            {notice.undoLabel || tr("Undo", "Rückgängig")}
          </button>
        )}
        <button
          type="button"
          className="parent-button"
          onClick={onDismiss}
        >
          {tr("Dismiss notice", "Hinweis ausblenden")}
        </button>
      </div>
    </div>
  );
}

export default function ParentPageIntro({
  title,
  subtitle,
  backTo,
  backLabel,
  activeChildId,
  onSelectChild,
  titleRef,
}) {
  const { lang, tr } = useLanguage();
  const data = getParentData(lang);

  return (
    <header className="parent-intro">
      {backTo && backLabel && (
        <Link className="parent-back-link" to={backTo}>
          <span aria-hidden="true">←</span> {backLabel}
        </Link>
      )}
      <div className="parent-intro-row">
        <div className="parent-intro-copy">
          <h1 ref={titleRef} tabIndex={-1}>
            {title}
          </h1>
          <p className="parent-intro-subtitle">{subtitle}</p>
        </div>

        <div
          className="parent-child-switcher"
          role="group"
          aria-label={tr("Select child", "Kind auswählen")}
        >
          {data.children.map((child) => {
            const isActive = child.id === activeChildId;
            return (
              <button
                key={child.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectChild(child.id)}
                className="parent-child-btn"
              >
                {child.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
