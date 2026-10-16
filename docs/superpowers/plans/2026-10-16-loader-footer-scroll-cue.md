# Loader, footer control and scroll cue polish

**Goal:** Separate loader copy/counter at all supported screen sizes, correctly position back-to-top, and refine the hero scroll marker around the supplied palette.

**Evidence:** At 1920x720 the loader note ends at y=463.8 while the animated counter starts at y=400. The absolutely positioned message does not participate in the counter's layout. Footer back-to-top ends 72px inside the footer content edge because of inherited floating-widget clearance, and mobile flex wrapping puts it beside the legal row.

**Design and implementation:** Use three actual loader grid rows (signature, message, counter) with reserved gaps and viewport-height-bounded type; preserve the full odometer row window and entry lifecycle. Use a footer bottom grid with the button on the right, copyright beside it on phones and legal links on a separate row, reserving bottom clearance for WhatsApp. Retain a 48px touch control, add a proper SVG arrow and orange progress ring. Keep hero pill text blue and its glass material; use one full-size SVG down arrow with a blue/orange/blue motion loop in a softer glass capsule. Reduced motion is static orange.

**Alternatives:** Shrinking only the loader digits would leave the absolute-flow overlap brittle. Moving the footer control into the viewport would compete with the contact widget. The chosen flow layouts reserve space explicitly while retaining the site's structure.

- [x] Capture failing geometry/colour checks for loader, footer and cue.
- [x] Implement scoped layout, SVG and colour/motion changes.
- [x] Verify short/phone/desktop sizes, full counter ink, scroll actions, reduced motion, visuals and production checks.

**Verification:** All three new regressions failed before implementation. Five production browser tests pass after the changes: loader row separation across 1920x720, 1440x640, 390x568, 844x390 and 320x480; footer edge alignment and WhatsApp clearance at desktop/tablet/phone widths; scroll-cue colour keyframes, reduced motion and anchor action; existing loader handoff/client navigation; full mobile 100% glyph bounds. Inspected wide, phone and landscape loader captures, the completed scroll cue, and phone footer placement. Lint, TypeScript and production build pass. Configuration restored after build. Preview refreshed at http://127.0.0.1:4174.

**Scroll-cue revision:** After user feedback, removed the nested circle/bar and orange outlined outer frame. The control now has a single 24px arrow, balanced spacing, subtle glass and hover lift. Removed the scroll-triggered fade: it previously disabled the cue before it was fully reached on mobile. The mobile click regression failed before that correction and now passes.

**Final combined check:** The revised arrow control, mobile anchor activation, loader row spacing, full mobile percentage glyphs, entry handoff and footer positioning pass in the final eight-test production run alongside the consultation tests.
