# Student dashboard redesign plan

Date: 8 November 2026

Status: Increments 1–5 implemented on 8 November 2026. Increment 3 follows the revised scope: remove dashboard announcements and use the header bell. Increment 4 follows the approved schoolwork mockup with the owner's requested Grades 1–5 content alignment. Increment 5 follows the approved imagegen preview with both the existing radar graph and score bars, preserving meaningful content. Ready for implementation review before increment 6; phone work remains deferred. Complete and review one increment before proceeding to the next.

## Design direction

Make the dashboard lead with what the student needs to do next, while retaining an illustrated navigation carousel inspired by `wireframes/Student.png`.

Preserve the forest, sage, sand, and cream palette. Use Source Sans 3 for UI text and Bree Serif 400 for the school wordmark only. Keep the existing routes, upload interaction, and teacher-help links working throughout the redesign.

### Desktop layout

```text
Header
Welcome + pending task count
Illustrated carousel with visible neighboring slides

Full-width schoolwork
Progress: radar graph + score bars  |  Existing practice suggestions
```

Use comfortable margins and content-driven card heights. The owner removed dashboard announcements in increment 3; updates are accessed through the header bell. Keep schoolwork full-width to avoid an empty sidebar. Increment 5 uses a two-thirds progress card and one-third practice card on desktop, with matching top/bottom edges. Phone work remains deferred.

## Increment 1: Page foundation and welcome

- [x] Add a stable “Hi Ahmed” greeting above the carousel.
- [x] Derive the task count from dashboard state.
- [x] Widen the desktop container to approximately 1120–1200px and align its edges with the header.
- [x] Apply Source Sans 3 to dashboard UI and Bree Serif 400 to its wordmark.
- [x] Establish consistent spacing, readable text, and restrained borders.

**Review point:** Assess typography, width, and spacing before changing individual sections.

**Implementation notes:** The main area and header share a 1248px outer container with 24px side padding, giving 1200px of content on wide desktops. The welcome, carousel, and assessment header share a count that updates after a local homework upload. The current carousel, section order, radar chart, and existing destinations remain in place. Dashboard styles are scoped separately to protect the other portals. Font declarations moved to `src/index.css` without changing the login layout.

**Owner update:** On 8 November 2026, the owner deferred phone/responsive work. Desktop is the current review target; phone validation in increment 6 remains deferred until requested.

**Validation:** Production build, targeted dashboard ESLint, and 14 headless desktop assertions passed. Assertions cover font loading, wordmark weight, content width/alignment, absence of horizontal overflow, stable welcome during carousel changes, upload feedback/count updates, quiz navigation, and keyboard announcement navigation. Desktop dashboard and login screenshots were visually reviewed. The taste layout checker reports no desktop overflow but cannot complete its section checks because the app has no `.wrap` markup. Its broader consistency checks also include landing-page rules that conflict with this dashboard (full-screen heroes, one section per screen, sales CTAs, and promotional visuals); these are not a dashboard conformance pass. Full-project lint still fails on existing errors in other pages and bundled skill files.

## Increment 2: Illustrated navigation carousel

- [x] Replace the current single text panel with a large central card and smaller visible neighboring cards.
- [x] Retain Schoolwork, Teachers, and Grades.
- [x] Reuse the existing teacher-dashboard illustrations temporarily; replacement artwork will come from the owner later.
- [x] Make each entire card the image with a bottom title overlay; remove the separate action buttons.
- [x] Make clicking a neighboring card center it.
- [x] Make clicking the central card open Teachers or Grades; Schoolwork scrolls to and focuses the task section.
- [x] Include manual arrows, clickable indicators, keyboard navigation, swipe support, and reduced-motion behavior. Do not auto-advance.
- [x] Match the approved Design 3 proportions: central height 260–330px on desktop and smaller neighbors. Partial neighboring previews are included at narrow widths; phone validation remains deferred.

**Owner-approved revision:** Use Design 3's layout with the image-card treatment from `src/components/HeroCarousel.jsx`: a sharp, uncropped image over a matching blurred backdrop and a forest bottom text overlay. Reuse `class.png` for Teachers, `papers.png` for Schoolwork, and `schedule.png` temporarily for Grades. No carousel CTA buttons. Start with Teachers on the left, Schoolwork centered, and Grades on the right. Keep the existing header and lower single-column dashboard unchanged.

**Implementation:** Changes are local to `StudentHome.jsx`, `student-dashboard.css`, and the slide title/order in `studentData.js`. No new dependencies or artwork. The active image card opens its destination; a neighboring image first centers. Arrow keys, Home/End, manual arrows, indicators, and touch/pen horizontal swipes select slides. Swipe clicks are suppressed to avoid accidental navigation; vertical gestures do not change slides. Reduced motion removes card transitions. Carousel controls have 44px targets and a live announcement identifies the current slide.

**Validation:** Production build and targeted JSX/data ESLint passed. Nineteen headless desktop checks passed, covering the initial layout and artwork, image loading/containment, no horizontal overflow, control sizes, no automatic advance, neighbor selection, teacher/grade routes, wraparound arrows, keyboard controls, indicators/live announcements, Schoolwork keyboard focus, synchronized upload counts, horizontal versus vertical gestures, reduced motion, 1280px layout, quiz navigation, and absence of browser runtime exceptions. Synthetic pointer events exercise swipe handlers; this is not a physical touch-device test. Desktop screenshots were visually reviewed. The taste layout checker again reports no desktop overflow but stops on its unsupported `.wrap` expectation, so it is not a conformance pass. Full-project lint was not repeated; its previously recorded unrelated failures remain outside this increment. Phone validation remains deferred.

**Review point:** Approve the artwork, proportions, and navigation before rearranging the lower dashboard.

## Increment 3: Remove dashboard announcements — revised scope complete

- [x] Remove the dashboard announcements banner and its unused icon import.
- [x] Keep announcements accessible through the existing header notification bell and announcement feed.
- [x] Keep schoolwork full-width directly below the carousel, without an empty right column.
- [x] Retain content-driven card heights and verify that schoolwork begins within the first laptop screen.

**Owner revision:** The two-column announcement preview was not implemented. The owner requested removal of the dashboard announcements section because notifications belong in the top-right bell. This supersedes the announcement card, preview/date/link, and announcement-specific desktop/mobile grid requirements. The existing bell already has a notification linking to `/student/announcements`; no header or notification changes are needed. Practice relocation remains increment 5 work.

**Validation:** Production build and targeted `StudentHome.jsx` ESLint passed. Seven headless browser checks passed: no dashboard announcement section, full-width schoolwork immediately after the carousel, no desktop overflow, keyboard bell access and announcement entry, navigation from that entry to the announcement feed, schoolwork visible within the 1280×800 first screen, and no runtime exceptions. The laptop screenshot was visually reviewed. Phone validation and full-project lint remain deferred; previously documented unrelated lint failures are outside this increment.

**Next:** Increment 4, the schoolwork list, is implemented below. No further increment 3 layout changes are required under the revised scope.

## Increment 4: Schoolwork list

- [x] Rename “Pending Assessments” to “Your schoolwork.”
- [x] Order tasks by deadline using explicit dates.
- [x] Show subject, task title, deadline, and duration or accepted file types.
- [x] Replace “Online / Offline” with “Complete online / Upload your work.”
- [x] Use specific actions: “Start quiz,” “Start exam,” and “Upload homework.”
- [x] Replace individually outlined rows with light dividers and generous spacing.
- [x] Preserve uploaded-file feedback and keep the pending count consistent with it.

**Implementation:** The full-width list follows the approved preview with readable 16px supporting text, 20px task titles, thin dividers, and aligned 48px action buttons. Per the owner's follow-up, rows use letter markers: Q for Quiz, HW for Homework, and E for Exam. The header shows only “Your schoolwork” and the pending count, with no icon or subtitle. Full task types remain in the row labels, so the abbreviations are not the only explanation. ISO calendar dates sort chronologically and display in full English dates with semantic `<time>` elements. The list does not mutate fixture order. Sample and selected-file uploads show their filenames and update the welcome, carousel, and section counts together. Submitted fixtures have a status instead of an action, and an empty list has a helpful message. Upload wording accurately describes the filename-only demo; no file is sent.

**Owner-requested content alignment:** Use Grade 5 examples within the Grades 1–5 audience: Math “Fractions and multiples,” English “Reading and grammar,” and Science “Plant life cycles worksheet.” Both online titles match their existing assessment IDs; the English assessment now includes a short seed-growing passage and a grammar question, with a 30-minute fixture duration. Math remains a Grade 5 fractions/multiples example. The student header derives Grade 5/Class 5A from the profile. Related notifications, dashboard strength copy, grade-history labels, and science/English teacher fixtures also use primary-school topics. Parent fixtures remain separate work. No new routes, dependencies, artwork, or progress layout changes.

**Validation:** Production build, targeted ESLint for `StudentHome.jsx`, `studentData.js`, and `Header.jsx`, and `git diff --check` passed. Twenty-three headless browser checks passed, including layout/order, full dates, labels/actions, subject icons/dividers/text sizes, Grade 5 copy/header, retained carousel, alignment and 48px targets, keyboard quiz access, English exam navigation, title/duration consistency, cancel/sample/selected-file uploads, filename feedback and all three pending counts, Schoolwork focus, reduced motion, 1280px layout, long-title wrapping, dates across months/years, already-submitted and empty states, and no runtime exceptions. Screenshots at 1440px and 1280px were visually reviewed. Existing taste-checker `.wrap` limitations still apply; this is not a marketing-page checker conformance claim. Phone validation and full-project lint remain deferred, with unrelated lint failures previously documented.

**Review point:** Review the implemented desktop schoolwork before increment 5. All task actions and long titles were checked on desktop; phone review remains deferred by the owner.

**Upload replacement follow-up:** Uploaded homework now has a “Replace upload” action. It reuses the upload modal, shows the current filename, and requires choosing a new file before confirmation. Canceling preserves the original upload, including after choosing a replacement. Confirming updates the filename in the same row, retains its Uploaded status, and leaves all three pending counts unchanged. The selected file resets each time the modal opens. This remains a filename-only demo. Build, targeted dashboard ESLint, and 11 headless browser checks passed, including keyboard access, disabled confirmation without a new file, cancellation, repeated replacement, 48px action size, stable counts, and no runtime exceptions. Phone checks remain deferred.

**Schoolwork label follow-up:** At the owner's request, the separate “Complete online” and “Upload your work” lines are removed. Online tasks now show “Math · Online Quiz” or “English · Online Exam” in their subject/type label; homework keeps “Science · Homework” without an additional instruction. Task actions, dates, durations, upload feedback, and pending counts are preserved. This supersedes the earlier instruction-line wording in increment 4.

## Increment 5: Progress and practice

- [x] Keep the existing radar graph and add labeled score bars for all five existing metrics: Math, Science, English, History, and Geography (replacing Classwork at the owner's request).
- [x] Rename “Analysis” to “Your progress.”
- [x] Calculate the overall average from the five displayed scores; show subject-specific comments under “Key takeaways,” retaining “Excellent work on” inside that section.
- [x] Show the approved English and History practice suggestions in the right column, with full tips and prefilled help routed to the relevant subject teacher.
- [x] Remove the repeated subject-score sentence and instructional labels such as “Short & encouraging,” “Details,” and “Metrics Graph.”
- [x] Present teacher-review information accurately within the prototype’s existing limitations, using a quiet “Demo data” note.

**Owner-approved scope:** The owner first approved a visual redesign preserving the existing content, then approved a more coherent data/content revision through imagegen previews. Both the radar graph and score bars remain. The final preview uses a plain calculated average, subject-only practice metadata, and stacked subject comments under “Key takeaways.” The owner's final correction retains “Excellent work on” inside Key takeaways. No reporting period, assessment type, or date appears in this dashboard section.

**Implementation:** The lower dashboard has aligned white progress/practice cards using the existing forest/sage/sand/cream tokens, Source Sans 3, 14px card corners, header dividers, and 24px spacing. The shared `RadarChart` remains unchanged; it and the accessible meters use Math 92%, Science 95%, English 88%, History 85%, and Geography 91%. The same array calculates the equal-weight overall average, currently 90.2%, with a dynamic subject count and no letter grade or score pill. “Key takeaways” includes “Excellent work on,” followed by stacked Math and Science labels and their approved full comments, on white with consistent spacing. The unsupported growth claim, tinted strength panel, and stale duplicate fixture fields are removed. Practice uses subject-only English/History labels, approved full tips, and plain 48px secondary buttons matching schoolwork. Help opens Mr. Said's English chat or the new synthetic Ms. Mona History chat with the relevant draft. Matching reading/timeline feedback fixtures support these demo suggestions; the original English paragraph feedback is retained. No teacher-page component changes, routes, dependencies, or artwork were needed. Empty scores hide the average and show the existing empty state; no fallback score is invented. Phone validation remains deferred.

**Validation:** Production build, targeted `StudentHome.jsx`/`studentData.js` ESLint, and `git diff --check` passed. Twenty-four headless desktop checks passed, covering the five scores and radar labels, calculated average/count, “Excellent work on” inside Key takeaways, stacked comments/spacing, subject-only practice metadata, complete tips, minimal surfaces and matching schoolwork buttons, palette/fonts/48px targets, 1440px/1280px alignment and no overflow, proportional bars, visible keyboard focus, both correct teacher routes/drafts/feedback, removed misleading grade/growth claims, retained schoolwork/carousel/upload counts/replacement action/quiz navigation, contained radar labels and long comments, recalculation after a score change, one-subject singular count, missing scores without a fabricated average, and no runtime exceptions. Desktop screenshots were visually reviewed. Full-project lint and phone checks were not repeated; previously documented unrelated lint errors and taste-checker `.wrap` limitations still apply.

**Review point:** A student should understand their scores and next practice step without interpreting a complex chart.

**Data boundaries:** Geography replaces Classwork at 91%. Dashboard aggregation and subject-specific takeaway/practice structure are implemented, using synthetic fixtures. The owner explicitly removed the proposed “This term” and assessment metadata from the dashboard. No real grading/publication pipeline exists. History and Geography still have no Grades detail fixtures; cross-page and cross-portal data unification remains separate work.

## Increment 6: Content alignment and final validation

- [x] Correct the dashboard/header Grade 11 mismatch and replace advanced dashboard examples with Grade 5 content (completed during increment 4 at the owner's request).
- [x] Reconcile any renamed assessment titles with their existing workspace destinations (completed during increment 4; retain this consistency for future renames).
- [ ] Check empty announcements, no pending work, long text, upload feedback, and missing progress data.
- [ ] Verify keyboard focus, contrast, meaningful labels, and touch targets of at least 44px.
- [ ] Inspect desktop, tablet, and narrow-phone layouts.
- [ ] Run the build and relevant lint checks; distinguish existing unrelated failures from regressions.

**Review point:** Confirm the redesigned dashboard works at desktop and narrow widths and preserves existing interactions.

## Implementation scope

Primary files to inspect and change as needed:

- `src/pages/student/StudentHome.jsx`: dashboard layout, carousel, schoolwork, progress, and upload UI.
- `src/styles/student.css`: dashboard styling, scoped to avoid affecting other pages.
- `src/styles/student-dashboard.css`: current dashboard-specific foundation and carousel styles; prefer this file for scoped dashboard changes.
- `src/data/studentData.js`: slide content, dates, and age-appropriate dashboard fixtures.
- `src/components/Header.jsx` and `src/styles/header.css`: narrowly scoped student header alignment, typography, and grade metadata where needed.
- `src/assets/`: carousel illustrations, once selected.
- `src/fonts/`: reuse the approved bundled fonts and retain their licenses.

The current student and parent styles share names such as `.btn-primary` and `.wireframe-hero-title`. Avoid broad selector edits that could change other screens. Reuse existing components and installed dependencies where suitable.

The shared submission → OCR review → grading → publication workflow remains separate work. Dashboard labels must not imply that this workflow or real teacher approval already exists.

## Execution approach

Implement only the current increment, perform checks appropriate to that change, and present it for review before starting the next. Increments 1–5 are implemented; increment 6 remains pending, with phone work deferred. Update the checkboxes and project context as implementation progresses. This plan does not authorize implementing all increments at once.
