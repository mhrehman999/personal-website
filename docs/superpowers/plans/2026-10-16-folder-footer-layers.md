# Folder and footer layer corrections

**Goal:** Fill the visible blue extension of the Velova hero file with previously supplied Charles Cross artwork while preserving the upper playing preview, and remove rectangular seams from the pointer-responsive footer light.

**Design:** Keep the existing five-file arrangement, video, reflection, drag and popup behaviour. Place a decorative still inside the same file's lower region, starting exactly after the 16:9 video artwork. Use the earlier Charles Cross cover, avoiding the newer Perspective images reserved for inner pages. Keep the footer's static grid and frost highlights. Extend the single compositor light plane beyond its maximum 220px horizontal / 110px vertical movement, with transparent radial edges and no live blur.

**Alternatives considered:** Adding a sixth file would change the fan and interaction count; replacing the video would hide requested motion. A lower image layer in the existing file preserves both. Adding blur to hide the footer seam would reintroduce the rendering cost; overscan fixes its geometry directly.

- [x] Reproduce missing lower image and footer light coverage failure with two focused browser regressions.
- [x] Add the lower artwork layer and overscan the footer light.
- [x] Verify desktop/mobile image placement, video playback, footer extremes/settling, targeted visuals and code checks.

**Evidence before fix:** At right/top pointer input the footer starts at x=0,y=173.8, but its light starts at x=219.95,y=63.86 and ends at y=890.12 before the footer's y=1000.09 bottom. Both focused tests fail for the reported conditions.

**Verification:** Both regressions failed before the change and passed afterward on the refreshed production preview (2/2). The four focused development checks, including footer settling/reduced motion, passed. Inspected desktop and mobile folder artwork plus footer at left/right cursor extremes. The video continues playing; the still begins after the video image and covers the remaining sheet. Lint, TypeScript and production build pass. Configuration files restored to their pre-build contents. Preview: http://127.0.0.1:4174.
