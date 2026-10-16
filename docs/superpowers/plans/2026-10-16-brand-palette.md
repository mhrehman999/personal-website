# Brand palette migration implementation plan

**Goal:** Apply the five supplied colours consistently across the website without changing its layout, content, or interactions.

**Architecture:** Store the exact palette in `content/palette.json`. Generate the primitive CSS block and standalone SVG palette blocks from that file, then map the existing semantic CSS variables to those primitives. Booking and Open Graph rendering import the same JSON. Existing reference artwork and partner logos retain their original colours.

**Stack:** Next.js, CSS custom properties and colour mixing, existing Motion/GSAP, a dependency-free Node token synchronisation script and Node tests.

The final role assignment and page sequence are documented in [Section colour story](2026-10-16-section-color-story.md) and [Website colour system](../../brand-palette.md). The original orange-first role proposal below is superseded by that section system.

## Original role proposal

| Primitive | Exact colour | Role |
| --- | --- | --- |
| Orange | `#F63B05` | Primary actions, focus, links, highlights, scroll colour |
| Cloud | `#C8D1D9` | Main foreground and light surfaces |
| Blue | `#2B4F9C` | Secondary surfaces and folder depth |
| Sky | `#5085C5` | Supporting detail, blue highlights and folder lighting |
| Black | `#070707` | Main canvas and ink on orange / sky |

Black on orange has 5.32:1 contrast; cloud on black 13.02:1; cloud on blue 5.03:1; black on sky 5.28:1. Cloud text must not be placed on solid sky, and orange text must not be placed on solid blue.

## Implementation

- [x] Audit CSS, embedded colours, vector preview artwork, calendar and social share rendering.
- [x] Add regression checks for the exact palette, synchronised outputs and removal of the old lime UI colours; confirm they fail before migration.
- [x] Add palette source, sync script, semantic/component tokens and Tailwind aliases.
- [x] Migrate hard-coded surfaces, borders, hovers, gradients, modal controls, the folder, service previews, booking and share image.
- [x] Run token checks, TypeScript, lint and production build. Perform one focused visual/contrast pass on desktop/mobile and representative secondary pages; investigate only concrete failures.

## Verification scope

Check exact primitive values; readable action/foreground pairings; folder/card clipping and modal close behavior; scroll-driven text colour; compact partner sizing; primary and secondary buttons, selected pricing controls, form inputs and footer. Preserve spacing, typography, asset attribution and all earlier requested interactions.
