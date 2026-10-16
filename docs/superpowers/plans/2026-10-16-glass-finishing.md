# Glass finishing pass

**Goal:** Floating glass header, visible hero grid behind a frosted colour field, and a quieter glass intro using the existing five-colour palette. Preserve folder drag, reflection, modal behaviour, copy, section order and content grids.

**Design:** Cloud-tinted pill navigation with a fine cloud rim and subtle blue shadow, a clear blue project action, and no header WhatsApp shortcut. Blue/sky light and a small orange warmth under a lightly frosted hero sheet; shallow frost keeps the grid visible. The intro uses heavier frosting over soft palette fields to protect the long statement's readability and blue progress colour. All colour fields stay static; blur only affects background layers. Mobile uses a compact glass pill with its existing accessible menu.

- [x] Inspect header, hero layering, folder reflection, intro progress and responsive styles.
- [x] Remove the header WhatsApp link; retain the shared glyph export used elsewhere.
- [x] Add isolated `styles/glass.css` after the palette/button styles; preserve content and folder geometry.
- [x] Verify build, types and lint, then one focused desktop/mobile glass, navigation, intro contrast and reflection check.

## Verification

Production build passed (22 pages). TypeScript, token synchronisation and lint completed; lint retains only the existing BrandLogo ARIA warning. The focused browser scenario passed desktop/mobile header and grid checks, folder reflection, page text contrast and mobile-menu open/close. Hero and intro desktop screenshots and the mobile hero were visually inspected. The test locator for closing the menu was scoped to its panel to avoid the identically labelled header toggle.

## Header transparency correction

The initial 68?80% cloud gradient compounded with a 42% scrolled fill, making the header read as a solid light surface. Reduced the fill to 9?22%, removed the extra scrolled fill, strengthened the blur/saturation and restrained the rim and shadow. Header text/logo/action colours now adapt to the surface immediately beneath it so dark sections do not require an opaque cloud layer. Surface sampling uses one animation-frame callback per scroll/resize and cleans up on route changes.

Correction verified: production build and TypeScript passed. The focused glass scenario passed, including automatic light navigation on the blue proof section and mobile menu operation. Desktop light/dark and mobile header screenshots inspected; the background now visibly passes through the glass.
