export const parentData = {
  children: [
    {
      id: "ahmed",
      name: "Ahmed Ehab",
      grade: "Grade 5 - Class 5A",
      avatar: "AE",

      // P1. Child Progress Metrics (Teacher reviewed, strictly individual, no class ranking)
      metrics: {
        overallScore: "92.8%",
        status: "Excellent Academic Standing",
        attendance: "98.5%",
        teacherReview: {
          status: "Verified & Approved",
          reviewedBy: "Mrs. Radwa (Mathematics) & Mr. Said (English)",
          date: "November 3, 2026",
          note: "Individual evaluation completed based on Term 1 formative coursework and lab assessments.",
        },
        strengths: [
          "Fractions, Decimals & Mental Math Problem Solving",
          "Plant Life Cycles & Light and Shadows Science Experiments",
          "Reading Comprehension & Creative Story Writing",
          "Consistent On-Time Assignment Submission (100%)",
        ],
        topicsToWorkOn: [
          "Adding Fractions with Different Denominators",
          "Structuring Paragraphs with Clear Topic Sentences",
          "Pacing Strategy During 30-Minute Timed Quizzes",
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
          "Ahmed excels at math and science. Supporting his fraction additions with different denominators and paragraph writing will help achieve balanced excellence.",
      },

      // P2. Grades and Report Cards (Confirmed by teacher, downloadable/printable)
      reportCard: {
        term: "Term 1 (Academic Year 2026-2027)",
        status: "Confirmed by Faculty",
        confirmationDate: "Nov 1, 2026",
        confirmedBy: "Elementary Faculty Committee & Department Heads",
        cumulativeGpa: "3.85 / 4.0",
        attendancePercentage: "98.5%",
        conduct: "Excellent",
        subjects: [
          { name: "Mathematics (Fractions & Decimals)", grade: "94%", letter: "A", credits: 4, teacher: "Mrs. Radwa" },
          { name: "Science (Plants & Light)", grade: "96%", letter: "A+", credits: 4, teacher: "Mr. Ahmed" },
          { name: "English & Reading", grade: "88%", letter: "B+", credits: 3, teacher: "Mr. Said" },
          { name: "Social Studies", grade: "90%", letter: "A-", credits: 3, teacher: "Mr. Yasser" },
          { name: "Art & Physical Education", grade: "98%", letter: "A+", credits: 2, teacher: "Ms. Nour" },
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
            notes: "Significant breakthrough in adding fractions and multiplication.",
          },
          {
            subject: "Science",
            previous: 92,
            midterm: 94,
            current: 96,
            change: "+2.0%",
            trend: "up",
            notes: "Outstanding plant growth experiment journal.",
          },
          {
            subject: "Languages",
            previous: 89,
            midterm: 86,
            current: 88,
            change: "+2.0%",
            trend: "up",
            notes: "Rebounded after focused reading and spelling practice.",
          },
          {
            subject: "History",
            previous: 88,
            midterm: 88,
            current: 90,
            change: "+2.0%",
            trend: "up",
            notes: "Strong community helpers project.",
          },
        ],
        improvements: [
          "Math fractions performance surged from 89% to 94% following extra practice sheets.",
          "Science experiment teamwork and observation accuracy rose to an all-time high of 96%.",
          "Homework consistency remained at 100% across all 4 subjects.",
        ],
        areasNeedingWork: [
          "English story composition requires more descriptive details.",
          "Speed and time allocation on multi-part quiz sections.",
        ],
      },

      // P4. Graded Exam and Quiz Details (Ticket request system)
      examTickets: [
        {
          id: "ticket-101",
          examTitle: "Mathematics Midterm Examination (Fractions & Decimals)",
          subject: "Mathematics",
          teacher: "Mrs. Radwa",
          examDate: "Oct 24, 2026",
          score: "47 / 50 (94%)",
          status: "Approved", // "Approved" | "Pending Approval" | "Not Requested"
          requestDate: "Oct 25, 2026",
          approvalDate: "Oct 26, 2026",
          teacherNote: "Access granted. Please review Question 4 on fractions with different denominators.",
          questions: [
            {
              num: 1,
              prompt: "Find the common denominator of 2/3 and 1/4.",
              studentAnswer: "12",
              correctAnswer: "12",
              isCorrect: true,
              points: "5/5",
              feedback: "Flawless identification of the least common multiple (12).",
            },
            {
              num: 2,
              prompt: "Calculate 3/5 + 1/5.",
              studentAnswer: "4/5",
              correctAnswer: "4/5",
              isCorrect: true,
              points: "10/10",
              feedback: "Accurate addition of fractions with like denominators.",
            },
            {
              num: 3,
              prompt: "What is 45 ÷ 5?",
              studentAnswer: "9",
              correctAnswer: "9",
              isCorrect: true,
              points: "15/15",
              feedback: "Quick and accurate mental multiplication fact recall.",
            },
            {
              num: 4,
              prompt: "Calculate 1/2 + 1/3.",
              studentAnswer: "2/5 (Mistake: added numerators and denominators directly)",
              correctAnswer: "5/6 (Convert to 3/6 + 2/6 = 5/6)",
              isCorrect: false,
              points: "7/10",
              feedback: "Remember to find a common denominator (6) before adding numerators. Lost 3 points.",
            },
            {
              num: 5,
              prompt: "A ribbon is 24 cm long. If you cut it into 4 equal pieces, how long is each piece?",
              studentAnswer: "6 cm",
              correctAnswer: "6 cm",
              isCorrect: true,
              points: "10/10",
              feedback: "Clear division step and correct unit.",
            },
          ],
        },
        {
          id: "ticket-102",
          examTitle: "Science Unit 1: Plant Life & Growth Quiz",
          subject: "Science",
          teacher: "Mr. Ahmed",
          examDate: "Oct 30, 2026",
          score: "19 / 20 (95%)",
          status: "Approved",
          requestDate: "Oct 31, 2026",
          approvalDate: "Nov 1, 2026",
          teacherNote: "Great lab notebook adherence. See note on seedling height measurement units.",
          questions: [
            {
              num: 1,
              prompt: "Which part of the plant absorbs water and minerals from the soil?",
              studentAnswer: "Roots",
              correctAnswer: "Roots",
              isCorrect: true,
              points: "5/5",
              feedback: "Correct identification.",
            },
            {
              num: 2,
              prompt: "Explain why plants need sunlight to make their food (photosynthesis).",
              studentAnswer: "Sunlight provides light energy that leaves use to produce sugars and food.",
              correctAnswer: "Sunlight provides energy for photosynthesis.",
              isCorrect: true,
              points: "10/10",
              feedback: "Very thorough explanation.",
            },
            {
              num: 3,
              prompt: "Name the gas that green leaves release into the air during photosynthesis.",
              studentAnswer: "Oxygen",
              correctAnswer: "Oxygen",
              isCorrect: true,
              points: "4/5",
              feedback: "Concept right, remember to write a complete sentence.",
            },
          ],
        },
        {
          id: "ticket-103",
          examTitle: "English Reading Comprehension & Story Quiz",
          subject: "Languages",
          teacher: "Mr. Said",
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
          examTitle: "Social Studies Community & Geography Test",
          subject: "World History",
          teacher: "Mr. Yasser",
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
          teacherName: "Mrs. Radwa",
          subject: "Mathematics",
          date: "Nov 12, 2026",
          time: "1:30 PM - 2:00 PM",
          type: "In-Person (Room 204)",
          status: "Confirmed",
          agenda: "Discussion on Grade 5 math enrichment and fractions practice strategies.",
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
          teacher: "Mrs. Radwa",
          subject: "Mathematics",
          date: "Nov 2, 2026",
          category: "Focus & Calculation Pacing",
          status: "Under Observation",
          concern:
            "Ahmed seemed slightly hurried during fraction problem sets and made quick arithmetic slips by not double-checking common denominators.",
          homeActionPlan: [
            "Encourage 15 minutes of quiet, distraction-free fraction calculation review at home.",
            "Ask him to explain one math problem verbally before writing the answer.",
            "Celebrate finding common denominators over rushing to finish.",
          ],
          parentNote: "We reviewed common denominator steps over the weekend.",
        },
        {
          id: "beh-2",
          teacher: "Mr. Said",
          subject: "English",
          date: "Oct 22, 2026",
          category: "Classroom Spoken Participation",
          status: "Resolved",
          concern:
            "Ahmed appeared hesitant to raise his hand during reading circle discussions, although his written answers are top-tier.",
          homeActionPlan: [
            "Practice reading story excerpts aloud during family time to build spontaneous speaking confidence.",
            "Provide verbal positive reinforcement when expressing opinions.",
          ],
          parentNote:
            "Reading aloud at dinner worked wonders! Mr. Said noted he raised his hand twice on Tuesday.",
        },
      ],

      // General Subjects & Teachers data for Home & Chat
      subjects: [
        {
          id: "math",
          name: "Math",
          teacher: "Mrs. Radwa",
          upcoming: "Fractions & Decimals Quiz - Nov 12",
          lastGrade: "94/100 (A)",
          gradesTable: [
            { id: 1, assignment: "95%", quiz: "92%", classWork: "98%" },
            { id: 2, assignment: "90%", quiz: "88%", classWork: "95%" },
            { id: 3, assignment: "96%", quiz: "94%", classWork: "100%" },
          ],
          analysis: {
            details: [
              "Mastery in Grade 5 multiplication and basic fractions.",
              "Excellent class participation in board problem solving.",
              "Zero late assignments this term.",
            ],
            keyTakeaways:
              "Very strong grasp of Grade 5 arithmetic concepts and enthusiasm in problem solving.",
            excellentWork: "Multiplication Tables & Equivalent Fractions",
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
          name: "English",
          teacher: "Mr. Said",
          upcoming: "Story Draft - Nov 15",
          lastGrade: "88/100 (B+)",
          gradesTable: [
            { id: 1, assignment: "88%", quiz: "85%", classWork: "92%" },
            { id: 2, assignment: "91%", quiz: "87%", classWork: "90%" },
            { id: 3, assignment: "89%", quiz: "90%", classWork: "94%" },
          ],
          analysis: {
            details: [
              "Great vocabulary acquisition and reading comprehension.",
              "Expressive writing style in creative story compositions.",
              "Encouraged to elaborate more in character descriptions.",
            ],
            keyTakeaways:
              "Fluent creative expression with steady progress in paragraph transitions.",
            excellentWork: "Short Story on Rainforest Explorers",
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
          teacher: "Mr. Ahmed",
          upcoming: "Plant Journal - Nov 18",
          lastGrade: "96/100 (A+)",
          gradesTable: [
            { id: 1, assignment: "98%", quiz: "95%", classWork: "97%" },
            { id: 2, assignment: "94%", quiz: "96%", classWork: "95%" },
            { id: 3, assignment: "99%", quiz: "98%", classWork: "100%" },
          ],
          analysis: {
            details: [
              "Outstanding understanding of plant biology and light experiments.",
              "Accurate measurement logs and detailed drawings.",
              "Consistently leads peer groups responsibly in the science lab.",
            ],
            keyTakeaways:
              "Exceptional scientific curiosity and diligence in experimental recordings.",
            excellentWork: "Bean Seed Germination Observation Log",
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
          id: "radwa",
          name: "Mrs. Radwa",
          subject: "Mathematics",
          email: "radwa@zinger.edu",
          phone: "+20 102 345 6789",
          avatarColor: "#1E3B2F",
          room: "Room 204",
          lastMessage: "Ahmed did great in today's fractions quiz!",
          availableSlots: ["Nov 12, 1:30 PM", "Nov 12, 2:15 PM", "Nov 15, 11:00 AM"],
        },
        {
          id: "said",
          name: "Mr. Said",
          subject: "English & Reading",
          email: "said@zinger.edu",
          phone: "+20 101 876 5432",
          avatarColor: "#7F8C6A",
          room: "Room 105",
          lastMessage: "Ahmed's story reading in class today was wonderful.",
          availableSlots: ["Nov 11, 10:30 AM", "Nov 13, 1:00 PM"],
        },
        {
          id: "ahmed",
          name: "Mr. Ahmed",
          subject: "Science",
          email: "ahmed@zinger.edu",
          phone: "+20 100 234 5678",
          avatarColor: "#C8B48A",
          room: "Science Lab",
          lastMessage: "Ahmed completed his plant observation journal accurately.",
          availableSlots: ["Nov 10, 12:00 PM", "Nov 14, 2:30 PM"],
        },
      ],
      chatMessages: {
        radwa: [
          {
            id: 1,
            sender: "teacher",
            text: "Good afternoon Mr. Ehab. I wanted to commend Ahmed on his recent math quiz score.",
            time: "10:30 AM",
          },
          {
            id: 2,
            sender: "parent",
            text: "Thank you Mrs. Radwa! He has been studying hard and practicing fractions every day.",
            time: "10:45 AM",
          },
          {
            id: 3,
            sender: "teacher",
            text: "It definitely shows. Let me know if you need any extra practice worksheets for the upcoming quiz on November 12th.",
            time: "11:00 AM",
          },
        ],
        said: [
          {
            id: 1,
            sender: "teacher",
            text: "Hello Mr. Ehab! Just reminding you about the story writing submission next week.",
            time: "Yesterday, 3:20 PM",
          },
          {
            id: 2,
            sender: "parent",
            text: "Understood Mr. Said, he has completed the outline and will submit it tomorrow.",
            time: "Yesterday, 4:10 PM",
          },
        ],
        ahmed: [
          {
            id: 1,
            sender: "teacher",
            text: "Dear Mr. Ehab, Ahmed's plant observation log draft was fantastic.",
            time: "Oct 28, 11:15 AM",
          },
        ],
        hosam: [
          {
            id: 1,
            sender: "teacher",
            text: "Good afternoon Mr. Ehab. Ahmed is doing well.",
            time: "10:30 AM",
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
