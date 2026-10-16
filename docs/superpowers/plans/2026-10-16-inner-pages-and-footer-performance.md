# Inner pages and footer performance

**Goal:** Finish the studio's contact, About, work, pricing, service and sub-service experiences using the established palette, concise copy and real portfolio assets.

**Design:** Keep Cloud as the reading canvas, Blue for depth, Orange for actions and the footer name, Sky for quiet shading, and Black for artwork. Use the existing Anton display face and Inter text. Inner-page heroes pair direct, specific copy with real work where useful. Preserve the landing page's structure, three selected videos and five folder projects. Add the five supplied images together as a Perspective branding project; use them only on portfolio and service pages.

**Content boundaries:** Write useful service, studio and enquiry copy. Do not invent prices, years, results, credentials, response guarantees or fixed commercial terms. Existing project descriptions awaiting user input remain unchanged. Explain scope, file formats, timing and revisions as matters agreed in the brief. Do not publish work or send live enquiries.

**Performance evidence:** The existing footer spring needs about 637 ms to reach 90% of its target in a production browser check. Its moving large gradients sit under a live 32px backdrop blur; the landing-page cursor also hides the native cursor over the footer. Replace this with one compositor-transform light, cached bounds and a short, time-corrected frame follow loop. Keep the frost appearance using pre-softened gradients and static highlights, and show the native cursor in the footer. Stop frame work when settled/offscreen/reduced motion is active.

- [x] Add focused regressions for missing content, service hover previews, child-service links/prefill, portfolio isolation and footer response.
- [x] Optimise and import the five supplied Perspective images; build its portfolio record/gallery without adding it to landing-page collections.
- [x] Author four concise service summaries, full parent service content and nineteen specific sub-service descriptions/scopes/deliverables. Create shared parent/child page templates.
- [x] Share landing-page service interactions with the services overview, retaining mobile expansion and using Perspective only in the overview/detail variants.
- [x] Replace About demo sections with a studio introduction, principles, existing process and partner sections. Polish contact and pricing around real enquiry/brief flows.
- [x] Polish portfolio filters, empty states and full-artwork case-study galleries.
- [x] Fix footer input/rendering cost, make column headings bold, and add a restrained white wordmark outline/shadow.
- [x] Verify meaningful interactions, all new routes and mobile layouts; compare footer response, inspect targeted screenshots, run lint/type checks and build, then refresh the production preview.

**Validation:** Phone 320/390px, tablet 768px, desktop 1440px; contact validation/prefill without sending; filters, service hover/focus/touch, sub-service route coverage, landing isolation, footer native cursor/light/reduced motion. Preserve all unrelated current workspace edits.

## Verification results

- Production build succeeded (47 generated pages), lint and TypeScript checks passed.
- Seven focused production browser tests passed: footer follow/settle/reduced motion, mobile menu, authored copy and landing isolation, overview hover/colour, child enquiry prefill, mobile service expansion, pricing options/focus.
- All 19 child service routes and About, Contact, Pricing and Work returned 200 with useful copy and no content/control overflow at 320px. About, Contact, Branding, Pricing and Work fit at 768px; desktop captures inspected at 1440px, phone captures at 390px.
- Portfolio gallery and partner images decoded successfully; inspected supplied artwork with contain fitting and the loaded partner scene. Five Perspective assets total approximately 982KB. No new project added to home collections or landing service previews.
- Production footer uses the native cursor, bold column headings, a white wordmark stroke, static frosted sheen and a single transform-only light layer. Instrumented 90% follow response was under 100ms (approximately 34ms in the recorded run), compared with approximately 637ms before. No runtime errors during the footer check. Automated desktop measurements do not substitute for testing every physical device.
- Canonical palette sync check and all four design-token tests passed. Existing unrelated workspace changes preserved. Production preview refreshed at http://127.0.0.1:4174. No deployment or live enquiry sent.
