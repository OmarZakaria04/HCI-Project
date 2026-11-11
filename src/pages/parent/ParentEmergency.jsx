import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { translateValue, useLanguage } from "../../i18n/useLanguage";
import keepDialogFocus from "../../utils/dialogFocus";
import {
  createParentId,
  getParentEmergenciesMap,
  saveParentEmergency,
} from "../../utils/parentStore";
import ParentPageIntro, {
  DialogCloseIcon,
  ParentNotice,
} from "./ParentPageIntro";
import { useActiveChild } from "./useActiveChild";
import "../../styles/parent.css";

export default function ParentEmergency() {
  const { lang, tr } = useLanguage();
  const { activeChildId, child, selectChild } = useActiveChild();
  const [addedAlertsByChild, setAddedAlertsByChild] = useState(() =>
    getParentEmergenciesMap()
  );
  const [reportTitle, setReportTitle] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [priorityKey, setPriorityKey] = useState("high");
  const [formError, setFormError] = useState("");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notice, setNotice] = useState(null);

  const confirmDialogRef = useRef(null);
  const submitTriggerRef = useRef(null);
  const cancelConfirmRef = useRef(null);
  const titleInputRef = useRef(null);

  const childFirstName = child.name.split(" ")[0];
  const alerts = [
    ...(addedAlertsByChild[child.id] || []),
    ...(child.emergencies || []),
  ];

  const priorityOptions = {
    high: tr("High Priority (Health/Safety)", "Hohe Priorität (Gesundheit/Sicherheit)"),
    pickup: tr("Urgent Pickup Notice", "Dringende Abholmitteilung"),
    allergy: tr("Allergy or Medication Notice", "Allergie- oder Medikamentenhinweis"),
  };
  const priorityLabel = priorityOptions[priorityKey] || priorityOptions.high;

  const presets = [
    {
      label: tr("Food allergy notice", "Hinweis zu Lebensmittelallergie"),
      title: tr(
        "Urgent food allergy notice for lunch period",
        "Dringender Allergiehinweis für die Mittagspause"
      ),
      details: tr(
        `${childFirstName} had a mild reaction to peanut oil yesterday evening. Please ensure cafeteria staff and the clinic nurse are alerted.`,
        `${childFirstName} hatte gestern Abend eine leichte Reaktion auf Erdnussöl. Bitte informieren Sie Mensapersonal und Schulkrankenstation.`
      ),
      type: "allergy",
    },
    {
      label: tr("Authorized early pickup", "Frühzeitige Abholung"),
      title: tr(
        "Authorized early family pickup at 1:30 PM",
        "Genehmigte vorzeitige Abholung um 13:30 Uhr"
      ),
      details: tr(
        `Grandmother Mrs. Nadia will pick up ${childFirstName} at the main gate at 1:30 PM for a dental appointment.`,
        `Großmutter Mrs. Nadia holt ${childFirstName} wegen eines Zahnarzttermins um 13:30 Uhr am Haupttor ab.`
      ),
      type: "pickup",
    },
    {
      label: tr("Medication reminder", "Medikamentenerinnerung"),
      title: tr(
        "Prescription inhaler reminder for PE class",
        "Hinweis zum Asthma-Spray für den Sportunterricht"
      ),
      details: tr(
        `${childFirstName} needs to use a preventive inhaler 15 minutes before 5th-period sports activities. Inhaler is packed in the school bag.`,
        `${childFirstName} muss 15 Minuten vor dem Sportunterricht in der 5. Stunde das Inhalationsspray anwenden. Das Spray ist im Schulranzen.`
      ),
      type: "allergy",
    },
  ];

  useEffect(() => {
    if (!showConfirm) return;
    const dialog = confirmDialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    cancelConfirmRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [showConfirm]);

  const applyPreset = (preset) => {
    setReportTitle(preset.title);
    setReportDetails(preset.details);
    setPriorityKey(preset.type);
    setFormError("");
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!reportTitle.trim() || !reportDetails.trim()) {
      setFormError(
        tr(
          "Enter both a subject and incident details before reviewing.",
          "Bitte geben Sie vor der Prüfung sowohl einen Betreff als auch Einzelheiten ein."
        )
      );
      if (!reportTitle.trim()) titleInputRef.current?.focus();
      return;
    }
    setFormError("");
    submitTriggerRef.current = event.currentTarget.querySelector(
      "button[type='submit']"
    );
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    requestAnimationFrame(() =>
      submitTriggerRef.current?.focus({ preventScroll: true })
    );
  };

  const executeSendUrgentAlert = () => {
    const targetChildId = child.id;
    const cleanTitle = reportTitle.trim();
    const cleanDetails = reportDetails.trim();
    setShowConfirm(false);
    setIsTransmitting(true);

    setTimeout(() => {
      const newAlert = {
        id: createParentId("em-parent"),
        severity: "alert",
        title: cleanTitle,
        sender: tr("Mr. Ehab Tawfeek (Parent)", "Mr. Ehab Tawfeek (Elternteil)"),
        date: tr("Just now", "Gerade eben"),
        status: "Recorded in demo log",
        message: cleanDetails,
        actionTaken: tr(
          `${priorityLabel} · Saved on this page for review.`,
          `${priorityLabel} · Zur Ansicht auf dieser Seite gespeichert.`
        ),
        contactNumber: "+20 100 000 9999",
      };

      setAddedAlertsByChild(saveParentEmergency(targetChildId, newAlert));
      setIsTransmitting(false);
      setNotice({
        text: tr(
          "Urgent notice recorded and saved across your parent portal.",
          "Dringende Mitteilung erfasst und im Elternportal gespeichert."
        ),
      });
      setReportTitle("");
      setReportDetails("");
      requestAnimationFrame(() =>
        submitTriggerRef.current?.focus({ preventScroll: true })
      );
    }, 350);
  };

  return (
    <div className="parent-page">
      <Header role="parent" />

      <main className="parent-container">
        <ParentPageIntro
          title={tr("Emergency & health", "Notfall & Gesundheit")}
          subtitle={tr(
            `Clinic incident logs, urgent parent notices, and direct campus phone lines for ${child.name} (${child.grade}).`,
            `Protokolle der Krankenstation, dringende Elternmitteilungen und Direktnummern für ${child.name} (${child.grade}).`
          )}
          activeChildId={activeChildId}
          onSelectChild={selectChild}
        />

        <section
          className="parent-alert-banner"
          aria-labelledby="parent-emergency-scope-title"
        >
          <div className="parent-alert-banner-copy">
            <p className="parent-alert-kicker">
              {tr("Urgent health & safety", "Dringende Gesundheit & Sicherheit")}
            </p>
            <h2 id="parent-emergency-scope-title">
              {tr(
                "Reserved for medical notices, early pickup, and safety alerts",
                "Reserviert für medizinische Hinweise, vorzeitige Abholung und Sicherheitsmeldungen"
              )}
            </h2>
            <p className="parent-meta">
              {tr(
                "Prototype notice: alerts submitted here remain in this browser view and are not sent to clinic or security phones.",
                "Prototyp-Hinweis: Hier eingereichte Meldungen bleiben in dieser Browseransicht und erreichen weder Krankenstation noch Sicherheitsdienst."
              )}
            </p>
          </div>
        </section>

        <ParentNotice notice={notice} onDismiss={() => setNotice(null)} />

        <div className="parent-emergency-layout">
          <div className="parent-emergency-col">
            <section
              className="parent-panel"
              aria-labelledby="parent-emergency-log-title"
            >
              <div className="parent-panel-heading">
                <div className="parent-panel-heading-copy">
                  <h2 id="parent-emergency-log-title">
                    {tr("Health & safety log", "Gesundheits- & Sicherheitsprotokoll")}
                  </h2>
                  <p className="parent-meta">
                    {tr(
                      `Clinic reports and campus notices for ${child.name}`,
                      `Berichte der Krankenstation und Schulmeldungen für ${child.name}`
                    )}
                  </p>
                </div>
                <span className="parent-meta">
                  {alerts.length}{" "}
                  {alerts.length === 1
                    ? tr("record", "Eintrag")
                    : tr("records", "Einträge")}
                </span>
              </div>

              {alerts.length === 0 ? (
                <p className="parent-empty">
                  {tr(
                    `No health or emergency alerts are on record for ${child.name}.`,
                    `Für ${child.name} liegen keine Gesundheits- oder Notfallmeldungen vor.`
                  )}
                </p>
              ) : (
                <ul className="parent-divided-list">
                  {alerts.map((item) => {
                    const isUrgent = item.severity === "alert";
                    return (
                      <li key={item.id}>
                        <div
                          className={`parent-emergency-record ${
                            isUrgent ? "parent-emergency-record-alert" : ""
                          }`}
                        >
                          <div className="parent-ticket-head">
                            <h3>{item.title}</h3>
                            <span
                              className={`parent-status-tag ${
                                isUrgent ? "parent-status-tag-urgent" : ""
                              }`}
                            >
                              {translateValue(item.status, lang)}
                            </span>
                          </div>
                          <p>{item.message}</p>
                          <p className="parent-meta">
                            {tr("Reported by", "Gemeldet von")} {item.sender} · {item.date}
                          </p>
                          <p className="parent-meta">
                            {tr("Action:", "Maßnahme:")} {item.actionTaken}
                            {item.contactNumber ? ` · ${item.contactNumber}` : ""}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section
              className="parent-panel"
              aria-labelledby="parent-emergency-form-title"
            >
              <div className="parent-panel-heading">
                <div className="parent-panel-heading-copy">
                  <h2 id="parent-emergency-form-title">
                    {tr("Send urgent notice", "Dringende Mitteilung senden")}
                  </h2>
                  <p className="parent-meta">
                    {tr(
                      "Use for urgent clinic alerts, authorized early pickups, or medication instructions",
                      "Für dringende Hinweise an Krankenstation, genehmigte Abholungen oder Medikamentenangaben"
                    )}
                  </p>
                </div>
              </div>

              <div className="parent-divider-section">
                <div className="parent-field">
                  <label>{tr("Quick templates", "Schnellvorlagen")}</label>
                  <div className="parent-starter-group">
                    {presets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="parent-button parent-button-quiet"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="parent-composer-form parent-divider-section"
                noValidate
              >
                <div className="parent-field">
                  <label htmlFor="parent-urgency-select">
                    {tr("Urgency classification", "Dringlichkeitsstufe")}
                  </label>
                  <select
                    id="parent-urgency-select"
                    className="parent-select"
                    value={priorityKey}
                    onChange={(event) => setPriorityKey(event.target.value)}
                  >
                    <option value="high">
                      {tr(
                        "High priority (medical or safety concern)",
                        "Hohe Priorität (medizinisch oder sicherheitsrelevant)"
                      )}
                    </option>
                    <option value="pickup">
                      {tr(
                        "Urgent authorized pickup request",
                        "Dringende genehmigte Abholmitteilung"
                      )}
                    </option>
                    <option value="allergy">
                      {tr(
                        "Medication or food allergy warning",
                        "Medikamenten- oder Allergiewarnung"
                      )}
                    </option>
                  </select>
                </div>

                <div className="parent-field">
                  <label htmlFor="parent-emergency-subject">
                    {tr("Subject or summary", "Betreff oder Zusammenfassung")}
                  </label>
                  <input
                    id="parent-emergency-subject"
                    ref={titleInputRef}
                    type="text"
                    className="parent-input"
                    value={reportTitle}
                    onChange={(event) => {
                      setReportTitle(event.target.value);
                      setFormError("");
                    }}
                    placeholder={tr(
                      "e.g. Sudden severe allergy notice for lunch period",
                      "z. B. Plötzlicher Allergiehinweis für die Mittagspause"
                    )}
                  />
                </div>

                <div className="parent-field">
                  <label htmlFor="parent-emergency-details">
                    {tr("Instructions and incident details", "Hinweise und Einzelheiten")}
                  </label>
                  <textarea
                    id="parent-emergency-details"
                    rows={3}
                    className="parent-textarea"
                    value={reportDetails}
                    onChange={(event) => {
                      setReportDetails(event.target.value);
                      setFormError("");
                    }}
                    placeholder={tr(
                      "Provide medication names, pickup contact details, or instructions",
                      "Medikamentennamen, Kontaktdaten zur Abholung oder Anweisungen angeben"
                    )}
                  />
                </div>

                {formError && (
                  <p className="parent-field-error" role="alert">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isTransmitting}
                  className="parent-button parent-button-danger"
                >
                  {isTransmitting
                    ? tr("Saving...", "Speichert...")
                    : tr("Review urgent notice", "Dringende Mitteilung prüfen")}
                </button>
              </form>
            </section>
          </div>

          <aside
            className="parent-panel"
            aria-labelledby="parent-hotlines-title"
          >
            <div className="parent-panel-heading">
              <div className="parent-panel-heading-copy">
                <h2 id="parent-hotlines-title">
                  {tr("Direct campus lines", "Direktdurchwahlen der Schule")}
                </h2>
                <p className="parent-meta">
                  {tr(
                    "Direct phone numbers for urgent school contacts",
                    "Direkte Telefonnummern für dringende Schulkontakte"
                  )}
                </p>
              </div>
            </div>

            <ul className="parent-divided-list">
              <li className="parent-hotline-row">
                <div>
                  <h3>{tr("School clinic & nurse", "Schulkrankenstation")}</h3>
                  <p className="parent-meta">
                    {tr("Nurse Hoda (Room 102)", "Schwester Hoda (Raum 102)")}
                  </p>
                  <p>+20 100 000 1122</p>
                </div>
                <a href="tel:+201000001122" className="parent-button">
                  {tr("Call", "Anrufen")}
                </a>
              </li>

              <li className="parent-hotline-row">
                <div>
                  <h3>{tr("Campus security desk", "Schulsicherheitsdienst")}</h3>
                  <p className="parent-meta">
                    {tr("Main gate & safe transport", "Haupttor & sicherer Transport")}
                  </p>
                  <p>+20 100 000 9999</p>
                </div>
                <a href="tel:+201000009999" className="parent-button">
                  {tr("Call", "Anrufen")}
                </a>
              </li>

              <li className="parent-hotline-row">
                <div>
                  <h3>{tr("Administration office", "Schulsekretariat & Leitung")}</h3>
                  <p className="parent-meta">
                    {tr("Principal emergency line", "Notfallleitung Schulleitung")}
                  </p>
                  <p>+20 100 000 3344</p>
                </div>
                <a href="tel:+201000003344" className="parent-button">
                  {tr("Call", "Anrufen")}
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </main>

      <dialog
        ref={confirmDialogRef}
        className="parent-dialog"
        aria-labelledby="parent-emergency-confirm-title"
        onClose={closeConfirm}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            confirmDialogRef.current?.close();
          }
        }}
        onKeyDown={keepDialogFocus}
      >
        {showConfirm && (
          <div className="parent-dialog-content">
            <header className="parent-dialog-header">
              <div>
                <h2 id="parent-emergency-confirm-title">
                  {tr("Review urgent notice", "Dringende Mitteilung prüfen")}
                </h2>
                <p className="parent-meta">
                  {tr("Regarding", "Betrifft")} {child.name} · {priorityLabel}
                </p>
              </div>
              <button
                type="button"
                className="parent-dialog-close"
                aria-label={tr("Close confirmation", "Bestätigung schließen")}
                onClick={() => confirmDialogRef.current?.close()}
              >
                <DialogCloseIcon />
              </button>
            </header>

            <div className="parent-dialog-body">
              <dl className="parent-dialog-facts">
                <div>
                  <dt>{tr("Subject", "Betreff")}</dt>
                  <dd>{reportTitle.trim()}</dd>
                </div>
                <div>
                  <dt>{tr("Classification", "Einstufung")}</dt>
                  <dd>{priorityLabel}</dd>
                </div>
              </dl>
              <div>
                <h3>{tr("Details", "Einzelheiten")}</h3>
                <p>{reportDetails.trim()}</p>
              </div>
              <p className="parent-meta">
                {tr(
                  "Demo confirmation: adding this notice updates the log on this page only and does not ring school phones.",
                  "Demo-Bestätigung: Das Hinzufügen aktualisiert nur das Protokoll auf dieser Seite und löst keinen Anruf aus."
                )}
              </p>
            </div>

            <footer className="parent-dialog-footer">
              <div className="parent-dialog-footer-actions">
                <button
                  ref={cancelConfirmRef}
                  type="button"
                  className="parent-button"
                  onClick={() => confirmDialogRef.current?.close()}
                >
                  {tr("Back to edit", "Zurück zum Bearbeiten")}
                </button>
                <button
                  type="button"
                  className="parent-button parent-button-danger"
                  onClick={executeSendUrgentAlert}
                >
                  {tr("Confirm & add notice", "Bestätigen & eintragen")}
                </button>
              </div>
            </footer>
          </div>
        )}
      </dialog>
    </div>
  );
}
