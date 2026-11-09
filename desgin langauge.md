# Zinger design language

Reusable guidance for designing or restyling **any page** in this project.

Derived on 8 November 2026 from `context.md` and the student dashboard implementation; extended on 9 November with the quiz/exam workspace, answer choices, and floating tools panel. This is a design reference, not a request to change application behavior or a claim that every existing page already follows it.

Review scope: the original reference used source and recorded approval history; its fresh screenshot attempt did not complete. The 9 November workspace extension also uses the headless checks and visually inspected screenshots recorded in `context.md`. This does not establish a whole-app accessibility or physical-device pass. Observed implementation values and recommended extensions are distinguished below.

## 1. Use this first

**Warm, calm, readable, and practical:** cream canvas, white content surfaces, forest text and actions, quiet sand borders, restrained sage accents, generous spacing, and clear language.

When changing a page:

1. Identify its purpose, main action, information hierarchy, and existing working interactions.
2. Apply the palette, fonts, spacing, surfaces, and control rules below.
3. Choose a layout suited to its content: form, detail, list, directory, conversation, table, or workspace.
4. Keep routes, handlers, data relationships, validation, and state transitions working.
5. Check actual rendering, keyboard access, long content, and relevant empty/error/success states.

The reusable system is the visual vocabulary and behavior. A greeting, carousel, chart, summary card, two-column split, or particular section order is optional. Pages do not need these elements to belong to the same product.

## 2. Design principles

- **Content leads.** Put the page's purpose and useful next action near the top. Use direct headings and recognizable labels.
- **One consistent hierarchy.** Establish importance with size, weight, placement, and space before adding decoration.
- **Quiet surfaces.** Group related material in a white panel when grouping helps. Separate repeated entries with fine dividers rather than an outlined card around every entry.
- **Comfortable reading.** Keep full useful explanations, allow wrapping, and use generous line height. Shorten redundant labels before shrinking text.
- **Restrained emphasis.** Forest indicates emphasis; sage and sand support it. Avoid turning every value or category into a colored pill.
- **Visible consequences.** Actions update the affected content and related summaries together. Give clear feedback and a safe way to cancel edits.
- **Honest content.** Match labels to implemented behavior. Show demo limitations where they affect the user's decision; do not claim delivery, approval, persistence, or synchronization that does not exist.

## 3. Color system

The four brand values already exist in the Tailwind v4 `@theme` block in `src/index.css`.

| Role | Value | Use |
|---|---|---|
| Forest / primary ink | `#1E3B2F` | Headings, body text, links, primary actions, meaningful chart outlines |
| Sage / supporting accent | `#7F8C6A` | Chart fills, secondary accents, small decorative details |
| Sand / warm accent | `#C8B48A` | Border source, gentle selected states, subtle highlights |
| Cream / canvas | `#F5F0E6` | Page background, quiet inset areas, text on forest |
| White / surface | `#FFFFFF` | Content panels, fields, secondary buttons, floating surfaces |
| Secondary ink | `color-mix(in srgb, var(--color-forest) 85%, white)` | Supporting copy and metadata; approximately `#40584E` on an opaque surface |
| Panel border | `color-mix(in srgb, var(--color-sand) 50%, white)` | Thin boundary around white content surfaces |
| Row divider | `color-mix(in srgb, var(--color-sand) 40%, white)` | Quiet separators within a surface |

Use forest on cream/white for readable text. Do not use sage text on cream or cream/white text on sand for ordinary reading. Keep forest text on tinted sage/sand surfaces and check the rendered contrast. Target at least 4.5:1 for normal text, 3:1 for large text and essential control/graphic boundaries.

`sand/40` is a transparent color over the actual background; mixing 40% sand with white creates an opaque color. They are different treatments. Prefer the explicit opaque mixes for repeatable panel borders and row dividers.

Success can use a checkmark and plain forest status text. Warnings and errors need explicit words and, when useful, an icon; reserve stronger semantic colors for a real problem. Additional semantic colors have not been standardized by this reference. Do not assign a new color to every category.

## 4. Typography

Use the bundled fonts and existing `@font-face` declarations, with `font-display: swap`. Keep their original licenses.

- **Bree Serif, 400:** school wordmark only. Never synthesize bold or use it for page headings.
- **Source Sans 3:** all other UI text. Use 400 for reading, 600 for labels/actions, and 700 for headings. Fallback: `"Segoe UI", sans-serif`.

| Role | Default size | Weight | Line height / treatment |
|---|---|---|---|
| Wordmark | 32px / `2rem` | 400 | Bree Serif; tracking `-0.025em` |
| Page title | 40px / `2.5rem` | 700 | `1.15`; tracking `-0.025em` |
| Main section heading | 28px / `1.75rem` | 700 | `1.3`; tracking `-0.015em` |
| Smaller section heading | 22px / `1.375rem` | 700 | `1.3`; use when a lower hierarchy level is needed |
| Item title / subsection heading | 20px / `1.25rem` | 700 | `1.4` |
| Body / introduction / feedback | 18px / `1.125rem` | 400 | `1.5` |
| Main action label | 18px / `1.125rem` | 600 | `1.5`; allow wrapping |
| Metadata / field label / navigation | 16px / `1rem` | 400–600 | Usually `1.5` |
| Compact peripheral label | 14px / `0.875rem` | 400–600 | Limited to minor header identity/context |

These are defaults for the new language, not mandatory sizes for every content type. Keep heading levels semantic regardless of visual size. Use one `h1`, then a logical `h2`/`h3` outline.

**Source detail:** some earlier context says 22px section headings and 18px item titles. Current CSS overrides make the principal sections 28px and list titles 20px. Prefer these current values when matching the approved page. Legacy 10–14px header details are not a new default for essential text.

Use sentence case for ordinary headings and actions. Avoid widespread uppercase text, decorative letter spacing, excessive bolding, and ellipsizing essential information.

## 5. Layout and spacing

### Shared edges

- Center the page in a **1248px outer container with 24px inline padding**, producing **1200px of usable content** on wide screens.
- Align header contents, page title, panels, and primary lists to the same inner edges.
- Begin main content 24px below the header. The reference header is 80px tall and sticky.
- Use content-driven height. A short form or detail view can use a narrower inner reading/form column within the shared shell.
- Give shrinkable grid/flex children `min-width: 0`; use `minmax(0, 1fr)` for flexible grid columns. Wrap long titles, filenames, and comments.
- Allow sufficient bottom space; the reference page has 64px bottom padding.

### Spacing scale

Use a 4px base, with these recurring roles:

| Space | Typical role |
|---|---|
| 4px | Label-to-title or title-to-metadata gap |
| 8px | Small related elements, icon-to-label spacing |
| 12px | Compact groups, status-to-follow-up action |
| 16px | Internal groups, repeated feedback entries, field gaps |
| 20px | Specific divider padding or copy-to-action gap |
| 24px | Section gap, panel padding, list row spacing, column gap |

Start with 24px between major blocks and 24px inside a standard panel. Use tighter spacing to show a relationship, not merely to fit more content. Reset inherited margins when a parent `gap` controls spacing, so the same space is not applied twice.

### Composition choices

Use one column for a continuous task or list. Use equal columns for peer content and an approximately 2:1 split when a main task has supporting material. Align neighboring panel tops and, where natural, their bottom edges; do not truncate content to force matching heights. Keep unrelated information out of a spare sidebar.

Forms, directories, tables, and workspaces can use different layouts while keeping these edges and tokens. There is no required hero, full-screen section height, sales CTA, or fixed number of cards.

## 6. Surfaces, borders, and shape

| Element | Treatment |
|---|---|
| Standard content panel | White; 1px panel border; 14px radius; 24px padding |
| Panel shadow | `0 1px 2px rgb(30 59 47 / 3%)` |
| Internal separation | 1px row divider; generous vertical spacing |
| Button / small inset / category marker | Usually 12px radius |
| Floating dialog / toast | 16px radius; stronger elevation appropriate to an overlay |
| Optional illustrated navigation tile | 18px radius; subtle image-card elevation |
| Circular control / avatar | Fully round, only where its role warrants it |
| Quantitative bar | 8px track height; 4px radius; cream track, sage fill |

A panel header places its heading on the left and optional compact context on the right, with room to wrap. Use a quiet bottom divider. Keep counts as text unless their status actually benefits from a badge.

Within a panel, prefer plain text, lists, or definition lists to more tinted boxes. Use a tinted inset only for a real grouping or explanation. Strong shadows belong to floating UI; the main header and ordinary content should remain visually quiet.

## 7. Controls and interaction states

| Control | Default | Hover / press |
|---|---|---|
| Primary button | Forest fill, cream text, 12px radius | Slightly lighter forest; subtle press scale near `0.98` |
| Secondary button | White fill, forest text, 1px sand border at 60% opacity, 12px radius | Cream fill; same subtle press response |
| Quiet button | Sand tint around 20%, forest text | Sand tint around 35% |
| Text link | Forest, identifiable as interactive in its context | Visible text/underline treatment; visible keyboard focus |
| Selected navigation item | Forest text, semibold, sand tint around 35% | Keep selection distinguishable from hover |

- Main text actions are **at least 48px tall**, with 8px vertical and 16–20px horizontal padding, 18px/600 labels, and automatic height for wrapped text.
- Target **at least 44 × 44px** for compact/icon controls. The icon itself can be 16–20px. Measure the clickable area, not the drawing.
- Align repeated row actions in one column and give them consistent widths within that list. The source list uses 192px; choose an appropriate width for other content instead of making 192px universal.
- Use concrete action labels: “Save changes,” “Open details,” or “Choose a file.” Make repeated controls accessible with the relevant item's name in their accessible label.
- Disabled actions remain visibly disabled and cannot activate; explain unmet requirements where needed. Do not communicate disabled state through color alone.
- Use buttons for state-changing actions and links for navigation. Avoid click handlers on otherwise noninteractive text containers.
- For keyboard focus, use a **2px forest outline with a 4px offset**; ensure it remains visible against its background and is not clipped. Use a contrasting focus treatment on dark surfaces.

The existing `.btn-primary`, `.btn-secondary`, and `.btn-ghost` styles provide a starting point, but their base sizes are smaller. The 48px main-action sizing comes from page-specific overrides; simply reusing a class does not guarantee these dimensions.

## 8. Reusable content patterns

### Lists and records

Give each entry a clear title, minimal category/context, useful metadata, and a specific action or current status. Use consistent ordering according to the task: deadline, name, chronology, or relevance. Keep the order understandable and sort real values rather than formatted strings.

The reference row has an optional 56px marker, flexible content, and an aligned action area, separated from the next row by a light divider. Reuse that structure when helpful; omit the marker when it adds no information. Abbreviations or icons need a full text equivalent nearby.

Show full unambiguous dates when timing matters, with semantic `<time dateTime="…">` markup. Decide whether the source is a calendar date or a timestamp and format it accordingly. Duration, type, owner, or file format belongs only where it helps the user act; do not add metadata merely to fill space.

### Forms and editable details — extension of the language

The source page has a file chooser, not a complete general form system. For other forms, carry its palette/type/spacing into white fields with forest text, sand borders, 12px corners, 16–18px text, and a recommended minimum 48px control height. Use explicit labels, concise helper text, associated error messages, and the same focus treatment. Check that field boundaries remain visible enough to identify the controls.

Arrange fields in a clear reading order; use columns only for closely related short values. Put the main submit action beside a clear cancel/back action. Preserve entered values after validation errors. These are recommended extensions, not claims about controls already implemented on the reference page.

### Dialogs and temporary feedback

The existing upload overlay uses a centered white surface, 16px corners, 24px padding, a subtle sand border, strong shadow, and a dark translucent backdrop (`black / 45%`). It has a clear title, relevant context, input state, and a separated footer with cancel and confirm actions.

For new dialogs, also provide a programmatic accessible name, dialog semantics, initial focus, focus containment, Escape dismissal where appropriate, and focus restoration. Constrain height and allow internal scrolling. Cancel must preserve the saved state; confirmation commits the new state.

Use inline status for persistent outcomes, including the changed value when useful. A brief forest/cream toast can supplement it; it should not be the only record of success or a blocking error. Announce status updates appropriately and provide dismissal. The source toast defaults to six seconds; duration should suit the message rather than become a universal requirement.

### Supporting tools and side panels

Use an optional side panel for tools needed alongside an ongoing task, such as a calculator or scratchpad. Preserve the main page's shared width and alignment when the panel opens; do not move the question, shrink its reading area, or add page-level horizontal scrolling.

- When the side margin has enough room, place the panel beside the main content with a 24px gap. Otherwise, use a dismissible overlay within the viewport. The overlay can cover part of the task while open; keep its Close control immediately reachable so the user can return to the task.
- Keep persistent tools below the sticky navbar with clear spacing. Use `position: fixed` when they should stay at one viewport position; use `position: sticky` when they should remain constrained by a containing section. These behaviors serve different layouts.
- Carry the panel vocabulary into the tools: white surface, sand border, forest text, 14px corners, and 24px padding. Floating panels can use a stronger shadow than ordinary content panels.
- Stack tools in a narrow panel. Limit its height to the available viewport, allow internal vertical scrolling, and keep the title/Close row sticky within it. Contain scroll chaining so reaching the panel's end does not unexpectedly scroll the task behind it.
- Give the panel an accessible name and the toggle `aria-expanded`/`aria-controls`. Move focus to its Close control on opening; support Escape while focus is inside and restore focus to the toggle on dismissal. Close controls need at least a 44 × 44px target.
- A nonmodal tools panel leaves the page available and does not trap focus or use a modal backdrop. If a future flow requires a modal drawer, use the dialog rules above, including background inertness and focus containment.
- Closing and reopening tools preserves the current working values. Explain their actual lifetime; page-state notes must not imply storage after navigation or refresh.

**Observed workspace example:** the tools rail is 300px wide, begins 104px from the viewport top (80px navbar + 24px gap), and leaves 24px at the bottom. It fits beside the centered 1200px assessment from a 1896px viewport width; below that it overlays the right side. These dimensions and the breakpoint belong to this composition, not a universal side-panel system. Recalculate fit for the target page and check short viewports as well as narrow ones.

### Questions and answer choices

For a single-answer question, use native radio inputs in a named group, with a whole-row label and readable answer text. Use checkboxes when more than one answer is allowed. Letter markers can help scanning, but must not replace the answer or its accessible name. The workspace uses 64px minimum-height answer rows, 12px corners, and a forest border/cream fill for selection; the checked input also communicates the selected state.

Keep the question, topic, helpful tip, and answer group in a clear reading order. Question-navigation buttons expose the current step and whether each item is answered or marked as hard, using text/accessibility labels and visible symbols alongside color. Preserve answers and marks across question changes and move focus to the new prompt. Show timing once where relevant; a changing timer should not announce every second.

Before finishing an assessment, show answered/unanswered counts and offer a clear way to keep working. Keep final summaries consistent with the same answers, marks, and timings, with explicit unanswered states and accurate demo/delivery wording.

### Data, charts, and summaries

Use charts only when they help interpret real relationships. Reuse forest outlines/labels, sage data fills, sand guide lines, and cream tracks. Include exact labeled values or an equivalent readable data view. Use appropriate meter semantics for bounded measurements; do not rely on shape or color alone.

Calculate summaries from the same records shown below them. Identify units, scope, and weighting when needed. Keep a prominent summary as plain readable text unless a badge communicates real status. Missing values need an honest empty state rather than an invented zero or fallback score. A trend claim requires comparable observations over time.

### Imagery and optional navigation tiles

Reuse suitable local artwork. Preserve meaningful image bounds with `object-fit: contain`; a matching blurred image behind it can fill a navigation tile without cropping the foreground. A dark forest bottom overlay can support a cream title. This is an image-specific treatment, not a general gradient or blur style for the whole application.

Choose image alt text according to purpose. Decorative artwork inside an already named control uses empty alt text. Make a clickable tile one coherent control without nested buttons or competing actions.

If a carousel is useful, make it manual, with named previous/next controls, selectable indicators, keyboard support, a current-slide announcement, and reduced-motion behavior. A neighboring preview can select an item before activation. Do not introduce a carousel to a page whose content works better as a list or grid.

## 9. Navigation and shared shell

Preserve a consistent header: brand at the left, navigation in the middle when space permits, and account/notification controls at the right. Use the same content edges as the page, a cream background, a fine lower border, and restrained active states. The source has a 40px forest brand-icon container and a 36px initials avatar; these visual sizes do not determine the minimum hit target.

Keep global updates in the notification entry point and account actions in the account menu. Add page-level notices only when the current task needs them. Navigation labels and menu contents follow the role/page, not a fixed dashboard inventory.

Use accessible names, expanded state for disclosure controls, a semantic navigation region, and an identifiable current destination. Support keyboard activation and predictable dismissal; opening one competing popover should close the other.

## 10. Motion and responsive behavior

Keep motion quiet and tied to the user's action. The optional image carousel uses roughly 300ms position/size transitions and a 180ms hover response with a 2px lift. Ordinary controls need only brief color/press feedback. Avoid automatic rotation, scroll reveals, decorative looping movement, or motion that shifts reading content unexpectedly.

Honor `prefers-reduced-motion`: remove nonessential transforms/transitions and smooth scrolling while preserving immediate state feedback. Review overlays and shared controls too; a carousel-specific rule does not cover the whole page.

The reference was approved and checked primarily at desktop sizes. Its CSS contains adaptations at 1099px (supporting panels stack and role badge hides), 700px (carousel previews change), 639px (rows/charts stack), and the shared header's 768px navigation change. **These are observed component breakpoints, not a required breakpoint system or proof of phone readiness.**

For future pages, adapt when content no longer fits: stack columns, wrap headings, move actions below their content, and preserve readable text and reachable controls. Use a mobile menu when navigation cannot fit. For tables, choose a labeled horizontal scroll area or a useful record layout. Avoid whole-page horizontal scrolling and fixed-height content that clips text. Inspect desktop and narrower widths relevant to the actual task, plus text zoom; document deferred checks explicitly.

## 11. Apply the language to different pages

| Page purpose | Suitable composition | Shared language to retain |
|---|---|---|
| Form / settings | Title, grouped fields, clear submit/cancel area | White surfaces, readable labels, 24px groups, 48px main actions |
| Record detail / article | Title/context, readable main column, optional related information | Heading scale, calm metadata, dividers, aligned edges |
| Directory / catalog | Title, search/filter controls, list or consistent grid | Panel shapes, action states, clear record names, useful empty results |
| Table / review queue | Title, filters, table with clear row destinations/actions | Forest headings, quiet rules, legible cells, visible selection/focus |
| Conversation / support | Contact context, readable message area, composer | Consistent type/colors, distinguishable authors, labeled send action |
| Editor / task workspace | Task context, main working area, relevant tools | Clear hierarchy, controlled supporting panels, preserved working state |

These are composition suggestions. Add only the elements required by the page's job. Existing table/chat styles elsewhere in the repository are not automatically approved examples of this newer language.

## 12. Optional semantic aliases for fast implementation

This is a **proposed copyable starting block**, not a set of global tokens already present in the app. Attach a neutral class such as `.page-theme` to the page being migrated, adapt it to existing markup, and keep changes scoped until a shared migration is explicitly in scope.

```css
.page-theme {
  --page-bg: var(--color-cream);
  --surface: #fff;
  --ink: var(--color-forest);
  --ink-secondary: color-mix(in srgb, var(--color-forest) 85%, white);
  --border-panel: color-mix(in srgb, var(--color-sand) 50%, white);
  --border-divider: color-mix(in srgb, var(--color-sand) 40%, white);
  --radius-panel: 14px;
  --radius-control: 12px;
  --space-section: 24px;
  --shadow-panel: 0 1px 2px rgb(30 59 47 / 3%);

  background: var(--page-bg);
  color: var(--ink);
  font-family: "Source Sans 3", "Segoe UI", sans-serif;
  font-size: 1.125rem;
  line-height: 1.5;
}

.page-theme .page-container {
  width: 100%;
  max-width: 1248px;
  margin-inline: auto;
  padding-inline: 24px;
}

.page-theme .panel {
  min-width: 0;
  padding: 24px;
  border: 1px solid var(--border-panel);
  border-radius: var(--radius-panel);
  background: var(--surface);
  box-shadow: var(--shadow-panel);
}
```

Use the existing brand tokens instead of inventing near-identical colors. Apply the container treatment to the header too. Set actual component typography, action sizes, focus, responsive behavior, and states deliberately; this block alone is not a complete component stylesheet.

## 13. Boundaries and implementation cautions

- `student-dashboard.css` is intentionally scoped. Its `.student-dashboard` class is an implementation boundary, not the universal class future pages should adopt.
- Classes such as `.btn-primary` are shared across screens, and imported role styles may affect each other. Inspect selectors and CSS load order before broad edits. Prefer a scoped page change for a single-page request.
- The page raises Tailwind `text-xs` and `text-sm` through local variables. This does not increase explicit sizes such as `text-[10px]`. Prefer explicit semantic typography on migrated pages over copying these utility overrides blindly.
- Header popovers still contain small explicit type and clickable notification `<li>` elements. The upload overlay does not currently implement complete dialog focus behavior; its hidden input/label file chooser needs keyboard review. The toast lacks live-region semantics and uses a small dismiss target. Treat these as implementation gaps to address when those controls are in scope, not reusable interaction specifications.
- Some shared icon controls do not receive the page's 44px sizing override. Verify each interactive target; do not assume a page-level accessibility pass.
- Do not copy fixture names, subjects, counts, example dates, equal-weight averaging, specific charts, or the original page's section order into unrelated pages. Reuse their clarity and consistency instead.
- Historical previews and superseded redesign instructions are not additional design requirements. Prefer the latest owner decisions recorded in `context.md` and verified implementation.

## 14. Quick review and future-change prompt

Before considering a restyled page complete:

- Shared edges, spacing, font loading, heading hierarchy, and visual emphasis are consistent.
- White panels, 14px corners, quiet borders, and restrained accents form one system.
- Main actions are at least 48px tall; compact targets reach 44px; focus is visible.
- Text, controls, and meaningful graphics have adequate contrast on their actual backgrounds.
- Keyboard users can navigate, activate controls, dismiss overlays, and return to their previous position.
- Opening tools preserves main-content dimensions and working values; floating panels fit the viewport, scroll internally when needed, and keep Close reachable.
- Long text, filenames, empty results, missing data, validation, and saved states remain understandable.
- Labels reflect actual behavior; summaries and repeated values stay synchronized.
- Existing routes, handlers, state, and destinations still work; no unrelated portal changed.
- Relevant viewport and reduced-motion checks are complete or explicitly recorded as deferred.

Copy this instruction into a future page-change request:

> Read `context.md` and `desgin langauge.md`, then inspect the target page and its dependencies. Restyle [page/file] using this design language. Choose a layout for that page's actual purpose. Preserve its working behavior, routes, data, validation, and state. Reuse the forest/sage/sand/cream palette, approved fonts, shared content edges, spacing, surfaces, and control rules. Keep edits scoped, distinguish recommended extensions from existing components, and check the changed page's relevant states and viewport sizes. Report what changed and what was verified.

### Source map

| Source | What it establishes |
|---|---|
| `context.md` | Latest owner decisions, approved fonts/palette, demo boundaries, deferred phone work |
| `src/index.css` | Actual palette tokens and local font declarations |
| `src/styles/student-dashboard.css` | Current overrides: type, container, surface, row, chart, focus, motion, breakpoint values |
| `src/styles/student-workspace.css` | Assessment theme, answer states, floating tools placement, internal scrolling, responsive fit |
| `src/styles/student.css` | Inherited panel/button/control styles; smaller defaults overridden on the source page |
| `src/pages/student/StudentHome.jsx` | Structure, derived summaries, action labels, states, carousel behavior, upload overlay |
| `src/pages/student/StudentSolvingWorkspace.jsx` | Radio answer groups, question navigation/focus, tool state/dismissal, confirmation and completion |
| `src/components/Header.jsx` and `src/styles/header.css` | Shared navigation, account/notification controls, inherited header styling |
| `src/components/RadarChart.jsx`, `StudentIcons.jsx`, and `Toast.jsx` | Chart palette, icon vocabulary, temporary feedback behavior |
| `docs/student-dashboard-redesign-plan.md` | Approval history and why older layout/content directions were superseded |
