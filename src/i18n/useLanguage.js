import { createContext, useContext } from "react";

export const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  isDe: false,
  tr: (en) => en,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

const STATUS_DE = {
  // Teacher papers & flags
  Pending: "Ausstehend",
  Graded: "Bewertet",
  "Needs review": "Prüfung erforderlich",
  Confirmed: "Bestätigt",
  Dismissed: "Verworfen",
  None: "Keine",
  // Schedule
  Upcoming: "Anstehend",
  Completed: "Abgeschlossen",
  // Activity & assessment types
  Assignment: "Aufgabe",
  Quiz: "Quiz",
  Exam: "Prüfung",
  Lesson: "Unterrichtsstunde",
  Homework: "Hausaufgabe",
  Gradebook: "Notenbuch",
  Online: "Online",
  Paper: "Papier",
  Uploaded: "Hochgeladen",
  Rescheduled: "Neu terminiert",
  Declined: "Abgelehnt",
  Answered: "Beantwortet",
  Important: "Wichtig",
  Standard: "Standard",
  // Parent portal statuses
  "Verified & Approved": "Geprüft & bestätigt",
  "Confirmed by Faculty": "Vom Kollegium bestätigt",
  Approved: "Genehmigt",
  "Pending Approval": "Genehmigung ausstehend",
  "Not Requested": "Nicht angefordert",
  "Resolved & Monitored": "Behoben & beobachtet",
  Notice: "Hinweis",
  "Recorded in demo log": "Im Demo-Protokoll erfasst",
  "Under Observation": "Unter Beobachtung",
  "Shared by teacher": "Von Lehrkraft geteilt",
  Resolved: "Gelöst",
};

const DAY_DE = {
  Saturday: "Samstag",
  Sunday: "Sonntag",
  Monday: "Montag",
  Tuesday: "Dienstag",
  Wednesday: "Mittwoch",
  Thursday: "Donnerstag",
  Friday: "Freitag",
};

export function translateValue(value, lang) {
  if (lang !== "de" || !value) return value;
  return STATUS_DE[value] || DAY_DE[value] || value;
}

