/**
 * Student Portal Data satisfying S1 to S9:
 * S1. Grades & report cards (Teacher confirmed, Download/Print)
 * S2. Assignment tracker (Pending/Unsubmitted, status)
 * S3. Assignment upload (Answer extraction scanner)
 * S4. Online solving workspace (Timer per question, student tools)
 * S5. Personalized feedback (Balanced friendly positive & constructive)
 * S6. Student-friendly progress view (Grades 1-5, encouraging topics, light progress)
 * S7. Notifications (Feedback, assignments, quizzes, announcements)
 * S8. Hard-question marking (Mark difficult questions for teacher review)
 * S9. Teacher messaging (Quiz review, attached question/feedback clarification)
 */

export const studentNotifications = [
  {
    id: 1,
    type: "feedback",
    text: "New Feedback: Mrs. Radwa reviewed and confirmed your Quiz 1 score (19/20).",
    time: "15m ago",
    link: "/student/teachers",
  },
  {
    id: 2,
    type: "assignment",
    text: "New Assignment: HW 2 (Thermodynamics Lab) uploaded for answer extraction scanner.",
    time: "1h ago",
    link: "/student",
  },
  {
    id: 3,
    type: "quiz",
    text: "Upcoming Quiz: Mathematics Quiz 2: Fractions & LCM is ready in your online workspace.",
    time: "3h ago",
    link: "/student/workspace/assess-1",
  },
  {
    id: 4,
    type: "announcement",
    text: "Announcement: School closed Wednesday & Thursday next week for National Holiday.",
    time: "Yesterday",
    link: "/student/announcements",
  },
];

export const onlineWorkspaceAssessments = {
  "assess-1": {
    id: "assess-1",
    title: "Mathematics Quiz 2: Fractions & LCM",
    type: "Quiz",
    subject: "Math",
    teacher: "Mrs. Radwa",
    durationMinutes: 30,
    instructions:
      "Answer all questions using the scratchpad and fraction tool if needed. Your time spent on each question will be recorded for your teacher's review. You can mark difficult questions to review with Mrs. Radwa later.",
    questions: [
      {
        id: "q1",
        number: 1,
        topic: "Least Common Multiple",
        prompt: "What is the Least Common Multiple (LCM) of 4 and 6?",
        options: ["12", "24", "10", "8"],
        correctOption: "12",
        hint: "Multiples of 4: 4, 8, 12, 16... Multiples of 6: 6, 12, 18...",
      },
      {
        id: "q2",
        number: 2,
        topic: "Adding Fractions",
        prompt: "Solve the equation: (3/4) + (2/5) = ?",
        options: ["23/20 (or 1 3/20)", "5/9", "5/20", "6/20"],
        correctOption: "23/20 (or 1 3/20)",
        hint: "Find the common denominator (20) first: 15/20 + 8/20.",
      },
      {
        id: "q3",
        number: 3,
        topic: "Fraction Simplification",
        prompt: "Simplify the fraction (8/12) to its lowest terms:",
        options: ["2/3", "4/6", "1/2", "3/4"],
        correctOption: "2/3",
        hint: "Divide both numerator and denominator by 4.",
      },
    ],
  },
  "assess-3": {
    id: "assess-3",
    title: "English Midterm Term 1 Examination",
    type: "Exam",
    subject: "English",
    teacher: "Mr. Said",
    durationMinutes: 60,
    instructions:
      "Complete the reading and language examination online. The system tracks your time spent per question for Mr. Said's review. Mark any question you want to discuss during office hours.",
    questions: [
      {
        id: "q1",
        number: 1,
        topic: "Figurative Language",
        prompt: "Which phrase is a metaphor in: 'The classroom was a lively hive during project time'?",
        options: [
          "'The classroom was a lively hive'",
          "'during project time'",
          "'was'",
          "There is no metaphor",
        ],
        correctOption: "'The classroom was a lively hive'",
        hint: "A metaphor compares two things directly without 'like' or 'as'.",
      },
      {
        id: "q2",
        number: 2,
        topic: "Irregular Verbs",
        prompt: "What is the correct past tense form of the verb 'bring'?",
        options: ["Brought", "Brang", "Broughted", "Bringed"],
        correctOption: "Brought",
        hint: "Think of irregular past forms like 'catch' -> 'caught'.",
      },
    ],
  },
};

export const studentData = {
  profile: {
    id: "ST-5049",
    name: "Ahmed Ehab",
    role: "student",
    grade: "Grade 5",
    section: "Class 5A",
    avatar: "AE",
    gpa: "3.86",
    teacher: "Mrs. Radwa",
  },

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

  // S2 Assignment tracker & S3 Upload status matching wireframe
  pendingAssessments: [
    {
      id: "assess-1",
      title: "Mathematics Quiz 2: Fractions & LCM",
      type: "Quiz",
      status: "Online",
      isOnline: true,
      dueDate: "8-11",
      actionLabel: "Start",
      subject: "Math",
      duration: "30 mins",
      isSubmitted: false,
    },
    {
      id: "assess-2",
      title: "Thermodynamics Lab Report 1",
      type: "HW",
      status: "Offline",
      isOnline: false,
      dueDate: "10-11",
      actionLabel: "Upload File",
      subject: "Science",
      duration: "PDF / Word",
      isSubmitted: false,
    },
    {
      id: "assess-3",
      title: "English Midterm Term 1 Examination",
      type: "Exam",
      status: "Online",
      isOnline: true,
      dueDate: "8-11",
      actionLabel: "Start",
      subject: "English",
      duration: "60 mins",
      isSubmitted: false,
    },
  ],

  // S6 Student-friendly progress view (designed for Grades 1-5)
  // Simplified, encouraging, light visual progress, paired with strengths and practice
  progressView: {
    teacherConfirmed: true,
    confirmedBadge: "Teacher Confirmed & Reviewed",
    overallGrade: "A (92%)",
    growthMessage: "You improved in Multiplication & Fractions!",
    recentExams: [
      { name: "Quiz 1", score: 85, date: "Sep 20" },
      { name: "Midterm", score: 88, date: "Oct 5" },
      { name: "Quiz 2", score: 92, date: "Oct 25" },
    ],
    // Something the student does well (encouraging strength)
    strength: {
      title: "Superstar Skill: Finding Common Denominators!",
      description: "You set up LCM calculations clearly and showed great step-by-step logic.",
    },
    // Only 1 or 2 relevant topics to practice paired with suggestion & ask teacher help
    practiceTopics: [
      {
        id: "practice-1",
        title: "Let's work on fractions!",
        tip: "Remember to simplify improper fractions in your final step (like changing 23/20 into 1 3/20).",
        teacher: "Mrs. Radwa",
        suggestedHelpMessage: "Hi Mrs. Radwa, could you please give me a tip on simplifying mixed fractions?",
      },
      {
        id: "practice-2",
        title: "Let's practice division with remainders!",
        tip: "Double check the subtraction step before writing down the final remainder.",
        teacher: "Mrs. Radwa",
        suggestedHelpMessage: "Hi Mrs. Radwa, can we practice division remainders during office hours?",
      },
    ],
  },

  // Analysis section data for Home-S (Wireframe Metrics Graph & Details)
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

  // S1 Official Report Cards & Subject Matrices
  subjects: [
    {
      id: "science",
      name: "Science",
      teacher: "Mr. Ahmed",
      overall: "95%",
      gradeLetter: "A+",
      confirmedByTeacher: true,
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
      confirmedByTeacher: true,
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
      confirmedByTeacher: true,
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

  // Teachers list & S5 Personalized Feedback (Balanced Positive & Constructive points)
  // S8 Hard-question marking support & S9 Attached Question clarification
  teachers: [
    {
      id: "mrs-radwa",
      name: "Mrs. Radwa",
      subject: "Mathematics",
      department: "Math Department",
      avatarBg: "bg-forest",
      office: "Room 204",
      feedbackItems: [
        {
          id: "quiz-1",
          title: "Quiz 1 - Fractions",
          score: "19/20",
          confirmedByTeacher: true,
          confirmedDate: "Oct 24, 2026",
          questions: [
            {
              id: "q1",
              q: "Question 1 (LCM Calculation)",
              status: "correct",
              positive: "What went well: Excellent clear working and correct prime factorization.",
              constructive: "Keep writing out all multiples so you never second-guess your answer.",
            },
            {
              id: "q2",
              q: "Question 2 (Adding Fractions with unlike denominators)",
              status: "needs-practice",
              positive: "What went well: Your common denominator finding was spot on!",
              constructive: "Practice tip: Remember to simplify the numerator addition before finalizing the answer.",
              isHardQuestion: true,
            },
            {
              id: "q3",
              q: "Question 3 (Fraction Reduction)",
              status: "correct",
              positive: "What went well: Spotless division of both terms by greatest common factor.",
              constructive: "Terrific speed and precision!",
            },
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
          text: "Chapters 3 and 4 up to fraction multiplication. You've been making great progress, Ahmed!",
          time: "Monday",
        },
      ],
    },
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
          title: "Quiz 1 - Force & Motion",
          score: "18/20",
          confirmedByTeacher: true,
          confirmedDate: "Oct 22, 2026",
          questions: [
            {
              id: "q1",
              q: "Question 1 (Force Vectors Diagram)",
              status: "correct",
              positive: "What went well: Outstanding vector arrows and proper directional labeling.",
              constructive: "Always remember to state the SI units (Newtons).",
            },
            {
              id: "q2",
              q: "Question 2 (Friction Calculation)",
              status: "needs-practice",
              positive: "What went well: You identified normal force correctly.",
              constructive: "Practice tip: Check your decimal multiplication on the friction coefficient.",
              isHardQuestion: true,
            },
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
          text: "Hello Ahmed! It is due by 4 PM on Sunday so our scanner can process your diagrams.",
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
          title: "Essay 1 - Thematic Analysis",
          score: "18/20",
          confirmedByTeacher: true,
          confirmedDate: "Oct 20, 2026",
          questions: [
            {
              id: "q1",
              q: "Question 1 (Thesis & Topic Sentence)",
              status: "correct",
              positive: "What went well: Compelling thesis statement with thoughtful textual evidence.",
              constructive: "Keep linking your concluding sentence back to the opening motif.",
            },
            {
              id: "q2",
              q: "Question 2 (Punctuation & Flow)",
              status: "needs-practice",
              positive: "What went well: Rich vocabulary selection.",
              constructive: "Practice tip: Watch out for run-on sentences in paragraph 3.",
            },
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
  ],
};
