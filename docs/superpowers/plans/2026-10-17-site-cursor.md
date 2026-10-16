# Site cursor implementation plan

**Goal:** Add a restrained, responsive custom cursor that belongs to the studio palette across all routes.

**Design:** A precise orange point inside a thin blue halo, with a cloud edge for contrast on dark sections. Links expand to a translucent orange halo that preserves label visibility; project links show a compact orange View cue with an arrow. Position follows the pointer directly; only hover shape changes ease. No trailing particles, live blur or perpetual animation.

**Architecture:** Mount one `SiteCursor` in `SiteShell`, outside the inert page container. One coalesced animation frame writes its transform, with no React state updates or layout reads on pointer movement. Restore native cursors for editing, selection, dragging, embedded calendars, dialogs, touch, reduced motion, keyboard use and window exit. The footer shares this lightweight cursor without changing its gradient animation.

**Tech stack:** React refs/effects, Pointer Events, CSS transforms, existing palette tokens, Playwright Chrome.

- [x] Add focused browser coverage in `tests/e2e/site-cursor.spec.ts`; confirm the shared cursor is absent before implementation.
- [x] Create `components/shell/SiteCursor.tsx` and `styles/cursor.css`; mount in `components/shell/SiteShell.tsx`, import stylesheet from `app/layout.tsx`, remove the old home-only component and its mount in `app/page.tsx`.
- [x] Remove superseded cursor rules from `styles/home.css`, `styles/section-colors.css`, `styles/social-proof.css`, `styles/project-folder.css`, `styles/inner-pages.css` and `styles/site-loader.css`. Update the footer regression assertion to the new site-wide cursor behavior.
- [x] Verify movement, link/project/pressed states, route changes, footer behavior, native controls/dragging, keyboard/window exit, touch and reduced motion. Inspect desktop screenshots. Run lint, typecheck, build and focused browser regressions.

**Commands:** `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run build` with the existing isolated `NEXT_DIST_DIR`, then `npx.cmd playwright test tests/e2e/site-cursor.spec.ts tests/e2e/footer-glass.spec.ts tests/e2e/inner-pages.spec.ts` against production Chrome.

**Verification:** Confirmed the initial shared-cursor test failed on the old build. Final production build, lint and type checks passed; all eight focused Playwright Chrome checks passed. Coverage includes exact tracking, idle updates, palette colors, hover and press states, route changes, footer motion, native fields/dropdowns, captured folder dragging, dialog dismissal, keyboard/window exit, reduced motion, forced colors and touch. Desktop hero, link, project and footer previews were inspected; the production preview reported no page errors. Original TypeScript configuration files were restored after the isolated build.
