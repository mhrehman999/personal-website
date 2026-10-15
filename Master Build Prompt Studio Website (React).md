# Master Build Prompt: Brand, Pitch Deck and Presentation Studio Website

Prepared for Haris, 14 October 2026. Part 1 is the analysis and plan. Part 2 is the master prompt: paste everything under the Part 2 heading into your coding agent (Claude Code, Cursor, etc.).

## Part 1. Analysis and plan

### 1.1 How the reference site is built (afirmglobal.com)

1. Fixed header: logo, four links, an outlined mailto button, and a side-menu toggle.
2. Hero: an oversized grotesk statement on black with a red chevron accent, a short supporting line at the right, scroll-pinned.
3. Intro statement and a promo video.
4. A huge year range heading (2018 to 2026) with a paragraph and an About link.
5. Selected work: six project cards in a horizontal strip with an Explore All link.
6. Capabilities: five numbered rows (001 to 005), each a heading plus a short paragraph linking to its page.
7. About block with two images and a values paragraph.
8. Testimonials: a mix of text quotes and YouTube video cards.
9. Approach: four numbered steps (research, position, build, scale).
10. Closing CTA, then a looping marquee of the line Let's work together.
11. Footer: logo, service links, navigation, social icons, copyright.

### 1.2 Where it falls short (what we fix)

The screenshot is a full-page capture, so some of this may be scroll-trigger artefacts, but each one is a real risk.

- Large empty black zones where scroll-revealed content has not appeared. Content that is invisible until JavaScript animates it is fragile.
- Hero headline overlaps and clips in the capture; supporting text is tiny against giant type, so hierarchy is weak.
- One conversion path only: a mailto link. No form, no messaging channel, no booking, no packages.
- Placeholder phone number and address in the menu panel hurt trust.
- Testimonial cards are cut off, formats are uneven, and YouTube iframes load up front.
- Five overlapping capabilities (marketing, social, AI) blur the offer. Ours is four clear services.
- Built on a page builder, so the DOM and CSS are heavy.
- Spacing and type feel unsystematic from section to section.

### 1.3 What we borrow from the second reference (Lynxify)

Numbered service cards, a process strip, an FAQ accordion, a trust strip, and a closing form section. We borrow patterns only.

### 1.4 Originality rule

Replicate structure and interaction patterns, never the copy, logo, imagery, or code of either reference site.

### 1.5 Decisions made for you (change any of them)

- Framework: Next.js App Router with React and TypeScript. It is still React, but gives proper SEO, image optimisation, and a server route for the contact form.
- Fonts: Inter Tight for display (the closest free match to the Sequel Sans look), Inter for body, and a Baskerville italic for accent words only. Use Fry's Baskerville if you hold a licence; otherwise Baskervville from Google Fonts. Swapping any font is a one-line CSS variable change.
- Brand name placeholder: MH Rehman, inferred from your email domain. Confirm it.
- No prices were given, so the pricing UI shows Get a quote until you add numbers.
- Sub-services for Pitch Deck and Presentation Design are proposals; edit them in one data file.
- Dark theme only, with the lime accent used on roughly 5 to 8 percent of any screen.

### 1.6 Plan of work

1. Lock design tokens, type, and the motion system.
2. Build the global shell: header, mobile menu, WhatsApp widget, email band, footer.
3. Build the home page sections.
4. Build services pages, pricing with the package builder, contact, and booking.
5. Add the portfolio system (you fill it).
6. Accessibility, performance, SEO, deployment, QA.

## Part 2. MASTER PROMPT (paste from here)

You are a senior front-end engineer and motion designer. Build a production-grade marketing website exactly as specified below. Follow this document literally.

### 0. Rules of engagement

1. Build only what is specified. Where information is missing, use clearly marked placeholders in /content (tagged TODO). Never invent prices, client names, testimonials, statistics, or awards.
2. Use only the five brand colours below and alpha variants of them. No other hex values anywhere in the codebase.
3. Every animation must have a defined mobile behaviour and a reduced-motion fallback.
4. Do not copy text, logo, imagery, or code from afirmglobal.com or any reference site.
5. Work phase by phase (section 16). After each phase run typecheck, lint, and build, and fix everything before continuing.
6. One source of truth each: content in /content, tokens in /styles/tokens.css, motion constants in /lib/motion.ts, site settings in /content/site.ts.

### 1. Project brief

A studio website selling four services: Branding, Pitch Deck, Social Media, and Presentation Design. Audience: founders, startups, SMEs, and marketing teams who need sharp brand and presentation work. Tone: confident, plain, premium. The brand name is BRAND\_NAME (placeholder: MH Rehman).

Conversion goals in priority order: (1) contact form, (2) WhatsApp chat, (3) copy or use the direct email contact@mhrehman.com, (4) discovery call booking. Every page must make at least two of these reachable without scrolling back to the top.

### 2. Tech stack

- Next.js (App Router), React, TypeScript strict, pnpm.
- Tailwind CSS wired to CSS variable tokens.
- GSAP with ScrollTrigger (and SplitText) for scroll-driven sequences. Lenis for smooth scrolling. Motion (motion/react) for hover, presence, and layout transitions. Do not use two libraries for the same job.
- Radix primitives (Select, Accordion, Dialog, Checkbox) styled by us, for accessible dropdowns and menus.
- react-hook-form with zod for forms. @calcom/embed-react for booking. Resend for email delivery. Cloudflare Turnstile for spam protection. lucide-react for icons plus a custom WhatsApp glyph.
- next/font for Inter, Inter Tight, and the serif accent. Playwright and axe for tests.

### 3. Content model (single source of truth)

/content/site.ts exports: brandName, email (contact@mhrehman.com), whatsappNumber (env), calLink (env), socials\[\], navigation\[\], availability {show, label}, stats\[\] (hidden when empty).

/content/services.ts exports an array of { slug, number, title, summary, subServices\[{id, label}\], deliverables\[\], faqs\[\] }. It drives the nav, footer, service rows, service pages, and both package dropdowns, so a change here updates everywhere.

Initial services:

1. Branding (slug branding): Logo design; Visual identity; Brand guidelines.
2. Pitch Deck (pitch-deck): Investor and fundraising; Sales and client pitch; Startup and seed; Company profile; Product launch; Custom pitch. (Proposed list, covers all types; confirm.)
3. Social Media (social-media): Account management; Social branding; Content calendar; Post designs.
4. Presentation Design (presentation-design): Corporate; Conference and keynote; Training and education; Reports and annual review; Sales enablement; Template systems. (Proposed list; confirm.)

/content/work/\*.mdx (or JSON) drives the portfolio: slug, title, client, category (one of the four service slugs), year, cover image, gallery images, summary, role. Adding a file plus images in /public/work must be enough to publish a project with no code changes. Ship 3 placeholder projects marked TODO.

### 4. Design tokens

#### 4.1 Colour (the only palette)

- --bg: #0F0F0F (page background)
- --line: #353535 (borders, dividers, raised surfaces; surfaces use it at 35 to 60 percent alpha over --bg)
- --muted: #757575 (secondary text for LARGE text only, 24px and up, plus icons and decorative labels)
- --accent: #82DB1A (CTAs, active states, focus rings, key highlights)
- --fg: #FFFFFF (primary text)
- Derived: --fg-2 is #FFFFFF at 72 percent alpha for body secondary text; --accent-glow is #82DB1A at 15 percent alpha.

Contrast rules (already checked): #FFFFFF on #0F0F0F passes with room to spare; #0F0F0F text on #82DB1A is about 11 to 1; #82DB1A on #0F0F0F passes. #757575 on #0F0F0F is only about 4.2 to 1, which fails AA for small text, so never use it for text under 24px. Use --fg-2 instead. Form field borders use #757575 (meets the 3 to 1 UI-component minimum). #353535 is for decorative lines only.

#### 4.2 Typography

- --font-display: Inter Tight, weight 600, letter-spacing -0.04em, line-height 0.92 to 1.05.
- --font-body: Inter, weight 400 and 500, line-height 1.6.
- --font-accent: Fry's Baskerville if licensed, else Baskervville italic. Used only for one highlighted word per headline, never for body copy.
- Scale (fluid, clamp): display-xl 3.25rem to 10rem; display-l 2.5rem to 6rem; h2 2rem to 3.5rem; h3 1.5rem to 2rem; body-l 1.25rem; body 1rem; small 0.875rem; label 0.75rem uppercase, tracking 0.12em, tabular numbers.
- Minimum body size 16px. All form inputs 16px or larger to prevent iOS zoom. Subset fonts to Latin, font-display swap, preload display and body only.

#### 4.3 Space, shape, grid

- 4px base unit; spacing steps 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- Section padding: clamp(72px, 12vw, 192px) vertically. Container max-width 1440px, horizontal padding clamp(20px, 4vw, 64px). 12 columns desktop, 8 tablet, 4 mobile, 24px gutters.
- Radius: 8, 16, 24, pill (999). Cards 24, buttons pill, inputs 16.
- Breakpoints: 360, 640, 768, 1024, 1280, 1536. Design mobile first.
- Use 100svh or dvh, never 100vh. Respect env(safe-area-inset-\*).

#### 4.4 Components, one style each

- Primary button: lime fill, #0F0F0F text, pill, 56px high (52 on mobile), trailing circular arrow icon. Hover: text rolls up to a duplicate line (400ms), arrow turns 45 degrees.
- Secondary button: 1px --line border, white text; hover border becomes white.
- Text link: underline draws left to right on hover.
- Card: 24px radius, 1px --line border, --line at 35 percent fill, spotlight border that follows the cursor on desktop only.
- Focus ring: 2px --accent with 3px offset, visible on every interactive element.
- Every tap target at least 44px.

### 5. Motion system (the heart of the build)

#### 5.1 Tokens in /lib/motion.ts

- Easings: out = cubic-bezier(0.16, 1, 0.3, 1); inOut = cubic-bezier(0.65, 0, 0.35, 1). Use only these two.
- Durations: fast 200ms, base 400ms, slow 700ms, hero 1100ms. Use only these four.
- Default reveal: translateY 32px to 0 plus opacity 0 to 1, slow, out easing, 70ms stagger, triggers once at top 85 percent. Use this pattern for every non-headline element. Headlines (h1 and h2 only) use a masked line-by-line reveal. Nothing else may invent a new reveal.
- Animate transform and opacity only. Apply will-change only during an animation and remove it after.
- Motion budget: at most one hero-level effect visible per viewport.

#### 5.2 Smooth scroll

Lenis with lerp 0.1, smoothWheel on, syncTouch OFF (native touch momentum on phones). Connect Lenis to the GSAP ticker and ScrollTrigger. Run ScrollTrigger.refresh() after fonts and images load. Anchor links call lenis.scrollTo with a header offset. Add data-lenis-prevent to dropdown lists, the mobile menu, and the Cal embed. Destroy on unmount.

#### 5.3 Scroll and micro-interactions, by element

1. Scroll progress: a 2px lime bar fixed at the top, scaleX scrubbed to page progress.
2. Header: hides on scroll down, returns on scroll up, gains a blurred --bg backdrop after 40px. Nav links get a sweeping underline. The active route has a lime dot.
3. Mobile menu: full-screen overlay, clip-path circle reveal from the toggle (500ms), links stagger in (60ms). Focus trapped, Escape closes, background inert, body scroll locked.
4. Hero: masked line reveal of the headline on load (hero duration); the accent word is serif italic with a lime underline that draws in. A faint grid background parallaxes at 0.2 speed. On scroll the hero content scales to 0.94 and fades (scrub). A scroll cue (thin line with a travelling dot) loops until first scroll.
5. Keyword marquee under the hero (the four services separated by lime plus signs): infinite loop, speed increases with scroll velocity and reverses with scroll direction, pauses on hover, static under reduced motion.
6. Intro statement: a large paragraph whose words scrub from #757575 to #FFFFFF as you scroll through it (large text, so contrast is fine).
7. Service rows (001 to 004): hover lifts the number to lime, shifts the row 8px, rotates the arrow, and shows a floating preview image that follows the cursor with 0.12 lag (desktop pointer-fine only). On touch devices rows are an accordion with animated height. Same data, one component.
8. Selected work: on desktop (1024 and up) a pinned horizontal scroll with scrubbed translateX; each cover image parallaxes inside its frame at plus or minus 8 percent; a custom View bubble follows the cursor. On mobile and tablet it is a native swipe carousel with scroll-snap and a progress indicator, no pinning.
9. Process (4 steps): section title sticks on the left; a vertical line fills as steps enter; each step number counts in and turns lime when active. On mobile the title is not sticky and steps simply stack with the line.
10. Package cards: the cursor spotlight border (desktop). Dropdown panels open with scale 0.98 to 1 plus fade (200ms). Selected items fly into the brief chips with a layout transition.
11. Testimonials: draggable slider with snap, video cards use a click-to-load facade (poster plus play button) so no iframe loads until clicked.
12. FAQ: accordion with animated height and a plus icon that rotates to a minus.
13. Final CTA marquee: the line Let's work together alternates outlined and filled words and moves with scroll velocity.
14. Email band: copy action (see 6.4) with a button that morphs into a check mark.
15. Footer: see 6.5.
16. Magnetic buttons: primary buttons pull toward the cursor within 80px, max 10px (desktop pointer-fine only).
17. Route transitions: 300ms fade plus 16px rise on the incoming page (template.tsx). Optionally enhance with the View Transitions API where supported.
18. Custom cursor: a small dot that grows over interactive elements and shows View over work cards. Pointer-fine only, never on touch, and the native cursor remains on form fields.

#### 5.4 Mobile and reduced motion

- Use gsap.matchMedia. Pinning, cursor effects, magnetic buttons, spotlight, and image-follow run only for (hover: hover) and (pointer: fine) and min-width 1024px.
- Under prefers-reduced-motion: Lenis off, no pinning, no parallax, no marquee movement, reveals reduce to a 200ms opacity fade, counters show final values.
- Content must be fully visible with JavaScript disabled or before hydration: hide-before-reveal is applied by a JS-added class, never by default CSS.

### 6. Global components

#### 6.1 Header

Logo left, nav centre (Services, Work, Pricing, About, Contact), at right a primary button Start a project (goes to /contact) and an icon button for WhatsApp on desktop. Under 1024px: logo plus a menu toggle only.

#### 6.2 WhatsApp floating widget

Fixed bottom-right, 20px from the edges (16px on mobile) plus safe-area insets. 56px circle in --accent with a dark WhatsApp glyph. Opens https://wa.me/{whatsappNumber}?text={encoded prefilled message} in a new tab with rel noopener. It enters after 1.5s with a spring scale-in. On desktop hover it expands into a pill labelled Chat on WhatsApp. A soft ping ring pulses every 8s and stops under reduced motion. It hides while the mobile menu is open, and never covers form submit buttons (add bottom padding to the page content on mobile so it cannot overlap). Fire an analytics event on click. aria-label: Chat on WhatsApp.

#### 6.3 Footer top CTA band

The final CTA section ends with three equal-weight actions: Contact form (primary), WhatsApp (secondary), Book a call (secondary).

#### 6.4 Email band (sits directly above the footer on every page)

A full-width band with a label Prefer email? and the address contact@mhrehman.com set in display type, plainly visible and selectable (user-select: all). Beside it: a Copy button and a Write an email link (mailto with a prefilled subject). Copy uses navigator.clipboard.writeText with a textarea and execCommand fallback. On success the button morphs into a check and reads Copied for 2 seconds, a polite aria-live region announces Email address copied, and on phones it triggers a short navigator.vibrate(10) where supported. The same component is reused on the Contact page.

#### 6.5 Footer (futuristic and modern)

- Background --bg with a faint 64px grid drawn in --line at 30 percent alpha, small plus-shaped crosshair marks at intersections near the corners, and a soft lime radial glow that follows the pointer on desktop (static glow on touch).
- Top row: availability chip (pulsing lime dot, label from site.ts) and optional local time with timezone label.
- Columns: Services (from services.ts), Navigate, Connect (email, WhatsApp, Book a call, socials). Labels in small uppercase tracking.
- Bottom: a giant brand wordmark spanning the full width. It starts as an outline stroke and fills with white from left to right as the footer scrolls into view (scrubbed). On mobile it fits the width using a viewBox SVG or clamp sizing.
- A back-to-top circular button with a lime progress ring showing page scroll progress.
- Copyright with a dynamic year, legal links, and a quiet Built with care line.
- Links stack to two columns on mobile; the wordmark and glow stay.

### 7. Pages and sections

Routes: / (home), /services, /services/\[slug\] (4), /work, /work/\[slug\], /pricing, /about, /contact, /book-consultation, /privacy, and a styled 404.

#### 7.1 Home, in this order

1. Hero. Headline (placeholder, rewrite freely): Brands that look sharp. Decks that close. Supporting line plus two buttons: Start a project, See our work.
2. Keyword marquee.
3. Intro statement with word-by-word scrub.
4. Services: four numbered rows (001 to 004).
5. Selected work: pinned horizontal strip, with an All work link.
6. Process: four steps (Discover, Define, Design, Deliver).
7. Packages: the shared Pricing component (section 8).
8. Testimonials (placeholder data, hidden if empty).
9. FAQ: six questions pulled from services.ts plus general ones (turnaround, revisions, formats, payment, working across time zones).
10. Final CTA with marquee and the three actions.
11. Email band, then footer.

#### 7.2 Services overview and detail

Overview: the four service rows with larger previews. Detail pages: hero, what is included (the sub-services as a grid), typical deliverables, process, FAQs, related work filtered by category, and the CTA stack. Each detail page has a Request this service button that goes to /contact?service={slug}.

#### 7.3 Work

Grid with category filter chips (All plus four services) and an animated layout transition when filtering. Cards use the cover image with an inner parallax on hover. Project pages: hero, meta row (client, year, role), gallery with staggered reveals, next-project link. Handle the empty state gracefully, with a note and a contact CTA.

#### 7.4 About

Short story, principles (three cards), working style, and the CTA stack. Placeholder copy marked TODO.

### 8. Pricing and package builder

Two cards side by side on desktop, stacked on mobile.

#### Package 1: One For All

Copy: everything under one roof; pick a service, then what you need inside it.

- Dropdown 1 (Service): the four services from services.ts.
- Dropdown 2 (Sub-service): disabled with the hint Choose a service first until Dropdown 1 has a value. When enabled it lists only that service's sub-services as multi-select checkboxes.
- Selections become chips (Service › Sub-service) under the dropdowns, each removable. Changing Dropdown 1 resets Dropdown 2 but keeps existing chips. Duplicates are ignored.
- Primary button Continue with this brief is disabled until at least one chip exists, with a helper line explaining why. On click it navigates to /contact?package=one-for-all&items={service:sub,...} and the form shows them prefilled as chips and in the message.
- Price line: reads Get a quote while the price field in /content/pricing.ts is null; otherwise show Starting from {price}.

#### Package 2: Custom

Copy: for bigger or unusual needs, talk it through first. Button Book a discovery call goes to /book-consultation. No dropdowns.

Both dropdowns are accessible: keyboard operable, typeahead, aria-labelled, listbox panels scroll with data-lenis-prevent, and on mobile they open as bottom sheets with a 44px row height.

### 9. Contact form and booking

#### 9.1 Contact page

Fields: name, email, WhatsApp or phone (optional), service (select, prefilled from the query string), sub-service chips (prefilled), message, a hidden honeypot, and an invisible Turnstile token. Validate with zod on the client and again on the server. States: idle, submitting (button shows a spinner), success (a lime check drawn with an SVG stroke animation and a calm confirmation message), and error (inline messages tied with aria-describedby; on server failure show the direct email as a fallback). Side panel: the Email band component, the WhatsApp button, and Book a call.

#### 9.2 Server

POST /api/contact: validate, verify Turnstile, rate-limit by IP, then send via Resend to contact@mhrehman.com with the sender set as reply-to. An optional auto-reply to the visitor. Never expose keys to the client.

#### 9.3 Book consultation page (/book-consultation)

Short header, then the Cal.com inline embed from NEXT\_PUBLIC\_CAL\_LINK, themed dark with the lime accent. Show a skeleton loader while it loads and a fallback link that opens the booking page in a new tab if it fails. Below the embed, offer the email band and WhatsApp button. Add the data-lenis-prevent attribute around the embed.

### 10. Responsive rules

- 360px width must work with no horizontal scroll. Test 360x640, 390x844, 768x1024, 1280x800, 1536x864.
- Display type uses clamp so the hero headline never clips or overlaps; max three lines on mobile.
- Stack columns under 768px; the header collapses under 1024px; the pinned work strip turns into a swipe carousel.
- Touch devices never rely on hover: every hover effect has a tap or always-visible equivalent.
- No parallax or heavy blur on low-power devices (check navigator.hardwareConcurrency 4 or below and disable backdrop blur and glow tracking there).

### 11. Accessibility (WCAG 2.2 AA)

Skip link; one h1 per page and ordered headings; visible focus rings; labels on every input; aria-live for copy and form results; full keyboard support for menu, dropdowns, accordions, and the slider; alt text on all images; do not rely on colour alone; respect reduced motion; no autoplaying audio; target sizes of 44px or more.

### 12. Performance budgets

- Lighthouse mobile 95 or higher in all four categories; LCP under 2.5s, CLS under 0.1, INP under 200ms.
- Initial JavaScript under 170KB gzipped; load GSAP and ScrollTrigger only on the client and code-split heavy sections.
- Images through next/image in AVIF and WebP with correct sizes, blur placeholders, and priority only on the hero.
- No autoplaying hero video. If a video is added later: muted, playsInline, poster, under 1.5MB, paused when off-screen and disabled for reduced motion or Save-Data.
- Prefer an SVG or CSS hero visual over any heavy asset.

### 13. SEO and analytics

Per-page metadata and canonical URLs, Open Graph images generated with next/og, sitemap.xml and robots.txt, JSON-LD (Organization and ProfessionalService, plus CreativeWork for projects), semantic HTML. Privacy-friendly analytics (Plausible or Vercel Analytics) with custom events: whatsapp\_click, email\_copy, email\_mailto, form\_submit, book\_call\_click, package\_continue.

### 14. Infrastructure and deployment

- Hosting: Vercel (or Cloudflare Pages with an equivalent adapter). Domain mhrehman.com with HTTPS. Preview deployments for every pull request.
- Environment variables: NEXT\_PUBLIC\_SITE\_URL, NEXT\_PUBLIC\_CONTACT\_EMAIL (contact@mhrehman.com), NEXT\_PUBLIC\_WHATSAPP\_NUMBER (digits only, country code first), NEXT\_PUBLIC\_CAL\_LINK, RESEND\_API\_KEY, CONTACT\_TO\_EMAIL, CONTACT\_FROM\_EMAIL, NEXT\_PUBLIC\_TURNSTILE\_SITE\_KEY, TURNSTILE\_SECRET\_KEY, optional UPSTASH\_REDIS\_REST\_URL and UPSTASH\_REDIS\_REST\_TOKEN for rate limiting. Provide .env.example and never commit secrets.
- Email: verify mhrehman.com in Resend and set SPF, DKIM, and DMARC records so mail lands in the inbox.
- Security headers: strict CSP (allow only Cal, Turnstile, analytics, and fonts), HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- CI (GitHub Actions): install, lint, typecheck, build, Playwright smoke tests, Lighthouse CI against the preview URL. Block merging on failure.
- No database. Content lives in the repo.

### 15. Folder structure

/app (routes, layout.tsx, template.tsx, api/contact), /components (ui, layout, sections, motion), /content (site.ts, services.ts, pricing.ts, faqs.ts, work), /lib (motion.ts, lenis.tsx, utils, analytics.ts, email.ts), /styles (tokens.css, globals.css), /public (fonts, work, og), /tests.

### 16. Build phases and done criteria

1. Scaffold and tokens. Done when the token page renders every colour, type size, button, card, and focus ring correctly.
2. Motion core. Lenis plus GSAP wired, reveal utilities, reduced-motion and matchMedia handling. Done when a demo section reveals and the toggle for reduced motion works.
3. Global shell. Header, mobile menu, WhatsApp widget, email band, footer, progress bar. Done when they work at all five test viewports.
4. Home page, all sections, using placeholders.
5. Services pages, pricing and package builder, contact with server route, booking page.
6. Work system with placeholder projects, filters, and detail pages.
7. Accessibility, performance, SEO, security headers, CI, deploy to preview.
8. Final QA against section 17, then report any deviations.

### 17. Acceptance checklist

- Only the five palette colours (and alphas) appear in the code; no other hex values.
- Header, WhatsApp widget, and email band appear on every page with no overlap on a 360px phone.
- Email contact@mhrehman.com is visible, selectable, copyable, and has a working mailto fallback.
- Package builder: second dropdown disabled until the first is set, shows only related sub-services, chips add and remove, the contact form receives the selection.
- Custom package lands on /book-consultation and the Cal embed loads.
- Contact form works end to end, including error and success states and the spam checks.
- Every animation has a mobile and reduced-motion behaviour as specified; no content is hidden without JavaScript.
- No horizontal scroll at any width from 360px up; no layout shift when fonts load.
- Lighthouse and axe targets met; keyboard-only run-through passes.

### 18. Items I need from you (leave as TODO until supplied)

WhatsApp number, Cal.com link, brand name confirmation, logo, final sub-service lists for Pitch Deck and Presentation Design, prices (if any), social links, portfolio projects and images, testimonials, About copy, availability label, and the licence status of Fry's Baskerville.
