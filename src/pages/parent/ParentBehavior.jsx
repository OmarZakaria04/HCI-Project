import { useState } from "react";
import Header from "../../components/Header";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import { getTeacherData } from "../../i18n/teacherDataDe";
import { getTeacherCommState } from "../../utils/teacherStore";
import {
  getParentBehaviorNotesMap,
  saveParentBehaviorNote,
} from "../../utils/parentStore";
import ParentPageIntro, { ParentNotice } from "./ParentPageIntro";
import { useActiveChild } from "./useActiveChild";
import "../../styles/parent.css";

export default function ParentBehavior() {
  const { lang, tr } = useLanguage();
  const { activeChildId, child, selectChild } = useActiveChild();
  const [savedNotesByChild, setSavedNotesByChild] = useState(() =>
    getParentBehaviorNotesMap()
  );
  const [replyTextMap, setReplyTextMap] = useState({});
  const [loadingConcernId, setLoadingConcernId] = useState(null);
  const [notice, setNotice] = useState(null);

  const presets = [
    tr(
      "Reviewed step-by-step calculation checks together over the weekend.",
      "Am Wochenende gemeinsam schrittweise Rechenkontrollen geübt."
    ),
    tr(
      "Practiced brief discussion turns at dinner to build speaking confidence.",
      "Beim Abendessen kurze Gesprächsrunden geübt, um das freie Sprechen zu stärken."
    ),
    tr(
      "Set up a 15-minute quiet focus block before homework.",
      "Eine 15-minütige ruhige Konzentrationsphase vor den Hausaufgaben eingeführt."
    ),
    tr(
      "Practiced double-checking signs and showing intermediate steps.",
      "Das Prüfen von Vorzeichen und Aufschreiben der Zwischenschritte geübt."
    ),
  ];

  const teacherComm = getTeacherCommState();
  const teacherLogs = [
    ...(teacherComm.addedBehaviors || []),
    ...(getTeacherData(lang).teacherCommunication?.behaviorLogs || []),
  ]
    .map((entry) => {
      const patch = teacherComm.behaviorPatches?.[entry.id];
      return patch ? { ...entry, ...patch } : entry;
    })
    .filter((entry) => entry.studentName === child.name && entry.sharedWithParent)
    .map((entry) => ({
      id: entry.id,
      teacher: tr("Class teacher", "Klassenleitung"),
      subject: tr("Classroom observation", "Unterrichtsbeobachtung"),
      date: entry.date,
      category: entry.category,
      status: "Shared by teacher",
      concern: entry.note,
      homeActionPlan: entry.homeTip ? [entry.homeTip] : [],
    }));

  const concerns = [...teacherLogs, ...(child.behavioralConcerns || [])].map((item) => {
    const updatedNote = savedNotesByChild[child.id]?.[item.id];
    return updatedNote ? { ...item, parentNote: updatedNote } : item;
  });

  const handleSendParentReply = (concernId, event) => {
    event?.preventDefault();
    const text = replyTextMap[concernId]?.trim();
    if (!text || loadingConcernId) return;

    const targetChildId = child.id;
    setLoadingConcernId(concernId);

    setTimeout(() => {
      setSavedNotesByChild(saveParentBehaviorNote(targetChildId, concernId, text));
      setLoadingConcernId(null);
      setReplyTextMap((prev) => ({ ...prev, [concernId]: "" }));
      setNotice({
        text: tr(
          "Home practice update saved for your teacher.",
          "Rückmeldung für die Lehrkraft gespeichert."
        ),
      });
    }, 300);
  };

  return (
    <div className="parent-page">
      <Header role="parent" />

      <main className="parent-container">
        <ParentPageIntro
          title={tr("Behavior & home plan", "Verhalten & Förderplan")}
          subtitle={tr(
            `Teacher observations and home support suggestions for ${child.name} (${child.grade}).`,
            `Beobachtungen der Lehrkräfte und Fördervorschläge für zu Hause für ${child.name} (${child.grade}).`
          )}
          activeChildId={activeChildId}
          onSelectChild={selectChild}
        />

        <ParentNotice notice={notice} onDismiss={() => setNotice(null)} />

        <section
          className="parent-panel"
          aria-labelledby="parent-behavior-heading"
        >
          <div className="parent-panel-heading">
            <div className="parent-panel-heading-copy">
              <h2 id="parent-behavior-heading">
                {tr(
                  "Teacher observations & home partnership",
                  "Beobachtungen der Lehrkräfte & Zusammenarbeit"
                )}
              </h2>
              <p className="parent-meta">
                {tr(
                  "Constructive observations shared by teachers with suggested steps for home",
                  "Konstruktive Rückmeldungen der Lehrkräfte mit Empfehlungen für zu Hause"
                )}
              </p>
            </div>
            <span className="parent-meta">
              {concerns.length}{" "}
              {concerns.length === 1
                ? tr("record", "Eintrag")
                : tr("records", "Einträge")}
            </span>
          </div>

          {concerns.length === 0 ? (
            <p className="parent-empty">
              {tr(
                `No behavioral notes are recorded for ${child.name}. Teachers have not logged any conduct or focus concerns.`,
                `Für ${child.name} liegen derzeit keine Verhaltenshinweise vor. Es wurden keine Auffälligkeiten gemeldet.`
              )}
            </p>
          ) : (
            <ul className="parent-divided-list">
              {concerns.map((item) => {
                const isItemLoading = loadingConcernId === item.id;
                const draftValue = replyTextMap[item.id] || "";
                const inputId = `behavior-reply-${child.id}-${item.id}`;

                return (
                  <li key={item.id}>
                    <div className="parent-ticket-head">
                      <h3>{item.category}</h3>
                      <span className="parent-status-tag">
                        {translateValue(item.status, lang)}
                      </span>
                    </div>
                    <p className="parent-meta">
                      {tr("Shared by", "Geteilt von")} {item.teacher} ({item.subject}) · {item.date}
                    </p>

                    <blockquote className="parent-observation-quote">
                      {item.concern}
                    </blockquote>

                    <div className="parent-action-plan">
                      <h4>{tr("Recommended home action plan", "Empfohlener Maßnahmenplan für zu Hause")}</h4>
                      <ul className="parent-bullet-list">
                        {item.homeActionPlan.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="parent-divider-section">
                      <h4>{tr("Home feedback & response", "Rückmeldung von zu Hause")}</h4>

                      {item.parentNote ? (
                        <p>
                          <strong>{tr("Your note:", "Ihre Notiz:")}</strong>{" "}
                          {item.parentNote}{" "}
                          <span className="parent-meta">
                            ({tr("Saved on this page", "Auf dieser Seite gespeichert")})
                          </span>
                        </p>
                      ) : (
                        <form
                          onSubmit={(event) =>
                            handleSendParentReply(item.id, event)
                          }
                          className="parent-composer-form"
                        >
                          <div
                            className="parent-starter-group"
                            role="group"
                            aria-label={tr("Suggested home updates", "Vorgeschlagene Rückmeldungen")}
                          >
                            {presets.map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                aria-pressed={draftValue === preset}
                                onClick={() =>
                                  setReplyTextMap((prev) => ({
                                    ...prev,
                                    [item.id]: preset,
                                  }))
                                }
                                className="parent-button parent-button-quiet"
                              >
                                {preset}
                              </button>
                            ))}
                          </div>

                          <div className="parent-field">
                            <label htmlFor={inputId}>
                              {tr("Home progress update for", "Rückmeldung für")} {item.teacher}
                            </label>
                            <div className="parent-inline-reply">
                              <input
                                id={inputId}
                                type="text"
                                className="parent-input"
                                value={draftValue}
                                onChange={(event) =>
                                  setReplyTextMap((prev) => ({
                                    ...prev,
                                    [item.id]: event.target.value,
                                  }))
                                }
                                placeholder={tr(
                                  "Write a brief update on home practice",
                                  "Kurze Rückmeldung zum Üben zu Hause schreiben"
                                )}
                              />
                              <button
                                type="submit"
                                disabled={isItemLoading || !draftValue.trim()}
                                className="parent-button parent-button-primary"
                              >
                                {isItemLoading
                                  ? tr("Saving...", "Speichert...")
                                  : tr("Save home update", "Rückmeldung speichern")}
                              </button>
                            </div>
                          </div>
                          <p className="parent-meta">
                            {tr(
                              "Demo note. Updates stay on this page and are not delivered to the teacher.",
                              "Demo-Hinweis. Rückmeldungen bleiben auf dieser Seite und werden nicht an die Lehrkraft gesendet."
                            )}
                          </p>
                        </form>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
