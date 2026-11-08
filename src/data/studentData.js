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
    text: "New homework: Plant life cycles worksheet is ready. Upload your completed work.",
    time: "1h ago",
    link: "/student",
  },
  {
    id: 3,
    type: "quiz",
    text: "Your Fractions and multiples quiz is ready to start.",
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
    title: "Fractions and multiples",
    type: "Quiz",
    subject: "Math",
    teacher: "Mrs. Radwa",
    durationMinutes: 30,
    instructions:
      "Answer each question. Use the scratchpad to work things out. Mark any question you would like help with.",
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
        prompt: "What is 3/4 + 2/5?",
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
    title: "Reading and grammar",
    type: "Exam",
    subject: "English",
    teacher: "Mr. Said",
    durationMinutes: 30,
    instructions:
      "Read each question carefully and choose an answer. You can go back to check your answers before you finish.",
    questions: [
      {
        id: "q1",
        number: 1,
        topic: "Reading comprehension",
        prompt: "Read: 'Maya planted a seed. She watered it each day. Soon, a green shoot appeared.' What happened after Maya watered the seed?",
        options: [
          "A green shoot appeared.",
          "The seed turned into a stone.",
          "Maya stopped watering it.",
          "The plant grew apples right away.",
        ],
        correctOption: "A green shoot appeared.",
        hint: "Look at the last sentence. It tells you what grew.",
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
      title: "Schoolwork",
      subtitle: "3 Pending tasks • Next due in 2 days",
      iconType: "homeworks",
      targetView: "home",
      actionText: "View Assessments",
    },
    {
      id: "grades",
      title: "Grades",
      subtitle: "Term 1 Report Card & Subject Grade Breakdown",
      iconType: "grades",
      targetView: "grades",
      actionText: "Inspect Report Card",
    },
    {
      id: "teachers",
      title: "Teachers",
      subtitle: "Connect with subject teachers & view personal feedback",
      iconType: "teachers",
      targetView: "teachers",
      actionText: "Open My Teachers",
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
      title: "Fractions and multiples",
      type: "Quiz",
      isOnline: true,
      dueDate: "2026-11-08",
      actionLabel: "Start quiz",
      subject: "Math",
      duration: "30 minutes",
      isSubmitted: false,
    },
    {
      id: "assess-2",
      title: "Plant life cycles worksheet",
      type: "Homework",
      isOnline: false,
      dueDate: "2026-11-10",
      actionLabel: "Upload homework",
      subject: "Science",
      duration: "PDF, Word or image",
      isSubmitted: false,
    },
    {
      id: "assess-3",
      title: "Reading and grammar",
      type: "Exam",
      isOnline: true,
      dueDate: "2026-11-08",
      actionLabel: "Start exam",
      subject: "English",
      duration: "30 minutes",
      isSubmitted: false,
    },
  ],

  // S6 Student-friendly progress view (designed for Grades 1-5)
  // Subject-specific demo feedback; the dashboard derives its average from the chart scores.
  progressView: {
    keyTakeaways: [
      {
        subject: "Math",
        comment: "You are doing well at comparing fractions. Keep showing your working clearly.",
      },
      {
        subject: "Science",
        comment: "You can name the main parts of a plant. Keep up the good work.",
      },
    ],
    practiceTopics: [
      {
        id: "practice-1",
        subject: "English",
        title: "Finding the main idea",
        tip: "You found details in the passage. Practise identifying its main idea by summing up one paragraph in a sentence.",
        teacherId: "mr-said",
        suggestedHelpMessage: "Hi Mr. Said, could you help me find the main idea of a paragraph?",
      },
      {
        id: "practice-2",
        subject: "History",
        title: "Putting events in order",
        tip: "You recognised the events. Practise ordering them by placing three events on a timeline.",
        teacherId: "ms-mona",
        suggestedHelpMessage: "Hi Ms. Mona, could you help me put events in order on a timeline?",
      },
    ],
  },

  // The same five scores feed the radar, bars, and equal-weight dashboard average.
  analysis: {
    radarMetrics: [
      { label: "Math", value: 92 },
      { label: "Science", value: 95 },
      { label: "English", value: 88 },
      { label: "History", value: 85 },
      { label: "Geography", value: 91 },
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
          assignment: "HW 1: Plant Parts (95%)",
          quiz: "Quiz 1 (18/20)",
          classWork: "Lab Safety (10/10)",
        },
        {
          rowNumber: 2,
          assignment: "HW 2: Plant Life Cycles (88%)",
          quiz: "Quiz 2 (19/20)",
          classWork: "Group Experiment (9/10)",
        },
        {
          rowNumber: 3,
          assignment: "HW 3: Light and Shadows (92%)",
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
          assignment: "HW 2: Multiplication (94%)",
          quiz: "Quiz 2 (18/20)",
          classWork: "Problem Set 4 (9.5/10)",
        },
        {
          rowNumber: 3,
          assignment: "HW 3: Division with Remainders (91%)",
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
          assignment: "HW 1: My Favourite Place (85%)",
          quiz: "Vocab Quiz 1 (16/20)",
          classWork: "Reading Circle (9/10)",
        },
        {
          rowNumber: 2,
          assignment: "HW 2: Reading a Poem (87%)",
          quiz: "Grammar Quiz 2 (17/20)",
          classWork: "Sharing Our Ideas (8.5/10)",
        },
        {
          rowNumber: 3,
          assignment: "HW 3: Writing a Short Story (89%)",
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
              q: "Question 1 (Pushes and Pulls)",
              status: "correct",
              positive: "What went well: Your arrows show which way the toy car moves.",
              constructive: "Label each arrow as a push or a pull.",
            },
            {
              id: "q2",
              q: "Question 2 (Rough and Smooth Surfaces)",
              status: "needs-practice",
              positive: "What went well: You noticed that the toy car slows down on a rough surface.",
              constructive: "Practice tip: Try the car on a smooth surface and compare how far it travels.",
              isHardQuestion: true,
            },
          ],
        },
      ],
      initialMessages: [
        {
          id: 1,
          sender: "student",
          text: "Mr. Ahmed, what should I include in my plant life cycles worksheet?",
          time: "10:14 AM",
        },
        {
          id: 2,
          sender: "teacher",
          text: "Hello Ahmed! Draw and label the seed, seedling and adult plant. The worksheet is due on 10 November.",
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
      subject: "English",
      department: "Humanities Department",
      avatarBg: "bg-sage",
      office: "Room 102",
      feedbackItems: [
        {
          id: "reading-main-idea",
          title: "Reading quiz - Finding the main idea",
          score: "88%",
          confirmedByTeacher: true,
          confirmedDate: "Oct 25, 2026",
          questions: [
            {
              id: "main-idea",
              q: "Finding the main idea",
              status: "needs-practice",
              positive: "What went well: You found details in the passage.",
              constructive: "Practice tip: Sum up one paragraph in a sentence to identify its main idea.",
            },
          ],
        },
        {
          id: "essay-1",
          title: "My Favourite Place - A Short Paragraph",
          score: "18/20",
          confirmedByTeacher: true,
          confirmedDate: "Oct 20, 2026",
          questions: [
            {
              id: "q1",
              q: "Question 1 (Opening Sentence)",
              status: "correct",
              positive: "What went well: Your first sentence tells us about your favourite place.",
              constructive: "Add one detail about what you can see or hear there.",
            },
            {
              id: "q2",
              q: "Question 2 (Punctuation & Flow)",
              status: "needs-practice",
              positive: "What went well: Rich vocabulary selection.",
              constructive: "Practice tip: Use a capital letter at the start and a full stop at the end of each sentence.",
            },
          ],
        },
      ],
      initialMessages: [
        {
          id: 1,
          sender: "teacher",
          text: "Ahmed, your paragraph helped me picture your favourite place. Keep using clear describing words!",
          time: "Yesterday",
        },
      ],
    },
    {
      id: "ms-mona",
      name: "Ms. Mona",
      subject: "History",
      department: "Humanities Department",
      avatarBg: "bg-sand",
      office: "Room 103",
      feedbackItems: [
        {
          id: "history-event-order",
          title: "History quiz - Putting events in order",
          score: "85%",
          confirmedByTeacher: true,
          confirmedDate: "Oct 27, 2026",
          questions: [
            {
              id: "event-order",
              q: "Putting events in order",
              status: "needs-practice",
              positive: "What went well: You recognised the events.",
              constructive: "Practice tip: Place three events on a timeline, from earliest to latest.",
            },
          ],
        },
      ],
      initialMessages: [],
    },
  ],
};
