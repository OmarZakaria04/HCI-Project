/**
 * Mock data for Student Portal matching the wireframe screens:
 * Home-S, Grades-S, Teacher-S, Teacher-S (Detail), Grades-S (Subject Detail), Teacher-P (Announcements)
 */

export const studentData = {
  profile: {
    id: "ST-5049",
    name: "Ahmed Ehab",
    role: "student",
    grade: "Grade 11",
    section: "Class B",
    avatar: "AE",
    gpa: "3.86",
  },

  // Hero carousel slides for Home-S
  heroSlides: [
    {
      id: "homeworks",
      title: "Home-Works",
      subtitle: "3 Pending tasks • Next due in 2 days",
      iconType: "homeworks",
      targetView: "home",
      actionText: "View Assessments",
    },
    {
      id: "teachers",
      title: "Teachers",
      subtitle: "Connect with subject teachers & view personal feedback",
      iconType: "teachers",
      targetView: "teachers",
      actionText: "Open My Teachers",
    },
    {
      id: "grades",
      title: "Grades",
      subtitle: "Term 1 Report Card & Subject Grade Breakdown",
      iconType: "grades",
      targetView: "grades",
      actionText: "Inspect Report Card",
    },
  ],

  // Announcements for student
  announcements: [
    {
      id: 1,
      title: "Holiday Next Week",
      date: "14-10-2026",
      category: "School Notice",
      content:
        "School will be closed on Wednesday and Thursday next week for the National Holiday. Please make sure all online homework is submitted beforehand.",
      author: "Administration",
      isImportant: true,
    },
    {
      id: 2,
      title: "Science Fair Project Submissions",
      date: "12-10-2026",
      category: "Academic",
      content:
        "The submission portal for the 2026 Annual Science Fair is now open. Coordinate with Mr. Ahmed for laboratory equipment reservations.",
      author: "Science Dept",
      isImportant: false,
    },
    {
      id: 3,
      title: "Mathematics Olympiad Selection",
      date: "09-10-2026",
      category: "Extracurricular",
      content:
        "Selection tests for the regional Math Olympiad will take place next Monday during Period 3 in Room 204.",
      author: "Mrs. Radwa",
      isImportant: false,
    },
  ],

  // Pending Assessments list matching Home-S wireframe
  pendingAssessments: [
    {
      id: "assess-1",
      title: "Mathematics Quiz 2: Fractions & LCM",
      type: "Quiz",
      status: "Online",
      dueDate: "8-11",
      actionLabel: "Start",
      subject: "Math",
      duration: "30 mins",
    },
    {
      id: "assess-2",
      title: "Thermodynamics Lab Report 1",
      type: "HW",
      status: "Offline",
      dueDate: "10-11",
      actionLabel: "Upload File",
      subject: "Science",
      duration: "PDF / Word",
    },
    {
      id: "assess-3",
      title: "English Midterm Term 1 Examination",
      type: "Exam",
      status: "Online",
      dueDate: "8-11",
      actionLabel: "Start",
      subject: "English",
      duration: "60 mins",
    },
  ],

  // Analysis section data for Home-S
  analysis: {
    details: "Mathematics (92%) • Science (95%) • English (88%)",
    excellentWorkOn: "Linear Equations & Biology Lab",
    keyTakeaways:
      "Great consistency across assignments. Maintain current momentum and review English vocabulary before Friday's quiz.",
    radarMetrics: [
      { label: "Math", value: 92 },
      { label: "Science", value: 95 },
      { label: "English", value: 88 },
      { label: "History", value: 85 },
      { label: "Classwork", value: 91 },
    ],
  },

  // Subjects & detailed Grade history matrices for Grades-S & Science view
  subjects: [
    {
      id: "science",
      name: "Science",
      teacher: "Mr. Ahmed",
      overall: "95%",
      gradeLetter: "A+",
      history: [
        {
          rowNumber: 1,
          assignment: "HW 1: Cell Structure (95%)",
          quiz: "Quiz 1 (18/20)",
          classWork: "Lab Safety (10/10)",
        },
        {
          rowNumber: 2,
          assignment: "HW 2: Thermodynamics (88%)",
          quiz: "Quiz 2 (19/20)",
          classWork: "Group Experiment (9/10)",
        },
        {
          rowNumber: 3,
          assignment: "HW 3: Optics & Waves (92%)",
          quiz: "Midterm Prep (46/50)",
          classWork: "Workbook Part B (10/10)",
        },
      ],
    },
    {
      id: "math",
      name: "Math",
      teacher: "Mrs. Radwa",
      overall: "92%",
      gradeLetter: "A",
      history: [
        {
          rowNumber: 1,
          assignment: "HW 1: Fractions (90%)",
          quiz: "Quiz 1 (19/20)",
          classWork: "Board Problem (10/10)",
        },
        {
          rowNumber: 2,
          assignment: "HW 2: Linear Equations (94%)",
          quiz: "Quiz 2 (18/20)",
          classWork: "Problem Set 4 (9.5/10)",
        },
        {
          rowNumber: 3,
          assignment: "HW 3: Polynomials (91%)",
          quiz: "Midterm (45/50)",
          classWork: "Mental Math (10/10)",
        },
      ],
    },
    {
      id: "english",
      name: "English",
      teacher: "Mr. Said",
      overall: "88%",
      gradeLetter: "B+",
      history: [
        {
          rowNumber: 1,
          assignment: "HW 1: Essay Draft (85%)",
          quiz: "Vocab Quiz 1 (16/20)",
          classWork: "Reading Circle (9/10)",
        },
        {
          rowNumber: 2,
          assignment: "HW 2: Poetry Analysis (87%)",
          quiz: "Grammar Quiz 2 (17/20)",
          classWork: "Debate Session (8.5/10)",
        },
        {
          rowNumber: 3,
          assignment: "HW 3: Final Composition (89%)",
          quiz: "Midterm Reading (42/50)",
          classWork: "Journal Entry (9/10)",
        },
      ],
    },
  ],

  // Teachers list for Teacher-S
  teachers: [
    {
      id: "mr-ahmed",
      name: "Mr. Ahmed",
      subject: "Science & Physics",
      department: "Science Department",
      avatarBg: "bg-forest",
      office: "Lab 3B",
      feedbackItems: [
        {
          id: "quiz-1",
          title: "Quiz 1",
          score: "19/20",
          questions: [
            { q: "Q1", note: "Excellent work on diagram labels and force vectors." },
            { q: "Q2", note: "Review formula: Common denominator was needed before adding fractions in equation 2." },
            { q: "Q3", note: "Nice approach on fraction conversion, full marks awarded." },
          ],
        },
        {
          id: "hw-1",
          title: "HW 1",
          score: "10/10",
          questions: [
            { q: "Q1", note: "All homework units and steps clearly outlined." },
            { q: "Q2", note: "Clean handwriting and flawless problem solving." },
          ],
        },
        {
          id: "hw-2",
          title: "HW 2",
          score: "9/10",
          questions: [
            { q: "Q1", note: "Well executed derivation." },
            { q: "Q2", note: "Minor arithmetic slip in final calculation step." },
          ],
        },
      ],
      initialMessages: [
        {
          id: 1,
          sender: "student",
          text: "Mr. Ahmed, is the thermodynamics lab report due before 4 PM or midnight?",
          time: "10:14 AM",
        },
        {
          id: 2,
          sender: "teacher",
          text: "Hello Ahmed! It is due by 4 PM on Sunday. Be sure to include your error analysis section.",
          time: "10:25 AM",
        },
        {
          id: 3,
          sender: "student",
          text: "Understood, thank you Mr. Ahmed!",
          time: "10:30 AM",
        },
      ],
    },
    {
      id: "mr-said",
      name: "Mr. Said",
      subject: "English Literature",
      department: "Humanities Department",
      avatarBg: "bg-sage",
      office: "Room 102",
      feedbackItems: [
        {
          id: "essay-1",
          title: "Essay 1",
          score: "18/20",
          questions: [
            { q: "Q1", note: "Compelling thesis statement with strong textual evidence." },
            { q: "Q2", note: "Watch out for comma splices in paragraph 3." },
          ],
        },
      ],
      initialMessages: [
        {
          id: 1,
          sender: "teacher",
          text: "Ahmed, your vocabulary essay showed great thematic depth. Keep up the high standard!",
          time: "Yesterday",
        },
      ],
    },
    {
      id: "mrs-radwa",
      name: "Mrs. Radwa",
      subject: "Mathematics",
      department: "Math Department",
      avatarBg: "bg-forest",
      office: "Room 204",
      feedbackItems: [
        {
          id: "quiz-2",
          title: "Quiz 2",
          score: "18/20",
          questions: [
            { q: "Q1", note: "Step-by-step factoring was executed very well." },
            { q: "Q2", note: "Review sign changes when transposing terms." },
          ],
        },
      ],
      initialMessages: [
        {
          id: 1,
          sender: "student",
          text: "Mrs. Radwa, could you please confirm the chapters included in next week's test?",
          time: "Monday",
        },
        {
          id: 2,
          sender: "teacher",
          text: "Chapters 3 and 4 up to quadratic factoring.",
          time: "Monday",
        },
      ],
    },
  ],
};

