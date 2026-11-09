import { useEffect, useRef, useState } from "react";
import keepDialogFocus from "../utils/dialogFocus";

const suggestedMessages = [
  { label: "Call the school", text: "Please call the school as soon as possible." },
  { label: "Arrange pickup", text: "Your child needs to be picked up today." },
  { label: "Urgent update", text: "Please check the app for an urgent update." },
];

export default function ParentMessageModal({ isOpen, parentName, studentName, messages, onSend, onClose }) {
  const [draft, setDraft] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState("");
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const composerRef = useRef(null);
  const reviewTitleRef = useRef(null);
  const logRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    dialog.showModal();
    closeRef.current.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, isOpen, reviewing]);

  const editMessage = () => {
    setReviewing(false);
    requestAnimationFrame(() => composerRef.current?.focus());
  };

  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    if (emergency && !reviewing) {
      setReviewing(true);
      requestAnimationFrame(() => {
        bodyRef.current.scrollTop = 0;
        reviewTitleRef.current?.focus();
      });
      return;
    }
    onSend(draft.trim(), emergency);
    setStatus(emergency ? "Emergency message added to this conversation." : "Message added to this conversation.");
    setDraft("");
    setSuggestion("");
    setEmergency(false);
    setReviewing(false);
    requestAnimationFrame(() => composerRef.current?.focus());
  };

  return (
    <dialog ref={dialogRef} className="tsd-dialog tsd-parent-dialog" aria-labelledby="tsd-parent-title" onKeyDown={keepDialogFocus} onClick={(event) => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }} onClose={() => { setReviewing(false); onClose(); }}>
      <header className="tsd-parent-heading">
        <div>
          <h2 id="tsd-parent-title">Contact parent</h2>
          <p className="tsd-parent-recipient">To: {parentName}</p>
        </div>
        <button ref={closeRef} type="button" className="tsd-parent-close" aria-label="Close parent conversation" onClick={() => dialogRef.current.close()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </header>

      <form className="tsd-parent-form" onSubmit={submit}>
        <div ref={bodyRef} className="tsd-parent-body">
          {reviewing ? (
            <section className="tsd-parent-review" aria-labelledby="tsd-emergency-review-title">
              <div className="tsd-emergency-notice">
                <h3 ref={reviewTitleRef} tabIndex={-1} id="tsd-emergency-review-title">Review emergency message</h3>
                <p>Check the recipient and message before adding it to the conversation.</p>
              </div>
              <dl className="tsd-review-recipient"><dt>To</dt><dd>{parentName}</dd></dl>
              <div className="tsd-parent-preview"><h3>Your message</h3><p>{draft.trim()}</p></div>
            </section>
          ) : (
            <>
              <section className="tsd-parent-conversation" aria-labelledby="tsd-parent-conversation-title">
                <h3 id="tsd-parent-conversation-title">Conversation</h3>
                <div ref={logRef} className="tsd-chat-log" role="log" aria-label={`Conversation with ${parentName} about ${studentName}`} aria-live="polite" aria-relevant="additions" tabIndex={messages.length ? 0 : undefined}>
                  {messages.length ? messages.map((message, index) => (
                    <div key={index} className={`tsd-chat-message${message.emergency ? " tsd-parent-emergency-message" : ""}`}>
                      <div className="tsd-message-heading"><p>{message.from === "teacher" ? "You" : parentName}</p><p>{message.time}</p></div>
                      {message.emergency && <p className="tsd-emergency-label">Emergency</p>}
                      <p>{message.text}</p>
                    </div>
                  )) : <p className="tsd-meta">No previous messages.</p>}
                </div>
              </section>

              <fieldset className="tsd-message-type">
                <legend>Message type</legend>
                <div className="tsd-type-options">
                  <label className="tsd-type-option">
                    <input type="radio" name="parent-message-type" value="standard" checked={!emergency} onChange={() => { setEmergency(false); setStatus(""); }} />
                    <span>Standard message</span>
                  </label>
                  <label className="tsd-type-option tsd-type-emergency">
                    <input type="radio" name="parent-message-type" value="emergency" checked={emergency} onChange={() => { setEmergency(true); setStatus(""); }} />
                    <span>Emergency</span>
                  </label>
                </div>
              </fieldset>

              {emergency && (
                <div className="tsd-emergency-details">
                  <div className="tsd-emergency-notice" id="tsd-emergency-help">
                    <h3>Emergency message</h3>
                    <p>Use when the parent needs to act immediately.</p>
                  </div>
                  <div className="tsd-parent-field">
                    <label htmlFor="tsd-parent-suggestion">Suggested message</label>
                    <select id="tsd-parent-suggestion" value={suggestion} onChange={(event) => {
                      const value = event.target.value;
                      setSuggestion(value);
                      setStatus("");
                      if (value !== "") {
                        setDraft(suggestedMessages[Number(value)].text);
                        composerRef.current.focus();
                      }
                    }}>
                      <option value="">Choose a starting message</option>
                      {suggestedMessages.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="tsd-parent-field">
                <label htmlFor="tsd-parent-message">Your message</label>
                <textarea id="tsd-parent-message" ref={composerRef} rows={4} value={draft} onChange={(event) => { setDraft(event.target.value); setSuggestion(""); setStatus(""); }} aria-describedby={emergency ? "tsd-emergency-help tsd-parent-note" : "tsd-parent-note"} placeholder="Write your message" />
              </div>
            </>
          )}
        </div>

        <footer className="tsd-parent-footer">
          <div className="tsd-parent-actions">
            {reviewing && <button type="button" className="tsd-button" onClick={editMessage}>Back to edit</button>}
            <button type="submit" className={`tsd-button ${emergency ? "tsd-emergency-action" : "tsd-primary"}`} disabled={!draft.trim()}>
              {emergency ? reviewing ? "Send emergency message" : "Review emergency message" : "Send message"}
            </button>
          </div>
          <p className="tsd-parent-status" role="status">{status}</p>
          <p id="tsd-parent-note" className="tsd-meta">Messages stay on this page and are not delivered.</p>
        </footer>
      </form>
    </dialog>
  );
}
