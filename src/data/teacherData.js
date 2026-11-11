export const classes = [
  { id: "5A", name: "Grade 5A", grade: 5, students: 28, average: 72 },
  { id: "4A", name: "Grade 4A", grade: 4, students: 25, average: 81 },
  { id: "3B", name: "Grade 3B", grade: 3, students: 30, average: 66 },
];

export const notifications = [
  { id: 1, text: "Omar Zakaria submitted HW1 (5A)", time: "10 min ago" },
  { id: 2, text: "AI grading finished for Quiz 1 (4A)", time: "1 hour ago" },
  { id: 3, text: "Red flag: Ahmed Ehab keeps missing fraction problems", time: "Yesterday" },
];

export const classAnalysis = {
  "5A": {
    highest: 95,
    lowest: 41,
    strengths: ["Multiplication", "Word problems"],
    weaknesses: ["Fractions", "Decimals"],
    distribution: [
      { range: "0-49", count: 3 },
      { range: "50-69", count: 8 },
      { range: "70-89", count: 12 },
      { range: "90-100", count: 5 },
    ],
    topics: [
  { label: "Multiplication", value: 85 },
  { label: "Word Probs", value: 78 },
  { label: "Fractions", value: 52 },
  { label: "Decimals", value: 58 },
  { label: "Geometry", value: 70 },
]
  },
  "4A": {
    highest: 98,
    lowest: 55,
    strengths: ["Fractions"],
    weaknesses: ["Word problems"],
    distribution: [
      { range: "0-49", count: 0 },
      { range: "50-69", count: 5 },
      { range: "70-89", count: 14 },
      { range: "90-100", count: 6 },
    ],
    topics: [
  { label: "Multiplication", value: 88 },
  { label: "Word Probs", value: 60 },
  { label: "Fractions", value: 90 },
  { label: "Decimals", value: 75 },
  { label: "Geometry", value: 80 },
]
  },
  "3B": {
    highest: 90,
    lowest: 30,
    strengths: ["Addition"],
    weaknesses: ["Multiplication"],
    distribution: [
      { range: "0-49", count: 6 },
      { range: "50-69", count: 11 },
      { range: "70-89", count: 10 },
      { range: "90-100", count: 3 },
    ], topics: [
  { label: "Multiplication", value: 50 },
  { label: "Word Probs", value: 62 },
  { label: "Fractions", value: 68 },
  { label: "Decimals", value: 64 },
  { label: "Geometry", value: 72 },
]
  },
};

export const papers = [
  { id: 1, student: "Mohamed Ehab", grade: 5, classId: "5A", paper: "HW1", submissionType: "scan", submitted: "15-10-2026 5:00 PM", status: "Pending" },
  { id: 2, student: "Omar Zakaria", grade: 5, classId: "5A", paper: "HW1", submissionType: "scan", submitted: "15-10-2026 6:00 PM", status: "Pending" },
  { id: 3, student: "Mahmoud Ehab", grade: 5, classId: "5A", paper: "HW1", submissionType: "scan", submitted: "15-10-2026 7:00 PM", status: "Pending" },
  { id: 4, student: "Ahmed Ehab", grade: 5, classId: "5A", paper: "Quiz 1", submissionType: "online", submitted: "14-10-2026 9:00 AM", status: "Graded" },
  { id: 5, student: "Sara Hany", grade: 4, classId: "4A", paper: "Quiz 1", submissionType: "online", submitted: "13-10-2026 10:30 AM", status: "Graded" },
  { id: 6, student: "Youssef Adel", grade: 3, classId: "3B", paper: "HW2", submissionType: "scan", submitted: "12-10-2026 2:00 PM", status: "Pending" },
];
export const paperDetails = {
  1: {
    submissionType: "scan",
    answers: [
      { q: 1, question: "12 × 4 = ?", text: "48", key: "48", confidence: 0.97, erasingNoise: 6,
        gap: "Multiplication facts", mistake: "Skips the carry step when multiplying", tip: "Review the 4 times table." },
      { q: 2, question: "Which is bigger: 1/2 or 1/3?", text: "1/3", key: "1/2", confidence: 0.93, erasingNoise: 38,
        gap: "Comparing fractions", mistake: "Treats a larger denominator as a larger fraction", tip: "Practice comparing fractions with different denominators." },
      { q: 3, question: "3/4 + 1/4 = ?", text: "4/8", key: "1", confidence: 0.9, erasingNoise: 12,
        gap: "Adding fractions", mistake: "Adds numerators and denominators separately", tip: "Revisit adding fractions with the same denominator." },
    ],
  },
  2: {
    submissionType: "scan",
    answers: [
      { q: 1, question: "12 × 4 = ?", text: "46", scanText: "48", key: "48", confidence: 0.58, erasingNoise: 42,
        gap: "Multiplication facts", mistake: "Skips the carry step when multiplying", tip: "Review the 4 times table." },
      { q: 2, question: "Which is bigger: 1/2 or 1/3?", text: "1/2", key: "1/2", confidence: 0.95, erasingNoise: 34,
        gap: "Comparing fractions", mistake: "Treats a larger denominator as a larger fraction", tip: "Practice comparing fractions with different denominators." },
      { q: 3, question: "3/4 + 1/4 = ?", text: "1", key: "1", confidence: 0.96, erasingNoise: 9,
        gap: "Adding fractions", mistake: "Adds numerators and denominators separately", tip: "Revisit adding fractions with the same denominator." },
    ],
  },
  4: {
    submissionType: "online",
    answers: [
      { q: 1, question: "1/4 + 2/4 = ?", text: "3/8", key: "3/4", confidence: 1, timeSpentSec: 195, expectedTimeSec: 60,
        gap: "Adding fractions", mistake: "Adds numerators and denominators separately", tip: "Revisit adding fractions with the same denominator." },
      { q: 2, question: "5 × 6 = ?", text: "30", key: "30", confidence: 1, timeSpentSec: 38, expectedTimeSec: 60,
        gap: "Multiplication facts", mistake: "", tip: "" },
      { q: 3, question: "Which is bigger: 2/3 or 3/5?", text: "2/3", key: "2/3", confidence: 1, timeSpentSec: 168, expectedTimeSec: 60,
        gap: "Comparing fractions", mistake: "", tip: "" },
    ],
  },
};
export const scheduleDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export const schedulePeriods = [
  { id: "p1", name: "First", time: "08:00 - 08:45 AM" },
  { id: "p2", name: "Second", time: "09:00 - 09:45 AM" },
  { id: "break", name: "Break", time: "09:45 - 10:15 AM", isBreak: true },
  { id: "p3", name: "Third", time: "10:15 - 11:00 AM" },
  { id: "p4", name: "Fourth", time: "11:15 - 12:00 PM" },
];

export const scheduleTimetable = {
  Saturday: {
    p1: { classId: "5A", subject: "Math • Fractions & Decimals", room: "Room 204", grade: 5 },
    p2: { classId: "Free", subject: "Office Hours", room: "Staff Room" },
    break: { label: "Morning Break" },
    p3: { classId: "4A", subject: "Math • Multiplication Drill", room: "Room 102", grade: 4 },
    p4: { classId: "Free", subject: "Lesson Prep", room: "Staff Room" },
  },
  Sunday: {
    p1: { classId: "Free", subject: "Planning", room: "Staff Room" },
    p2: { classId: "5A", subject: "Math • Decimals & Percentages", room: "Room 204", grade: 5 },
    break: { label: "Morning Break" },
    p3: { classId: "Free", subject: "Office Hours", room: "Staff Room" },
    p4: { classId: "3B", subject: "Math • Basic Geometry", room: "Math Lab", grade: 3 },
  },
  Monday: {
    p1: { classId: "4A", subject: "Math • Multiplication Quiz", room: "Room 102", grade: 4 },
    p2: { classId: "Free", subject: "Grading Period", room: "Staff Room" },
    break: { label: "Morning Break" },
    p3: { classId: "Free", subject: "Office Hours", room: "Staff Room" },
    p4: { classId: "5A", subject: "Math • Quiz Review", room: "Room 204", grade: 5 },
  },
  Tuesday: {
    p1: { classId: "Free", subject: "Dept Meeting", room: "Conference B" },
    p2: { classId: "3B", subject: "Math • Word Problems", room: "Math Lab", grade: 3 },
    break: { label: "Morning Break" },
    p3: { classId: "5A", subject: "Math • Fractions Lab", room: "Room 204", grade: 5 },
    p4: { classId: "Free", subject: "Office Hours", room: "Staff Room" },
  },
  Wednesday: {
    p1: { classId: "4A", subject: "Math • Decimals Intro", room: "Room 102", grade: 4 },
    p2: { classId: "Free", subject: "Office Hours", room: "Staff Room" },
    break: { label: "Morning Break" },
    p3: { classId: "Free", subject: "AI Assessment Review", room: "Staff Room" },
    p4: { classId: "3B", subject: "Math • Multiplication Tables", room: "Math Lab", grade: 3 },
  },
  Thursday: {
    p1: { classId: "Free", subject: "Planning", room: "Staff Room" },
    p2: { classId: "4A", subject: "Math • Weekly Review", room: "Room 102", grade: 4 },
    break: { label: "Morning Break" },
    p3: { classId: "5A", subject: "Math • Midterm Preparation", room: "Room 204", grade: 5 },
    p4: { classId: "Free", subject: "Weekend Wrap-up", room: "Staff Room" },
  },
};

export const teacherScheduleEvents = [
  {
    id: 1,
    title: "Assignment 1: Fractions Practice",
    classId: "5A",
    grade: 5,
    type: "Assignment",
    date: "2026-10-12",
    time: "11:59 PM",
    status: "Upcoming",
    description: "Exercises 1 to 15 on Chapter 3: Dividing and multiplying fractions.",
  },
  {
    id: 2,
    title: "Quiz 1: Multiplication Tables",
    classId: "4A",
    grade: 4,
    type: "Quiz",
    date: "2026-10-17",
    time: "09:00 AM",
    status: "Upcoming",
    description: "Quick 20-minute timed quiz covering 6x through 12x multiplication tables.",
  },
  {
    id: 3,
    title: "Unit 2 Review Exam",
    classId: "5A",
    grade: 5,
    type: "Exam",
    date: "2026-10-22",
    time: "10:15 AM",
    status: "Upcoming",
    description: "Midterm test covering Decimals, Fractions, and Basic Geometry.",
  },
  {
    id: 4,
    title: "HW2: Geometry & Perimeters",
    classId: "3B",
    grade: 3,
    type: "Assignment",
    date: "2026-10-14",
    time: "05:00 PM",
    status: "Completed",
    description: "Draw 5 polygons and calculate perimeter given side lengths.",
  },
  {
    id: 5,
    title: "Interactive Geometry Lab",
    classId: "4A",
    grade: 4,
    type: "Lesson",
    date: "2026-10-19",
    time: "09:15 AM",
    status: "Upcoming",
    description: "Hands-on manipulative fractions session in Math Lab Room 102.",
  },
];
export const students = [
  { id: 1, name: "Mohamed Ehab", classId: "5A", attendance: 96, grade: 84 },
  { id: 2, name: "Omar Zakaria", classId: "5A", attendance: 45, grade: 38 },
  { id: 3, name: "Mahmoud Ehab", classId: "5A", attendance: 88, grade: 71 },
  { id: 4, name: "Ahmed Ehab", classId: "5A", attendance: 80, grade: 52 },
  { id: 5, name: "Salma Nabil", classId: "5A", attendance: 93, grade: 91 },
  { id: 6, name: "Sara Hany", classId: "4A", attendance: 97, grade: 89 },
  { id: 7, name: "Karim Fathy", classId: "4A", attendance: 90, grade: 78 },
  { id: 8, name: "Youssef Adel", classId: "3B", attendance: 85, grade: 64 },
  { id: 9, name: "Laila Samir", classId: "3B", attendance: 70, grade: 58 },
];

export const studentDetails = {
  2: {
    gaps: ["Comparing fractions", "Multiplication facts"],
    redFlags: [
      { id: 1, text: "Attendance below 50% this term" },
      { id: 2, text: "Repeated mistakes in fractions across 3 assignments" },
    ],
    repeated: ["Treats 1/3 as larger than 1/2", "Skips the carry step when multiplying"],
    topics: [
      { label: "Multiplication", value: 45 },
      { label: "Word Probs", value: 50 },
      { label: "Fractions", value: 30 },
      { label: "Decimals", value: 40 },
      { label: "Geometry", value: 55 },
    ],
    assessments: [
      {
        id: "hw1", title: "HW1", submissionType: "scan", score: "2/3",
        feedback: "Review the 4 times table before the next quiz.",
        items: [
          { q: "12 × 4", answer: "46", correct: false, erasingNoise: 42 },
          { q: "Bigger: 1/2 or 1/3?", answer: "1/2", correct: true, erasingNoise: 34 },
          { q: "3/4 + 1/4", answer: "1", correct: true, erasingNoise: 9 },
        ],
      },
      {
        id: "quiz1", title: "Quiz 1", submissionType: "online", score: "1/3",
        feedback: "Practice comparing fractions with different denominators.",
        items: [
          { q: "Bigger: 2/3 or 3/5?", answer: "3/5", correct: false, timeSpentSec: 190, expectedTimeSec: 60 },
          { q: "7 × 8", answer: "56", correct: true, timeSpentSec: 34, expectedTimeSec: 60 },
          { q: "1/2 + 1/4", answer: "2/6", correct: false, timeSpentSec: 165, expectedTimeSec: 60 },
        ],
      },
    ],
    messages: {
      student: [{ from: "teacher", text: "Omar, please review the fractions worksheet before Sunday.", time: "Yesterday" }],
      parent: [],
    },
  },
  4: {
    gaps: ["Adding fractions"],
    redFlags: [{ id: 1, text: "Keeps missing fraction problems" }],
    repeated: ["Adds numerators and denominators separately"],
    topics: [
      { label: "Multiplication", value: 70 },
      { label: "Word Probs", value: 65 },
      { label: "Fractions", value: 40 },
      { label: "Decimals", value: 60 },
      { label: "Geometry", value: 68 },
    ],
    assessments: [
      {
        id: "quiz1", title: "Quiz 1", submissionType: "online", score: "1/5",
        feedback: "Revisit adding fractions with the same denominator.",
        items: [
          { q: "1/4 + 2/4", answer: "3/8", correct: false, timeSpentSec: 195, expectedTimeSec: 60 },
          { q: "5 × 6", answer: "30", correct: true, timeSpentSec: 38, expectedTimeSec: 60 },
        ],
      },
    ],
    messages: { student: [], parent: [] },
  },
};

export const markSchemeLibrary = {
  HW1: {
    name: "HW1_Fractions_Multiples_Rubric.pdf",
    criteria: "Q1 (1 pt): Exact product 48 (award 0.5 for carry attempt). Q2 (1 pt): Identify 1/2 > 1/3 with common numerator/benchmark reasoning. Q3 (1 pt): Add like denominators cleanly (3/4 + 1/4 = 4/4 = 1).",
  },
  "Quiz 1": {
    name: "Quiz1_Fractions_Grading_Key.pdf",
    criteria: "1 pt per question. Full credit requires simplified fraction or exact whole number. Partial credit (0.5 pt) when setup is valid but arithmetic slips.",
  },
};

export const archiveRecords = [
  {
    id: "arch-1",
    term: "Fall 2026 · Term 1",
    classId: "5A",
    grade: 5,
    type: "Quiz",
    title: "Unit 1 Diagnostic: Place Value & Multiples",
    date: "2026-09-18",
    averageScore: "81%",
    status: "Uploaded",
    notes: "Class mastered place value up to 100,000; 4 students needed extra drill on 7x/8x multiples.",
  },
  {
    id: "arch-2",
    term: "Fall 2026 · Term 1",
    classId: "5A",
    grade: 5,
    type: "Assignment",
    title: "HW0: Baseline Number Sense Packet",
    date: "2026-09-24",
    averageScore: "76%",
    status: "Uploaded",
    notes: "Paper worksheet; reviewed common borrowing errors in class.",
  },
  {
    id: "arch-3",
    term: "Spring 2026 · Archive",
    classId: "4A",
    grade: 4,
    type: "Exam",
    title: "Spring Final Exam: Operations & Area",
    date: "2026-05-20",
    averageScore: "84%",
    status: "Uploaded",
    notes: "Verified by department supervisor on May 24, 2026.",
  },
  {
    id: "arch-4",
    term: "Spring 2026 · Archive",
    classId: "3B",
    grade: 3,
    type: "Gradebook",
    title: "Term 2 Final Class Grade Summary (3B)",
    date: "2026-06-02",
    averageScore: "74%",
    status: "Confirmed",
    notes: "All Term 2 coursework, quizzes, and attendance weighted per rubric.",
  },
];

export const teacherCommunication = {
  parentInbox: [
    {
      id: "pin-1",
      parentName: "Ehab Ibrahim (Parent of Ahmed Ehab)",
      studentName: "Ahmed Ehab",
      classId: "5A",
      type: "exam_ticket",
      subject: "Request to view graded Quiz 1 breakdown",
      assessment: "Quiz 1 (Math)",
      message: "Hello Mrs. Radwa, may I view Ahmed's detailed question breakdown and mistake notes for Quiz 1?",
      time: "Today · 09:15 AM",
      status: "Pending Approval",
      reply: "",
    },
    {
      id: "pin-2",
      parentName: "Parent of Omar Zakaria",
      studentName: "Omar Zakaria",
      classId: "5A",
      type: "question",
      subject: "Extra practice sheets for fractions at home",
      assessment: "",
      message: "Could you share which fraction denominator exercises we should practice this weekend before Sunday?",
      time: "Yesterday · 04:40 PM",
      status: "Pending",
      reply: "",
    },
  ],
  meetings: [
    {
      id: "mtg-1",
      parentName: "Ehab Ibrahim (Parent of Ahmed Ehab)",
      studentName: "Ahmed Ehab",
      classId: "5A",
      requestedSlot: "Tuesday, Nov 17 · 02:30 PM",
      topic: "Term 1 Math & Language growth review",
      status: "Pending",
      note: "Parent requested in-school or online check-in.",
    },
    {
      id: "mtg-2",
      parentName: "Parent of Omar Zakaria",
      studentName: "Omar Zakaria",
      classId: "5A",
      requestedSlot: "Thursday, Nov 19 · 01:00 PM",
      topic: "Attendance & fractions support plan",
      status: "Confirmed",
      note: "Confirmed in Staff Conference Room B.",
    },
  ],
  behaviorLogs: [
    {
      id: "beh-1",
      studentId: 2,
      studentName: "Omar Zakaria",
      classId: "5A",
      category: "Focus & Readiness",
      date: "2026-11-08",
      note: "Hesitates to start multi-step math problems independently; responds well when broken into single prompts.",
      homeTip: "Encourage short 10-minute confidence checks on step 1 before solving.",
      sharedWithParent: true,
    },
    {
      id: "beh-2",
      studentId: 4,
      studentName: "Ahmed Ehab",
      classId: "5A",
      category: "Participation",
      date: "2026-11-10",
      note: "Actively helped a desk partner check multiplication steps during lab work.",
      homeTip: "Positive reinforcement at home.",
      sharedWithParent: false,
    },
  ],
  parentAnnouncements: [
    {
      id: "pa-1",
      classId: "5A",
      date: "2026-11-11",
      summary: "Today in 5A Math we practiced comparing unlike denominators (1/2 vs 1/3) using fraction strips.",
      upcomingAssessments: "Quiz 1 fraction review on Monday · Unit 2 Exam scheduled Oct 22.",
    },
  ],
  studentAnnouncements: [
    {
      id: "sa-1",
      classId: "5A",
      title: "Bring fraction strips for Tuesday Math Lab",
      priority: "Important",
      body: "Please bring your notebook and color-coded fraction strips to Room 204 tomorrow.",
      date: "2026-11-11",
    },
    {
      id: "sa-2",
      classId: "All",
      title: "Review Quiz 1 practice tips before Sunday",
      priority: "Standard",
      body: "Check your teacher feedback and try the 3 warm-up fraction questions before next class.",
      date: "2026-11-10",
    },
  ],
};
