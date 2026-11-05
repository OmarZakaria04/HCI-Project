import { useEffect } from "react";

/**
 * Nielsen H1 (Status) & H3 (Freedom / Undo) Toast
 */
export default function Toast({
  message,
  type = "success", // "success" | "info" | "warning"
  undoAction,
  undoLabel = "Undo",
  onClose,
  duration = 6000,
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-forest text-cream p-4 rounded-2xl shadow-xl border border-sand/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base">
            {type === "success" ? "✓" : type === "warning" ? "⚠️" : "ℹ️"}
          </span>
          <span className="text-xs font-semibold leading-tight">{message}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {undoAction && (
            <button
              type="button"
              onClick={() => {
                undoAction();
                onClose();
              }}
              className="px-2.5 py-1 rounded-lg bg-sand/30 hover:bg-sand/50 text-cream font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {undoLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-xs opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Dismiss notice"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

