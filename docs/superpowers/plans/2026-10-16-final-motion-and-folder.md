# Final hero, folder and accent pass

Preserve the site grid, supplied project media, glass header and palette. Apply every requested finishing item:

- [x] Re-fan five sheets, use a different palette colour for each extension, widen/flatten the folder slightly, soften shadows/reflection and modestly increase drag bounds. Follow-up correction: remove the pocket mask entirely; place the file bottoms above the folder base so the outer fan stays complete.
- [x] Remove the visible project count/dot, drag hint, folder number, process footnote and review counter. Rename the front label exactly `Projects Folder`; retain accessible drag instructions and review position announcements.
- [x] Promote the existing licensed Anton font into a shared local font. Hero headline reveals by word, with staggered eyebrow/body copy, folder drop and file entrance. Keep normal authored line breaks and mobile fit. Reduced motion shows all content immediately.
- [x] Repair the service marquee: each repeated group covers the viewport, includes boundary separators, and wraps using the measured group width. No hover freeze. Reduced motion remains static.
- [x] Intro title and statement become larger, bold and uppercase; preserve the copy and scroll colour progress. Add slow transform-driven blurred palette currents behind the glass; freeze for reduced motion.
- [x] Contain service-preview artwork and make the process CTA orange with a black icon disc/orange arrow. Follow-up: the preview caption strip is black with cloud text.
- [x] Follow-up correction: revert the orange section-label change and its dark badge backgrounds only, keeping the previous section-specific subheading colours.
- [x] Verify build/types/lint and a focused normal/reduced-motion desktop/mobile pass: entrance timing, marquee coverage, drag bounds, unmasked sheet geometry, responsive type and complete preview images.

Validation: production build passed (27 pages), typecheck passed, lint has no errors (one existing BrandLogo ARIA warning), four palette tests passed. Both focused browser cases passed, covering normal desktop motion and 390/320px reduced-motion mobile. Desktop and mobile screenshots visually reviewed. Service hover test waits for scrolling to settle because the preview intentionally hides during scroll.

## Liquid background visibility correction

The previous colour fields were only 14–36% opaque and then covered by 82–86% opaque cloud glass, suppressing almost all visible colour and motion. Use overlapping, softly blurred palette tints at full opacity behind 12–22% cloud glass instead. Wider transform paths and independent 12/15/18-second cycles make the currents apparent without animated filters. Keep the blue scroll-progress text legible against the lightened fields. Enlarge the intro title to 32–44px desktop / 28–36px mobile using the same bold display face as the statement, both uppercase. Preserve the previous section-label colours everywhere else and the reduced-motion fallback.

Correction verified: production build passed, both focused browser cases passed (52.7s), and screenshots at two animation phases show visible movement of the blue/sky/orange field. Black preview caption and complete contained artwork visually reviewed. Intro text fits at 390px and 320px; reduced-motion users retain the static colour field.

## Hero finishing adjustments

- Make the intro label a single, subordinate uppercase line (16–24px), preserving the large statement and liquid background.
- Give hero content a modest additional header clearance, including an explicit 100px mobile top inset so the fixed header cannot overlap its eyebrow.
- Extend hero glass to all four edges, without its old border, rounding or inset shadow. Its lower edge meets the marquee directly.
- Add two independent, gently moving colour fields confined to a soft-masked region behind the folder. Preserve the visible grid, folder reflection and existing entrance motion.
- Style Index with translucent orange glass, a light inset edge and a five-pixel vertical float. Hover and keyboard focus pause the float; reduced motion disables it.
- Uppercase the existing hero headline while preserving authored lines and word entrances. Verify the longer uppercase words fit at 320px and 390px.

Verified: production build and typecheck passed. Focused desktop and mobile browser cases passed, including the full-bleed glass edge meeting the marquee, contained hero gradient motion, Index float/pause/resume, folder reflection and both text levels fitting at 320/390px. Desktop hero/intro and mobile folder screenshots visually reviewed. The animated Index hover check uses direct pointer movement because Playwright's locator hover waits for a stable element.
