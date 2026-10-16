# Hero project folder implementation plan

**Goal:** Add a tactile, draggable project folder to the hero's right column, with a project viewer and full-screen index.

**Architecture:** Keep the hero copy separate from the interaction. `ProjectFolder` owns bounded drag and independent card springs; `ProjectViewer` owns one native modal dialog for the index and selected project. Reference artwork and clips are local assets described in `content/folder-projects.ts`; they remain visibly credited in the viewer and index.

**Stack:** Existing Next.js, React, Motion springs, native dialog, local WebP images and project clips. No new dependencies.

- [x] Inspect the supplied screenshot, bundled source and stylesheet, and live reference interactions.
- [x] Download the six reference images and three clips requested by the user; optimize images and retain source attribution.
- [x] Add focused interaction tests and confirm the missing folder fails the initial test.
- [x] Build the responsive hero layout, lime translucent folder, distinct card lag, constrained horizontal drag and spring return. Preserve vertical touch scrolling; distinguish clicks from drags; support keyboard project access and reduced motion.
- [x] Build the accessible project viewer, image/video media, animated soft-focus caption, Escape/backdrop close, focus restoration, and Folder/Index navigation.
- [x] Run TypeScript and lint; run the focused browser tests, inspect desktop/mobile screenshots, and fix concrete failures. Respect the user's preference against repetitive browser testing.

## Design decisions

Use the existing charcoal, white and lime tokens and Inter typography. No headline or oversized lettering behind the folder. The hero remains two columns on desktop and stacks on small screens. The folder's movement is bounded by its actual available width; cards have different springs driven by displacement and velocity. On release, the assembly and cards settle back independently. A shallow faded reflection adds depth without a new boxed panel.

The project dialog has a blurred dark backdrop, restrained window controls, a centered image or playing clip, and a staggered blur-to-sharp caption. Index is a full-screen masonry gallery using the same six project assets. Opening a project from Index returns to Index when closed; opening from the folder returns to the hero. Media is lazy loaded outside the initial folder thumbnails. Reference imagery is credited to vivekvisualss, not represented as the studio's client work.

## Asset source

Source: https://vivekvisualss.vercel.app/ (user-provided reference; inspected on 2026-10-16).

Images: `/assets/images/project-01.png`, `projectbig-02.png`, `project-03.png`, `project-04.png`, `project-05.png`, `project-06.png`.

Clips: `/assets/project-videos/kreo.MOV`, `offbeat.MOV`, `cosmos.MOV`. Supplied JavaScript and CSS were read for interaction behavior, not executed or copied wholesale.

## Verification

Production build and TypeScript pass. ESLint reports no errors and one existing warning in `BrandLogo.tsx`. The three focused browser scenarios pass: bounded drag and spring return; project/index navigation with keyboard focus restoration; mobile sizing and reduced motion. Desktop hero, viewer, index and mobile viewer were visually inspected. Local Kreo video playback was confirmed with readyState 4 and advancing playback time. The initial keyboard test was adjusted to wait for hydration, and index project lookups were scoped to the active dialog.

### Pointer and pocket follow-up

Fixed conflicting custom-cursor rules that hid the pointer inside the native dialog. Dismissal now uses one Motion exit with the native modal remaining open until it finishes; repeat interactions are blocked during dismissal. Backdrop dismissal requires the pointer press to originate on the backdrop, so dragging from the preview cannot accidentally close it. Folder cards now share a clipped pocket that keeps their fanned tops free while trimming the lower corners and base.

Both new regressions were reproduced before the fixes. All five focused folder scenarios pass, including mouse dismissal, backdrop gestures, keyboard/index return navigation, bounded drag, and mobile reduced motion. The final pocket shape was checked for zero card hits below its base. TypeScript and targeted ESLint checks pass; `git diff --check` is clean.
