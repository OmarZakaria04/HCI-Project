import { useEffect, useRef, useState } from "react";
import keepDialogFocus from "../utils/dialogFocus";
import { useLanguage } from "../i18n/useLanguage";
import "../styles/homework-upload.css";

const QUESTION_TAGS = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"];

export default function HomeworkUploadModal({ assignment, dueDateLabel, currentUpload, onConfirm, onClose }) {
  const { tr } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileConfirmed, setFileConfirmed] = useState(false);
  const [hardQuestions, setHardQuestions] = useState(() => currentUpload?.hardQuestions || []);
  const [hardNote, setHardNote] = useState(() => currentUpload?.hardNote || "");
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const fileRef = useRef(null);
  const currentFile = currentUpload?.fileName || "";
  const replacing = Boolean(currentFile);

  const toggleHardTag = (tag) => {
    setHardQuestions((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    closeRef.current.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  const chooseFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.(pdf|docx?|png|jpe?g)$/i.test(file.name)) {
      setSelectedFile(null);
      setFileConfirmed(false);
      setError(tr("Choose a PDF, Word document, JPG or PNG file.", "Wähle eine PDF-, Word-, JPG- oder PNG-Datei aus."));
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
    setFileConfirmed(false);
    setError("");
  };

  return (
    <dialog ref={dialogRef} className="homework-upload" aria-labelledby="homework-upload-title" aria-describedby="homework-upload-assignment" onKeyDown={keepDialogFocus} onClose={(event) => {
      if (!event.currentTarget.open) onClose();
    }} onClick={(event) => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }}>
      <header className="hu-header">
        <div>
          <h2 id="homework-upload-title">
            {replacing ? tr("Replace upload", "Upload ersetzen") : tr("Upload homework", "Hausaufgabe hochladen")}
          </h2>
          <p id="homework-upload-assignment">{assignment.title}</p>
        </div>
        <button ref={closeRef} type="button" className="hu-close" aria-label={tr("Close homework upload", "Upload-Dialog schließen")} onClick={() => dialogRef.current.close()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </header>

      <form className="hu-form" onSubmit={(event) => {
        event.preventDefault();
        if (selectedFile && fileConfirmed && !error) {
          onConfirm({
            fileName: selectedFile.name,
            hardQuestions,
            hardNote: hardNote.trim(),
          });
        }
      }}>
        <div className="hu-body">
          <section className="hu-brief" aria-labelledby="hu-brief-title">
            <h3 id="hu-brief-title">{tr("Review assignment details", "Aufgabendetails prüfen")}</h3>
            <dl className="hu-brief-list">
              {assignment.instructions && (
                <div>
                  <dt>{tr("Instructions", "Anleitung")}</dt>
                  <dd>{assignment.instructions}</dd>
                </div>
              )}
              {dueDateLabel && (
                <div>
                  <dt>{tr("Due date", "Abgabefrist")}</dt>
                  <dd>{dueDateLabel}</dd>
                </div>
              )}
              <div>
                <dt>{tr("Submission requirements", "Abgabeanforderungen")}</dt>
                <dd>{assignment.requirements || assignment.duration}</dd>
              </div>
            </dl>
          </section>
          <p>{replacing ? tr("Choose a new file. Your current upload stays until you submit.", "Wähle eine neue Datei. Dein aktueller Upload bleibt erhalten, bis du absendest.") : tr("Select your completed worksheet and confirm the file before submitting.", "Wähle dein ausgefülltes Arbeitsblatt aus und bestätige die Datei vor dem Absenden.")}</p>
          {replacing && <div className="hu-current"><h3>{tr("Current file", "Aktuelle Datei")}</h3><p>{currentFile}</p></div>}
          <div className="hu-file-group">
            <h3>{tr("Homework file", "Hausaufgabendatei")}</h3>
            <p id="homework-upload-formats" className="hu-meta">{tr("PDF, Word, JPG or PNG", "PDF, Word, JPG oder PNG")}</p>
            <input ref={fileRef} id="homework-upload-file" type="file" hidden accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={chooseFile} />
            <div className="hu-file-area">
              <div className="hu-file-status" role="status" aria-live="polite" aria-atomic="true">
                {selectedFile ? <><p className="hu-meta">{tr("Selected file", "Ausgewählte Datei")}</p><p className="hu-filename">{selectedFile.name}</p></> : <p>{tr("No file chosen", "Keine Datei ausgewählt")}</p>}
              </div>
              <button type="button" className="hu-button" aria-controls="homework-upload-file" aria-describedby={error ? "homework-upload-formats homework-upload-error" : "homework-upload-formats"} onClick={() => fileRef.current.click()}>
                {selectedFile ? tr("Change file", "Datei ändern") : tr("Upload file", "Datei hochladen")}
              </button>
            </div>
            {selectedFile && (
              <label className="hu-confirm-check" htmlFor="homework-confirm-file">
                <input
                  id="homework-confirm-file"
                  type="checkbox"
                  checked={fileConfirmed}
                  onChange={(event) => setFileConfirmed(event.target.checked)}
                />
                <span>
                  {tr(
                    `Confirm selected file: "${selectedFile.name}" is ready to submit`,
                    `Ausgewählte Datei bestätigen: „${selectedFile.name}“ kann eingereicht werden`
                  )}
                </span>
              </label>
            )}
            <p id="homework-upload-error" className="hu-error" role="alert">{error}</p>
          </div>
          <div className="hu-hard-group">
            <h3>{tr("Mark hard questions for your teacher (optional)", "Schwere Aufgaben für die Lehrkraft markieren (optional)")}</h3>
            <p className="hu-meta">
              {tr(
                "Tap any questions you found tricky so your teacher can review them with you.",
                "Tippe auf Aufgaben, die schwer waren, damit deine Lehrkraft sie mit dir besprechen kann."
              )}
            </p>
            <div className="hu-hard-tags" role="group" aria-label={tr("Difficult assignment questions", "Schwere Hausaufgaben-Fragen")}>
              {QUESTION_TAGS.map((tag) => {
                const isSelected = hardQuestions.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={isSelected}
                    className={`hu-tag-btn ${isSelected ? "is-selected" : ""}`}
                    onClick={() => toggleHardTag(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <label htmlFor="homework-hard-note" className="hu-note-label">
              {tr("Question note (optional)", "Notiz zur Aufgabe (optional)")}
            </label>
            <input
              id="homework-hard-note"
              type="text"
              className="hu-note-input"
              value={hardNote}
              onChange={(event) => setHardNote(event.target.value)}
              placeholder={tr("e.g. I wasn't sure how to label Question 3.", "z. B. Ich war bei Aufgabe 3 unsicher.")}
            />
          </div>
          {!replacing && !selectedFile && <div className="hu-sample"><p>{tr("No file handy?", "Keine Datei zur Hand?")}</p><button type="button" className="hu-sample-button" onClick={() => { setSelectedFile({ name: "Homework_Scan_Ahmed.pdf" }); setFileConfirmed(false); setError(""); }}>{tr("Select sample scan", "Beispiel-Scan auswählen")}</button></div>}
        </div>

        <footer className="hu-footer">
          <div className="hu-actions">
            <button type="button" className="hu-button" onClick={() => dialogRef.current.close()}>{tr("Cancel", "Abbrechen")}</button>
            <button type="submit" className="hu-button hu-primary" disabled={!selectedFile || !fileConfirmed || Boolean(error)}>
              {replacing ? tr("Submit replacement", "Neue Datei absenden") : tr("Submit assignment", "Aufgabe absenden")}
            </button>
          </div>
          <p className="hu-meta">{tr("Saved in this browser so your upload & marked hard questions stay synced for your teacher.", "Wird in diesem Browser gespeichert, damit Upload und markierte Fragen für deine Lehrkraft sichtbar bleiben.")}</p>
        </footer>
      </form>
    </dialog>
  );
}
