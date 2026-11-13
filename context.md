# Zinger School — React Frontend Prototype Context

> **Status:** Working project context, version 0.9 (9 November 2026), with student dashboard increments 1–5, Grade 5 content alignment, the quiz/exam workspace design-language update, and the approved teacher-dashboard refinement. Other implementation observations retain their original review date unless noted.
> **Purpose:** Shared source of context for the existing implementation, remaining requirements, and future frontend work.  
> **Important:** This is a prototype, **not** a working AI grading system. Real OCR, AI grading, authentication, notifications, and backend APIs are not required.

## 0. Current implementation at a glance

This repository already contains an interactive **Zinger School** frontend with student, parent, and teacher portals. It is no longer an empty project awaiting stack selection. Requirements and intended journeys below describe the target; they do not imply that the complete assessment cycle currently works.

### Implemented screens and behavior

| Area | Current behavior | Limits |
|---|---|---|
| Login and header | Fixture credentials, local-storage demo user, role-specific navigation, profile menu, portal links, notification dropdown, mobile menu | No real authentication. Only teacher routes have a role guard. Switching portal links does not change the stored user, so entering teacher routes requires a teacher login. Parent header notifications are empty. |
| Teacher dashboard | Shared student-style illustrated navigation carousel, oldest-first pending-paper list with direct review links, then stable searchable class analytics on a green chalkboard surface with exact topic percentages and radar chart | Class and paper records are demo fixtures. Paper-page review changes do not update the dashboard/Papers list or student results. |
| Teacher papers | Submission list with grade/class/paper/status filters and search; rows open the existing local OCR/grading review screen | Detailed answer fixtures exist for papers 1 and 2; other papers use fallback answers. Review/upload state stays on the paper page; no shared submission/publication workflow. |
| Teacher paper review | Fixed demo paper beside editable extracted answers, labeled Name/Class/Assignment metadata, confirmation before simulated grading, and local grade/feedback review | HTML demo paper, not an uploaded scan. Mark schemes record a filename only. Saving and supervisor requests remain page-local simulations. |
| Teacher schedule | Weekly timetable with class dropdown, continuous break row, searchable activity list with type dropdown and hide-completed control; local create/edit/complete/delete/undo and period-detail dialogs | Fixture timetable; activity changes last only on this page and are not delivered or synchronized across portals. |
| Student dashboard | Image-card carousel, deadline-ordered “Your schoolwork” list with full dates and specific actions, homework upload modal, progress and topic support cards; updates accessed through the header bell | Upload records only a filename in page state; a separate sample-homework action is available. No file transfer, scan preview, OCR, or shared teacher submission is created. |
| Student grades | Direct Science/Math/English rows, linked subject history, accessible report-card dialog, report-only browser printing | Grades/GPA remain demo fixtures with no actual publication gate. PDF download is disabled with an explanation. |
| Student teachers | Linked teacher directory, assessment feedback selector, question clarification/review drafts, prefilled practice requests, local chat with labeled simulated replies | Messages remain page-local and are not delivered to a teacher. Feedback is demo data with no publication gate. |
| Student announcements | Readable itemized feed with always-visible messages, sender initials, important-only filter and result count, newest-first localized dates, and empty-state recovery; includes locally stored teacher-created announcements | Fixture/local-storage prototype; no backend delivery or verification service. |
| Student solving workspace | Restyled Math quiz and English exam with navbar-aligned width, accessible multiple-choice answers, question navigation, time per question, hard-question marking, calculator, scratchpad, hints, keyboard-accessible submission confirmation, and answer/timing summary | Answers, timings, notes, and difficulty marks stay in page state; submitting does not create a teacher-review item or calculate/publish a grade. Confirmation and completion explain the demo boundary. |
| Parent portal | Child switcher, dashboard, grades/history/exams, report card and printing, exam review tickets, teacher meeting booking/cancellation, chat, behavioral notes/home updates, emergency report flow | These are fixture-backed views and local simulations. They do not deliver messages, book real meetings, dispatch alerts, or update teacher/student data. |

The login screen implements the approved **Refined split** concept: original book illustration and wordmark on white at the left, an open form on cream at the right, and a pale sage page background. It uses **Bree Serif 400** for the school name and **Source Sans 3** for the rest of the login UI. The illustration, panel split, 400px form width, colors and interaction handlers are preserved; the illustration and form stack below 900px. The secondary **Use student demo** button fills Ahmed's credentials and clears a previous login error; **Sign in** still performs the fixture login. Labels, autocomplete hints, visible keyboard focus, and announced login errors are included. Forgot-password and account-creation links remain prototype placeholders; no recovery or registration workflow exists.

### Student Announcements refinement — 13 November 2026

The owner approved a redesign based on the current Grades/Teachers pages and `desgin langauge.md`, removing the redundant Back to dashboard action and centered legacy banner. The page now uses the cream canvas, left-aligned introduction, 1248px outer container, Source Sans 3, and a white panel with a labeled 48px filter and live result count. Following visual feedback, announcements are distinct bordered items with lightly tinted headers, forest sender-initial markers, title/category/author/date context, and full message bodies. Every message is visible by default. Items are ordinary articles, with no click behavior, chevrons, or disclosure controls.

The important filter, English/German content, and existing local teacher posts remain. Importance has an explicit text label; the unimplemented Verified Broadcast claim is removed. `announcementDate.js` normalizes English fixture, German fixture, and teacher-post calendar dates for newest-first sorting and localized full-date display, with an honest fallback for invalid dates. Empty filters offer Show all announcements and restore focus to the filter. Styles remain local below the shared header.

Validation: production build, targeted ESLint, date-normalization assertions, and diff checks passed. A focused probe run through the taste skill's headless checker passed 28 checks at each of 1440, 1024, 768, and 390px, including default-visible noninteractive items, sender initials, typography, filter/count behavior, both languages, teacher-post inclusion, ordering, invalid dates, long text, empty results, reset, and focus restoration. The announcement main content fits those widths. The shared header still causes page overflow at 390px, and the floating IT Support control can overlap text while scrolling; these shared controls were not redesigned here. The broader taste checker also flags marketing-template expectations (full-screen hero, photos, CTA, `.wrap`, screen-height sections) that do not apply to this school notice list; this is not a whole-page checker pass. The layout screenshot checker stops on its missing `.wrap` assumption; standalone taste screenshots are used for visual inspection instead. Full-project lint and physical-device testing were not repeated.

Usability review: filter/count and text priority expose status (1); familiar school wording and localized dates support recognition (2, 6); reset restores the full list and focus (3, 9); the approved page typography, controls, and colors provide consistency (4); date validation avoids misleading output, and this read-only list has no destructive operation needing confirmation (5); the important filter supports quick scanning (7); the redundant dashboard action and verification claim are removed (8); empty states explain recovery, with the existing shared help entry point retained (10). Remaining shared-control issues are documented above.

Sender initials omit common titles (Mrs., Mr., Ms., Miss, Dr., Prof.); Mrs. Radwa displays as R, while the author byline retains her full name. Targeted ESLint passed for this follow-up; browser checks were not repeated.

### Student dashboard practice-panel sizing — 13 November 2026

The owner chose a content-sized Topics to practice panel instead of adding filler topics or praise. On the two-column dashboard, the practice card ends after its content and can grow only as far as the adjacent Your progress panel's bottom edge. Additional content then scrolls inside the topic list, while the heading remains visible. A size-contained grid wrapper lets the progress panel determine the row height without JavaScript measurements. At the existing 1099px stacking breakpoint, the height cap is removed and the practice panel follows normal document flow. The topic list is named and keyboard-focusable; padding preserves focus outlines around its actions. Existing practice widgets, help actions, two-topic selection, and translations remain.

Validation: production build, targeted StudentHome ESLint, and diff checks passed. Focused headless probes passed 45 assertions across 1440, 1280, and 1024px, checking natural height, equal top edges, overflow capped at the neighboring panel bottom, internal scrolling, stable heading/progress height, access to later actions, keyboard focus, shrinking after content removal, practice open/close, German content, and uncapped stacked behavior. The desktop screenshot was visually inspected. The broader taste audit still reports existing dashboard findings and marketing-template mismatches; it is not a whole-app pass. Full-project tests and phone-device checks were not repeated for this change.

### Teacher dashboard refinement — 9 November 2026

The owner approved the proposed refinement with “Proceed” after reviewing the plan. **Preserve the green chalkboard color as a defining teacher-view surface.** The dashboard now follows the shared 1248px outer container/24px gutters, Source Sans 3, cream canvas, restrained borders, 14px panels, and 48px actions. The shared navbar is unchanged. `TeacherLayout` applies the wider container only to the dashboard index route; other teacher pages retain their existing width and styling.

`TeacherQuickLinks.jsx` replaces the rotating hero with three compact, always-visible links using the existing Classes/Papers/Schedule artwork. `TeacherClassAnalytics.jsx` replaces the timed analytics carousel with manual, pressed-state class buttons above the results, a labeled class/topic search, announced result/selection feedback, and a keyboard-accessible Clear search action that restores search focus. Excluded classes remain visible with disabled dashed controls. Clearing search restores the previously chosen class when possible. The forest board retains Average/Highest/Lowest and strengths, renames “Weaknesses” to “Topics needing practice,” expands “Word Probs” to “Word problems” locally, and links to the selected class's existing details. Its cream chart inset keeps the radar with larger scoped labels and a readable definition list of all exact topic values; the decorative radar is hidden from assistive technology in favor of those values. The shared `RadarChart` and fixture values are unchanged. Missing classes, analysis, topic scores, or summary values have explicit states; missing scores are not turned into zero. “Demo data” identifies the fixture summaries.

The white “Papers awaiting review” section derives its count and records from the same `papers` array as Papers, sorts pending submissions oldest first, shows full submission dates and school-local times, and links each named student/paper/class directly to the existing OCR review route. Dates are parsed explicitly from the current day-month-year fixtures, with calendar/clock validation and original-text fallback. The empty queue and welcome count stay consistent. Inline help tells the teacher to check extracted answers before grading and explains that demo review changes do not update this list. No backend, shared workflow, new statuses, fixture changes, dependencies, or other portal redesign was added.

Styles are scoped to `.teacher-dashboard` in `src/styles/teacher-dashboard.css`; obsolete hero/analytics rules were removed from `teacher.css` after their only callers were replaced. Nielsen's ten heuristics guide the visible status, familiar labels, manual control/reset, design consistency, explicit review actions, visible choices, direct shortcuts, restrained hierarchy, recoverable empty states, and contextual review help. Native links/buttons, contrasting keyboard focus, reduced-motion handling, meaningful headings, and text equivalents support access; these changes are not a whole-app usability/accessibility certification.

Validation: production build, targeted ESLint for all four changed JSX files, and diff checks passed. A temporary local headless Chrome script passed **54 targeted checks: 47 browser checks and seven date-parsing checks**. Checks cover fonts/palette/surfaces, headings, loaded artwork, class selection without timed advancement, search normalization/results/reset/focus, exact metrics/topic values, contrast of main text/metadata, 48px action heights, pending counts/order/full dates, all shortcut/class/paper destinations, empty/missing-data states, long content, reduced motion, unchanged navbar geometry, and no runtime exceptions. Header/content alignment and no whole-page horizontal overflow passed at 1440/1280/1024/820/768/390px; dashboard content also fits 320px, with the inherited shared-header limitation outside scope. Desktop 1440px/1280px, 390px, and no-results screenshots were visually inspected. The taste layout checker reports `no .wrap` for this React dashboard and cannot complete its marketing-template checks; this is a documented mismatch, not a full checker pass. Full-project lint, physical-device testing, and a full accessibility audit were not repeated.

### Dashboard consistency follow-up — 9 November 2026

The owner clarified that **already approved designs should be reused wherever the page's purpose fits**, specifically requesting the teacher's illustrated navigation match the student dashboard. This supersedes the compact shortcut tiles from the first teacher refinement. The owner also moved **Papers awaiting review above Class analytics**. The current teacher section order is welcome → navigation carousel → review list → green analytics board. Keep the chalkboard green and the existing review/analytics behavior.

`DashboardCarousel.jsx` and `dashboard-carousel.css` now share the approved student layout and interaction between both dashboards: larger center card, smaller neighbors, uncropped local artwork over a blurred backdrop, forest title overlays, manual arrows/indicators, neighbor-selection followed by active-card opening, ArrowLeft/ArrowRight/Home/End, slide announcements, pointer swipe handling/click suppression, and reduced motion. There is no automatic rotation. `TeacherQuickLinks` supplies Papers centrally, Classes left, Schedule right, and the pending-paper count. Student navigation keeps Schoolwork central, Teachers left, Grades right, the live pending-task count, the Schoolwork scroll/focus action, and existing teacher/grade destinations. Student upload/replacement handlers and all other student content are retained. Carousel CSS was moved out of `student-dashboard.css`; the earlier teacher tile styles were removed. Both dashboards now consume one implementation instead of separate lookalikes. No dependencies, routes, shared-header changes, or fixture changes were added.

The consistency rule and shared carousel reference are also recorded in `desgin langauge.md`. Before designing a new treatment, inspect an approved screen with the same purpose; reuse its relevant component, composition, controls, type, spacing, and surfaces while retaining role-specific content and intentional choices such as the green teacher board. This does not require every page to use a carousel or the same layout.

Validation: production build, targeted ESLint for `DashboardCarousel`, `TeacherQuickLinks`, `TeacherHome`, and `StudentHome`, and diff checks passed. A temporary local headless Chrome script passed **51 targeted checks (44 browser checks and seven date checks)**. Browser checks cover matching computed carousel rectangles/fonts/radii/shadows between roles, initial card order/counts, teacher DOM/visual section order, image loading/containment, all six role-specific destinations and student Schoolwork scroll/focus, manual arrows/indicators/keyboard announcements/focus, compact 44px targets and 48px main actions, retained student sample upload/replacement availability and synchronized counts, teacher analytics selection/search/reset, horizontal swipe click suppression/vertical gestures/pointer cancellation, reduced motion, unchanged navbar geometry, and no runtime exceptions. Both dashboards fit 1440/1280/1024/768/390px; teacher screenshots at 1440/1280/390px and student screenshots at 1440/390px were captured. Desktop teacher/student screenshots were visually inspected. Touch checks use synthetic events, not physical devices. Earlier taste-checker marketing-template limitations still apply; full-project lint, physical-device tests, and a complete accessibility audit were not repeated.

### Teacher papers refinement — 9 November 2026

The owner requested a readable, uncluttered submissions page with no emojis while preserving the original green chalkboard direction. `TeacherPapers.jsx` now uses scoped `teacher-papers.css`, Source Sans 3, the approved type sizes, 1248px outer container/24px gutters, the original `#183126` board, restrained dividers, cream fields, and 48px review links. Plain counts and status words replace the icon heading, avatars, chips, and class/status badges. Search and all four filters remain available with visible labels; search now trims surrounding whitespace. An announced result count, disabled-when-clear reset, search focus restoration, and recoverable no-results/empty-list copy make the state clear. Full dates and school-local times use semantic `time` elements through the dashboard's existing date parser, extracted to `src/utils/submissionDate.js` for both callers. Review links retain all existing paper-detail routes and add student/paper context for assistive technology. The fixture data and grading workflow are unchanged.

The owner clarified that Papers is a top-level navigation destination, so it **does not need a Back to dashboard link**. The initially added link was removed; use the main navbar here and reserve the approved student back-link pattern for nested detail pages. `TeacherLayout` applies the same outer container to the dashboard and Papers index; other teacher pages and the shared navbar retain their existing treatment. Legacy paper styles remain because class and grading screens still use them. Narrow layouts stack filter fields and keep the table in a labeled, keyboard-focusable horizontal scroll area.

Validation: production build, targeted ESLint, and diff checks passed. A temporary local headless Chrome script passed **34 browser checks**, covering typography/palette, no emojis/decorative badges, derived counts, labeled 48px controls, full dates, all review URLs, case/whitespace/class search, individual and combined filters, empty results/reset/focus, keyboard review navigation, long text, reduced motion, unchanged navbar geometry, the existing dashboard queue, retained student detail back links, no runtime exceptions, and no whole-page overflow at 1440/1280/1024/820/768/390px. Desktop, phone, and no-results screenshots were visually inspected. Twelve date assertions cover midnight/noon, year ordering, invalid/missing inputs, and display labels. Physical devices, full-project lint, and a complete accessibility audit were not checked.

The taste layout checker could not complete against this React screen: it lacks the marketing template's `.wrap`/section structure and the checker exits with `r.sections is not iterable`. This is an incompatible checker, not a passing result; the 34 app-specific browser checks and inspected screenshots provide the rendering evidence.

Nielsen review: visible status is covered by live results and explicit status words; familiar language by labeled filters and full dates; user control by reset; consistency by approved type, edges, and navigation; error prevention by navigation-only row actions and a disabled unnecessary reset; recognition by visible labels; efficiency by filters/direct review links; minimalism by removed decoration; recovery by empty-result guidance; contextual help by extraction guidance and the demo note. The existing limitation remains: review changes do not update this fixture list or publish results across portals. Cancel/save/confirmation states are outside this read-only list's task.

### Teacher paper-review workspace — 9 November 2026

The owner approved the imagegen preview and requested explicit **Name: Mohamed Ehab / Class: 5A / Assignment: HW1** labels. `TeacherGrading.jsx` and scoped `teacher-grading.css` implement the green workspace with a nested-view “Back to papers” link, “Paper review” heading, compact wrapping Name/Class/Assignment definition list, and full submission date. The metadata also appears on the demo worksheet, adapting to each selected record. `TeacherLayout` extends the approved 1248px outer shell to paper-detail routes without changing the navbar or other teacher layouts.

The original `#183126` board holds an accessible HTML demo worksheet beside labeled, directly editable answer fields. It is labeled “Demo paper,” not presented as a real uploaded scan. Original student math mistakes stay fixed when extractions are edited. Omar's existing extracted `46` has one additive `scanText: "48"` source value for a meaningful correction example; other fixture answers/scores are retained. Blank/whitespace answers cannot advance, and empty extractions have recovery guidance and disabled grading. “Confirm answers and grade” explicitly confirms extraction before the existing timed simulation. Mark-scheme attachment/replacement announces its filename-only limitation. Loading/results receive keyboard focus; smaller screens stack the columns.

Existing grade/feedback overrides, question details, flag dismissal, supervisor action, and save confirmation remain available with readable styling. Gap labels have separators and fallback feedback has useful copy. Misleading student-publication and message-delivery claims are replaced with accurate demo wording. A page-local native dialog replaces this page's shared emoji confirmation, with safe Cancel focus, background isolation, Escape cancellation, and focus restoration. Other modal consumers are unchanged. Live status notices have a dismiss action. Save remains local and resets on leaving; no shared submission store, actual OCR/scan upload, mark-scheme parsing, publication, or supervisor delivery was added. Support flags still lack a complete confirmation/publication lifecycle.

Validation: build, targeted ESLint for `TeacherGrading`, `TeacherLayout`, and `teacherData`, and diff checks passed. A temporary local headless Chrome script passed **49 checks** for metadata on page/paper, palette/fonts/edges, two columns, original-answer preservation, labels/48px controls, blank/whitespace validation, keyboard focus, filename-only attachment, confirmation/loading, corrected-answer grading, retained overrides/question review/flag dismissal, gap punctuation, honest save/supervisor status, native-dialog cancellation/focus/background isolation, changing identities/quiz/fallback records, missing/empty extraction states, long content, reduced motion, unchanged navbar/list data, and no runtime exceptions. No page overflow at 1440/1280/1024/820/768/390px; columns stack below 900px. Desktop/results/phone screenshots were visually inspected. The taste checker's known React/marketing-template `.wrap` mismatch remains; physical devices, full-project lint, and a complete accessibility audit were not repeated.

Nielsen review: confirmation/loading/notices provide visible status; metadata/full dates use familiar terms; Back/editing/Cancel/dismissal preserve control; approved type/edges/preview provide consistency; nonblank validation and confirmation prevent errors; visible source/question labels support recognition; direct editing and review controls provide efficiency; one workspace removes decoration; missing/empty states and native validation provide recovery; comparison instructions and demo boundaries provide contextual help. Cross-portal publication and complete flag adjudication remain workflow gaps.

### Grading presentation and full editing follow-up — 9 November 2026

The owner explicitly requested that the grading experience read as the product workflow, without demo/simulation explanations in the teacher-facing screens, and that the entire report be editable. This supersedes the earlier visible demo wording above. Verification now shows “Page 1 of 1,” attachment feedback shows the selected filename, loading says “Grading paper,” and results use “Send to supervisor” / “Save review” with ordinary confirmation/status messages. The Papers list's implementation-limit footer is removed. **The technical boundaries remain unchanged:** grading is deterministic with a timed delay, the paper is fixture-backed HTML, attachment only records a filename, and save/request state stays in the current page. No AI service, backend storage, actual supervisor delivery, student publication, or new cross-portal workflow was added. Keep these limits in project documentation rather than restoring the removed in-flow explanations.

The results page replaces its edit-mode toggle with directly labeled controls for score, learning gaps, feedback, red flags, and repeated mistakes. Multiline fields support replacing, adding, and clearing findings; an explicitly cleared field stays empty. Flag status supports Needs review / Confirmed / Dismissed, with an empty/disabled state when no flag exists. The percentage chart updates live; fractional scores are allowed and blank, negative, and above-total scores cannot be saved or submitted. “View question details” exposes editable question text, student answers, and answer-key values for every question. Answer/key corrections recalculate suggestions while an explicit teacher score override retains priority. Incomplete question details cannot bypass validation by hiding the section. Editing after saving enables Save again and resets stale supervisor/success state. Native confirmation and cancellation preserve entered values.

Validation: build, targeted ESLint for `TeacherGrading` and `TeacherPapers`, and diff checks passed. A temporary headless Chrome script passed **41 checks** for normal copy across verification/loading/results/dialog/list, all five editable report fields, live fractional percentage, multiline replacements and empty values, flag states, score validation, save/cancel/focus, submission state, editing after save, editable question details and hidden-field validation, automatic versus overridden scores, independent paper records, all-correct empty sections, keyboard focus, reduced motion, long content, and no runtime exceptions. Report layout fits 1440/1280/1024/820/768/390px; phone question details also fit. Desktop and phone screenshots were visually inspected. Backend functionality, durable review storage, full-project lint, physical devices, and a full accessibility audit were not added or checked. The known taste-checker template mismatch remains.

### Graded question details before the overall review — 9 November 2026

The owner's final clarification is **after grading, before “Review suggested grades”**. An earlier implementation put the disclosure in extraction, which misunderstood the requested ordering and has been removed. Extraction only checks the AI's extracted text against the submitted paper. After grading completes, “View question details” appears above the overall-review heading; opening it displays each fixed question, the confirmed student answer, expected answer, suggested question grade, and question-specific comment. Student answers, questions, and answer-key values remain read-only. `updateAnswer` guards against changes outside extraction verification.

Teachers can edit each question's grade and comment before reviewing the overall report. Each current fixture question carries one mark; fractional marks are supported. Question marks recalculate the overall total and chart, clearing a prior total override so the latest question edits are reflected. The teacher may then override the total again. Suggested learning gaps/mistakes/flags follow the questions receiving less than full credit. Edited question comments feed suggested feedback while an explicit overall-feedback override stays under teacher control. Empty/out-of-range question marks prevent saving or supervisor submission, including when their disclosure is collapsed; the section reopens and focuses the invalid mark. Overall score, learning gaps, feedback, red-flag note/status, and repeated mistakes remain editable. Collapsing details preserves their edits. No durable storage, AI service, or cross-portal workflow was added.

Validation: build, targeted `TeacherGrading.jsx` ESLint, and diff checks passed. **28 headless browser checks** cover no details/key in extraction or loading; post-grading action and open panel both preceding the overall heading; keyboard disclosure; actual student answers and suggested marks/comments; no answer/key editing; partial-credit totals/chart; comment-derived feedback and explicit overrides; recalculation after mark edits; collapse preserving edits; save validation with visible/hidden invalid marks and focus recovery; supervisor validation; saved edits and subsequent changes; corrected-extraction results; normal product copy; and no runtime exceptions. Open details fit 1440/1280/1024/768/390px without overflow. Desktop and phone screenshots were visually inspected. Physical devices, full-project lint, and a complete accessibility audit were not repeated.

### Grading worksheet layout — 9 November 2026

The owner approved the post-grading worksheet direction, then requested exact alignment between the overall-report columns. `TeacherGrading.jsx` and scoped `teacher-grading.css` retain the original `#183126` chalkboard, cream fields, shared 1200px usable width, and question-details-before-overall-report sequence. Each question now uses a roughly 2:1 desktop grid: read-only question/answer comparison on the left, editable grade and compact two-line comment on the right. Cream question headings, shorter visible labels with question-specific accessible names, restrained dividers, 16px labels, and 18px reading text clarify the hierarchy. Existing disclosure behavior and grade/comment state are retained.

The overall report uses shared grid rows through CSS subgrid, rather than independently stacked columns: Feedback / Overall score, Learning gaps / Red flags, and Repeated mistakes / Flag status. Paired labels and field tops align; feedback/score and learning-gap/flag surfaces also share heights. The score label sits above its cream surface; the editable score and retained 96px percentage ring are grouped inside, with a text percentage available to assistive technology. The final row's select retains its normal 48px height. Report rows respond to content and textarea resizing. Supervisor and Save buttons align at the top of the footer, with request status beneath the supervisor action. Below 900px, both question and report columns stack; narrow screens use an 80px ring and full-width footer buttons. Focus is cream on the board and forest on the cream score surface, including explicit select focus styling.

All grading logic, extraction/attachment/loading behavior, question validation (including hidden invalid marks), live partial-credit totals, manual overrides, editable/clearable findings, flag decisions, supervisor state, save confirmation/cancel, edit-after-save, record isolation, fixtures, routes, and prototype storage/delivery boundaries remain unchanged. No new dependency, shared-header change, backend, or publication workflow was introduced.

Validation: production build, targeted `TeacherGrading.jsx` ESLint, and diff checks passed. A temporary headless Chrome script passed **77 checks**, including keyboard disclosure/dialog focus/Escape, grading calculations/overrides, all editable fields, empty findings, flag confirmation/dismissal, save/supervisor validation and reset, extraction correction, alternate/fallback/missing records, reduced motion, long text, actual text contrast of at least 4.5:1 for sampled essential report text, and no runtime exceptions. Shared shell/control containment passed at 1440/1280/1024/900/899/820/768/390/320px; exact paired-row alignment and matching surface heights passed at all four desktop widths. Whole-page overflow passed down to 390px; 320px checking is limited to the grading content because of the existing shared-navbar limitation. Desktop report/open-question and phone screenshots were visually reviewed. Physical devices, full-project lint, and a complete accessibility audit were not checked.

The taste layout checker was run on a captured rendering of the revised worksheet. It reported no horizontal overflow at 1440px/390px, but returned `no .wrap` at both widths because this app does not use its marketing-template structure. This is not a full checker pass; the app-specific browser checks establish the field alignment and containment.

Nielsen review: visible status uses the existing totals, percentage, request/saved states and notices; familiar language and consistent controls are retained; Back/disclosure/confirmation cancellation provide control; shared type/edges/rows provide consistency; existing score validation and confirmation prevent errors; read-only answers and visible labels support recognition; keyboard editing and the compact grid support efficiency; quiet dividers and grouped decisions reduce clutter; inline grade errors reopen/focus hidden invalid marks for recovery; existing extraction/review instructions provide contextual help. The broader shared publication and support-flag lifecycle gaps recorded above remain outside this visual change.

### Student dashboard foundation — 8 November 2026

Increment 1 of `docs/student-dashboard-redesign-plan.md` is implemented from the owner's approved image mockup. The dashboard has a stable “Hi Ahmed” welcome, a state-derived pending count, a 1200px content area aligned with the header, Source Sans 3 UI text, a Bree Serif 400 wordmark, and consistent spacing and restrained borders. The welcome, carousel, and schoolwork-header counts update together after a local homework upload. The single-column section order, radar chart, upload simulation, and existing destinations are retained; increments 5–6 remain pending apart from the content alignment completed in increment 4.

Increment 2 is implemented from the approved Design 3 revision: a large central image card and smaller visible neighbors, with the whole card clickable and no separate carousel action buttons. Existing teacher assets are reused temporarily: `class.png` for Teachers, `papers.png` for Schoolwork, and `schedule.png` for Grades; the owner will supply replacement artwork later. Images retain their full bounds over a matching blurred backdrop, with bottom forest title overlays. Initially Teachers is left, Schoolwork is central, and Grades is right. Clicking a neighbor centers it; clicking the central card opens Teachers/Grades or scrolls to and focuses the pending-assessments section. Manual arrows, indicators, arrow keys/Home/End, touch/pen swipe handlers, reduced-motion behavior, and live slide announcements are included. There is no automatic rotation. The teacher carousel itself is unchanged.

Increment 3 is complete under the owner's revised scope: remove dashboard announcements because updates belong in the header bell. The existing bell includes an announcement notification linking to the preserved `/student/announcements` feed. The two-column announcement mockup was not implemented; schoolwork remains full-width directly below the carousel, avoiding an empty sidebar. Practice placement remains increment 5 work.

Increment 4 implements the approved “Your schoolwork” mockup: subject/type labels, full deadline dates, duration or accepted file types, “Complete online” / “Upload your work,” specific task actions, light row dividers, and 48px buttons. The owner's follow-up replaces subject icons with Q (Quiz), HW (Homework), and E (Exam) markers and simplifies the header to “Your schoolwork” plus its pending count, removing the icon and subtitle. Full type labels remain in the rows. ISO dates sort chronologically without changing fixture order; empty and already-submitted fixtures have useful states. Upload feedback now shows the saved filename, and the welcome/carousel/list counts update together. The modal and success message accurately describe a filename-only demo, with an explicit sample-upload action when no file is chosen.

At the owner's request, increment 4 also aligns student-facing examples with Grades 1–5 using Grade 5 content: Math fractions/multiples, English reading/grammar, and a Science plant-life-cycles worksheet. Pending titles and durations match their online workspace fixtures; the English example has a short reading passage and grammar question. The shared student header now derives Grade 5/Class 5A from the profile. Related dashboard strengths, notifications, subject-history labels, and science/English teacher fixtures use primary-school topics. Parent fixtures were not changed. Increment 4 is ready for implementation review before increment 5.

The owner also requested “Replace upload” for uploaded homework. It opens the existing modal with the current filename, requires a new file, and replaces the filename in the same row while keeping Uploaded status and pending counts unchanged. Canceling keeps the original, even after selecting another file. This remains a filename-only page-state demo. Build, targeted dashboard ESLint, and 11 headless browser checks passed for keyboard access, disabled confirmation without a new file, cancel/confirm/repeat flows, preserved filenames/counts, action size, and no runtime exceptions. Phone checks remain deferred.

Styles live in `src/styles/student-dashboard.css` and are scoped to `.student-dashboard` to avoid changing the teacher, parent, or other student pages. Shared `@font-face` declarations moved from `src/styles/login.css` to `src/index.css`; this does not apply the font globally or change login layout. The owner deferred phone/responsive work; desktop is the current validation target.

Validation on 8 November: production build, targeted dashboard ESLint, and 14 headless desktop assertions passed (font loading, layout alignment/width, no horizontal overflow, carousel welcome stability, upload feedback/count updates, quiz navigation, and keyboard announcement navigation). Dashboard and login desktop screenshots were visually reviewed. The taste layout checker cannot complete its section checks without its expected `.wrap` structure, and its marketing-page consistency rules are not a dashboard conformance test. Full-project lint still fails on existing errors in unrelated pages and bundled skill files; phone checks were skipped at the owner's request.

Increment 2 validation on 8 November: production build, targeted JSX/data ESLint, and 19 headless desktop checks passed, including image layout/loading, whole-card destinations, neighbor selection, arrows/indicators, keyboard Schoolwork focus, synchronized upload counts, swipe click suppression, vertical gesture handling, reduced motion, 44px controls, no horizontal overflow at 1440px/1280px, quiz navigation, and no browser runtime exceptions. Swipe checks use synthetic pointer events, not a physical touch device. Desktop screenshots were visually reviewed. The taste layout checker again reports no overflow but cannot complete its `.wrap` section checks. Full-project lint was not rerun; phone validation remains deferred.

**Main missing connection:** student submission → teacher OCR correction → simulated grading → teacher edits/red-flag decisions → publication → updated student/parent results and notifications. This remains the primary implementation priority.

Increment 3 validation on 8 November: production build, targeted dashboard ESLint, and seven headless browser checks passed. Checks cover announcement removal, full-width schoolwork directly after the carousel, no overflow, keyboard bell access, the announcement entry opening the feed, schoolwork visible in the 1280×800 first screen, and no runtime exceptions. The laptop screenshot was visually reviewed. Phone checks and full-project lint were not repeated.

Increment 4 validation on 8 November: production build, targeted JSX/data/header ESLint, and 23 headless desktop browser checks passed. Checks include task ordering/full dates, labels/actions, readable text/dividers, primary-school content and header, retained carousel, aligned 48px actions, both assessment destinations, consistent titles/durations, cancel/sample/selected-file uploads and filenames/counts, keyboard Schoolwork focus, reduced motion, 1280px layout, long titles, dates across months/years, empty/submitted states, and no runtime exceptions. Screenshots at 1440px and 1280px were visually reviewed. Existing taste-checker `.wrap` limitations still apply. Full-project lint and phone checks were not repeated.

**Schoolwork label follow-up:** The owner removed the separate “Complete online” and “Upload your work” lines. Online subject/type labels now read “Math · Online Quiz” and “English · Online Exam”; homework keeps “Science · Homework” with no extra instruction. Existing task actions and upload behavior are preserved. This supersedes the earlier instruction-line wording in increment 4.

### Student dashboard increment 5 — 8 November 2026

The owner approved the final minimal progress/content revision through imagegen previews, retaining both the radar graph and score bars. “Your progress” and “Topics to practice” use aligned white cards, the existing forest/sage/sand/cream tokens, Source Sans 3, 14px corners, thin dividers, and 24px spacing. The shared `RadarChart` is unchanged. Both charts and the equal-weight average use one array: Math 92%, Science 95%, English 88%, History 85%, Geography 91%. The average is calculated as 90.2%, with a dynamic subject count, replacing the unrelated hard-coded A (92%). It is plain text, with no score pill. “Demo data” remains; there is no working approval/publication gate.

“Key takeaways” now contains “Excellent work on” (the owner's final correction), followed by full Math and Science comments with each subject above its comment and consistent spacing. Tinted strength panels, duplicate summary fields, and unsupported growth claims are removed. Practice shows English and History subject labels, the approved main-idea/timeline tips, and 48px secondary “Ask Help” buttons matching schoolwork. The owner removed “This term,” assessment names/types, and dates from this section. Help now uses the existing teacher-ID route to open Mr. Said or the new synthetic History teacher Ms. Mona with a relevant draft. Matching reading/timeline teacher-feedback fixtures were added; previous English paragraph feedback remains available. These remain demo fixtures, not a live assessment-derived recommendation system. No teacher component, route, dependency, or shared-component changes were needed. Missing scores hide the average and show an empty state; smaller widths stack, but phone validation remains deferred. Increment 5 is ready for desktop review; increment 6 remains pending apart from checks already completed.

Validation: production build, targeted `StudentHome.jsx`/`studentData.js` ESLint, `git diff --check`, and 24 headless desktop checks passed. Checks cover five values/labels, calculated average/count, Excellent work on and stacked comments, subject-only practice metadata and full tips, matching minimal surfaces/buttons/fonts/palette, 48px actions, 1440px/1280px alignment/no overflow, bar proportions, visible keyboard focus, both correct teacher routes/drafts/feedback, removal of misleading grade/growth claims, retained schoolwork/carousel/upload counts/replacement action/quiz destination, long-comment containment, recalculation on score changes, single-subject count, empty scores, and no runtime exceptions. Desktop screenshots were visually reviewed. Full-project lint and phone checks were not repeated; existing unrelated lint failures and taste-checker `.wrap` limitations remain. Earlier foundation notes describing increments 5–6 as pending are historical and superseded by this update.

**Progress-data boundary:** The dashboard now has a calculated equal-weight average and structured subject feedback/practice. History and Geography still have no Grades detail fixtures; those three subject pages retain their separate existing records. Broader data unification across pages/portals and real submission-backed recommendations remain separate work. A reporting period was proposed and then explicitly removed by the owner.

### Student quiz/exam workspace — 9 November 2026

The owner requested direct implementation of the project design language on the page opened by **Start quiz** and **Start exam**, explicitly matching the navbar width. Both existing routes use `StudentSolvingWorkspace.jsx`. The page now uses a scoped `.student-workspace` theme in `src/styles/student-workspace.css`: cream canvas, white 14px panels, quiet sand dividers, forest text/actions, Source Sans 3, and Bree Serif 400 for the wordmark. Main content and the local header share a 1248px outer container with 24px inline padding (1200px usable content), matching the student dashboard. The header is 80px tall on this page. The assessment title, instructions, subject/type, question count, duration, and teacher appear above the question panel; the active-question timer is shown once alongside the tools action.

Existing questions, hints, navigation, per-question timing, difficulty marking, calculator behavior, scratchpad state, and dashboard/teacher destinations are retained. Answers use native radio inputs with whole-row labels and keyboard arrow support; question buttons expose current/answered/hard state. Main actions reach 48px and question/calculator controls reach 44px. Tools, confirmation, notices, and completion share the page styling. A page-local native dialog provides a safe initial action, Tab/Shift+Tab focus containment, Escape/backdrop dismissal, and focus restoration without changing the shared `ConfirmModal`. Navigating questions focuses the new prompt; finishing focuses the summary. The completion list now includes selected answers and explicit unanswered states alongside timings and hard marks.

Misleading claims about secure recording or forwarding work to a teacher were replaced with accurate confirmation/completion copy. Submitting still only switches to a page-state summary; no persistence, grading, teacher delivery, or shared submission workflow was added. Scratchpad copy also explains its lifetime. All app changes are confined to the workspace component and its new stylesheet; no routes, fixture content, shared components, dependencies, or other portal styles were changed.

Validation: production build, targeted workspace ESLint, and `git diff --check` passed. A temporary headless Chrome script passed 45 checks covering dashboard entry to both assessments, matching header/content edges and no overflow at 1440/1280/1024/768/390/320px, font loading/type/palette/panels, action sizes, selection and keyboard radio navigation, answer/difficulty retention, question boundaries/focus, timing, tool state/calculator errors, dialog focus/cancel/Escape, unanswered warnings, completion content/stopped timers, existing destinations/fallback, reduced motion, long text, an unchanged Grades header, and no runtime exceptions. Desktop quiz/exam/tools/confirmation/summary and a 390px quiz screenshot were visually inspected. These are headless viewport checks, not physical-device or full accessibility certification. Full-project lint was not rerun; known unrelated errors remain. The taste layout checker still cannot evaluate the React page without its marketing-template `.wrap` structure and failed before completing section checks; the targeted app assertions provide the alignment/overflow verification.

**Tools placement follow-up — 9 November 2026:** The owner requested tools on the right, remaining visible during scrolling without changing the assessment/body size. The tools are now a fixed, nonmodal 300px panel below the navbar with stacked calculator/scratchpad, an internally scrolling body, and a sticky title/44px Close button. At viewport widths of 1896px and above, it sits in the right margin with a 24px gap from the unchanged 1200px assessment; smaller viewports use a right-side overlay without shifting, shrinking, or widening the page. The panel fits within the viewport, preserves calculator/notes on close/reopen, supports Escape while focus is inside, focuses Close when opened, and restores the toggle on dismissal. Submission still closes the tools. Build, targeted ESLint, and diff checks passed; the expanded temporary headless browser script passed 57 checks, including unchanged main/question rectangles and document height, right-margin placement at 1920px, fixed placement while scrolling, overlays at 1440/1280/390/320px, short-viewport internal scrolling with Close visible, focus/close/Escape, preserved tool state, and the previous assessment checks. Wide-desktop and 320px panel screenshots were visually inspected. Physical-device and full-project lint checks were not repeated.

### Shared navbar — 9 November 2026

The owner reviewed three imagegen concepts (Quiet underline, Soft tabs, Framed navigation) using the taste skill and selected **Quiet underline**, with **ZINGER** capitalized and the old “School Portal” subtitle removed. Only the current **Student Portal / Teacher Portal / Parent Portal** label remains beneath the wordmark. `Header.jsx` and `header.css` now provide the common cream/forest header, plain links with an active underline, a bell/account divider, readable dropdowns, and the approved Bree Serif 400 / Source Sans 3 fonts. The 80px header shares the 1248px outer container and 24px gutters with the dashboard and assessment content. The parent header retains all six destinations and can use a second navigation row on narrower desktops.

Dashboard and assessment themes now begin in a sibling below `Header`, with their explicit navbar overrides removed. This also keeps inherited font variables and broad focus/motion selectors out of the header. The shared header owns its styles across student pages and portals. Existing role detection, fixtures, routes, teacher guard, profile/portal links, sign out, notifications, and mobile menu are retained. Notification destinations now use native keyboard-accessible links; disclosures expose expanded state, support Escape dismissal with focus restoration, and preserve outside-click dismissal and mutually exclusive account/notification popovers. No authentication or delivery behavior changed. Mobile redesign and checks were explicitly deferred by the owner.

Validation: production build, targeted Header/dashboard/workspace ESLint, and diff checks passed. A temporary headless Chrome script passed 46 desktop checks covering identical header geometry on dashboard/quiz/exam/Grades/Teachers, uppercase brand and role label, active underline, account contents, keyboard/focus/Escape/outside-click dismissal, notification destination, portal switching, parent/teacher inventories and notifications, sign out, reduced motion, dashboard/workspace alignment at 1440/1280/1024px, answer retention, existing assessment entries, fixed tools below the navbar, no overflow, and no runtime exceptions. Dashboard and exam desktop screenshots were visually reviewed. The taste layout checker reports no horizontal overflow at these widths but cannot evaluate its expected `.wrap` structure; this remains an app/template mismatch, not a passing marketing-page conformance result. Full-project lint and phone checks were not repeated. This update supersedes historical descriptions of page-local navbar styling and unchanged legacy student headers. The imagegen prompts and final owner choice are recorded in `docs/navbar-redesign-prompts.md`.

### Student Grades redesign — 9 November 2026

The owner approved and requested implementation of the Grades redesign using the taste and ponytail skills. `StudentGrades.jsx` now uses a local `student-grades.css` theme below the unchanged shared header: a 1248px outer container with 24px gutters (1200px usable content), cream canvas, white 14px panels, quiet sand dividers, Source Sans 3, a left-aligned 40px title, readable metadata, and 48px main actions. The centered hero, subject carousel, selected-subject inset, nested report-card surface, and unsupported verification claims were removed.

The overview retains the Term 1 report and fixture GPA. Science, Math, and English each show their teacher, original score/letter, and a direct “View grades” link to the existing `/student/grades/:subjectId` route. Subject details retain the original assessment history and weight explanation, with a back link and a focused page title after navigation. Invalid subject IDs show a useful fallback; empty subjects/history/report records have explicit empty states. The history note identifies overall grades as provided examples rather than a calculation from the displayed records. No fixture values, shared routes, dependencies, other portals, or teacher publication workflow changed.

The report uses a page-local native dialog with an accessible name, initial Close focus, Tab/Shift+Tab containment, Escape/backdrop/Close dismissal, focus restoration, background scroll lock, and a keyboard-scrollable table. Both Print report actions use browser printing; the overview opens the report first. Print CSS shows the report only, without the navbar, overview, action controls, clipped table, or dialog elevation. PDF download is disabled with a visible explanation instead of showing a false download toast. Report copy accurately identifies example grades without implying teacher approval.

Validation: production build, targeted `StudentGrades.jsx` ESLint, and diff checks passed. A temporary headless Chrome script passed 41 assertions covering original values, typography/palette/panels, action sizes, 1440/1280/1024px shared alignment, all three subject destinations and focused headings, browser Back/direct URLs/invalid IDs, modal keyboard/focus/dismissal/scroll lock, report contents, both print entry points and print-only styles, reduced motion, long text, empty fixtures, 768/390px page overflow, narrow-table scrolling, 320px Grades-content/dialog containment, unchanged header geometry, and no runtime exceptions. Desktop overview/history/dialog/print and a 390px overview screenshot were visually inspected. A browser-generated PDF was also captured. These are headless checks, not physical-device, printer, or full accessibility certification.

The taste layout checker was attempted but failed on its expected marketing-template section structure (`r.sections is not iterable`); it is not a passing conformance result. The targeted browser assertions establish this page's alignment and overflow behavior instead. An existing shared-navbar overflow at 320px remains outside this scoped change; the Grades content itself fits. Full-project lint and physical-device checks were not repeated.

**Grades button consistency follow-up — 9 November 2026:** The owner reported that Grades buttons did not behave like the dashboard, with the View report label disappearing on hover. A more-specific generic hover rule was overriding the primary background and leaving cream text on cream. The primary hover selector now has matching specificity, uses the dashboard's 90% forest background, and retains cream text. Grades buttons also use the dashboard's 150ms easing, no hover lift, and existing 0.98 press scale. Disabled behavior, keyboard focus, reduced motion, and report/subject handlers are retained. Production build and 14 targeted headless Chrome assertions passed for matching dashboard default/hover colors and timing, visible primary labels, no lift, press feedback, dialog primary hover, secondary/link hover, report opening/subject navigation, disabled hover, focus, reduced motion, and no runtime exceptions. The hovered Grades screenshot was visually inspected; physical-device checks and full-project lint were not repeated.

### Student Teachers redesign — 9 November 2026

The owner requested immediate implementation of the student Teachers page using the same taste/ponytail direction as Grades. `StudentTeachers.jsx` now uses a local `student-teachers.css` theme below the unchanged shared header: the shared 1248px outer container/24px gutters, cream canvas, Source Sans 3, left-aligned 40px title, white 14px panels, thin sand dividers, 16–18px reading text, visible focus, and 48px main controls. The centered hero, nested teacher-card grid, ineffective directory arrows, and noninteractive clickable card containers were replaced by four teacher rows. Each row retains its name, subject and office, uses a quiet initial avatar, and links directly to its existing `/student/teachers/:teacherId` URL. Browser Back and a visible back link return to the directory; invalid IDs and empty directories have useful states.

Teacher detail places feedback and messaging in equal desktop columns and stacks them below 1000px. Feedback retains original scores, dates, question comments, hard-question markers, review requests and question-specific clarification. Mr. Said's two assessments use a labeled native selector; single-assessment teachers show their assessment directly. Question comments use readable text and dividers instead of nested cards, and each question has a specific accessible help action. Review/clarification actions fill and focus the message composer without sending. The generic help starter now uses the current teacher's subject, replacing the old fractions shortcut shown to every teacher; the office-hours starter remains a draft request.

Messaging uses a labeled multiline field, a named keyboard-scrollable polite log, explicit sender/time labels, disabled blank/whitespace Send, local confirmation status, and labeled simulated replies. The conversation note explains that messages are not delivered, replies are simulated, and state lasts only on this page. Existing fixture messages are retained; sent messages clear the draft and keep composer focus. Local conversation/feedback state is keyed by teacher/navigation so changing routes cannot retain another teacher's thread or draft. Pending reply timers are cleared when leaving the conversation. Both dashboard Ask Help destinations still open the correct teacher with the original topic draft focused. No fixture data, shared components, dependencies, other portal styling, actual delivery or publication workflow changed.

Validation: production build, targeted `StudentTeachers.jsx` ESLint, and diff checks passed. A temporary headless Chrome script passed 59 assertions covering all four teachers and original details, native keyboard links/focused titles, browser Back/direct URLs/invalid IDs, feedback selection/score/questions, exact review/clarification drafts, subject-specific starters, whitespace/trimmed sends/status/focus, labeled simulated replies, reply isolation after navigation, hard markers, both dashboard practice drafts, long titles/unbroken messages, reduced motion, empty feedback/messages/directory, alignment and no overflow at 1440/1280/1024/768/390px, content containment at 320px excluding the existing shared-navbar overflow, unchanged header geometry, and no runtime exceptions. Desktop directory/Math/English/conversation and 390px directory/detail screenshots were visually inspected. Full-project lint and physical-device checks were not repeated. The shared 320px navbar limitation remains outside this scoped change.

The taste layout checker also reported no horizontal overflow for Teachers at 1440/1280/1024px, but could not run its section checks because the React app has no marketing-template `.wrap`. This is a documented template mismatch, not a passing full taste-checker result; the 59 targeted browser assertions provide the app-specific verification.

### Teacher Classes workspace — 9 November 2026

The owner approved merging the Classes directory and class roster into one workspace. Both `/teacher/classes` and `/teacher/classes/:classId` now use `TeacherClasses.jsx`; the index replaces its history entry with Grade 5A (or the first available class if 5A is absent). The latest owner refinement puts the native class dropdown **inside the green panel's heading**, followed by the capitalized word **Students**: **[Grade 5A ▾] Students**. The selector has a cream background, forest text, compact padding, and an 8px gap to Students, integrating with the heading while clearly reading as a dropdown. The separate upper selector is removed. Its accessible name is “Class”; the section heading keeps the complete selected class name for assistive technology. It switches the summary, practice topics, and roster through the existing URLs, with stable live selection status. The heading uses the approved 28px typography, a control at least 48px tall, visible cream focus, and responsive wrapping. The selector stays mounted while the keyed roster content resets search, preserving native keyboard focus across class changes. This supersedes both the initial compact button row and the standalone dropdown above the panel. Unknown classes offer a recovery dropdown inside the empty-state panel; an empty class list omits it. Direct dashboard links, refresh, browser Back, and existing individual-student destinations/return links remain functional. `TeacherClassDetails.jsx` and its unused card styles were removed.

Scoped `teacher-classes.css` follows the approved Papers treatment: Source Sans 3, cream canvas/fields, original `#183126` chalkboard, restrained dividers, 14px panels, 48px controls, and the shared 1248px outer container/24px gutters. `TeacherLayout` extends that container only to the Classes index and exact class roster routes; individual student pages keep their original width and design. The page has no redundant Back action, emojis, avatars, percentage circles, pills, or duplicate dashboard charts. Student rows use semantic table headings and explicit, student-named “View student” links rather than row click handlers.

Student search trims whitespace and ignores case, announces result counts, supports Clear search with focus restoration, and resets on class changes. Unknown classes, an empty class list/roster, no matches, missing practice analysis, and missing summaries have useful states without invented zero grades. **Owner clarification:** the listed students represent the entire class. Class size now derives from the same roster as the table: 5A has 5 students, 4A has 2, and 3B has 2. The unfiltered status says “Showing all 5 students”; search says, for example, “Showing 1 of 5 students.” An empty roster says “No students in this class.” This supersedes the earlier partial-record wording and separate reported totals of 28/25/30. The legacy `classes[].students` values remain in the fixtures but are no longer used by the Classes UI. Supplied class averages remain fixture summaries rather than recalculations from student grades. No fixture changes, dependencies, backend, publication workflow, or student-detail redesign were added.

Validation: production build, targeted ESLint for App/TeacherLayout/TeacherClasses, and diff checks passed. A temporary local headless Chrome script passed **43 browser checks** covering the default/history replacement, all three selections and direct URLs, dashboard entry, refresh/Back/student links, search normalization/clearing/focus, semantic controls/live status, missing/empty fixture states, long names, reduced motion, unchanged navbar geometry and existing Papers/dashboard content, and no runtime exceptions. Shared edges and no whole-page horizontal overflow passed at 1440/1280/1024/820/768/390px; the narrow roster uses a labeled, keyboard-focusable horizontal scroll area. Sampled essential board/field/action text contrast exceeds 4.5:1. Desktop, phone, and no-results screenshots were visually inspected. Physical-device checks, full-project lint, and a complete accessibility audit were not repeated.

Complete-roster wording follow-up: build and targeted Classes ESLint passed, along with eight headless browser checks for matching totals/rows in all three classes, filtered counts, no matches, clear/reset focus, singular wording, and empty classes. The displayed roster is now the class-size source of truth.

Class-dropdown follow-up: build, targeted Classes ESLint, and diff checks passed. Nineteen headless browser checks cover the visible label/default selection, 48px control and focus styling, class content/search reset, Back/Forward/refresh, native keyboard selection, student-detail navigation/return, unknown-class recovery, empty classes, and no runtime exceptions. Seven extra classes were added only to the browser's in-memory fixtures to verify all ten options remain selectable while the selector dimensions and roster's vertical position stay unchanged. The page fits 1440/1024/390px with ten classes; desktop and phone screenshots were visually inspected. Repository fixtures were not expanded. Physical-device/native popup appearance and full-project lint were not rechecked.

Heading-dropdown follow-up: build, targeted Classes ESLint, and diff checks passed. The adapted 19 browser checks passed for one selector within the heading and no upper selector, its accessible name/heading typography, retained keyboard focus with cream outline, class switching and search reset, history/refresh/student links, recovery states, and ten-class containment at 1440/1024/390px. Desktop and phone screenshots were visually inspected. Existing roster totals and fixture values are retained. Physical-device/native popup appearance and full-project lint were not repeated.

Cream-dropdown polish: the owner requested capitalized “Students” and a cream dropdown that integrates with the heading. The control now uses cream/forest colors, tighter vertical padding and an 8px heading gap, retaining the 48px minimum target and native arrow. Build, targeted Classes ESLint, diff checks, and the adapted 19 browser checks passed, including the exact control colors, gap, heading text, and existing selection/history/keyboard behavior. Desktop and phone screenshots were visually inspected; physical-device testing was not repeated.

The taste layout checker was attempted on the captured Classes rendering but failed on its expected marketing-template section structure (`Cannot read properties of undefined (reading 'map')`, then `r.sections is not iterable`). This is not a passing checker result; the 43 app-specific browser checks and inspected screenshots provide the rendering evidence.

Nielsen review: selected class/result status provides visibility; familiar labels provide clarity; native history, the class dropdown, and search reset provide control; approved Papers controls provide consistency; explicit navigation-only row actions prevent accidental state changes; the visible selected class and roster heading support recognition; native keyboard selection, normalized search, and direct student links support efficiency; one compact selector keeps the roster focused as class numbers grow; invalid/empty states offer recovery; practice topics and matching roster totals provide context. Cancellation/confirmation states do not apply to this read-only roster. Broader publication and messaging behavior remain outside scope.

### Teacher student details — 9 November 2026

The owner approved the student-detail redesign, then revised its composition after seeing the tall analysis sidebar. The final requested order is **Learning Objectives → Assessment feedback → Message student**, with each section spanning the shared 1200px usable width. Inside Learning Objectives, the cream radar/topic-score inset sits on the left; support flags, topics needing practice, and repeated mistakes sit on the right. This supersedes the initial feedback-left/analysis-right proposal. Columns stack below 1000px, while the three sections keep their reading order. The original `#183126` chalkboard, cream fields, Source Sans 3, 14px panels, 24px spacing, readable text, and 48px actions match Classes and Papers. The shared navbar is unchanged. `TeacherLayout` extends its approved outer shell to the existing student-detail route.

`TeacherStudentDetails.jsx` and scoped `teacher-student-details.css` add a named class back link, plain student metadata, and a labeled assessment selector only when multiple assessments exist. Original assessment scores, questions, answers, feedback, analysis, and seeded conversations are retained for Omar and Ahmed. Other students now show honest unavailable states: the old fallback quiz and topic scores were invented content, not student records. Missing summary/topic values are unavailable, actual zero topic scores remain zero, and invalid topic values are excluded from the decorative radar. Exact topic values have a readable definition list. Missing analysis is distinguished from a known empty set of findings. Wrong-class and unknown student routes offer recovery without exposing another student's record.

Flags retain confirmation, cancellation, dismissal, and undo, with explicit review counts, persistent dismissible status notices, safe initial Cancel focus, and focus restoration. Student messaging uses a labeled multiline composer, disabled whitespace sends, sender/time labels, a named keyboard-scrollable live log, and local status feedback. `ParentMessageModal`, used only by this page, now follows the same design with native dialogs, draft preservation on close, recipient context, urgent-message starters and confirmation, background isolation, scroll locking, Escape/backdrop cancellation, and focus restoration. `src/utils/dialogFocus.js` keeps Tab/Shift+Tab within these dialogs using the existing Grades pattern. Student/class keys isolate conversations, drafts, and review decisions. The obsolete student-detail and parent-popup CSS was removed from `teacher.css` after its callers were replaced.

Messages and review decisions remain component state and reset when leaving the student; no delivery, notifications, persistence, grading/publication connection, fixture changes, new routes, dependencies, or other portal redesign was added. Visible conversation copy identifies the local-only boundary; confirmation no longer claims that a student or parent was notified.

Validation: production build, targeted ESLint for the three changed JSX files and dialog helper, and diff checks passed. A local headless Chrome script passed **68 checks** covering roster entry/return, exact section order and desktop graph/support placement, original values, selection, honest missing/empty/invalid data, flag confirm/dismiss/cancel/undo, native modal focus containment and Escape/backdrop recovery, both conversations and urgent confirmation, route isolation, long content, reduced motion, sampled reading-text contrast above 4.5:1, unchanged navbar geometry, existing Papers/dashboard content, and no runtime exceptions. Shared edges and no whole-page overflow passed at 1440/1280/1024/999/820/768/390px; student-content and dialog containment also passed at 320px, excluding the inherited shared-navbar limitation. Desktop, tablet, phone, and parent-dialog screenshots were captured; desktop and phone screenshots were visually reviewed. Local checks and artifacts are kept in the ignored `.aider-desk/student-details/` folder.

The taste layout checker was attempted on the rendered page and failed on its expected marketing-template section structure (`Cannot read properties of undefined (reading 'map')`, then `r.sections is not iterable`). This is not a passing skill-checker result; the 68 app-specific checks establish the relevant layout/interaction evidence. Physical devices, full-project lint, and a complete accessibility audit were not checked.

Nielsen review: selected assessment, flag counts and notices provide visible status; familiar school terms and exact percentages provide clarity; class Back, dialog cancellation, retained drafts and flag undo provide control; approved teacher surfaces, type and native selectors provide consistency; disabled blank sends and urgent/dismiss review prevent errors; questions, student answers, recipient and topic values remain visible for recognition; direct assessment selection and keyboard operation support efficiency; three full-width sections remove the tall-sidebar gap; missing-record recovery and explicit unavailable states avoid fabricated results; local conversation notes explain the relevant boundary. The broader shared publication and messaging lifecycle remains outside this redesign.

### Parent-contact modal refinement — 9 November 2026

The owner approved restructuring the parent conversation and explicitly requested an **X** in place of Close. `ParentMessageModal.jsx` now has a single recipient line in a separated header, a compact labeled conversation, native **Standard message / Emergency** radio choices, the labeled composer, and a stable action/footer area. The 44px X has the accessible name “Close parent conversation.” The header and footer remain visible while the body scrolls. Empty history no longer reserves a large blank area; populated history keeps its named keyboard-scrollable live log, sender/time labels, and latest-message position.

Emergency selection preserves the draft and reveals a pale-red notice, labeled Suggested message dropdown using the original three editable presets, and a red **Review emergency message** action. Review replaces the body inside the same native dialog with the exact recipient/message and **Back to edit / Send emergency message** actions. The nested confirmation dialog and on/off toggle are removed. Emergency history uses an explicit red Emergency label and border. Red (`#B42318`, hover `#912018`, pale surface `#FEF3F2`) is local to this workflow; standard actions retain forest/cream. Whitespace cannot send or advance to review. Switching types, backing out, X, Escape, and backdrop cancellation preserve unsent text; closing review returns to the composer when reopened. Confirmed messages clear the composer and return to Standard. Starting a new draft clears the previous status notice.

The change is confined to this modal and its scoped CSS; the existing callback, parent/student record isolation, underlying student page, and page-local storage/delivery limits are retained. No actual emergency dispatch, parent delivery, notification, persistence, backend, dependency, or other portal change was added.

Validation: production build, targeted modal ESLint, and diff checks passed. A focused local headless Chrome script passed **55 checks** covering X semantics/size/focus, compact empty history, structural alignment, native message-type choices, exact emergency colors, preserved drafts, all presets, multiline edits, Tab/Shift+Tab containment, one-dialog review/back/edit/send, X/Escape/backdrop recovery, single-message sends and emergency history labels, local status, scrolling, reduced motion, sampled emergency-text contrast above 4.5:1, student isolation, and unchanged surrounding page dimensions/content. Header/footer/body containment and reachable actions passed at 1440×900, 1024×768, 820×1180, 768×1024, 390×844, and 320×480. Standard, emergency and review screenshots were captured; desktop and phone examples were visually reviewed. Checks/artifacts are in the ignored `.aider-desk/parent-modal/` folder. Physical devices, full-project lint, and a complete accessibility audit were not run. The previously documented incompatible marketing-template checker was not repeated for this modal.

Nielsen review: native selected state, review heading, history and local status show progress; recipient and familiar message types clarify the task; cancellation, draft retention and Back to edit preserve control; shared type, fields and actions maintain consistency; disabled blank actions and emergency review prevent mistakes; visible recipient/message previews support recognition; presets and keyboard controls support efficiency; compact history and separated groups remove unnecessary space; preserved drafts and editable previews support recovery; emergency guidance and the footer's local-only note give contextual help.

### Student homework-upload modal — 9 November 2026

The owner revisited the student homework-upload dialog after the parent-contact refinement. `HomeworkUploadModal.jsx` and scoped `homework-upload.css` replace the inline overlay in `StudentHome.jsx` with the same organized white dialog vocabulary: separated assignment header, accessible 44px X, clear instruction/file area, and a stable Cancel/Upload footer. The title uses Source Sans 3 28px, reading text 18px, metadata 16px, main actions 48px, and 16px dialog corners. The demo explanation is quiet footer text rather than a prominent boxed introduction. There is no implied drag-and-drop behavior.

Choose a file is now a keyboard-operable button opening the native file picker. Selected filenames are announced and shown with a Change file action; Upload stays disabled until a supported file is chosen. Extension validation accepts PDF/DOC/DOCX/PNG/JPG/JPEG case-insensitively, rejects unsupported names (including `.pdf.exe`), and gives an announced recovery message. This validates the name only, not file contents. The separate **Use sample homework** action retains the original direct sample upload and filename; it is available only before selecting a file and never during replacement. Replace upload shows the current filename, requires a new file, and retains the old record until confirmation. Cancel, X, Escape, and backdrop dismissal leave the existing upload unchanged and clear the uncommitted selection when reopened.

The native dialog uses the existing focus-containment helper, body scroll locking, safe X focus, and focus restoration to the originating row's Upload/Replace action. A queued native close from React Strict Mode is ignored when the dialog has already reopened. Header/footer remain visible while the body scrolls. Dashboard welcome/carousel/list counts still update together only for an initial confirmed upload; replacement keeps the count unchanged. Student quiz/exam destinations and all other dashboard content are retained. No dependencies, routes, fixtures, shared-header styles, teacher/parent modal changes, actual uploads, preview/OCR, persistence, or cross-portal submission workflow were added.

Validation: production build, targeted ESLint for `HomeworkUploadModal.jsx`/`StudentHome.jsx`, and diff checks passed. A local headless Chrome script passed **50 checks**, including native file-picker activation by keyboard, supported/unsupported extensions, selected filenames, focus containment/restoration, empty/selected/error states, X/Cancel/Escape/backdrop cancellation, explicit sample upload, synchronized counts, replacement cancel/confirm/repeat, new assignment isolation, long titles/filenames, reduced motion, unchanged navbar dimensions, preserved quiz/exam destinations, and no runtime exceptions. Dialog/control containment and stable header/footer passed at 1440×900, 1280×800, 1024×768, 820×1180, 768×1024, 390×844, and 320×480. Desktop empty/selected/error/replacement and phone replacement screenshots were captured; desktop and phone examples were visually reviewed. Checks/artifacts are kept in the ignored `.aider-desk/homework-upload/` folder. Physical-device tests, full-project lint, and a complete accessibility audit were not run. The previously documented incompatible marketing-template checker was not repeated for this modal.

Nielsen review: selected filename, errors and synchronized upload status show state; familiar worksheet/file wording supports clarity; all cancellation paths and Change file give control; the established dialog type/spacing/actions maintain consistency; disabled empty confirmation and file-type validation prevent mistakes; current/selected filenames remain visible; keyboard file selection and the explicit sample shortcut support efficiency; a quieter footer note and fewer decorative boxes reduce clutter; inline errors and unchanged previous uploads support recovery; supported-format guidance and the filename-only note provide contextual help. The existing shared toast's live-region/target limitations remain outside this modal change.

### Student Grades report-modal consistency — 9 November 2026

The owner requested removing duplicate **Print report / Download PDF** controls from the Grades overview because those controls already exist inside the report, while preserving functionality. The overview now has only **View report** and no redundant PDF-unavailable note. `StudentGrades.jsx` and `student-grades.css` retain all report data, subject links/history, modal handlers, keyboard focus/containment, dismissal, browser printing, and the disabled PDF action/explanation inside the modal.

The modal now matches the other revised dialogs: title/context above a separated header, the same 44px accessible SVG X, white/sand/forest palette, 16px corners, 24px content edges, restrained elevation, a scrolling body, and a stable action footer. Its 760px desktop width remains appropriate to the report table. Narrow viewports retain the labeled keyboard-scrollable table; header and Print/PDF footer stay reachable while the body scrolls. Print CSS releases the new scrolling/flex containers so the printed output still contains the complete report without navbar, overview, X, or export controls. No report calculations, fixtures, routes, download implementation, dependencies, or other portal changes were made.

Validation: production build, targeted Grades ESLint, and diff checks passed. A local headless Chrome script passed **45 checks** covering overview-only View report, original profile/subject values, matching modal styling, keyboard opening/focus/Tab/Shift+Tab, X/Escape/backdrop dismissal and focus restoration, browser Print invocation, report-only print styling, a browser-generated report PDF, unchanged disabled PDF behavior, all subject destinations/history, empty/unknown states, reduced motion, unchanged navbar geometry, and no runtime exceptions. Dialog containment and stable header/footer passed at 1440×900, 1280×800, 1024×768, 820×1180, 768×1024, 390×844, and 320×480; overview overflow passed down to 390px. Desktop, phone, and print screenshots were visually reviewed. Local checks/artifacts are in the ignored `.aider-desk/grades-modal/` folder. Physical devices/printers, full-project lint, and a complete accessibility audit were not checked; the previously documented incompatible marketing-template checker was not repeated.

Nielsen review: the existing report/disabled-download states remain visible; familiar report labels and original values are preserved; Back, X, Escape and backdrop behavior retain control; approved dialog geometry/type/controls give consistency; the existing disabled PDF action prevents a false download; profile details, table and export labels remain visible for recognition; keyboard access and one overview entry point support efficiency; removing duplicate controls reduces clutter; existing subject/empty-state recovery remains; PDF/demo explanations stay with the modal actions they describe.

### Teacher schedule refinement — 9 November 2026

The owner requested a restrained refinement preserving the timetable and upcoming-activities composition and green chalkboard surfaces. `TeacherSchedule.jsx` now uses scoped `teacher-schedule.css`, the approved 1248px outer shell/24px gutters, Source Sans 3, readable wrapping topics and full dates, 14px panels, quiet dividers, cream fields, and 48px actions. Decorative emojis, category colors/badges, strong shadows, strike-through/dimming of completed rows, and the redundant top-level back link were removed. The follow-up request merges the six repeated morning-break cells into **one continuous cell spanning all six days**, with a centered, widely spaced **BREAK** label; the period name and time remain at the left. The shared header and fixture data are unchanged.

The class dropdown derives its options from the existing classes and highlights matching lessons while filtering the activity list. Other lessons remain readable. A labeled activity-type dropdown replaces the type pills, and search ignores case and surrounding whitespace. **Hide completed events** replaces collapsing the whole section: unfinished activities and filter controls remain visible. Native completion checkboxes update readable status text and derived counts; when a newly completed row disappears, focus moves to the visibility control. Reset restores all filters and focuses search. Empty and no-results states give specific recovery guidance. The timetable retains a labeled keyboard-focusable horizontal scroll area on narrow screens.

Create and edit share the established white native-dialog pattern: named header, accessible 44px SVG X, labeled grade/class/type/title/date/time/instructions fields, scrolling body, and stable Cancel/Save footer. Grade/class choices stay consistent, titles must contain non-whitespace text, and dates are required instead of silently assigning an unrelated fallback date. Period details retain their full subject/location/grade and the class-specific scheduling shortcut. Cancel, X, Escape and backdrop dismissal preserve saved data, with focus containment/restoration and body scroll locking. Delete uses safe initial focus, explicit confirmation and persistent undo that restores the original list position. Announced, dismissible inline notices replace this page's shared emoji toasts. The local-only limitation is stated beside the list and in the editor; no persistence, backend, delivery, dependencies or routes were added.

Validation: production build, targeted ESLint and diff checks passed. A local headless Chrome script passed **51 checks** for preserved data/slots, styling/edges/header, the merged break row, dynamic filters/search/reset, completion/visibility/counts/focus, full dates/topics, create/edit/validation/cancellation, period details/class prefilling, deletion/undo, keyboard containment/restoration, backdrop dismissal, refresh lifetime, long text, empty data, reduced motion and no runtime exceptions. Page overflow checks passed at 1440/1280/1024/820/768/390px; schedule content and dialogs fit 320px. The inherited shared header still overflows at 320px, as previously documented. Desktop, 1280px, phone, no-results and editor screenshots were captured; desktop, 1280px, phone and editor views were visually inspected. Checks/artifacts are in ignored `.aider-desk/teacher-schedule/`. Physical devices, full-project lint and a complete accessibility audit were not run; the previously documented incompatible marketing-template checker was not repeated.

Nielsen review: derived counts, statuses and notices show state; familiar school labels and full dates clarify meaning; reset/cancel/undo preserve control; approved type/surfaces/dialogs provide consistency; required fields and safe deletion focus prevent mistakes; visible labels/context aid recognition; native dropdowns/search/keyboard/class shortcuts support efficiency; removed badges/colors/emojis reduce clutter; retained input, validation messages and empty states support recovery; filter guidance and the local-only note provide contextual help. The schedule remains a local prototype, not a synchronized teacher/student planning workflow.

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

- Target users remain Grades 1–5. The student profile/header and revised student fixtures now use Grade 5/Class 5A and primary-school topics. Parent fixtures still include Grades 11 and 8 and advanced subjects; cross-portal alignment remains to be completed.
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

The app uses a text-based **Zinger / School Portal** brand with an inline graduation-cap icon. Current assets in `src/assets/` include `login-illustration.png`, `class.png`, `papers.png`, `schedule.png`, and `hero.png`; the teacher hero uses class/papers/schedule illustrations and login uses the login illustration. `public/` contains `favicon.svg` and `icons.svg`; default React/Vite SVGs also remain in `src/assets/`. Login and the student dashboard use the chosen custom fonts below; other portal pages retain the Tailwind/system font stack.

**Approved font pairing:** On 6 November 2026, the owner chose **Bree Serif + Source Sans 3**. This remains the agreed typography system: **Bree Serif 400 for the Zinger School wordmark only**, and **Source Sans 3 for all other UI text** (700 for headings, 600 for labels/buttons, 400 for body/input text). The original files and their SIL Open Font License 1.1 documents are now in `src/fonts/bree-serif/` and `src/fonts/source-sans-3/`. See `src/fonts/README.md` for sources, filenames and weights.

| Role | Selected font | Usage guide |
|---|---|---|
| Zinger School title / wordmark | **Bree Serif Regular, 400** | The only use of the display family. Start around 32–40px and preserve the existing layout; do not synthesize bold. |
| Page and section headings | **Source Sans 3, 700** | Use size and weight for hierarchy; around 28–36px for main headings. |
| Form labels and buttons | **Source Sans 3, 600** | Around 16px for labels and 18px for button text, with clear contrast and focus indicators. |
| Paragraphs, descriptions, feedback and input text | **Source Sans 3, 400** | Start around 18–20px for reading text, with 1.5–1.6 line height for paragraphs. |
| Secondary text and links | **Source Sans 3, 400–600** | Around 16px, avoiding tiny or low-contrast text. |

These are starting sizes, to be checked in the real UI at desktop and narrow widths. Use one UI family throughout; keep a system sans-serif fallback. Source Sans 3 includes normal and italic variable fonts covering weights 200–900. Retain each family's original license when distributing it.

**Implementation status:** The pairing is now **applied to the sign-in page and student dashboard** through shared local `@font-face` declarations in `src/index.css`, with `font-display: swap` and scoped font-family rules. Bree Serif uses its real 400 weight for the wordmark (login: 36px desktop / 28px narrow screens; dashboard: 32px); Source Sans 3 uses a declared 200–900 variable weight range. Login sizes remain 36px for the main heading (32px narrow), 18px for body/input/button text, and 16px for labels/secondary text. Dashboard sizes are 40px for the welcome, 22px for section headings, 18px for task titles, and 16px for supporting UI text. Preserve the original login layout and do not carry over the rejected Fibel sizing. Normal and italic Source Sans files remain available, but only the normal file is currently loaded. Scholar Block, Fibel Nord, Fibel Sued and Eskool were removed from `src/fonts/` at the owner's request; Halvarson had already been removed. Unselected comparison fonts remain only in the ignored preview folder, not in the app's font assets.

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
    DashboardCarousel.jsx  Shared approved teacher/student navigation carousel
    TeacherQuickLinks.jsx  Teacher carousel destinations and pending-paper count
    TeacherClassAnalytics.jsx  Stable searchable teacher class analytics
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
  fonts/              Bree Serif and Source Sans 3, licenses and usage notes (applied to login and student dashboard)
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
- **Reuse approved designs when applicable.** Similar page purposes use the same established components and visual treatment; the teacher/student dashboard navigation shares the approved student carousel. Keep role-specific content and the teacher's green chalkboard surface.
- All three portals exist, including the parent portal; parent inclusion is no longer an unimplemented option.
- Demo entry uses fixture email/password login and local storage. Header portal links also exist, with the teacher-role limitation documented above. No real authentication or backend is present.
- The interface and current assessment fixtures are in English.

### Still to clarify or implement

**Teacher dashboard redesign — approved and implemented, 9 November 2026:** On 6 November, the owner rejected all three concept previews. On 9 November, the owner requested a new refinement proposal based on this context and `desgin langauge.md`, with Nielsen's ten usability heuristics considered, **before any application code changes**, then approved the proposal with “Proceed.” The owner particularly likes the **green chalkboard color**: preserve it as a defining teacher-view surface and refine its typography, hierarchy, spacing, contrast, and controls rather than replacing it with an all-white treatment. The agreed Bree Serif 400 wordmark and Source Sans 3 UI pairing still applies. The approved refinement is implemented and documented in section 0; the previously rejected concepts remain superseded.

**Teacher source-check note — 9 November 2026:** `src/App.jsx` now registers Classes, class/individual-student details, Schedule, and paper-detail/grading routes. Earlier missing-route statements above are historical and must not be treated as current for those destinations. The dashboard checks verify its links open those destinations, not a connected submission/publication workflow or a complete audit of the destination screens. Before this refinement, the hero advanced every five seconds and analytics switched classes through a six-second CSS animation, with mouse-hover pauses. Both timed behaviors have now been removed.

1. **Research gap / distinguishing feature:** Confirm the specific research claim and how per-question timing, hard-question marks, or another agreed feature will support teacher decisions. Existing student controls alone do not establish a complete differentiator.
2. **Source documents and fidelity:** The PDF, wireframes, and palette images are absent from this checkout. Recheck their exact requirements when available; preserve the inherited requirements and current visual system in the meantime.
3. **Language coverage:** Add a German assessment example to satisfy the inherited bilingual-content requirement; full UI translation remains unconfirmed and outside the current implementation.
4. **Shared workflow state:** Choose how submissions, OCR edits, grading, flag decisions, publication, and notifications are shared across roles, and whether that state should survive refresh.
5. **Fixture alignment:** Student header/dashboard/workspace examples now use Grade 5 content. Reconcile the remaining Grade 11/8 parent fixtures and cross-portal student/teacher identities with the Grades 1–5 audience.
6. **Delivery scope:** Complete the teacher/student assessment cycle before expanding secondary parent features; confirm any changes to the inherited course deadline and non-code deliverables with the owner/original PDF.

Keep unresolved product decisions labeled as such. Repository observations are implementation facts, not proof of course compliance or additional owner approval.

---

**Implementation instruction to future coding assistants:** Read this context and inspect the relevant existing files before changing the app. Extend the current architecture, preserve the palette and functional screens, and prioritize the shared teacher/student assessment cycle. Treat inherited PDF requirements separately from verified implementation; never describe fixture labels as working teacher oversight or publication gating. Update this context as behavior changes, and validate against the original course materials when available.
