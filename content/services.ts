export type ServiceFaq = { question: string; answer: string };
export type Service = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  previewImage?: string;
  subServices: { id: string; label: string }[];
  deliverables: string[];
  faqs: ServiceFaq[];
};

export const services: Service[] = [
  {
    slug: "branding",
    number: "001",
    title: "Branding",
    previewImage: "/services/previews/branding.svg",
    summary: "TODO: Add a concise, confirmed description of the branding service.",
    subServices: [
      { id: "logo-design", label: "Logo design" },
      { id: "visual-identity", label: "Visual identity" },
      { id: "brand-guidelines", label: "Brand guidelines" },
    ],
    deliverables: [], // TODO: add confirmed deliverables.
    faqs: [
      { question: "What does a branding project include?", answer: "TODO: Add the approved scope for branding projects." },
      { question: "Can you build an identity around an existing logo?", answer: "TODO: Confirm whether this is part of the branding service." },
    ],
  },
  {
    slug: "pitch-deck",
    number: "002",
    title: "Pitch Deck",
    previewImage: "/services/previews/pitch-deck.svg",
    summary: "TODO: Add a concise, confirmed description of the pitch deck service.",
    subServices: [
      { id: "investor-fundraising", label: "Investor and fundraising" },
      { id: "sales-client-pitch", label: "Sales and client pitch" },
      { id: "startup-seed", label: "Startup and seed" },
      { id: "company-profile", label: "Company profile" },
      { id: "product-launch", label: "Product launch" },
      { id: "custom-pitch", label: "Custom pitch" },
    ],
    deliverables: [], // TODO: add confirmed deliverables.
    faqs: [
      { question: "What kinds of pitch decks can you design?", answer: "TODO: Add the confirmed pitch deck types and scope." },
      { question: "Can you help structure the story as well as design the slides?", answer: "TODO: Confirm the studio's pitch deck strategy offering." },
    ],
    // TODO: Confirm this proposed sub-service list.
  },
  {
    slug: "social-media",
    number: "003",
    title: "Social Media",
    previewImage: "/services/previews/social-media.svg",
    summary: "TODO: Add a concise, confirmed description of the social media service.",
    subServices: [
      { id: "account-management", label: "Account management" },
      { id: "social-branding", label: "Social branding" },
      { id: "content-calendar", label: "Content calendar" },
      { id: "post-designs", label: "Post designs" },
    ],
    deliverables: [], // TODO: add confirmed deliverables.
    faqs: [
      { question: "What is included in social media design?", answer: "TODO: Add the approved social media design scope." },
    ],
  },
  {
    slug: "presentation-design",
    number: "004",
    title: "Presentation Design",
    previewImage: "/services/previews/presentation-design.svg",
    summary: "TODO: Add a concise, confirmed description of the presentation design service.",
    subServices: [
      { id: "corporate", label: "Corporate" },
      { id: "conference-keynote", label: "Conference and keynote" },
      { id: "training-education", label: "Training and education" },
      { id: "reports-annual-review", label: "Reports and annual review" },
      { id: "sales-enablement", label: "Sales enablement" },
      { id: "template-systems", label: "Template systems" },
    ],
    deliverables: [], // TODO: add confirmed deliverables.
    faqs: [
      { question: "Can you create a presentation template for my team?", answer: "TODO: Confirm the presentation template offering." },
    ],
    // TODO: Confirm this proposed sub-service list.
  },
];
