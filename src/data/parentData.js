export const parentData = {
  children: [
    {
      id: "ahmed",
      name: "Ahmed Ehab",
      grade: "Grade 11 - Section B",
      avatar: "AE",

      // P1. Child Progress Metrics (Teacher reviewed, strictly individual, no class ranking)
      metrics: {
        overallScore: "92.8%",
        status: "Excellent Academic Standing",
        attendance: "98.5%",
        teacherReview: {
          status: "Verified & Approved",
          reviewedBy: "Mr. Hosam (Math) & Mrs. Radwa (Languages)",
          date: "November 3, 2026",
          note: "Individual evaluation completed based on Term 1 formative coursework and lab assessments.",
        },
        strengths: [
          "Calculus Derivatives & Rate-of-Change Problem Solving",
          "Scientific Experimentation & Chemistry Laboratory Precision",
          "Analytical Reading & Complex Vocabulary Retention",
          "Consistent On-Time Assignment Submission (100%)",
        ],
        topicsToWorkOn: [
          "Multi-step Word Problems with Geometric Constraints",
          "Persuasive Essay Thesis Framing & Argument Transitions",
          "Pacing Strategy During 45-Minute Timed Quizzes",
        ],
        radarValues: [
          { label: "Math", value: 94 },
          { label: "Science", value: 96 },
          { label: "Languages", value: 88 },
          { label: "History", value: 90 },
          { label: "Art", value: 85 },
        ],
        details: [
          "Independent study habits have shown consistent growth this term.",
          "Demonstrates strong conceptual mastery in STEM fields.",
          "Actively engaged in problem-solving and teacher consultations.",
        ],
        keyTakeaways:
          "Ahmed excels at analytical problem-solving. Supporting his writing thesis structures will help achieve balanced excellence.",
      },

      // P2. Grades and Report Cards (Confirmed by teacher, downloadable/printable)
      reportCard: {
        term: "Term 1 (Academic Year 2026-2027)",
        status: "Confirmed by Faculty",
        confirmationDate: "Nov 1, 2026",
        confirmedBy: "Faculty Committee & Department Heads",
        cumulativeGpa: "3.85 / 4.0",
        attendancePercentage: "98.5%",
        conduct: "Excellent",
        subjects: [
          { name: "Mathematics (Calculus)", grade: "94%", letter: "A", credits: 4, teacher: "Mr. Hosam" },
          { name: "Physics & Chemistry", grade: "96%", letter: "A+", credits: 4, teacher: "Mr. Said" },
          { name: "English Literature", grade: "88%", letter: "B+", credits: 3, teacher: "Mrs. Radwa" },
          { name: "World History", grade: "90%", letter: "A-", credits: 3, teacher: "Mr. Said" },
          { name: "Computer Science", grade: "98%", letter: "A+", credits: 2, teacher: "Mr. Yasser" },
        ],
      },

      // P3. Progress History (Term-by-term comparisons)
      progressHistory: {
        terms: ["Previous Year Final", "Midterm (Term 1)", "Current (Term 1 Final)"],
        comparisons: [
          {
            subject: "Mathematics",
            previous: 87,
            midterm: 89,
            current: 94,
            change: "+5.0%",
            trend: "up",
            notes: "Significant breakthrough in Calculus theorems.",
          },
          {
            subject: "Science",
            previous: 92,
            midterm: 94,
            current: 96,
            change: "+2.0%",
            trend: "up",
            notes: "Outstanding lab report scores.",
          },
          {
            subject: "Languages",
            previous: 89,
            midterm: 86,
            current: 88,
            change: "+2.0%",
            trend: "up",
            notes: "Rebounded after focused grammar practice.",
          },
          {
            subject: "History",
            previous: 88,
            midterm: 88,
            current: 90,
            change: "+2.0%",
            trend: "up",
            notes: "Strong essay research project.",
          },
        ],
        improvements: [
          "Calculus performance surged from 89% to 94% following extra problem sets.",
          "Lab experiment teamwork and report precision rose to an all-time high of 96%.",
          "Homework consistency remained at 100% across all 4 subjects.",
        ],
        areasNeedingWork: [
          "Literature essay composition requires more detailed supporting evidence.",
          "Speed and time allocation on multi-part exam sections.",
        ],
      },

      // P4. Graded Exam and Quiz Details (Ticket request system)
      examTickets: [
        {
          id: "ticket-101",
          examTitle: "Calculus Midterm Examination",
          subject: "Mathematics",
          teacher: "Mr. Hosam",
          examDate: "Oct 24, 2026",
          score: "47 / 50 (94%)",
          status: "Approved", // "Approved" | "Pending Approval" | "Not Requested"
          requestDate: "Oct 25, 2026",
          approvalDate: "Oct 26, 2026",
          teacherNote: "Access granted. Please review Question 4 on optimization constraints.",
          questions: [
            {
              num: 1,
              prompt: "Evaluate the limit of (sin 3x)/x as x approaches 0.",
              studentAnswer: "3",
              correctAnswer: "3",
              isCorrect: true,
              points: "5/5",
              feedback: "Flawless application of trigonometric limit rules.",
            },
            {
              num: 2,
              prompt: "Find the derivative of f(x) = x^3 * e^(2x).",
              studentAnswer: "f'(x) = 3x^2 * e^(2x) + 2x^3 * e^(2x)",
              correctAnswer: "f'(x) = 3x^2 * e^(2x) + 2x^3 * e^(2x) = x^2 * e^(2x)(3 + 2x)",
              isCorrect: true,
              points: "10/10",
              feedback: "Accurate product and chain rule execution.",
            },
            {
              num: 3,
              prompt: "A cylinder has fixed surface area 150π. Find dimensions maximizing volume.",
              studentAnswer: "Radius r = 5, Height h = 10",
              correctAnswer: "Radius r = 5, Height h = 10",
              isCorrect: true,
              points: "15/15",
              feedback: "Excellent critical points verification using second derivative test.",
            },
            {
              num: 4,
              prompt: "Find the inflection points of f(x) = x^4 - 4x^3 + 6x^2.",
              studentAnswer: "x = 1 (Mistake: omitted x = 2)",
              correctAnswer: "x = 1 and x = 2",
              isCorrect: false,
              points: "7/10",
              feedback: "Factored f''(x) = 12x(x - 2) incorrectly in the second step. Lost 3 points.",
            },
            {
              num: 5,
              prompt: "Particle position s(t) = 2t^3 - 9t^2 + 12t. When is velocity negative?",
              studentAnswer: "1 < t < 2",
              correctAnswer: "1 < t < 2",
              isCorrect: true,
              points: "10/10",
              feedback: "Clear interval analysis table.",
            },
          ],
        },
        {
          id: "ticket-102",
          examTitle: "Organic Chemistry Lab & Quiz 2",
          subject: "Science",
          teacher: "Mr. Said",
          examDate: "Oct 30, 2026",
          score: "19 / 20 (95%)",
          status: "Approved",
          requestDate: "Oct 31, 2026",
          approvalDate: "Nov 1, 2026",
          teacherNote: "Great lab protocol adherence. See note on safety goggles documentation.",
          questions: [
            {
              num: 1,
              prompt: "Identify the functional group present in ethyl acetate.",
              studentAnswer: "Ester",
              correctAnswer: "Ester",
              isCorrect: true,
              points: "5/5",
              feedback: "Correct identification.",
            },
            {
              num: 2,
              prompt: "Explain why boiling point increases with molecular mass in alkanes.",
              studentAnswer: "Greater London dispersion forces as electron cloud grows.",
              correctAnswer: "Greater surface area and London dispersion forces.",
              isCorrect: true,
              points: "10/10",
              feedback: "Very thorough explanation.",
            },
            {
              num: 3,
              prompt: "Calculate percent yield of aspirin synthesis (actual 4.2g vs theoretical 4.8g).",
              studentAnswer: "87.5%",
              correctAnswer: "87.5%",
              isCorrect: true,
              points: "4/5",
              feedback: "Calculation right, but missing significant figures justification.",
            },
          ],
        },
        {
          id: "ticket-103",
          examTitle: "Literary Analysis Mid-Term Essay",
          subject: "Languages",
          teacher: "Mrs. Radwa",
          examDate: "Nov 2, 2026",
          score: "42 / 50 (84%)",
          status: "Pending Approval",
          requestDate: "Nov 3, 2026",
          approvalDate: null,
          teacherNote: "Teacher is reviewing your view request ticket.",
          questions: [],
        },
        {
          id: "ticket-104",
          examTitle: "World History Modern Revolutions Unit Test",
          subject: "World History",
          teacher: "Mr. Said",
          examDate: "Nov 4, 2026",
          score: "45 / 50 (90%)",
          status: "Not Requested",
          requestDate: null,
          approvalDate: null,
          teacherNote: "Submit access request ticket to inspect graded booklet.",
          questions: [],
        },
      ],

      // P6. Meeting Booking
      meetings: [
        {
          id: "meet-1",
          teacherName: "Mr. Hosam",
          subject: "Mathematics",
          date: "Nov 12, 2026",
          time: "1:30 PM - 2:00 PM",
          type: "In-Person (Room 204)",
          status: "Confirmed",
          agenda: "Discussion on AP Calculus exam registration and semester pacing.",
        },
      ],

      // P7. Emergency Channel (Separate dedicated alerts & protocols)
      emergencies: [
        {
          id: "em-1",
          severity: "alert",
          title: "School Clinic Health Notice",
          sender: "School Clinic (Nurse Hoda)",
          date: "Today, 11:15 AM",
          status: "Resolved & Monitored",
          message:
            "Ahmed visited the health clinic reporting mild dizziness after physical education. Vital signs checked: Temp 36.8°C, Blood Pressure 118/75. He was provided with electrolytes and rested 25 minutes. He returned to 4th period class in good spirits.",
          actionTaken: "Monitored and cleared to resume classes.",
          contactNumber: "+20 100 000 1122 (Direct Clinic)",
        },
        {
          id: "em-2",
          severity: "info",
          title: "Campus Weather & Early Departure Precaution",
          sender: "School Safety Administration",
          date: "Oct 29, 2026, 1:00 PM",
          status: "Notice",
          message:
            "Due to heavy rain forecast, school bus transport departed 30 minutes earlier under police escort. All students safely accounted for.",
          actionTaken: "Safely dispatched.",
          contactNumber: "+20 100 000 9999 (Campus Security)",
        },
      ],

      // P8. Behavioral Concerns (Shared by teacher with home action plan)
      behavioralConcerns: [
        {
          id: "beh-1",
          teacher: "Mr. Hosam",
          subject: "Mathematics",
          date: "Nov 2, 2026",
          category: "Focus & Calculation Pacing",
          status: "Under Observation",
          concern:
            "Ahmed seemed slightly hurried during independent problem-solving sets and made arithmetic slips by not re-reading minus signs.",
          homeActionPlan: [
            "Encourage 15 minutes of quiet, distraction-free calculation review at home.",
            "Ask him to explain one math problem verbally to verify steps.",
            "Celebrate method over speed.",
          ],
          parentNote: "We reviewed the minus sign habits over the weekend.",
        },
        {
          id: "beh-2",
          teacher: "Mrs. Radwa",
          subject: "Languages",
          date: "Oct 22, 2026",
          category: "Classroom Spoken Participation",
          status: "Resolved",
          concern:
            "Ahmed appeared hesitant to raise his hand during classroom debate rounds, although his written essays are top-tier.",
          homeActionPlan: [
            "Practice mini-debates during family dinners to build spontaneous public speaking confidence.",
            "Provide verbal positive reinforcement when expressing opinions.",
          ],
          parentNote:
            "Dinner debates worked wonders! Mrs. Radwa noted he spoke up twice in Tuesday's seminar.",
        },
      ],

      // General Subjects & Teachers data for Home & Chat
      subjects: [
        {
          id: "math",
          name: "Math",
          teacher: "Mr. Hosam",
          upcoming: "Calculus Quiz - Nov 12",
          lastGrade: "94/100 (A)",
          gradesTable: [
            { id: 1, assignment: "95%", quiz: "92%", classWork: "98%" },
            { id: 2, assignment: "90%", quiz: "88%", classWork: "95%" },
            { id: 3, assignment: "96%", quiz: "94%", classWork: "100%" },
          ],
          analysis: {
            details: [
              "Mastery in single-variable differential calculus.",
              "Excellent class participation in group proof sessions.",
              "Zero late assignments this term.",
            ],
            keyTakeaways:
              "Very strong grasp of abstract algebraic concepts and speed in problem solving.",
            excellentWork: "Derivatives & Optimization Problems",
            radarValues: [
              { label: "Homework", value: 95 },
              { label: "Quizzes", value: 92 },
              { label: "Participation", value: 98 },
              { label: "Midterm", value: 94 },
              { label: "Projects", value: 97 },
            ],
          },
        },
        {
          id: "languages",
          name: "Languages",
          teacher: "Mrs. Radwa",
          upcoming: "Essay Draft - Nov 15",
          lastGrade: "88/100 (B+)",
          gradesTable: [
            { id: 1, assignment: "88%", quiz: "85%", classWork: "92%" },
            { id: 2, assignment: "91%", quiz: "87%", classWork: "90%" },
            { id: 3, assignment: "89%", quiz: "90%", classWork: "94%" },
          ],
          analysis: {
            details: [
              "Great vocabulary acquisition and reading comprehension.",
              "Expressive writing style in creative literary essays.",
              "Encouraged to strengthen counter-argument paragraphs.",
            ],
            keyTakeaways:
              "Fluent communication skills with steady improvement in structured persuasive writing.",
            excellentWork: "Literary Analysis on 19th Century Prose",
            radarValues: [
              { label: "Homework", value: 89 },
              { label: "Quizzes", value: 87 },
              { label: "Participation", value: 92 },
              { label: "Midterm", value: 88 },
              { label: "Projects", value: 90 },
            ],
          },
        },
        {
          id: "science",
          name: "Science",
          teacher: "Mr. Said",
          upcoming: "Lab Report - Nov 18",
          lastGrade: "96/100 (A+)",
          gradesTable: [
            { id: 1, assignment: "98%", quiz: "95%", classWork: "97%" },
            { id: 2, assignment: "94%", quiz: "96%", classWork: "95%" },
            { id: 3, assignment: "99%", quiz: "98%", classWork: "100%" },
          ],
          analysis: {
            details: [
              "Outstanding understanding of thermodynamic laws and lab safety.",
              "Thorough data recording and precision in chemical titration.",
              "Acts as lab team lead during practical experiments.",
            ],
            keyTakeaways:
              "Exceptional scientific rigor and dedication to experimental validation.",
            excellentWork: "Organic Chemistry Synthesis Experiment",
            radarValues: [
              { label: "Homework", value: 97 },
              { label: "Quizzes", value: 96 },
              { label: "Participation", value: 99 },
              { label: "Midterm", value: 95 },
              { label: "Projects", value: 98 },
            ],
          },
        },
      ],
      teachers: [
        {
          id: "hosam",
          name: "Mr. Hosam",
          subject: "Math",
          email: "hosam@zinger.edu",
          phone: "+20 100 234 5678",
          avatarColor: "#1E3B2F",
          room: "Room 204",
          lastMessage: "Ahmed did great in today's calculus session!",
          availableSlots: ["Nov 12, 1:30 PM", "Nov 12, 2:15 PM", "Nov 15, 11:00 AM"],
        },
        {
          id: "said",
          name: "Mr. Said",
          subject: "Science & History",
          email: "said@zinger.edu",
          phone: "+20 101 876 5432",
          avatarColor: "#7F8C6A",
          room: "Lab 3",
          lastMessage: "Please ensure the lab safety slip is signed.",
          availableSlots: ["Nov 11, 10:30 AM", "Nov 13, 1:00 PM"],
        },
        {
          id: "radwa",
          name: "Mrs. Radwa",
          subject: "Languages",
          email: "radwa@zinger.edu",
          phone: "+20 102 345 6789",
          avatarColor: "#C8B48A",
          room: "Room 105",
          lastMessage: "Hello Mr. Ehab, Ahmed's essay was wonderful.",
          availableSlots: ["Nov 10, 12:00 PM", "Nov 14, 2:30 PM"],
        },
      ],
      chatMessages: {
        hosam: [
          {
            id: 1,
            sender: "teacher",
            text: "Good afternoon Mr. Ehab. I wanted to commend Ahmed on his recent calculus test score.",
            time: "10:30 AM",
          },
          {
            id: 2,
            sender: "parent",
            text: "Thank you Mr. Hosam! He has been studying hard for this topic and practicing everyday.",
            time: "10:45 AM",
          },
          {
            id: 3,
            sender: "teacher",
            text: "It definitely shows. Let me know if you need any extra practice materials for the upcoming quiz on November 12th.",
            time: "11:00 AM",
          },
        ],
        said: [
          {
            id: 1,
            sender: "teacher",
            text: "Hello Mr. Ehab! Just reminding about the science fair project proposal deadline next week.",
            time: "Yesterday, 3:20 PM",
          },
          {
            id: 2,
            sender: "parent",
            text: "Understood Mr. Said, he has completed the outline and will submit it tomorrow.",
            time: "Yesterday, 4:10 PM",
          },
        ],
        radwa: [
          {
            id: 1,
            sender: "teacher",
            text: "Dear Mr. Ehab, Ahmed's creative writing essay draft was fantastic.",
            time: "Oct 28, 11:15 AM",
          },
        ],
      },
    },

    // Child 2: Mariam Ehab
    {
      id: "mariam",
      name: "Mariam Ehab",
      grade: "Grade 8 - Section A",
      avatar: "ME",
      metrics: {
        overallScore: "94.2%",
        status: "Honor Roll Student",
        attendance: "99.0%",
        teacherReview: {
          status: "Verified & Approved",
          reviewedBy: "Mrs. Radwa (Languages)",
          date: "November 2, 2026",
          note: "Evaluated based on reading showcase and algebra milestone assessments.",
        },
        strengths: [
          "Creative Writing and Spoken Recitation",
          "Visual Arts & Design Composition",
          "Linear Equations & Algebraic Reasoning",
        ],
        topicsToWorkOn: [
          "Geometry Proof Steps Structure",
          "Scientific Method Hypothesis Formulation",
        ],
        radarValues: [
          { label: "Math", value: 92 },
          { label: "Science", value: 95 },
          { label: "Languages", value: 97 },
          { label: "History", value: 93 },
          { label: "Art", value: 98 },
        ],
        details: [
          "Consistent top-tier academic participation across all classes.",
          "Demonstrates great creative leadership in peer group tasks.",
        ],
        keyTakeaways: "Mariam continues to maintain exemplary academic diligence.",
      },
      reportCard: {
        term: "Term 1 (Academic Year 2026-2027)",
        status: "Confirmed by Faculty",
        confirmationDate: "Nov 1, 2026",
        confirmedBy: "Middle School Academic Committee",
        cumulativeGpa: "3.95 / 4.0",
        attendancePercentage: "99.0%",
        conduct: "Exemplary",
        subjects: [
          { name: "English Language Arts", grade: "98%", letter: "A+", credits: 4, teacher: "Mrs. Radwa" },
          { name: "Algebra I", grade: "91%", letter: "A-", credits: 4, teacher: "Mr. Hosam" },
          { name: "General Science", grade: "95%", letter: "A", credits: 3, teacher: "Mr. Said" },
          { name: "Visual Arts", grade: "98%", letter: "A+", credits: 2, teacher: "Ms. Nour" },
        ],
      },
      progressHistory: {
        terms: ["Previous Year Final", "Midterm (Term 1)", "Current (Term 1 Final)"],
        comparisons: [
          { subject: "Languages", previous: 94, midterm: 96, current: 98, change: "+2.0%", trend: "up", notes: "First place in poetry recital." },
          { subject: "Mathematics", previous: 88, midterm: 90, current: 91, change: "+1.0%", trend: "up", notes: "Steady improvement in functions." },
          { subject: "Science", previous: 92, midterm: 93, current: 95, change: "+2.0%", trend: "up", notes: "Top marks on biodiversity project." },
        ],
        improvements: ["Languages rose to a stunning 98% with zero missed assignments."],
        areasNeedingWork: ["Continue strengthening coordinate geometry proofs."],
      },
      examTickets: [
        {
          id: "ticket-201",
          examTitle: "Middle School Poetry & Essay Exam",
          subject: "Languages",
          teacher: "Mrs. Radwa",
          examDate: "Oct 28, 2026",
          score: "49 / 50 (98%)",
          status: "Approved",
          requestDate: "Oct 29, 2026",
          approvalDate: "Oct 29, 2026",
          teacherNote: "Remarkable poetic rhythm and syntax.",
          questions: [
            {
              num: 1,
              prompt: "Identify the metrical scheme used in the provided stanza.",
              studentAnswer: "Iambic Pentameter",
              correctAnswer: "Iambic Pentameter",
              isCorrect: true,
              points: "10/10",
              feedback: "Accurate scansion analysis.",
            },
          ],
        },
      ],
      meetings: [],
      emergencies: [
        {
          id: "em-mariam-1",
          severity: "info",
          title: "Library Reading Showcase Schedule",
          sender: "Middle School Activities",
          date: "Nov 1, 2026",
          status: "Notice",
          message: "Mariam's poetry presentation is scheduled for 10:00 AM on Thursday in the main auditorium.",
          actionTaken: "Invitation sent.",
          contactNumber: "+20 100 000 1100",
        },
      ],
      behavioralConcerns: [],
      subjects: [
        {
          id: "languages",
          name: "Languages",
          teacher: "Mrs. Radwa",
          upcoming: "Poetry Recital - Nov 14",
          lastGrade: "98/100 (A+)",
          gradesTable: [
            { id: 1, assignment: "98%", quiz: "96%", classWork: "100%" },
            { id: 2, assignment: "97%", quiz: "99%", classWork: "98%" },
            { id: 3, assignment: "100%", quiz: "97%", classWork: "99%" },
          ],
          analysis: {
            details: ["Exemplary grammatical accuracy and expressive vocabulary."],
            keyTakeaways: "Consistently produces near-perfect scores.",
            excellentWork: "Middle School Poetry Showcase",
            radarValues: [
              { label: "Homework", value: 99 },
              { label: "Quizzes", value: 97 },
              { label: "Participation", value: 100 },
              { label: "Midterm", value: 98 },
              { label: "Projects", value: 99 },
            ],
          },
        },
      ],
      teachers: [
        {
          id: "radwa",
          name: "Mrs. Radwa",
          subject: "Languages",
          email: "radwa@zinger.edu",
          phone: "+20 102 345 6789",
          avatarColor: "#C8B48A",
          room: "Room 105",
          lastMessage: "Mariam's recitation rehearsal was simply breathtaking!",
          availableSlots: ["Nov 10, 12:00 PM", "Nov 14, 2:30 PM"],
        },
      ],
      chatMessages: {
        radwa: [
          {
            id: 1,
            sender: "teacher",
            text: "Hello Mr. Ehab! Mariam has been selected for the annual inter-school poetry contest.",
            time: "Nov 2, 2:15 PM",
          },
        ],
      },
    },
  ],
};
