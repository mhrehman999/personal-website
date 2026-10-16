# Contact controls and visibility corrections

**Goal:** Clear, consistent contact field, dropdown, button and link states without changing submission or spam protection.

**Evidence:** Sidebar action links inherit the page's blue accent on hover against the same blue background. Field borders are only 28% blue with no hover change. The native select does not provide consistent option styling. Chip removal has no hover feedback, and the unavailable submit button gives no explanation while waiting for spam protection.

**Implementation:** Scope styles to Contact. Cloud field surfaces, stronger blue borders, blue focus/error outlines; orange/black hover links on blue. Replace the service select with the existing Radix Select dependency, wired through React Hook Form Controller, preserving the service value, optional empty value and query prefill. Explicit portal colours, selected/highlighted states, keyboard navigation and viewport collision limits. Orange submit / blue hover / clear disabled state, and a short waiting status while protection loads. Keep the API, validation, token requirement and real send behaviour unchanged.

- [x] Reproduce three failing state/choice tests before changes.
- [x] Implement explicit states and accessible service selection.
- [x] Verify pointer/keyboard, phone fit, prefill/removal, validation without sending, screenshots, code checks and production build.

**Verification:** Three new state tests failed before changes. All three now pass, along with the service-page-to-contact prefill regression, against the refreshed production server (4/4). Keyboard selection/escape/focus return, mouse hover colours, validation errors without sending, chip removal and 320px menu fit passed. A separate 320px touch-context check selected Presentation Design, restored trigger focus and found no visible control overflow. Scoped axe checks reported no colour contrast, label, input-name or button-name violations in the contact panel, and no contrast/input-name violations in the dropdown. Inspected desktop/phone control screenshots. Lint, TypeScript and production build passed; pre-build configuration restored. No live enquiry sent. Preview http://127.0.0.1:4174/contact.
