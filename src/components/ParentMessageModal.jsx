import { useEffect, useRef, useState } from "react";
import keepDialogFocus from "../utils/dialogFocus";
import { useLanguage } from "../i18n/useLanguage";

export default function ParentMessageModal({ isOpen, parentName, studentName, messages, onSend, onClose }) {
  const { tr } = useLanguage();
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

  const suggestedMessages = [
    {
      label: tr("Call the school", "Schule anrufen"),
      text: tr("Please call the school as soon as possible.", "Bitte rufen Sie so bald wie möglich in der Schule an."),
    },
    {
      label: tr("Arrange pickup", "Abholung organisieren"),
      text: tr("Your child needs to be picked up today.", "Ihr Kind muss heute abgeholt werden."),
    },
    {
      label: tr("Urgent update", "Dringendes Update"),
      text: tr("Please check the app for an urgent update.", "Bitte prüfen Sie die App für ein dringendes Update."),
    },
  ];

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
    setStatus(
      emergency
        ? tr("Emergency message added to this conversation.", "Notfallnachricht zu dieser Unterhaltung hinzugefügt.")
        : tr("Message added to this conversation.", "Nachricht zu dieser Unterhaltung hinzugefügt.")
    );
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
          <h2 id="tsd-parent-title">{tr("Contact parent", "Elternteil kontaktieren")}</h2>
          <p className="tsd-parent-recipient">{tr("To:", "An:")} {parentName}</p>
        </div>
        <button ref={closeRef} type="button" className="tsd-parent-close" aria-label={tr("Close parent conversation", "Eltern-Unterhaltung schließen")} onClick={() => dialogRef.current.close()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </header>

      <form className="tsd-parent-form" onSubmit={submit}>
        <div ref={bodyRef} className="tsd-parent-body">
          {reviewing ? (
            <section className="tsd-parent-review" aria-labelledby="tsd-emergency-review-title">
              <div className="tsd-emergency-notice">
                <h3 ref={reviewTitleRef} tabIndex={-1} id="tsd-emergency-review-title">{tr("Review emergency message", "Notfallnachricht prüfen")}</h3>
                <p>{tr("Check the recipient and message before adding it to the conversation.", "Prüfen Sie Empfänger und Nachricht vor dem Hinzufügen zur Unterhaltung.")}</p>
              </div>
              <dl className="tsd-review-recipient"><dt>{tr("To", "An")}</dt><dd>{parentName}</dd></dl>
              <div className="tsd-parent-preview"><h3>{tr("Your message", "Ihre Nachricht")}</h3><p>{draft.trim()}</p></div>
            </section>
          ) : (
            <>
              <section className="tsd-parent-conversation" aria-labelledby="tsd-parent-conversation-title">
                <h3 id="tsd-parent-conversation-title">{tr("Conversation", "Unterhaltung")}</h3>
                <div ref={logRef} className="tsd-chat-log" role="log" aria-label={tr(`Conversation with ${parentName} about ${studentName}`, `Unterhaltung mit ${parentName} über ${studentName}`)} aria-live="polite" aria-relevant="additions" tabIndex={messages.length ? 0 : undefined}>
                  {messages.length ? messages.map((message, index) => (
                    <div key={index} className={`tsd-chat-message${message.emergency ? " tsd-parent-emergency-message" : ""}`}>
                      <div className="tsd-message-heading"><p>{message.from === "teacher" ? tr("You", "Sie") : parentName}</p><p>{message.time}</p></div>
                      {message.emergency && <p className="tsd-emergency-label">{tr("Emergency", "Notfall")}</p>}
                      <p>{message.text}</p>
                    </div>
                  )) : <p className="tsd-meta">{tr("No previous messages.", "Keine vorherigen Nachrichten.")}</p>}
                </div>
              </section>

              <fieldset className="tsd-message-type">
                <legend>{tr("Message type", "Nachrichtentyp")}</legend>
                <div className="tsd-type-options">
                  <label className="tsd-type-option">
                    <input type="radio" name="parent-message-type" value="standard" checked={!emergency} onChange={() => { setEmergency(false); setStatus(""); }} />
                    <span>{tr("Standard message", "Standardnachricht")}</span>
                  </label>
                  <label className="tsd-type-option tsd-type-emergency">
                    <input type="radio" name="parent-message-type" value="emergency" checked={emergency} onChange={() => { setEmergency(true); setStatus(""); }} />
                    <span>{tr("Emergency", "Notfall")}</span>
                  </label>
                </div>
              </fieldset>

              {emergency && (
                <div className="tsd-emergency-details">
                  <div className="tsd-emergency-notice" id="tsd-emergency-help">
                    <h3>{tr("Emergency message", "Notfallnachricht")}</h3>
                    <p>{tr("Use when the parent needs to act immediately.", "Verwenden, wenn Eltern sofort handeln müssen.")}</p>
                  </div>
                  <div className="tsd-parent-field">
                    <label htmlFor="tsd-parent-suggestion">{tr("Suggested message", "Nachrichtenvorlage")}</label>
                    <select id="tsd-parent-suggestion" value={suggestion} onChange={(event) => {
                      const value = event.target.value;
                      setSuggestion(value);
                      setStatus("");
                      if (value !== "") {
                        setDraft(suggestedMessages[Number(value)].text);
                        composerRef.current.focus();
                      }
                    }}>
                      <option value="">{tr("Choose a starting message", "Vorlage auswählen")}</option>
                      {suggestedMessages.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="tsd-parent-field">
                <label htmlFor="tsd-parent-message">{tr("Your message", "Ihre Nachricht")}</label>
                <textarea id="tsd-parent-message" ref={composerRef} rows={4} value={draft} onChange={(event) => { setDraft(event.target.value); setSuggestion(""); setStatus(""); }} aria-describedby={emergency ? "tsd-emergency-help tsd-parent-note" : "tsd-parent-note"} placeholder={tr("Write your message", "Nachricht schreiben")} />
              </div>
            </>
          )}
        </div>

        <footer className="tsd-parent-footer">
          <div className="tsd-parent-actions">
            {reviewing && <button type="button" className="tsd-button" onClick={editMessage}>{tr("Back to edit", "Zurück zum Bearbeiten")}</button>}
            <button type="submit" className={`tsd-button ${emergency ? "tsd-emergency-action" : "tsd-primary"}`} disabled={!draft.trim()}>
              {emergency
                ? reviewing ? tr("Send emergency message", "Notfallnachricht senden") : tr("Review emergency message", "Notfallnachricht prüfen")
                : tr("Send message", "Nachricht senden")}
            </button>
          </div>
          <p className="tsd-parent-status" role="status">{status}</p>
          <p id="tsd-parent-note" className="tsd-meta">{tr("Messages stay on this page and are not delivered.", "Nachrichten bleiben auf dieser Seite und werden nicht zugestellt.")}</p>
        </footer>
      </form>
    </dialog>
  );
}
