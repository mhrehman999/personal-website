# Section colour story

**Goal:** Make all five supplied colours work together through a deliberate section sequence, with restrained orange. Preserve the existing markup, layout, spacing, typography and interactions.

**Research:** Studio Paradis' designer documents neutral and dark-blue rows, with orange providing energy: https://juliabalfour.com/case-study/studio-paradis/. The live site was inspected alongside its first-party case study. Agency.OS' designer explicitly assigns blue the foundation and orange the accent: https://polybox.studio/case-studies/agency-os-branding-3d. Rare Assembly's live About page alternates large warm, powder-blue and neutral fields: https://rareassembly.com/pages/about; its identity designer documents the system at https://www.feelystudio.com/works/rare-assembly. These references inform colour hierarchy and pacing only; none of their structure or palette is copied.

## The sequence

| Existing section | Surface | Foreground / control treatment |
| --- | --- | --- |
| Header and hero | Cloud | Black type, blue headline highlight, one orange opening action |
| Service marquee | Blue | Cloud lettering, small orange separators |
| Introduction and services | Cloud | Black reading text; blue scroll highlight and links |
| Work gallery | Black | Cloud text; sky details; original artwork colours |
| Approach | Cloud | Black cards and copy, blue handoff card |
| Reviews and partners | Blue | Cloud text and controls, deeper blue cards, light logo tiles |
| Pricing and FAQ | Cloud | Black reading text, consistent blue controls |
| Closing invitation and email | Sky | Black text, orange primary closing action |
| Footer | Blue | Cloud wordmark and navigation |

Black on cloud, cloud on blue, and black on sky are the repeating foreground pairs. Orange carries black text when used as a button fill. On light grey, text highlights and focus rings use blue; on blue they use cloud; on sky they use black. Colour changes do not change section geometry.

## Files and checks

- [x] Modify semantic roles in `styles/tokens.css`; keep the five exact primitives unchanged.
- [x] Add `styles/section-colors.css` and import it last in `app/layout.tsx`; apply scoped palette roles and background paint only.
- [x] Separate fixed black shadows from local section canvases, and update booking/share colour roles.
- [x] Update palette checks and `docs/brand-palette.md` to describe the final system.
- [x] Verify token synchronisation, types, lint and isolated production build; run focused contrast/responsive/preview checks and inspect the section sequence.

## Verified outcome

- Exact palette and synchronised SVG outputs: four Node checks passed.
- TypeScript passed; ESLint completed with zero errors and the existing BrandLogo ARIA warning.
- Isolated Next.js production build passed and generated all 22 pages.
- Two focused browser checks passed: preview SVG decoding and palette/contrast checks across home, pricing and contact, folder open/close, and 390px/320px overflow.
- Desktop, mobile, wide review surface, partners artwork, closing invitation and footer inspected. Section paint fills wide gutters without moving the content grid.
