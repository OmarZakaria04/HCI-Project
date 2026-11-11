// Lightweight localStorage state helpers for Student portal S1–S9 prototype flows.
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
    // Ignore storage quota or privacy restrictions in demo mode
  }
};

const KEYS = {
  HOMEWORK_UPLOADS: "zinger_student_homework_uploads",
  WORKSPACE_SUBMISSIONS: "zinger_student_workspace_submissions",
  TEACHER_MESSAGES: "zinger_student_teacher_messages",
  READ_NOTIFICATIONS: "zinger_student_read_notifications",
};

const emitStudentUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("zinger:student-store-updated"));
  }
};

export function getHomeworkUploads() {
  return safeRead(KEYS.HOMEWORK_UPLOADS, {});
}

export function saveHomeworkUpload(assessmentId, payload) {
  const current = getHomeworkUploads();
  const next = {
    ...current,
    [String(assessmentId)]: {
      ...(current[String(assessmentId)] || {}),
      ...payload,
    },
  };
  safeWrite(KEYS.HOMEWORK_UPLOADS, next);
  emitStudentUpdate();
  return next;
}

export function getWorkspaceSubmissions() {
  return safeRead(KEYS.WORKSPACE_SUBMISSIONS, {});
}

export function saveWorkspaceSubmission(assessmentId, payload) {
  const current = getWorkspaceSubmissions();
  const next = {
    ...current,
    [String(assessmentId)]: payload,
  };
  safeWrite(KEYS.WORKSPACE_SUBMISSIONS, next);
  emitStudentUpdate();
  return next;
}

export function clearWorkspaceSubmission(assessmentId) {
  const current = getWorkspaceSubmissions();
  const next = { ...current };
  delete next[String(assessmentId)];
  safeWrite(KEYS.WORKSPACE_SUBMISSIONS, next);
  emitStudentUpdate();
  return next;
}

export function getStudentMessagesMap() {
  return safeRead(KEYS.TEACHER_MESSAGES, {});
}

export function saveStudentTeacherMessage(teacherId, message) {
  const current = getStudentMessagesMap();
  const key = String(teacherId);
  const existing = Array.isArray(current[key]) ? current[key] : [];
  const next = {
    ...current,
    [key]: [...existing, message],
  };
  safeWrite(KEYS.TEACHER_MESSAGES, next);
  emitStudentUpdate();
  return next[key];
}

export function getReadNotificationIds() {
  return safeRead(KEYS.READ_NOTIFICATIONS, []);
}

export function markNotificationIdsRead(ids) {
  const current = new Set(getReadNotificationIds().map(String));
  ids.forEach((id) => current.add(String(id)));
  const next = Array.from(current);
  safeWrite(KEYS.READ_NOTIFICATIONS, next);
  emitStudentUpdate();
  return next;
}

export function createStudentId(prefix = "st") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function nowIsoTimestamp() {
  return new Date().toISOString();
}

