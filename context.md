# Zinger School — React Frontend Prototype Context

> **Status:** Working project context, version 0.2 (6 November 2026), updated from the current repository.  
> **Purpose:** Shared source of context for the existing implementation, remaining requirements, and future frontend work.  
> **Important:** This is a prototype, **not** a working AI grading system. Real OCR, AI grading, authentication, notifications, and backend APIs are not required.

## 0. Current implementation at a glance

This repository already contains an interactive **Zinger School** frontend with student, parent, and teacher portals. It is no longer an empty project awaiting stack selection. Requirements and intended journeys below describe the target; they do not imply that the complete assessment cycle currently works.

### Implemented screens and behavior

| Area | Current behavior | Limits |
|---|---|---|
| Login and header | Fixture credentials, local-storage demo user, role-specific navigation, profile menu, portal links, notification dropdown, mobile menu | No real authentication. Only teacher routes have a role guard. Switching portal links does not change the stored user, so entering teacher routes requires a teacher login. Parent header notifications are empty. |
| Teacher dashboard | Illustrated hero carousel and searchable class analytics carousel; averages, highest/lowest scores, strengths, weaknesses, and SVG radar chart | Uses static data for classes 5A, 4A, and 3B. Classes/students and schedule links lead to unimplemented routes. |
| Teacher papers | Submission list with working grade, class, and paper filters, status badges, and empty state | Clicking a paper links to an unimplemented detail route. OCR/AI fixtures exist for papers 1 and 2 but are not connected to a review screen. |
| Student dashboard | Hero carousel, announcements preview, pending assessments, homework upload modal, progress and topic support cards | Upload records only a filename in page state, with a sample filename if no file is selected. No file transfer, scan preview, OCR, or shared teacher submission is created. |
| Student grades | Science/Math/English subject carousel, subject history/detail, report-card modal, browser printing | Results are fixtures labeled teacher-confirmed; there is no actual publication gate. PDF download currently shows a toast only. |
| Student teachers | Teacher selection, feedback carousel, question clarification, prefilled practice requests, local chat with simulated teacher reply | Messages and feedback are not synchronized with a teacher inbox. |
| Student announcements | Seeded announcement feed and important-only filter | No teacher composer or delivery pipeline. |
| Student solving workspace | Multiple-choice Math and English assessments, question navigation, time per question, hard-question marking, calculator, scratchpad, hints, submission confirmation and summary | Answers, timings, and difficulty marks stay in page state; submitting does not create a teacher-review item or calculate/publish a grade. |
| Parent portal | Child switcher, dashboard, grades/history/exams, report card and printing, exam review tickets, teacher meeting booking/cancellation, chat, behavioral notes/home updates, emergency report flow | These are fixture-backed views and local simulations. They do not deliver messages, book real meetings, dispatch alerts, or update teacher/student data. |

The login screen implements the approved **Refined split** concept: original book illustration and wordmark on white at the left, an open form on cream at the right, and a pale sage page background. It uses **Bree Serif 400** for the school name and **Source Sans 3** for the rest of the login UI. The illustration, panel split, 400px form width, colors and interaction handlers are preserved; the illustration and form stack below 900px. The secondary **Use student demo** button fills Ahmed's credentials and clears a previous login error; **Sign in** still performs the fixture login. Labels, autocomplete hints, visible keyboard focus, and announced login errors are included. Forgot-password and account-creation links remain prototype placeholders; no recovery or registration workflow exists.

**Main missing connection:** student submission → teacher OCR correction → simulated grading → teacher edits/red-flag decisions → publication → updated student/parent results and notifications. This remains the primary implementation priority.

### Demo access and persistence

The following are hard-coded demo accounts from `src/data/users.js`, not real credentials:

| Role | Email | Password |
|---|---|---|
| Teacher | `radwa@zinger.edu` | `teacher123` |
| Student | `ahmed@zinger.edu` | `student123` |
| Parent | `ehab@zinger.edu` | `parent123` |

- `localStorage["user"]` stores the matched demo user; sign-out removes it.
- `localStorage["parent_active_child"]` stores the selected child ID (default `ahmed`).
- Uploads, workspace answers/timers, chat messages, bookings, tickets, behavioral replies, and emergency reports otherwise use component state. They are not persisted or shared across portals and generally reset when their page remounts.
- No backend, network data-fetching layer, global state provider, or shared submission store is implemented.

### Known gaps and inconsistencies

- Target users remain Grades 1–5. Student profile data says Grade 5/Class 5A, but the header says Grade 11/Class B; parent fixtures include Grades 11 and 8 and advanced subjects. Align fixtures and copy with the primary-school audience.
- English assessment content exists; no German assessment example is currently present.
- Per-question timing, hard-question marks, and teacher clarification are implemented ideas for a possible differentiating feature. The research gap and teacher-side use of these signals have not been confirmed or completed.
- There is no catch-all/not-found route. Visible links to missing teacher pages can render no matched page.
- The README is still the default React/Vite template; it needs project-specific run instructions, demo access, workflow, and limitations.

### Local commands and verification

```sh
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

On Windows PowerShell, use `npm.cmd` if execution policy prevents running `npm.ps1`. There is no test script or automated test suite in the repository.

Repository verification on **6 November 2026**:

- `npm.cmd run build`: passed.
- `npm.cmd run lint`: failed with **8 errors and 1 warning**. Existing issues include unused imports/variables in `ParentChat`, `StudentGrades`, `StudentSolvingWorkspace`, and `StudentTeachers`, state updates inside effects in `ParentChat`/`StudentTeachers`, and a missing effect dependency in `ParentChat`.
- The redesigned login passes its targeted ESLint check and has been visually inspected in headless Chrome at 1440px desktop, 820px tablet, and 390px/320px phone widths without horizontal overflow. The Taste layout checker could not complete against the app's React structure; these screenshots are visual verification, not an automated accessibility or authentication test. Full-app narrow-screen and keyboard verification remains necessary.

## 1. Source materials and precedence

The previous context recorded the following supplied materials. **These files are not present in this repository**, so their contents and the course deadline below were not independently rechecked during this update. Preserve these inherited requirements until the original materials or project owner clarify them; do not invent additional PDF requirements.

1. `PD(2).pdf` — **CSEN 909, Human Computer Interaction, Winter 2026:** *AI-Powered Personalized Assessment and Learning Gap Detection for Children*. Authoritative source for required features, workflow, course constraints, and deliverables.
2. `image(1).webp` — existing low-fidelity Zinger School wireframes. Source for the intended information architecture, page sections, navigation ideas, and feature concepts. **Not** a strict visual design specification.
3. `image.webp` — four-color palette. Authoritative color references for the visual theme.

**When materials differ:** satisfy all mandatory features in the project description; preserve the wireframes' intended screens and interactions where possible; expand/adjust the wireframes to cover missing mandatory features; use the palette consistently. Do not claim unsupported requirements are stated in the PDF.

## 2. Project summary

**Product name used in the app:** Zinger School.  
**Platform:** Responsive browser-based web app.  
**Primary users:** Teachers and children in Grades 1–5.  
**Additional implemented role:** Parents/guardians (optional in the inherited course requirements, already included in this prototype).  
**Goal:** Make the assessment process understandable and actionable. Students submit scanned work; the interface simulates OCR and AI-assisted grading; teachers review and retain final authority; students see teacher-approved grades, personalized feedback, learning gaps, recurring errors, red flags, and progress over time.

The prototype should demonstrate the **full assessment cycle** rather than only disconnected dashboards. Teacher decisions must be visible and meaningful, and students must not see unapproved results.

### Non-negotiable human-in-the-loop principle

The AI **suggests**, the teacher **decides**. A teacher must be able to:
- Inspect and correct OCR-extracted answers **before** AI grading.
- Review and edit AI-proposed grades and feedback.
- Review learning gaps and recurring mistakes.
- Confirm or dismiss a proposed red flag.
- Publish confirmed results and communicate them to the student.

Never visually imply AI results are final before teacher confirmation.

## 3. Course requirements from the project description

### Required student functions
- Upload or scan an exam paper (a local file-upload interaction is sufficient for a prototype).
- Track submission status and see a grade **after** teacher approval.
- See personalized, comprehensible feedback.
- See identified learning gaps, recurring mistakes, and teacher-confirmed red flags.
- Receive teacher notifications (e.g. new feedback, practice suggestions).
- View progress across multiple assessments.

### Required teacher functions
- Review and correct OCR-extracted text before grading.
- Initiate or inspect simulated AI grading.
- Confirm or override suggested grades and written feedback.
- Inspect proposed learning gaps and repeated mistakes.
- Confirm/dismiss red flags; add comments or notifications.
- Publish the result so it becomes visible in the student's view.

### Optional parent functions
- View their child's grades, progress, and confirmed red flags.
- Parent features are already implemented as local demo screens, including messaging. Further expansion is secondary to completing the required teacher/student assessment cycle.

### Other project constraints
- Target children in **Grades 1–5**; design must account for young readers.
- Illustrate support for **English and German exam content**. This does not necessarily mean translating the entire interface; confirm desired UI language coverage.
- Demonstrate a **research gap / unique differentiating feature** beyond the minimum requirements. Its exact definition is **pending confirmation**.
- Responsive browser interface.
- Mock/hard-coded OCR output, AI scores, feedback, and detection results are explicitly acceptable.
- Keep an exportable record of prompts and AI-tool conversations used in creating deliverables, as required by the course.

**Relevant course milestone:** Milestone 3 (Prototype), due **14 November 2026** per the supplied PDF. It requests a complete interactive prototype, a 2–4 minute walkthrough video, and hierarchical task design; if submitting a coded frontend, also include a public repository and clear local run instructions. This context file covers the frontend, not production of those other deliverables.

## 4. Existing low-fidelity wireframes — screen inventory

The wireframes are landscape-arranged miniature screens with the following named frames. The `-T` and `-P` suffixes are retained from the artwork; do not assume they identify roles unless confirmed.

| Wireframe label | What is shown | Proposed prototype treatment |
|---|---|---|
| `Home-T` | Zinger School header; navigation to Classes, Papers and Schedule; Notification Portal; Class Analysis/metrics graph | Teacher dashboard with overview KPIs, class navigation, recent work, announcements and metrics |
| `Papers-T` | Papers screen; grade/class/paper filters; students/submission rows with dates | Teacher assessment/submission list with selectable status and links to verification/grading |
| `Grades-T` | An individual homework/paper; extracted answers preview; Edit Mode; Upload Mark Scheme; Start AI Grading | Teacher OCR review screen; mock scan preview and editable extracted answers; mark-scheme control; explicit verification step |
| `FinishedGrade-T` | Final score, graph, learning gaps, feedback, red flags, repeated mistakes; edit controls; upload grade to system | Teacher AI grading review screen with editable score/feedback, actionable red-flag decisions, approval/publish action |
| `Students-T` | Class student table with student name, attendance score, overall grade and View action | Teacher student roster; student details, performance and risk overview |
| `Student-T` | Student profile; messaging; feedback carousel; learning gaps; student graph | Student dashboard/results/progress; add upload entry point and teacher-approved assessment detail |
| `Parent-T` | Parent profile and message interface | Implemented parent portal with child progress and simulated teacher communications; see section 0 for limits |
| `Teacher-P` — notification | Notification Portal; class selector, Parents/Students targets; announcement composer | Teacher announcements with audience picker, preview, simulated send |
| `Teacher-P` — schedule | Schedule table; filters for grade/class/activity/slot/date; list of assignments/quizzes | Schedule and assessment planner/list; actions navigate to relevant assessment |
| `Teacher-P` — classes | Grade/class selectors and class tile/list | Class overview and drill-down to roster or class analytics |

> The screenshots suggest a compact desktop layout, top header/navigation, large panels/cards, filters, carousel-like content areas, tables, circular graph placeholders, and messaging. Treat these as *structural cues*. Replace grey placeholder boxes and diagonal crosses with real, readable UI.

### Required additions/clarifications not fully represented in the wireframes

1. **Student submission/upload** screen, with status feedback and a realistic sample scanned assessment.
2. **OCR verification** interaction that allows the teacher to edit extracted text and explicitly verify it **before** grading.
3. **AI grade review** controls that can change suggested marks, revise feedback, and confirm/dismiss red flags.
4. **Publish / student visibility state** that prevents premature result display.
5. **Teacher-reviewed notifications** when feedback is published.
6. Clear navigation between role-specific screens and the workflow's states.
7. A visual demonstration of the project's **unique feature/research-gap solution**, once confirmed.

Do not omit these just to match the current wireframes exactly.

## 5. Target core user journeys

These are acceptance targets. See section 0 for what works today; the connected grading/publication journeys are not yet implemented.

### Journey A — Student submits an assessment

1. Student opens their dashboard and selects **Upload Exam**.
2. Chooses a grade/subject/assignment where applicable, and uploads an image or PDF.
3. Sees a preview, filename and a **Submitted / Pending teacher review** state.
4. The app creates or updates a simulated assessment submission.
5. The student cannot see an unapproved grade. Once teacher-approved, their dashboard and results list update.

### Journey B — Teacher reviews and grades

1. Teacher opens **Papers** and selects a submission.
2. Views exam preview side by side with simulated OCR text/answers.
3. Edits OCR extraction if necessary and clicks **Confirm OCR**.
4. Starts **Simulate AI Grading** (using deterministic fixture data, not real AI).
5. Reviews the proposed score, answer-level grading, learning gaps, recurring mistakes, feedback and red flags.
6. Edits proposed grade and feedback; **confirms or dismisses each red flag**.
7. Clicks **Approve & Publish**. Submission enters `published` state and student-facing data becomes visible.
8. Optionally sends a mock teacher message/announcement about the result.

### Journey C — Student receives results and tracks improvement

1. Student sees an in-app notification of a newly published grade.
2. Opens the assessment to view score, explanations and skill-specific feedback.
3. Sees strengths/learning gaps, repeated mistake patterns and any confirmed support flag with supportive wording.
4. Navigates to **Progress** to compare scores or skill mastery across exams.
5. Can explore teacher-recommended practice activities if implemented.

### Journey D — Teacher communicates with a class

1. Opens Notification Portal.
2. Chooses class and audience (`Students`, `Parents`, or both only if parent view is in scope).
3. Enters announcement and submits.
4. Message appears in a mock recipient inbox/notification feed. No real email or SMS is sent.

### Journey E — Parent monitors child (optional)

1. Parent opens dashboard.
2. Views the linked child's **published** assessment results, progress and confirmed support needs.
3. Reads teacher notices and optionally exchanges simulated messages.

## 6. Actual routes and remaining navigation

`src/main.jsx` mounts `BrowserRouter`; `src/App.jsx` defines the following routes. Preserve existing URLs when extending the app.

| Route | Component / purpose |
|---|---|
| `/` | `Login` — fixture login |
| `/teacher` | `TeacherLayout` with `TeacherHome` as its index page |
| `/teacher/papers` | `TeacherPapers` inside `TeacherLayout` |
| `/student` | `StudentHome`, including the upload modal and progress cards |
| `/student/grades` and `/student/grades/:subjectId` | `StudentGrades` overview and subject detail |
| `/student/teachers` and `/student/teachers/:teacherId` | `StudentTeachers` overview and teacher feedback/chat |
| `/student/announcements` | `StudentAnnouncements` |
| `/student/workspace` and `/student/workspace/:assessmentId` | `StudentSolvingWorkspace`; missing/unknown assessment ID falls back to `assess-1` |
| `/parent` | `ParentHome` |
| `/parent/teachers` | `ParentTeachers` — directory and simulated meetings |
| `/parent/chat` and `/parent/chat/:teacherId` | `ParentChat` |
| `/parent/grades` | `ParentGrades` — overview/history/exams and review tickets |
| `/parent/emergency` | `ParentEmergency` — simulated urgent reports |
| `/parent/behavior` | `ParentBehavior` — teacher guidance and home notes |

**Visible links without implemented routes:** `/teacher/students`, `/teacher/schedule`, and `/teacher/papers/:id`. The last is linked from every paper row. These need real destinations before the teacher journey is usable.

OCR review, grading review, teacher announcements, class/roster details, and student publication-backed results still need implementation. Possible future URLs include `/teacher/submissions/:id/ocr`, `/teacher/submissions/:id/review`, and `/teacher/notifications`; these are proposals, not existing routes. Upload and progress currently live on `/student`, not separate `/student/upload` or `/student/progress` pages. Existing grades pages should be connected to published data rather than duplicated without a reason.

The shared header already shows active navigation, a mobile menu, portal links, and sign-out. `TeacherLayout` checks the local-storage user and redirects non-teachers to `/`; student and parent routes have no equivalent guard. This is demo navigation, not production access control. Parent views select from fixture children rather than an authenticated child relationship.

## 7. Visual direction and design system

### Supplied palette

| Token | Hex | Intended use (proposal) |
|---|---|---|
| `forest` | `#1E3B2F` | Primary navigation, headings, main buttons, strong text |
| `sage` | `#7F8C6A` | Secondary elements, soft progress/chart accents |
| `sand` | `#C8B48A` | Highlights, cards, badges with dark text, warm accents |
| `cream` | `#F5F0E6` | Main background and subtle content panels |

Current Tailwind v4 theme tokens in `src/index.css`:

```css
@theme {
  --color-forest: #1E3B2F;
  --color-sage: #7F8C6A;
  --color-sand: #C8B48A;
  --color-cream: #F5F0E6;
}
```

### Style principles

- Modern, warm, inviting school interface: professional enough for teachers, friendly and readable for young students.
- Prefer cream page backgrounds with white/light surfaces, forest green text/nav and restrained sage/sand highlights.
- Replace placeholder charts with legible charts, concise legends and meaningful labels. Avoid pie/donut charts for unrelated metrics merely because wireframes show circles.
- Distinct layouts for adult-facing data-intensive views and child-facing simpler, larger-touch-target views while keeping one consistent design system.
- Use clear hierarchy, whitespace, cards, subtle shadows, rounded corners and consistent spacing.
- Labels, statuses and explanations must not rely on color alone.
- **Accessibility note:** forest-on-cream offers strong contrast; sage text on cream and cream text on sand are low-contrast combinations for normal body text. Use forest or very dark text on sage/sand accents instead. Maintain visible keyboard focus, semantic headings, field labels and responsive tables.
- Consider age-appropriate feedback language, positive framing and simple explanations; avoid alarming children with aggressive red danger styling for support flags.

### Responsive intent

Target desktop/laptop demonstrations first while adapting to tablet and mobile width. On smaller screens: stack panel columns, collapse navigation into an accessible menu, ensure tables can scroll or become cards, and keep primary actions visible. No fixed-size wireframe artboards.

### Assets and typography

The app uses a text-based **Zinger / School Portal** brand with an inline graduation-cap icon. Current assets in `src/assets/` include `login-illustration.png`, `class.png`, `papers.png`, `schedule.png`, and `hero.png`; the teacher hero uses class/papers/schedule illustrations and login uses the login illustration. `public/` contains `favicon.svg` and `icons.svg`; default React/Vite SVGs also remain in `src/assets/`. The login uses the chosen custom fonts below; other portal pages retain the Tailwind/system font stack.

**Approved font pairing:** On 6 November 2026, the owner chose **Bree Serif + Source Sans 3**. This remains the agreed typography system: **Bree Serif 400 for the Zinger School wordmark only**, and **Source Sans 3 for all other UI text** (700 for headings, 600 for labels/buttons, 400 for body/input text). The original files and their SIL Open Font License 1.1 documents are now in `src/fonts/bree-serif/` and `src/fonts/source-sans-3/`. See `src/fonts/README.md` for sources, filenames and weights.

| Role | Selected font | Usage guide |
|---|---|---|
| Zinger School title / wordmark | **Bree Serif Regular, 400** | The only use of the display family. Start around 32–40px and preserve the existing layout; do not synthesize bold. |
| Page and section headings | **Source Sans 3, 700** | Use size and weight for hierarchy; around 28–36px for main headings. |
| Form labels and buttons | **Source Sans 3, 600** | Around 16px for labels and 18px for button text, with clear contrast and focus indicators. |
| Paragraphs, descriptions, feedback and input text | **Source Sans 3, 400** | Start around 18–20px for reading text, with 1.5–1.6 line height for paragraphs. |
| Secondary text and links | **Source Sans 3, 400–600** | Around 16px, avoiding tiny or low-contrast text. |

These are starting sizes, to be checked in the real UI at desktop and narrow widths. Use one UI family throughout; keep a system sans-serif fallback. Source Sans 3 includes normal and italic variable fonts covering weights 200–900. Retain each family's original license when distributing it.

**Implementation status:** The pairing is now **applied to the sign-in page only** through local `@font-face` declarations in `src/styles/login.css`, with `font-display: swap` and fallbacks. Bree Serif uses its real 400 weight for the wordmark (36px desktop / 28px narrow screens); Source Sans 3 uses a declared 200–900 variable weight range, 700 for the main heading, 600 for labels/buttons, and regular body/input text. Login sizes are 36px for the main heading (32px narrow), 18px for body/input/button text, and 16px for labels/secondary text. Preserve the original layout and do not carry over the rejected Fibel sizing. Normal and italic Source Sans files remain available, but login currently loads only the normal file because it has no italic text. Scholar Block, Fibel Nord, Fibel Sued and Eskool were removed from `src/fonts/` at the owner's request; Halvarson had already been removed. Unselected comparison fonts remain only in the ignored preview folder, not in the app's font assets.

## 8. Target prototype interaction rules and state

The prototype must be clickable and stateful, not a static slideshow. Several local interactions already use React state and seeded data; the shared lifecycle below remains to be built:

- **Submission lifecycle:** `draft` → `submitted` → `ocr_pending` → `ocr_verified` → `ai_graded` → `awaiting_teacher_approval` → `published` (states can be simplified visually, but preserve verification/approval gates).
- File-upload UI accepts at least sample image and PDF inputs; a mock exam may be provided for demos. Real OCR is **not** performed.
- Teacher changes to extracted text must be reflected in the current submission state.
- AI grading is a short deterministic simulation (optional simulated loading state); no fake claim of calling an AI service.
- Suggested score and feedback remain editable before publishing.
- Red flags have explicit review status: `pending`, `confirmed`, or `dismissed`.
- Publishing a grade updates the student's results and notifications in the same demo session.
- Search, filtering, tabs, navigation, back buttons, selection controls and messaging should work with real mock state rather than nonfunctional decoration.
- Display useful empty states, success feedback and validation for missing uploads or incomplete teacher review.
- Local storage already persists demo login and parent child selection. Persistence of assessment workflows is a future implementation decision. Do not imply cloud synchronization.

### Required demo-data additions

Existing fixtures are in `src/data/`. Teacher data contains classes, analysis, notifications, six papers, and answer/AI details for papers 1 and 2. Student data includes profile, notifications, announcements, pending assessments, progress, subject history, teacher feedback, and Math/English workspace assessments. Parent data contains two child profiles and portal fixtures. Extend these with synthetic names and invented scores, reconciling cross-role identities, grades, and results. Include at least:

- **Grade 4 Mathematics** sample: mock OCR output, suggested **72%**, weakness **Fractions**, recurring mistake **incorrect comparison of fractions**, proposed support flag, and suggested practice **comparing fractions with different denominators** (adapted from the supplied PDF's example).
- One **English-language** worksheet and one **German-language** worksheet to demonstrate language support.
- At least two assessment dates/points for a meaningful progress trend.
- One item awaiting teacher confirmation and one already published.

Data must remain demonstrative; avoid including private real student records. Use a supportive label like **Needs extra practice** or **Teacher support recommended**, while maintaining the project's required red-flag concept internally.

## 9. Current frontend architecture

**Implemented stack:** JavaScript/JSX with React, Vite, React Router, and Tailwind CSS v4. There is no TypeScript setup, CSS Modules setup, backend, charting library, or external component library. Versions below are the ranges declared in `package.json`, not a claim about latest releases:

| Package | Declared version |
|---|---|
| `react`, `react-dom` | `^19.3.1` |
| `react-router-dom` | `^7.18.5` |
| `vite` | `^8.3.5` |
| `@vitejs/plugin-react` | `^6.1.2` |
| `tailwindcss`, `@tailwindcss/vite` | `^4.3.4` |
| `eslint` | `^10.13.0` |

`vite.config.js` enables the React and Tailwind Vite plugins. Role CSS files use Tailwind utilities and `@apply` with `@reference "../index.css"`. ESLint uses the recommended JS, React Hooks, and React Refresh flat configurations and ignores `dist`.

```text
index.html            App title, favicon, root element
src/
  main.jsx            StrictMode, BrowserRouter, global CSS, React root
  App.jsx             Route definitions
  index.css           Tailwind import and four palette tokens
  components/
    Header.jsx        Role navigation, notifications, profile and portal links
    TeacherLayout.jsx Teacher demo-login guard, header, nested route outlet
    HeroCarousel.jsx  Teacher illustrated navigation carousel
    AnalyticsCarousel.jsx  Searchable teacher class analytics
    RadarChart.jsx    Reusable hand-built SVG chart
    ParentChildBar.jsx Parent child switcher and breadcrumbs
    ConfirmModal.jsx  Shared confirmation UI
    Toast.jsx         Shared transient feedback
    StudentIcons.jsx  Inline SVG icon components
  pages/
    Login.jsx
    teacher/          TeacherHome, TeacherPapers
    student/          StudentHome, StudentGrades, StudentTeachers,
                      StudentAnnouncements, StudentSolvingWorkspace
    parent/           ParentHome, ParentGrades, ParentTeachers,
                      ParentChat, ParentBehavior, ParentEmergency
  data/               users.js, teacherData.js, studentData.js, parentData.js
  styles/             header.css, login.css, teacher.css, student.css, parent.css
  assets/             Local PNG illustrations and starter SVG assets
  fonts/              Bree Serif and Source Sans 3, licenses and usage notes (applied to login only)
public/               favicon.svg, icons.svg
```

Work within this structure unless a specific change justifies refactoring. A shared assessment-state layer is needed to connect the core workflow, but its implementation has not been chosen. Prefer small reusable components; avoid introducing server endpoints, production accounts, payments, real messaging, third-party AI APIs, or databases unless explicitly requested.

## 10. Feature priorities

These tiers describe the target scope, not completion status. Keep the existing parent/student screens while prioritizing the missing shared assessment flow, teacher detail routes, age-appropriate fixture consistency, and working navigation. Section 0 records the current implementation.

### P0 — Mandatory to convincingly fulfill the project PDF

- Teacher and student dashboards/navigation.
- Student upload/submission.
- Teacher OCR review and correction.
- Simulated AI grading followed by teacher edit/approval.
- Learning gaps, recurring mistakes, red flag review and personalized feedback.
- Publish gating + student result viewing.
- In-app teacher notification and student progress history.
- Interactive flow connecting the full process.
- Visible implementation of the unique feature once agreed.

### P1 — Preserve important wireframe concepts

- Teacher classes, roster, analysis charts.
- Teacher papers filters and assessment list.
- Notification Portal with class/student messaging.
- Teacher schedule and assignment listing.
- Feedback carousel, if helpful for browsing assessments.

### P2 — Optional enhancements

- Parent portal and parent notifications/messaging.
- Practice recommendation cards and child-friendly explanations.
- Demonstration of German-language exam content.
- More sophisticated graph interactions, search and filtering.

**Note:** English and German assessment support is mentioned in the PDF and should not be silently omitted even if one example is prioritized. Priority tiers are implementation sequencing only, not permission to ignore course requirements.

## 11. Definition of done for the frontend prototype

A reviewer should be able to, without backend services:

1. Open the app and distinguish teacher/student roles.
2. Upload or submit a sample assessment from the student side.
3. Switch to teacher, locate that submission and verify/edit extracted text.
4. Trigger a clearly simulated AI result; inspect score, mistakes, learning gaps and proposed support flag.
5. Change the grade or feedback; confirm or dismiss the flag; publish.
6. Switch to student and see the published grade and teacher feedback, plus a relevant notification.
7. View progress across multiple assessments.
8. Access supporting wireframe features (classes, papers, schedule, announcements) in functional form.
9. Navigate the experience at desktop and narrow-screen widths.
10. Understand what the project's unique differentiator is from the UI itself.

For submission, repository README should document installation, run commands, mock features, example demo flow and non-implemented backend services. The course also requires a 2–4 minute walkthrough and AI-tool chat/prompt history if AI was used.

## 12. Explicitly out of scope unless requested

- Real OCR, LLM inference, autonomous grading or live AI calls.
- Server database, production authentication, account creation or school administration.
- Real email, push notifications or live chat delivery.
- Production security, real pupil data, or full school deployment.
- Full translation of the entire UI unless confirmed.
- A separate complete backend or mobile application.

## 13. Established implementation choices and open decisions

### Established by the repository

- Continue the existing Vite + React **JavaScript/JSX** project with React Router and **Tailwind v4**; stack selection is no longer pending.
- **Zinger School** is the implemented brand, with the supplied forest/sage/sand/cream palette.
- All three portals exist, including the parent portal; parent inclusion is no longer an unimplemented option.
- Demo entry uses fixture email/password login and local storage. Header portal links also exist, with the teacher-role limitation documented above. No real authentication or backend is present.
- The interface and current assessment fixtures are in English.

### Still to clarify or implement

**Teacher dashboard redesign — deferred:** On 6 November 2026, the owner rejected all three dashboard concept previews and chose to revisit the design later. No concept is selected or approved for implementation. Keep the existing teacher dashboard unchanged; its current system-font styling has not yet been migrated to the agreed fonts. The rejected concepts do not change the Bree Serif + Source Sans 3 font decision above.

1. **Research gap / distinguishing feature:** Confirm the specific research claim and how per-question timing, hard-question marks, or another agreed feature will support teacher decisions. Existing student controls alone do not establish a complete differentiator.
2. **Source documents and fidelity:** The PDF, wireframes, and palette images are absent from this checkout. Recheck their exact requirements when available; preserve the inherited requirements and current visual system in the meantime.
3. **Language coverage:** Add a German assessment example to satisfy the inherited bilingual-content requirement; full UI translation remains unconfirmed and outside the current implementation.
4. **Shared workflow state:** Choose how submissions, OCR edits, grading, flag decisions, publication, and notifications are shared across roles, and whether that state should survive refresh.
5. **Fixture alignment:** Reconcile Grade 5 student data, Grade 11 header copy, and Grade 11/8 parent fixtures with Grades 1–5 and consistent cross-portal student/teacher identities.
6. **Delivery scope:** Complete the teacher/student assessment cycle before expanding secondary parent features; confirm any changes to the inherited course deadline and non-code deliverables with the owner/original PDF.

Keep unresolved product decisions labeled as such. Repository observations are implementation facts, not proof of course compliance or additional owner approval.

---

**Implementation instruction to future coding assistants:** Read this context and inspect the relevant existing files before changing the app. Extend the current architecture, preserve the palette and functional screens, and prioritize the shared teacher/student assessment cycle. Treat inherited PDF requirements separately from verified implementation; never describe fixture labels as working teacher oversight or publication gating. Update this context as behavior changes, and validate against the original course materials when available.
