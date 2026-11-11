// Lightweight localStorage state helpers for Parent portal P1–P8 persistence and Teacher portal sync.
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
  TICKETS: "zinger_parent_exam_tickets",
  MEETINGS: "zinger_parent_meetings",
  CHATS: "zinger_parent_chats",
  BEHAVIOR_NOTES: "zinger_parent_behavior_notes",
  EMERGENCIES: "zinger_parent_emergencies",
};

const emitParentUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("zinger:parent-store-updated"));
  }
};

export function getParentTicketsMap() {
  return safeRead(KEYS.TICKETS, {});
}

export function saveParentTicket(childId, ticketId, record) {
  const current = getParentTicketsMap();
  const next = {
    ...current,
    [childId]: {
      ...(current[childId] || {}),
      [ticketId]: record,
    },
  };
  safeWrite(KEYS.TICKETS, next);
  emitParentUpdate();
  return next;
}

export function getParentMeetingsState() {
  return safeRead(KEYS.MEETINGS, { addedByChild: {}, cancelledByChild: {} });
}

export function addParentMeeting(childId, meeting) {
  const current = getParentMeetingsState();
  const next = {
    ...current,
    addedByChild: {
      ...(current.addedByChild || {}),
      [childId]: [meeting, ...((current.addedByChild || {})[childId] || [])],
    },
  };
  safeWrite(KEYS.MEETINGS, next);
  emitParentUpdate();
  return next;
}

export function setParentMeetingCancelled(childId, meetingId, isCancelled) {
  const current = getParentMeetingsState();
  const prevList = (current.cancelledByChild || {})[childId] || [];
  const nextList = isCancelled
    ? Array.from(new Set([...prevList, meetingId]))
    : prevList.filter((id) => id !== meetingId);
  const next = {
    ...current,
    cancelledByChild: {
      ...(current.cancelledByChild || {}),
      [childId]: nextList,
    },
  };
  safeWrite(KEYS.MEETINGS, next);
  emitParentUpdate();
  return next;
}

export function getParentChatsMap() {
  return safeRead(KEYS.CHATS, {});
}

export function saveParentChatMessage(childId, teacherId, message) {
  const current = getParentChatsMap();
  const childChats = current[childId] || {};
  const next = {
    ...current,
    [childId]: {
      ...childChats,
      [teacherId]: [...(childChats[teacherId] || []), message],
    },
  };
  safeWrite(KEYS.CHATS, next);
  emitParentUpdate();
  return next;
}

export function getParentBehaviorNotesMap() {
  return safeRead(KEYS.BEHAVIOR_NOTES, {});
}

export function saveParentBehaviorNote(childId, concernId, text) {
  const current = getParentBehaviorNotesMap();
  const next = {
    ...current,
    [childId]: {
      ...(current[childId] || {}),
      [concernId]: text,
    },
  };
  safeWrite(KEYS.BEHAVIOR_NOTES, next);
  emitParentUpdate();
  return next;
}

export function getParentEmergenciesMap() {
  return safeRead(KEYS.EMERGENCIES, {});
}

export function saveParentEmergency(childId, alert) {
  const current = getParentEmergenciesMap();
  const next = {
    ...current,
    [childId]: [alert, ...(current[childId] || [])],
  };
  safeWrite(KEYS.EMERGENCIES, next);
  emitParentUpdate();
  return next;
}

export function createParentId(prefix = "p") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

