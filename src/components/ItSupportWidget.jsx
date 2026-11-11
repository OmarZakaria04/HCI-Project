import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/useLanguage";
import "../styles/it-support.css";

const STORAGE_KEY = "zinger_it_support_chat";
let ticketSeq = 1000;
const nextSupportId = () => ++ticketSeq;

function detectRole(pathname) {
  const path = pathname.toLowerCase();
  if (path.startsWith("/teacher")) return "teacher";
  if (path.startsWith("/student")) return "student";
  if (path.startsWith("/parent")) return "parent";
  try {
    const parsed = JSON.parse(localStorage.getItem("user") || "null");
    if (parsed?.role) return parsed.role.toLowerCase();
  } catch {
    // ignore invalid stored user
  }
  return "guest";
}

function buildSupportReply(text, role, tr) {
  const q = text.toLowerCase();
  const ticketId = `IT-${nextSupportId()}`;

  if (q.includes("password") || q.includes("sign in") || q.includes("login") || q.includes("passwort") || q.includes("anmeld")) {
    return tr(
      `Account & sign-in (${ticketId}): Check for extra spaces in your email, or use one of the Quick Demo buttons on /. For permanent password resets, school office admins reset credentials from the Zinger Admin Desk.`,
      `Konto & Anmeldung (${ticketId}): Prüfen Sie Ihre E-Mail auf Leerzeichen oder nutzen Sie die Schnell-Demo auf /. Dauerhafte Passwort-Resets nimmt das Schulsekretariat vor.`
    );
  }
  if (q.includes("upload") || q.includes("file") || q.includes("pdf") || q.includes("scan") || q.includes("datei") || q.includes("hochladen")) {
    return tr(
      `Upload help (${ticketId}): Homework accepts PDF, DOC/DOCX, JPG, or PNG files. Make sure you tick "Confirm selected file" before clicking Submit, or try "Select sample scan" to test.`,
      `Upload-Hilfe (${ticketId}): Erlaubt sind PDF, DOC/DOCX, JPG oder PNG. Aktivieren Sie „Ausgewählte Datei bestätigen“, bevor Sie auf Absenden klicken.`
    );
  }
  if (q.includes("ocr") || q.includes("extract") || q.includes("publish") || q.includes("supervisor") || q.includes("fachleitung")) {
    return tr(
      `Grading workflow (${ticketId}): Edit extracted answers in Step 1 (or click "Back to extracted answers" from Step 3). Remember: "Publish confirmed results" unlocks only after "Supervisor: Confirm assessment".`,
      `Korrektur-Hilfe (${ticketId}): Ausgelesene Antworten können in Schritt 1 (oder über „Zurück zu ausgelesenen Antworten“) bearbeitet werden. Die Veröffentlichung wird nach Bestätigung durch die Fachleitung freigegeben.`
    );
  }
  if (q.includes("grade") || q.includes("report") || q.includes("note") || q.includes("zeugnis")) {
    return tr(
      `Grades & Reports (${ticketId}): Only grades confirmed by both teacher and supervisor appear in Student and Parent report cards. If a recent paper is missing, check whether Step 3 "Publish confirmed results" was completed.`,
      `Noten & Zeugnisse (${ticketId}): Erst nach Bestätigung durch Lehrkraft und Fachleitung erscheinen Ergebnisse in Schüler- und Elternansicht.`
    );
  }
  const roleLabel =
    role === "teacher"
      ? tr("Teacher Desk", "Lehrkräfte-Support")
      : role === "parent"
        ? tr("Parent Desk", "Eltern-Support")
        : role === "student"
          ? tr("Student Desk", "Schüler-Support")
          : tr("Portal Desk", "Portal-Support");

  return tr(
    `Logged ticket ${ticketId} (${roleLabel}): Our IT Support team received your note ("${text.slice(0, 60)}${text.length > 60 ? "..." : ""}") and will inspect it right away.`,
    `Ticket ${ticketId} (${roleLabel}) erfasst: Unser IT-Support hat Ihre Meldung erhalten und kümmert sich sofort darum.`
  );
}

export default function ItSupportWidget() {
  const location = useLocation();
  const { tr } = useLanguage();
  const role = detectRole(location.pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const panelRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const replyTimerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore storage errors
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages.length, isOpen]);

  useEffect(() => () => clearTimeout(replyTimerRef.current), []);

  const roleName =
    role === "teacher"
      ? tr("Teacher", "Lehrkraft")
      : role === "parent"
        ? tr("Parent", "Eltern")
        : role === "student"
          ? tr("Student", "Schüler")
          : tr("Sign-in", "Anmeldung");

  const quickTopics = {
    guest: [
      tr("Can't sign in / password issue", "Anmeldung / Passwortproblem"),
      tr("Page error or blank screen", "Seitenfehler melden"),
    ],
    student: [
      tr("Homework upload failed", "Hausaufgaben-Upload klappt nicht"),
      tr("Missing quiz grade", "Note fehlt noch"),
    ],
    parent: [
      tr("Report card not visible yet", "Zeugnis noch nicht sichtbar"),
      tr("Technical issue with messages", "Technisches Problem bei Nachrichten"),
    ],
    teacher: [
      tr("OCR answer edit help", "Hilfe bei OCR-Antwortkorrektur"),
      tr("Supervisor publish button locked", "Veröffentlichen ist gesperrt"),
    ],
  }[role];

  const sendUserMessage = (rawText) => {
    const text = rawText.trim();
    if (!text) return;
    const userMsg = {
      id: `it-u-${nextSupportId()}`,
      sender: "user",
      text,
      time: tr("Just now", "Gerade eben"),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    clearTimeout(replyTimerRef.current);
    replyTimerRef.current = setTimeout(() => {
      const botMsg = {
        id: `it-s-${nextSupportId()}`,
        sender: "support",
        text: buildSupportReply(text, role, tr),
        time: tr("IT Support · Now", "IT-Support · Jetzt"),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 350);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendUserMessage(input);
  };

  const welcomeMsg = tr(
    `Hi! You're connected to Zinger IT Support (${roleName}). Tell us what isn't working or pick a topic below.`,
    `Hallo! Hier ist der Zinger IT-Support (${roleName}). Beschreiben Sie Ihr Problem oder wählen Sie ein Thema.`
  );

  return (
    <aside
      className={`it-support-root${isDocked && !isOpen ? " is-docked" : ""}`}
      aria-label={tr("IT Support chat", "IT-Support-Chat")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
          toggleBtnRef.current?.focus();
        }
      }}
    >
      {isOpen && (
        <section
          ref={panelRef}
          id="it-support-panel"
          className="it-support-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="it-support-title"
        >
          <header className="it-support-head">
            <div>
              <h2 id="it-support-title">{tr("IT Support", "IT-Support")}</h2>
              <p>
                {tr("Active portal:", "Aktives Portal:")} <strong>{roleName}</strong> ·{" "}
                {location.pathname}
              </p>
            </div>
            <div className="it-support-head-actions">
              {messages.length > 0 && (
                <button
                  type="button"
                  className="it-support-clear"
                  onClick={() => setMessages([])}
                >
                  {tr("Clear", "Leeren")}
                </button>
              )}
              <button
                type="button"
                className="it-support-close"
                aria-label={tr("Close IT Support chat", "IT-Support-Chat schließen")}
                onClick={() => {
                  setIsOpen(false);
                  toggleBtnRef.current?.focus();
                }}
              >
                ×
              </button>
            </div>
          </header>

          <div
            ref={logRef}
            className="it-support-log"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            <div className="it-support-msg is-support">
              <p>{welcomeMsg}</p>
            </div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`it-support-msg ${msg.sender === "user" ? "is-user" : "is-support"}`}
              >
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="it-support-quick" role="group" aria-label={tr("Common IT issues", "Häufige IT-Themen")}>
            {quickTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className="it-support-chip"
                onClick={() => sendUserMessage(topic)}
              >
                {topic}
              </button>
            ))}
          </div>

          <form className="it-support-form" onSubmit={handleSubmit}>
            <label htmlFor="it-support-input" className="sr-only">
              {tr("Describe your technical issue", "Technisches Problem beschreiben")}
            </label>
            <input
              ref={inputRef}
              id="it-support-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={tr("Type a technical question...", "Technische Frage eingeben...")}
            />
            <button type="submit" disabled={!input.trim()}>
              {tr("Send", "Senden")}
            </button>
          </form>
        </section>
      )}

      {!isOpen && (
        <div className="it-support-launcher">
          {!isDocked ? (
            <>
              <button
                ref={toggleBtnRef}
                type="button"
                className="it-support-bubble"
                aria-expanded={isOpen}
                aria-controls="it-support-panel"
                onClick={() => {
                  setIsDocked(false);
                  setIsOpen(true);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>{tr("IT Support", "IT-Support")}</span>
              </button>
              <button
                type="button"
                className="it-support-dock-btn"
                title={tr("Tuck bubble to side edge", "Chat-Bubble an den Rand schieben")}
                aria-label={tr("Tuck IT Support bubble to right edge", "IT-Support an den rechten Rand einklappen")}
                onClick={() => setIsDocked(true)}
              >
                ›
              </button>
            </>
          ) : (
            <button
              ref={toggleBtnRef}
              type="button"
              className="it-support-edge-tab"
              aria-expanded={false}
              aria-controls="it-support-panel"
              title={tr("Open IT Support chat", "IT-Support-Chat öffnen")}
              aria-label={tr("Open IT Support chat", "IT-Support-Chat öffnen")}
              onClick={() => {
                setIsDocked(false);
                setIsOpen(true);
              }}
            >
              ‹ {tr("IT", "IT")}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
