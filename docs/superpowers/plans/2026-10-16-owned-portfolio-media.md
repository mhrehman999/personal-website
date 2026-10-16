# Supplied portfolio media

**Goal:** Replace the interaction-demo artwork with the supplied studio projects, retain the existing layout, and autoplay muted looping deck videos with relevant image fallbacks.

**Plan:**
- [x] Optimise the seven supplied covers as WebP. Transcode the three deck videos to web-ready H.264 with fast-start metadata and no audio. Extract Maneuver's poster from its own video.
- [x] Add one reusable image/video component with poster-first rendering and image fallback on playback errors. Use it for selected work, folder cards, index and viewer. Provide a pause/play control in the viewer.
- [x] Replace the three placeholder work entries with supplied project metadata, leaving descriptions/year/role unfilled until approved. Show the three videos in Selected Work. Populate the folder with Velova, Maneuver, Numa, Cognexo and MISK.
- [x] Remove the reference credit, reference wording and external project links from every folder view. Preserve index/back/close controls, focus restoration, dragging and reflection.
- [x] Map services to supplied images: Branding → Cognexo; Pitch Deck → Velova; Social Media → MISK; Presentation Design → NEECA. Remove the preview-placeholder label.
- [x] Verify media metadata, build, types/lint and one focused browser pass for actual playback, forced video-error image fallback, popup/index cleanup, service previews and mobile fit.

Browser autoplay restrictions can still prevent automatic playback; muted inline looping videos and real posters make the initial and failed states useful. No project descriptions or results are invented.

## Verified outcome

The three 1920px original videos totalled 40,395,232 bytes. The optimised 1600px H.264/24fps fast-start versions total 13,579,963 bytes, with audio removed. Seven supplied covers plus an extracted Maneuver poster are saved under public/work.

Production build passed (27 generated pages), TypeScript passed, palette checks passed (4/4), and lint completed with the existing BrandLogo warning only. One focused media scenario passed: all three deck videos actually played, muted/loop/inline flags were confirmed, a forced error restored the cover image, popup play/pause/index/close worked, credits/external links were absent, all four service previews decoded, mobile viewer fit, and the work page displayed eight supplied projects. Desktop and mobile screenshots were inspected.

Video playback starts when a preview enters view and pauses when wholly offscreen to avoid decoding unseen duplicates. It is never hover-gated. The existing folder reflection and spring drag remain intact. Project descriptions, dates and roles remain empty in the content files.
