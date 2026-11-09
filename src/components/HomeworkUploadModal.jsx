import { useEffect, useRef, useState } from "react";
import keepDialogFocus from "../utils/dialogFocus";
import "../styles/homework-upload.css";

export default function HomeworkUploadModal({ assignment, currentFile, onConfirm, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const fileRef = useRef(null);
  const replacing = Boolean(currentFile);

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
      setError("Choose a PDF, Word document, JPG or PNG file.");
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
    setError("");
  };

  return (
    <dialog ref={dialogRef} className="homework-upload" aria-labelledby="homework-upload-title" aria-describedby="homework-upload-assignment" onKeyDown={keepDialogFocus} onClose={(event) => {
      // Strict Mode can queue a close event before reopening this dialog.
      if (!event.currentTarget.open) onClose();
    }} onClick={(event) => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }}>
      <header className="hu-header">
        <div>
          <h2 id="homework-upload-title">{replacing ? "Replace upload" : "Upload homework"}</h2>
          <p id="homework-upload-assignment">{assignment.title}</p>
        </div>
        <button ref={closeRef} type="button" className="hu-close" aria-label="Close homework upload" onClick={() => dialogRef.current.close()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </header>

      <form className="hu-form" onSubmit={(event) => {
        event.preventDefault();
        if (selectedFile && !error) onConfirm(selectedFile.name);
      }}>
        <div className="hu-body">
          <p>{replacing ? "Choose a new file. Your current upload stays until you confirm." : "Choose your completed worksheet to upload."}</p>
          {replacing && <div className="hu-current"><h3>Current file</h3><p>{currentFile}</p></div>}
          <div className="hu-file-group">
            <h3>Homework file</h3>
            <p id="homework-upload-formats" className="hu-meta">PDF, Word, JPG or PNG</p>
            <input ref={fileRef} id="homework-upload-file" type="file" hidden accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={chooseFile} />
            <div className="hu-file-area">
              <div className="hu-file-status" role="status" aria-live="polite" aria-atomic="true">
                {selectedFile ? <><p className="hu-meta">Selected file</p><p className="hu-filename">{selectedFile.name}</p></> : <p>No file chosen</p>}
              </div>
              <button type="button" className="hu-button" aria-controls="homework-upload-file" aria-describedby={error ? "homework-upload-formats homework-upload-error" : "homework-upload-formats"} onClick={() => fileRef.current.click()}>
                {selectedFile ? "Change file" : "Choose a file"}
              </button>
            </div>
            <p id="homework-upload-error" className="hu-error" role="alert">{error}</p>
          </div>
          {!replacing && !selectedFile && <div className="hu-sample"><p>No file handy?</p><button type="button" className="hu-sample-button" onClick={() => onConfirm("Homework_Scan_Ahmed.pdf")}>Use sample homework</button></div>}
        </div>

        <footer className="hu-footer">
          <div className="hu-actions">
            <button type="button" className="hu-button" onClick={() => dialogRef.current.close()}>Cancel</button>
            <button type="submit" className="hu-button hu-primary" disabled={!selectedFile || Boolean(error)}>{replacing ? "Replace upload" : "Upload homework"}</button>
          </div>
          <p className="hu-meta">This demo saves the filename only. Your file is not sent.</p>
        </footer>
      </form>
    </dialog>
  );
}
