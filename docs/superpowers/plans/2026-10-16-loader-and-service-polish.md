# Loader and service polish implementation plan

**Goal:** Carry the reference's rolling counter, progress line and blur dissolve into a faster, branded entrance, then apply the requested text and service interaction refinements without changing the page layout.

**Architecture:** A small client loader belongs to the persistent SiteShell. Its pending/loading/revealing/ready lifecycle gates hero entrance animations. It waits for fonts and visible hero cover images, has a bounded timeout, restores scrolling and interaction, and does not replay on client navigation. CSS owns visual motion and service colour transitions.

**Reference inspection:** https://vivekvisualss.vercel.app/ and its supplied JavaScript. Baseline: black full-screen canvas, short uppercase text at roughly 20vh, bottom-centred rolling 1–100% counter, 3px top progress line; 1.4s lead-in, 3.8s progress, 1.4s hold, .95s blur/scale/fade exit. Preserve that composition and rolling mechanism, then adapt to the portfolio: small studio signature, cloud type, orange counter/progress, restrained blue glow, Anton display face, about three seconds total for ready assets, coordinated hero handoff. Do not preload full videos or delay client route changes.

- [x] Add a lifecycle browser regression and observe it fail before implementation.
- [x] Implement `SiteLoader.tsx`, `styles/site-loader.css`, and SiteShell integration. Font/cover readiness, smooth rolling progress, 100% settle and dissolve; a 4.5s readiness cap, reduced-motion bypass, non-JS fallback and effect cleanup.
- [x] Gate hero word, actions, folder and file entrances until reveal; preserve the grid and reflection.
- [x] Make only the requested intro and selected-work labels orange. Uppercase hero support copy.
- [x] Give Explore services a black pill, clear label and orange icon disc, with an orange hover state.
- [x] Service rows transition to orange / black with charcoal-grey numbers. Keep the existing image preview and arrow movement; orange arrows retain legibility on hover with a black icon disc. Apply an equivalent keyboard focus state and respect reduced motion.
- [x] Build, type/lint checks and focused desktop/mobile/reduced-motion/no-JS verification. Inspect loader and service screenshots.

## Follow-up refinements (same authorised pass)

- Glassy blue-text hero eyebrow, Scroll to explore pill with a wider indicator, and See our work with a smooth hover lift.
- Revert only the selected-work eyebrow's orange colour. Share the filled Explore services action component with All work and Explore packages, including service-page package links.
- Better in orange, together in black; opened FAQ question and plus/arrow in orange.
- Keep the actual logo in the page header, add the same supplied logo to the loader signature, and enlarge the rolling counter window/row leading so the digits have adequate room on mobile and desktop.
- Crossfade the folder face to orange with black text on hover; crossfade Index to blue/cloud while retaining its hover pause.
- Loop NOTICE blue/orange/blue and draw/erase a black curved underline independently of its word entrance. Freeze both appropriately for reduced motion.
- Latest instruction supersedes the intro-label colour: remove "The right work changes what's possible" entirely; retain the main statement, palette currents and an accessible section name.


Validation: production build passed for 27 routes with no lint warnings; typecheck passed. Focused browser checks passed for the desktop loader/hero handoff, all hover and active states, NOTICE colour/arc animation, client navigation without loader replay, failed covers plus a never-ready font, mobile 100% counter bounds, 390/320px reduced-motion layout and non-JavaScript access. Screenshots reviewed for hero glass, the orange folder face, service hover and the complete mobile 100% counter/logo. Mobile, reduced-motion and non-JavaScript scenarios run as separate Playwright fixtures to avoid retaining multiple video-heavy pages during teardown; a virtual clock holds the counter at 100% for a deterministic glyph-bound check.
