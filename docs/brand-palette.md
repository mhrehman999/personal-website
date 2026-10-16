# Website colour system

The five exact supplied colours live in `content/palette.json`. Primitives feed semantic roles in `styles/tokens.css`; `styles/section-colors.css` scopes those roles to existing sections. Typography, spacing, markup and interactions remain unchanged.

| Colour | Hex | Role |
| --- | --- | --- |
| Orange | `#F63B05` | Opening/closing actions, footer signature and the new partner seat |
| Cloud | `#C8D1D9` | Main reading canvas; foreground on dark and blue surfaces |
| Blue | `#2B4F9C` | Links, headline highlights, regular controls, proof chapter and custom pricing card |
| Sky | `#5085C5` | Service ribbon, closing invitation, folder light and dark-gallery accents |
| Black | `#070707` | Main reading ink, image gallery and viewer, fixed shadow colour |

## Page flow

The cloud hero introduces one orange action and a blue headline highlight. A sky service ribbon introduces the softer blue. Introduction and services return to cloud for reading. Black gives the work gallery a separate image-viewing canvas. The approach returns to cloud with a blue handoff card. Reviews and partners share one continuous blue field. Pricing and FAQ return to cloud. A cloud marquee separates the invitation from the reading sections. Sky opens the closing invitation and email band, then black grounds the footer and its orange signature.

The same pairs repeat: black on cloud, cloud on blue, black on sky and black on orange. Blue highlights on cloud replace orange text because orange on cloud has insufficient text contrast. On dark gallery surfaces the accent becomes sky; on blue it becomes cloud; on sky it becomes black. Focus rings follow these readable local roles. Fixed shadows use black independently of section backgrounds. Card shadows are lighter, with restrained blue shading. Blue surfaces carrying cloud body copy limit sky-lightening to 12% for contrast.

## Research

[Studio Paradis](https://juliabalfour.com/case-study/studio-paradis/) demonstrates neutral and deep-blue rows with orange energy. [Agency.OS](https://polybox.studio/case-studies/agency-os-branding-3d) gives blue the foundation and orange the accent. [Rare Assembly](https://rareassembly.com/pages/about) uses recurring warm, light-blue and neutral fields; [Feely Studio](https://www.feelystudio.com/works/rare-assembly) documents its identity. These inform hierarchy and pacing without copying their layouts or colours.

## Maintenance and checks

Edit the JSON and run `npm run tokens:sync`. Dev and production build commands run this automatically. The script updates CSS primitives and four standalone service-preview SVG palettes. Booking and Open Graph artwork import the JSON directly. Partner logos, supplied project artwork, photographs and the original brand logo retain their asset colours.

`npm run test:tokens` verifies exact values, generated outputs, legacy-colour removal and text/surface contrast. `npm run tokens:check` checks synchronisation without writing. `tests/e2e/palette.spec.ts` checks actual rendered section colours, contrast, modal operation, desktop/mobile overflow and SVG decoding.

## Buttons and component materials

`styles/buttons.css` defines filled primary, outlined secondary, small secondary navigation buttons, quiet underlined inline links, and explicit disabled/hover/icon states. Root actions use blue/cloud; opening and closing actions use orange/black. Outline buttons invert to black/cloud on light and sky surfaces, cloud/blue on blue surfaces, and cloud/black on dark surfaces. Footer links highlight orange on black; email actions hover black/cloud. Disabled pricing controls use opaque neutral colours instead of faded blue.

Approach cards sit in a blue-grey tray with a blue handoff. Reviews pair a cloud score tile with shaded blue quote cards. Pricing pairs a cloud brief builder with a blue custom card. ASUS joins the four existing compact partner logos. The partner scene uses blue, sky, cloud and charcoal chairs, with an orange seat appearing on hover; only that seat crossfades to keep surrounding furniture stable.

The pinned work gallery applies its foreground and background directly, including inside GSAP?s pin wrapper. The normal-motion regression test covers that path separately from reduced-motion checks.

## Glass surfaces

`styles/glass.css` layers static orange warmth and sky/blue light under a shallow hero frost, keeping the blue grid readable. The folder reflection and its independent glass front remain intact. The intro uses stronger cloud frosting over palette colour fields to protect black-to-blue progress text. A floating cloud-glass header uses the existing blue project action and responsive menu, without the header WhatsApp shortcut. Low-power and unsupported-backdrop cases retain opaque, readable surfaces.
