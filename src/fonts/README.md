# Project fonts

The owner selected **Bree Serif + Source Sans 3**, comparison option 1, on 6 November 2026. These are the original font binaries, unchanged, and are not installed system-wide. They are now **applied to the sign-in page and student dashboard** through shared local `@font-face` declarations in `src/index.css`. Font-family rules remain scoped to those screens; other portal pages retain their existing system fonts.

| Family | File | Weight / style | Intended role |
|---|---|---|---|
| Bree Serif | `bree-serif/BreeSerif-Regular.ttf` | 400, normal | Zinger School title / wordmark only |
| Source Sans 3 | `source-sans-3/SourceSans3[wght].ttf` | Variable 200–900, normal | All UI headings, labels, buttons, inputs and body text |
| Source Sans 3 | `source-sans-3/SourceSans3-Italic[wght].ttf` | Variable 200–900, italic | Italic emphasis within UI text |

## Sources and licenses

- **Bree Serif**, by TypeTogether: https://github.com/google/fonts/tree/main/ofl/breeserif. Original copyright notice and SIL Open Font License 1.1 are in `bree-serif/OFL.txt`.
- **Source Sans 3**, by Paul D. Hunt / Adobe: https://github.com/google/fonts/tree/main/ofl/sourcesans3. Original copyright notice and SIL Open Font License 1.1 are in `source-sans-3/OFL.txt`.

Retain each family's original license with the files. No font has been converted, subsetted or otherwise modified. Bree Serif and the normal Source Sans 3 font were copied byte-for-byte from the verified official downloads used in the isolated comparison; the matching italic font was downloaded from the same official repository. Font signatures were checked, and local character-map inspection confirmed **Ä Ö Ü ä ö ü ß** in all three files.

## Usage

- Use **Bree Serif 400** only for the school name. It has no bundled bold style; do not synthesize bold. Start around 32–40px.
- Use **Source Sans 3 700** for headings, **600** for labels/buttons, and **400** for body/input text. The shared declaration specifies the normal variable font's weight range as `200 900`, with `font-display: swap`; each screen retains a system sans-serif fallback. The italic file is available but is not currently loaded.
- Suggested starting sizes: main headings 28–36px, labels 16px, buttons 18px, body text 18–20px, secondary text 16px. Use 1.5–1.6 line height for paragraphs. Verify actual content at desktop and narrow widths before finalizing sizes.
- Preserve the existing login layout, illustration and palette. Keep a system sans-serif fallback. Do not reuse the exaggerated sizes from the rejected Fibel trial.
- Implemented login sizes: Bree Serif wordmark 36px desktop / 28px narrow; Source Sans 3 heading 36px desktop / 32px narrow, labels/secondary text 16px, and body/input/button text 18px. The original panel split and 400px maximum form width are preserved.
- Student dashboard increment 1 uses a 32px Bree Serif wordmark, 40px Source Sans 3 welcome, 22px section headings, 18px task titles, and 16px supporting UI text. Its styles are scoped in `src/styles/student-dashboard.css`; phone validation is deferred at the owner's request.
- Scholar Block, Fibel Nord, Fibel Sued and Eskool have been deleted from `src/fonts/`. Halvarson was removed earlier. Other pairing samples are preview assets only in the ignored `.aider-desk/font-pairings/` folder.

See `context.md` for the current project-wide typography decision.
