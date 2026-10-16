# Colour and component polish

**Goal:** Resolve colour regressions and improve the existing palette and controls without changing section order or content layout.

**Design:** Keep cloud reading surfaces, a black work gallery, a blue proof chapter and a sky invitation. Give both marquees a separate surface. Use a black footer so the orange signature has sufficient contrast. Repeat filled primary, outlined secondary and quiet inline link treatments. Use cloud and blue for card hierarchy rather than heavy black shadows. Recolour the partner chairs to blue, sky, cloud and charcoal, with an orange seat revealed on hover. Add the supplied ASUS logo at the existing compact size.

**Root cause:** GSAP moves the selected-work section into a `.pin-spacer`; the direct-child colour selector then stops matching. Its inherited black foreground becomes invisible on its dark surface. Theme foreground and full-width paint must be applied directly to the themed section, independent of the pin wrapper.

**Files:** `styles/section-colors.css` owns the palette scopes and section shading. `styles/buttons.css` owns shared control colours and states. `styles/pricing.css` retains pricing geometry. Existing section components get shared button classes only. Partner assets and `content/partners.ts` receive the new artwork/logo. Existing palette browser coverage is extended to exercise the actual pinned gallery and pricing selections.

- [x] Verify the pinned heading failure in normal motion; add a regression assertion.
- [x] Correct theme scoping; establish shared button state tokens and apply section links consistently.
- [x] Refine approach, reviews, pricing and footer surfaces; separate the marquees; orange footer signature.
- [x] Add ASUS and replace both aligned partner artwork states with the revised palette.
- [x] Run token checks, types/lint and isolated production build. One focused browser pass for normal-motion heading, pricing selections/hover, contrast, partner hover, and mobile overflow; investigate concrete failures only.

## Verification outcome

- Confirmed the pinned heading regression before the fix: actual black text instead of cloud. The normal-motion regression now passes.
- Production build generated all 22 pages successfully; TypeScript passed. ESLint reports zero errors and the existing BrandLogo ARIA warning.
- All four Node palette checks passed.
- The focused browser pass passed SVG decoding, palette and text contrast across home/pricing/contact, live pricing selection and hover states, partner hover/ASUS, modal close, and page overflow at 320px/390px.
- Visual review found a pricing CTA extending into the inner padding at 320px. Added narrow-screen sizing and a targeted containment check; it passes at 320px and 390px after font loading.
- Inspected approach, reviews, pricing, partners hover, footer, and the pinned work heading. No section order, content or grid changes.
