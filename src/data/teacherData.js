export const classes = [
{ id: "5A", name: "Grade 5A", students: 28, average: 72 },
{ id: "4A", name: "Grade 4A", students: 25, average: 81 },
{ id: "3B", name: "Grade 3B", students: 30, average: 66 },
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
  { id: 1, student: "Mohamed Ehab", grade: 5, classId: "5A", paper: "HW1", submitted: "15-10-2026 5:00 PM", status: "Pending" },
  { id: 2, student: "Omar Zakaria", grade: 5, classId: "5A", paper: "HW1", submitted: "15-10-2026 6:00 PM", status: "Pending" },
  { id: 3, student: "Mahmoud Ehab", grade: 5, classId: "5A", paper: "HW1", submitted: "15-10-2026 7:00 PM", status: "Pending" },
  { id: 4, student: "Ahmed Ehab", grade: 5, classId: "5A", paper: "Quiz 1", submitted: "14-10-2026 9:00 AM", status: "Graded" },
  { id: 5, student: "Sara Hany", grade: 4, classId: "4A", paper: "Quiz 1", submitted: "13-10-2026 10:30 AM", status: "Graded" },
  { id: 6, student: "Youssef Adel", grade: 3, classId: "3B", paper: "HW2", submitted: "12-10-2026 2:00 PM", status: "Pending" },
];
export const paperDetails = {
  1: {
    answers: [
      { q: 1, question: "12 × 4 = ?", text: "48" },
      { q: 2, question: "Which is bigger: 1/2 or 1/3?", text: "1/3" },
      { q: 3, question: "3/4 + 1/4 = ?", text: "4/8" },
    ],
    ai: {
      score: 1,
      total: 3,
      gaps: ["Comparing fractions", "Adding fractions with the same denominator"],
      redFlags: ["Repeated fraction mistakes across 3 assignments"],
      feedback: "Practice comparing fractions with different denominators.",
    },
  },
  2: {
    answers: [
      { q: 1, question: "12 × 4 = ?", text: "46" },
      { q: 2, question: "Which is bigger: 1/2 or 1/3?", text: "1/2" },
      { q: 3, question: "3/4 + 1/4 = ?", text: "1" },
    ],
    ai: {
      score: 2,
      total: 3,
      gaps: ["Multiplication facts"],
      redFlags: [],
      feedback: "Review the 4 times table.",
    },
  },
};