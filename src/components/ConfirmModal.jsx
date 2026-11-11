import { useEffect, useRef } from "react";
import { useLanguage } from "../i18n/useLanguage";

/**
 * Nielsen H5 (Error Prevention) & H3 (Freedom) & KLM (Efficiency)
 * Accessible Confirmation Modal with safe default and Escape/Enter support.
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDestructive = false,
  onConfirm,
  onCancel,
}) {
  const { tr } = useLanguage();
  const cancelBtnRef = useRef(null);
  const resolvedTitle = title ?? tr("Are you sure?", "Sind Sie sicher?");
  const resolvedMessage = message ?? tr("This action will take effect immediately.", "Diese Aktion wird sofort wirksam.");
  const resolvedConfirmLabel = confirmLabel ?? tr("Confirm", "Bestätigen");
  const resolvedCancelLabel = cancelLabel ?? tr("Cancel", "Abbrechen");

  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus the safe cancel button by default (Nielsen H5 Error Prevention)
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="bg-white rounded-2xl border border-sand/50 shadow-2xl max-w-sm w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${
              isDestructive ? "bg-red-100 text-red-700" : "bg-sand/30 text-forest"
            }`}
          >
            {isDestructive ? "⚠️" : "ℹ️"}
          </div>
          <div>
            <h3
              id="confirm-modal-title"
              className="text-sm font-extrabold text-forest"
            >
              {resolvedTitle}
            </h3>
            <p className="text-xs text-forest/75 mt-1 leading-relaxed">
              {resolvedMessage}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          {/* Safe default button */}
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-sand/20 hover:bg-sand/35 text-forest font-bold text-xs transition-colors cursor-pointer"
          >
            {resolvedCancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isDestructive
                ? "bg-red-700 hover:bg-red-800 text-white"
                : "bg-forest hover:bg-forest/90 text-cream"
            }`}
          >
            {resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

