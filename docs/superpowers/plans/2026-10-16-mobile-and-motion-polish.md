# Mobile and motion polish

**Goal:** Refine the existing site for small screens, add the hero's glass material to the footer, and make folder dragging fluid without changing desktop content or the colour palette.

**Direction:** Keep the current page order and desktop layout. Use a full-width, dark frosted footer with restrained blue/sky currents and a readable grid. The mobile menu uses the actual logo, a 48px animated close control, safe-area padding, focus trapping and compact navigation. Partners get an explicit touch invitation and a balanced logo shelf. Mobile services get padded expanded content; reviews stack at their natural heights. Pricing options become a native modal sheet on phones, escaping section clipping and inheriting correct focus/scroll behaviour.

**Motion:** Use pointer capture after horizontal drag intent, frame-driven Motion values and a responsive follow spring. Smooth velocity before using it for file sway, widen the available drag range, keep all file artwork and reflection, and suppress project clicks after dragging. Vertical touch scrolling and reduced motion remain supported.

**Reference:** Inspected the live reference bundle at https://vivekvisualss.vercel.app/assets/index-C_5FuP5h.js. Its folder uses bounded horizontal dragging, individual file trailing and elastic release. Adapt the behaviour to our narrower hero stage rather than copying its full-screen bounds.

- [x] Capture regression failures for mobile menu branding, service expansion padding, review card heights, pricing sheet visibility and bounded folder movement.
- [x] Update `MobileMenu`, `BrandLogo`, `Footer` and the final responsive/material stylesheet.
- [x] Repair mobile pricing sheet containment and focus, preserve desktop options popover.
- [x] Refine folder input, constraints, follow/sway springs and click suppression.
- [x] Check landing page and every route at phone/tablet widths; fix demonstrated overflow or control issues.
- [x] Run responsive interaction checks, folder checks, lint, type checking and production build. Inspect targeted desktop/mobile screenshots.

**Validation widths:** 320, 390, 768 and 1440px. Route coverage includes home, services and all four service details, work and a project, pricing, about, contact, booking and privacy. No live form submissions.

## Results

- Reproduced all five original regression cases before implementation. Added a sixth native touch gesture case; it caught implicit child pointer capture cancelling the assembly capture. Guarding capture-loss handling by its actual target resolved the issue.
- `mobile-refinement.spec.ts`: six tests passed against the production build, covering menu logo/focus, service expansion, review natural heights, partner invitation, pricing sheet selection/focus, native touch drag/vertical scroll and desktop folder release/project access.
- Audited all 20 public pages at 320px and 768px, with no document overflow or oversized content headings/controls. The contact honeypot is intentionally offscreen.
- Confirmed the 667×375 pricing sheet fits entirely in view, including the Done button. Confirmed the tablet menu uses the square logo asset.
- Inspected mobile partners, services, reviews and menu, plus desktop/mobile footer screenshots. Reserved footer control clearance; confirmed no overlap with the floating contact control at 390px or 1440px.
- Final production build generated all 27 routes successfully. Full lint, TypeScript and `git diff --check` passed. Restored build-generated TS configuration changes to their pre-task contents.
- Production preview: http://127.0.0.1:4174. Testing used browser emulation; physical device testing was not available.
