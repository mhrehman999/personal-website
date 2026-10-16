# Consultation page polish

**Goal:** Match the finished inner pages, explain the first conversation, frame the real Cal.com booking flow and keep it usable on phones or when the external calendar is slow.

**Design:** Anton hero and concise introduction, blue agenda panel, cloud calendar surface with a clear section heading, practical timezone/preparation copy and orange primary links. Stack the hero and agenda on phones. Keep the configured calendar, and offer an external calendar link plus a project enquiry at all times. Use the existing Cal SDK with a normalised event path, its public ready/failed events and scoped theme variables. Replace the arbitrary 1.8-second ready timer with actual readiness plus an honest slow-loading fallback. Never create a booking during verification.

**Alternatives:** A standalone iframe would drop existing SDK sizing and messaging. A direct-only link would remove on-page scheduling. Retain the existing integration, improve its wrapper and add useful fallbacks.

- [x] Reproduce missing page structure and blank loading fallback with focused checks.
- [x] Add authored page, responsive styles and honest calendar states.
- [x] Verify keyboard/touch, 320/390/768/1440 layouts, blocked/ready/failed calendar states, screenshots and production checks.

**Sources:** Cal.com public embed events (https://cal.com/help/embedding/embed-events) and theme variables (https://cal.com/docs/developing/guides/embeds/customize-embed-css-variables), checked against the locally installed 1.5.3 package types. Use public linkReady/linkFailed events; avoid internal events.

**Verification:** Missing agenda and blank fallback checks failed before changes. Final production run passed all eight focused booking/loader/footer/scroll tests, including 320/390/768/1440 page fit, anchor navigation, blocked embed script, normalised Cal event path, ready/failed/slow transitions, optional inline calendar reveal and public bookerReady recovery through the wildcard event API. Scoped axe contrast/control-name checks had no violations. Desktop/phone screenshots inspected. Lint, TypeScript and production build passed; configuration restored exactly afterward.

**Live provider limitation:** A read-only browser check outside the network sandbox received the public Cal.com embed HTML (HTTP 200), but provider assets returned HTTP 403 and the embedded body remained empty. The ready state and appointment availability could therefore not be verified against the live provider here. The local slow-state UI, direct configured calendar link and enquiry alternatives are verified. No appointment was submitted. The public bookerReady event is handled through the wildcard API because the installed SDK types predate it.

**Preview:** http://localhost:3000/book-consultation (development), http://127.0.0.1:4174/book-consultation (production build).
