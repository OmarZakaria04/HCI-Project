import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import { useLanguage } from "../../i18n/useLanguage";
import {
  createParentId,
  getParentChatsMap,
  saveParentChatMessage,
} from "../../utils/parentStore";
import ParentPageIntro from "./ParentPageIntro";
import { useActiveChild } from "./useActiveChild";
import "../../styles/parent.css";

export default function ParentChat() {
  const { teacherId } = useParams();
  const { lang, tr } = useLanguage();
  const { activeChildId, child, selectChild } = useActiveChild();

  const [addedChats, setAddedChats] = useState(() => getParentChatsMap());
  const [draft, setDraft] = useState("");
  const [statusRecord, setStatusRecord] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const chatLogRef = useRef(null);
  const composerRef = useRef(null);

  const teachers = child.teachers || [];
  const selectedTeacher =
    teachers.find((item) => item.id === teacherId) || teachers[0];
  const childFirstName = child.name.split(" ")[0];
  const baseMessages = selectedTeacher
    ? child.chatMessages?.[selectedTeacher.id] || []
    : [];
  const extraMessages = selectedTeacher
    ? addedChats[child.id]?.[selectedTeacher.id] || []
    : [];
  const messages = [...baseMessages, ...extraMessages];
  const statusKey = `${child.id}:${selectedTeacher?.id || ""}`;
  const messageStatus =
    statusRecord?.key === statusKey ? statusRecord.text : "";

  const presets = [
    tr("Thank you for the feedback and update.", "Vielen Dank für die Rückmeldung und das Update."),
    tr(
      `Could we clarify the upcoming ${selectedTeacher?.subject || "class"} work for ${childFirstName}?`,
      `Könnten wir die nächsten Aufgaben im Fach ${selectedTeacher?.subject || "Unterricht"} für ${childFirstName} kurz absprechen?`
    ),
    tr(
      `${childFirstName} practiced the recommended exercises at home.`,
      `${childFirstName} hat die empfohlenen Übungen zu Hause bearbeitet.`
    ),
    tr(
      "Confirming our upcoming parent-teacher conference.",
      "Ich bestätige unseren bevorstehenden Gesprächstermin."
    ),
  ];

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages.length, selectedTeacher?.id, child.id]);

  const handleDraftStarter = (text) => {
    setDraft(text);
    composerRef.current?.focus();
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isSending || !selectedTeacher) return;

    setIsSending(true);
    const targetChildId = child.id;
    const targetTeacherId = selectedTeacher.id;

    setTimeout(() => {
      const formattedTime = new Date().toLocaleTimeString(
        lang === "de" ? "de-DE" : [],
        { hour: "2-digit", minute: "2-digit" }
      );
      const newMsg = {
        id: createParentId("pchat"),
        sender: "parent",
        text,
        time: lang === "de" ? `${formattedTime} Uhr` : formattedTime,
      };

      const nextChats = saveParentChatMessage(targetChildId, targetTeacherId, newMsg);
      setAddedChats(nextChats);
      setDraft("");
      setIsSending(false);
      setStatusRecord({
        key: `${targetChildId}:${targetTeacherId}`,
        text: tr(
          "Message saved in your browser for your teacher.",
          "Nachricht für die Lehrkraft im Browser gespeichert."
        ),
      });
      composerRef.current?.focus();
    }, 200);
  };

  return (
    <div className="parent-page">
      <Header role="parent" />

      <main className="parent-container">
        <ParentPageIntro
          title={tr("Messages", "Nachrichten")}
          subtitle={
            selectedTeacher
              ? tr(
                  `Conversation with ${selectedTeacher.name} (${selectedTeacher.subject}) regarding ${child.name} (${child.grade}).`,
                  `Unterhaltung mit ${selectedTeacher.name} (${selectedTeacher.subject}) zu ${child.name} (${child.grade}).`
                )
              : tr(
                  `No teachers listed for ${child.name}.`,
                  `Keine Lehrkräfte für ${child.name} hinterlegt.`
                )
          }
          backTo={teacherId ? "/parent/teachers" : undefined}
          backLabel={
            teacherId
              ? tr("Back to teachers", "Zurück zu den Lehrkräften")
              : undefined
          }
          activeChildId={activeChildId}
          onSelectChild={selectChild}
        />

        {selectedTeacher ? (
          <div className="parent-chat-layout">
            <aside
              className="parent-panel"
              aria-labelledby="parent-chat-teachers-title"
            >
              <div className="parent-panel-heading">
                <h2 id="parent-chat-teachers-title">
                  {tr("Teachers", "Lehrkräfte")}
                </h2>
              </div>

              <ul className="parent-chat-directory">
                {teachers.map((teacher) => {
                  const isCurrent = teacher.id === selectedTeacher.id;
                  return (
                    <li key={teacher.id}>
                      <Link
                        to={`/parent/chat/${teacher.id}`}
                        className="parent-chat-teacher-link"
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        <strong>{teacher.name}</strong>
                        <span className="parent-meta">
                          {teacher.subject} · {teacher.room}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <section
              className="parent-panel parent-chat-panel"
              aria-labelledby="parent-chat-heading"
            >
              <div className="parent-panel-heading">
                <div className="parent-panel-heading-copy">
                  <h2 id="parent-chat-heading">{selectedTeacher.name}</h2>
                  <p className="parent-meta">
                    {selectedTeacher.subject} · {selectedTeacher.room} ·{" "}
                    {tr("Regarding", "Betrifft")} {child.name}
                  </p>
                </div>
              </div>

              <p id="parent-chat-note" className="parent-meta">
                {tr(
                  "Demo conversation. Messages stay on this page and are not delivered to the teacher.",
                  "Demo-Unterhaltung. Nachrichten bleiben auf dieser Seite und werden nicht an die Lehrkraft gesendet."
                )}
              </p>

              <div
                ref={chatLogRef}
                className="parent-chat-log"
                role="log"
                aria-label={tr(
                  `Conversation with ${selectedTeacher.name} about ${child.name}`,
                  `Unterhaltung mit ${selectedTeacher.name} über ${child.name}`
                )}
                aria-live="polite"
                aria-relevant="additions"
                tabIndex={0}
              >
                {messages.length ? (
                  messages.map((msg) => {
                    const isParent = msg.sender === "parent";
                    return (
                      <div
                        key={msg.id}
                        className={`parent-chat-message ${
                          isParent
                            ? "parent-chat-parent"
                            : "parent-chat-teacher"
                        }`}
                      >
                        <p className="parent-chat-author">
                          {isParent ? tr("You", "Sie") : selectedTeacher.name}
                        </p>
                        <p>{msg.text}</p>
                        <p className="parent-chat-time">{msg.time}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="parent-meta">
                    {tr(
                      "No previous messages. Write a note below to start this demo conversation.",
                      "Noch keine Nachrichten. Schreiben Sie unten, um die Demo-Unterhaltung zu starten."
                    )}
                  </p>
                )}
              </div>

              <div
                className="parent-starter-group"
                role="group"
                aria-label={tr("Message starters", "Nachrichtenvorschläge")}
              >
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleDraftStarter(preset)}
                    className="parent-button parent-button-quiet"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="parent-composer-form"
              >
                <div className="parent-field">
                  <label htmlFor="parent-chat-input">
                    {tr("Your message to", "Ihre Nachricht an")} {selectedTeacher.name}
                  </label>
                  <textarea
                    id="parent-chat-input"
                    ref={composerRef}
                    rows={3}
                    className="parent-textarea"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    aria-describedby="parent-chat-note"
                    placeholder={tr(
                      `Write a message to ${selectedTeacher.name}`,
                      `Nachricht an ${selectedTeacher.name} schreiben`
                    )}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSending || !draft.trim()}
                  className="parent-button parent-button-primary"
                >
                  {isSending
                    ? tr("Sending...", "Wird gesendet...")
                    : tr("Send message", "Nachricht senden")}
                </button>
              </form>

              {messageStatus && (
                <p className="parent-meta" role="status">
                  {messageStatus}
                </p>
              )}
            </section>
          </div>
        ) : (
          <section className="parent-panel">
            <p className="parent-empty">
              {tr("No teachers available for messaging.", "Keine Lehrkräfte zum Schreiben verfügbar.")}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
