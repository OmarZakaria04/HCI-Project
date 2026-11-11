// Lightweight localStorage state helpers for Teacher portal prototype mutations.
const safeRead = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota / privacy errors in demo mode
  }
};

const KEYS = {
  MARK_SCHEMES: "zinger_teacher_mark_schemes",
  PAPER_UPLOADS: "zinger_teacher_paper_uploads",
  ARCHIVE_EDITS: "zinger_teacher_archive_edits",
  ARCHIVE_ADDED: "zinger_teacher_archive_added",
  COMM_STATE: "zinger_teacher_comm_state",
};

export function getSavedMarkSchemes() {
  return safeRead(KEYS.MARK_SCHEMES, {});
}

export function saveMarkScheme(paperKey, scheme) {
  const current = getSavedMarkSchemes();
  const next = { ...current, [paperKey]: scheme };
  safeWrite(KEYS.MARK_SCHEMES, next);
  return next;
}

export function getUploadedPapersMap() {
  return safeRead(KEYS.PAPER_UPLOADS, {});
}

export function saveUploadedPaper(paperId, record) {
  const current = getUploadedPapersMap();
  const next = { ...current, [String(paperId)]: record };
  safeWrite(KEYS.PAPER_UPLOADS, next);
  return next;
}

export function getArchiveEdits() {
  return safeRead(KEYS.ARCHIVE_EDITS, {});
}

export function saveArchiveEdit(id, patch) {
  const current = getArchiveEdits();
  const next = { ...current, [String(id)]: { ...(current[String(id)] || {}), ...patch } };
  safeWrite(KEYS.ARCHIVE_EDITS, next);
  return next;
}

export function getArchiveAdded() {
  return safeRead(KEYS.ARCHIVE_ADDED, []);
}

export function saveArchiveAdded(list) {
  safeWrite(KEYS.ARCHIVE_ADDED, list);
  return list;
}

export function getTeacherCommState() {
  return safeRead(KEYS.COMM_STATE, {});
}

export function saveTeacherCommState(state) {
  safeWrite(KEYS.COMM_STATE, state);
  return state;
}

export function createRecordId(prefix) {
  return `${prefix}-${Date.now()}`;
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
