import { useEffect, useRef, useState } from "react";
import ConfirmModal from "./ConfirmModal";

const quickPhrases = [
  "Please call the school as soon as possible.",
  "Your child needs to be picked up today.",
  "Please check the app for an urgent update.",
];

export default function ParentMessageModal({ isOpen, parentName, studentName, messages, onSend, onClose }) {
  const [draft, setDraft] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const endRef = useRef(null);

  // Escape closes the popup, unless the confirm dialog is open (it handles Escape itself)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !confirming) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, confirming, onClose]);

  // Keep the newest message in view
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const initials = parentName
    .replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const send = () => {
    onSend(draft.trim(), emergency);
    setDraft("");
    setEmergency(false);
    setConfirming(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    if (emergency) setConfirming(true);
    else send();
  };

  return (
    <>
      <div className="pm-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <div className="pm-panel" onClick={(e) => e.stopPropagation()}>
          <header className="pm-head">
            <div className="pm-avatar">{initials}</div>
            <div className="flex-1">
              <h3 id="pm-title" className="pm-name">{parentName}</h3>
              <p className="pm-sub">Parent of {studentName}</p>
            </div>
            <button type="button" className="pm-close" onClick={onClose} aria-label="Close">✕</button>
          </header>

          <div className="pm-thread">
            {messages.length === 0 && (
              <p className="pm-empty">No messages yet. Write the first one below.</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`pm-row ${m.from === "teacher" ? "pm-row-me" : ""}`}>
                <div
                  className={`pm-bubble ${m.from === "teacher" ? "pm-bubble-me" : "pm-bubble-them"} ${
                    m.emergency ? "pm-bubble-urgent" : ""
                  }`}
                >
                  {m.emergency && <span className="pm-urgent-tag">Emergency</span>}
                  <p>{m.text}</p>
                  <span className="pm-time">{m.time}</span>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {emergency && (
            <div className="pm-quick">
              {quickPhrases.map((q) => (
                <button key={q} type="button" className="pm-chip" onClick={() => setDraft(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="pm-bar">
            <button
              type="button"
              className={`pm-toggle ${emergency ? "pm-toggle-on" : ""}`}
              onClick={() => setEmergency((v) => !v)}
              aria-pressed={emergency}
            >
              Emergency Text
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={emergency ? "Urgent message to the parent..." : "Write a message..."}
              className="pm-input"
            />
            <button type="submit" className="pm-send" aria-label="Send message">➤</button>
          </form>
        </div>
      </div>

      {/* Outside the backdrop so clicking it doesn't also close the popup */}
      <ConfirmModal
        isOpen={confirming}
        title="Send emergency text?"
        message="The parent receives this immediately as an urgent alert."
        confirmLabel="Send now"
        isDestructive
        onConfirm={send}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}