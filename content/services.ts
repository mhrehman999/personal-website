export type ServiceFaq = { question: string; answer: string };
export type SubService = { id: string; label: string; description: string; deliverables: string[] };
export type Service = {
  slug: string; number: string; title: string; summary: string; headline: string; introduction: string;
  previewImage: string; heroImage: string; relatedSlugs: string[]; subServices: SubService[]; deliverables: string[]; faqs: ServiceFaq[];
};

export const services: Service[] = [
  {
    slug: "branding", number: "001", title: "Branding",
    summary: "A distinct identity. One clear visual language.",
    headline: "A brand that feels like you.",
    introduction: "Your identity should make your business easier to recognise and understand. I bring the logo, typography, colours and everyday details together, so your brand feels considered wherever it appears.",
    previewImage: "/work/cognexo/cover.webp", heroImage: "/work/perspective/cover.webp", relatedSlugs: ["perspective", "cognexo"],
    subServices: [
      { id: "logo-design", label: "Logo design", description: "A recognisable mark with a clear idea behind it. We explore a direction that fits your business, then refine the proportions, spacing and variations so it works across the places people meet your brand.", deliverables: ["Primary logo and supporting variations", "Colour and single-colour versions", "Logo exports for screen and print"] },
      { id: "visual-identity", label: "Visual identity", description: "A connected visual language beyond the logo. Colour, typography, imagery and layout work together to give your business a consistent presence, with examples showing how the identity comes to life.", deliverables: ["Colour palette and typography direction", "Graphic elements and image direction", "Selected brand applications"] },
      { id: "brand-guidelines", label: "Brand guidelines", description: "A practical guide your team can actually use. Clear rules and examples help people apply your identity with confidence, keeping the details consistent as your business grows.", deliverables: ["Logo usage, spacing and sizing guidance", "Colour and typography specifications", "Layout examples and asset handoff"] },
    ],
    deliverables: ["A defined visual direction", "The agreed logo and identity assets", "Applications for your chosen touchpoints", "Organised final files and usage guidance"],
    faqs: [
      { question: "Do I need a completely new identity?", answer: "Not always. Share what you have and what feels out of step. The brief can focus on a new identity, a considered refresh, or bringing existing elements into one consistent system." },
      { question: "Can you work with an existing logo?", answer: "Yes. An existing mark can be the starting point for a stronger palette, typography and supporting design. We agree what to keep and what to develop before design begins." },
      { question: "What do you need from me?", answer: "A little context about your business, audience and direction. Existing assets, references and examples of where the brand will appear help define a useful scope." },
    ],
  },
  {
    slug: "pitch-deck", number: "002", title: "Pitch Deck",
    summary: "Your story, shaped into a pitch that connects.",
    headline: "Make the next conversation count.",
    introduction: "A strong pitch makes the important things easy to follow. I shape the visual story around your audience, giving the idea, the opportunity and the next step a clear place in the deck.",
    previewImage: "/work/velova/cover.webp", heroImage: "/work/velova/cover.webp", relatedSlugs: ["velova", "maneuver", "numa"],
    subServices: [
      { id: "investor-fundraising", label: "Investor and fundraising", description: "A focused deck for the investment conversation. Your business story, market context and numbers are organised into a visual narrative that helps investors understand the opportunity and the ask.", deliverables: ["Slide structure around your investment story", "Designed business and financial slides", "Presentation and shareable PDF versions"] },
      { id: "sales-client-pitch", label: "Sales and client pitch", description: "Put the client's needs at the centre of the conversation. A clear sequence connects the problem, your offer and the reasons to choose it, giving your team a useful tool for presenting the value.", deliverables: ["A clear offer and benefit narrative", "Product, service and proof-point slides", "Reusable pitch layouts"] },
      { id: "startup-seed", label: "Startup and seed", description: "Give an early idea a clear, confident introduction. We make the problem, product and direction easy to grasp, using the material you have without dressing assumptions up as results.", deliverables: ["A focused early-stage story", "Problem, solution and business-model slides", "A designed deck ready to share"] },
      { id: "company-profile", label: "Company profile", description: "Introduce your business with a coherent story rather than a long list of facts. Capabilities, work and people are arranged around what a new client or partner needs to know.", deliverables: ["An organised company narrative", "Capability and portfolio layouts", "An editable profile and PDF export"] },
      { id: "product-launch", label: "Product launch", description: "Bring a new product into focus. A visual story introduces what it does, why it matters and how people can engage with it, giving the launch a consistent direction from opening slide to final action.", deliverables: ["Product story and visual direction", "Feature, benefit and use-case slides", "Launch presentation files"] },
      { id: "custom-pitch", label: "Custom pitch", description: "Some conversations need a different kind of deck. Tell me who you are presenting to, what they need to understand and the decision you want to support. We build the structure around that moment.", deliverables: ["A structure tailored to the audience", "Custom slide design and visual assets", "Agreed presentation and export formats"] },
    ],
    deliverables: ["A considered slide flow", "Custom layouts, charts and visual hierarchy", "An editable deck in the agreed format", "A PDF version for sharing"],
    faqs: [
      { question: "Can you help with the story as well as the slides?", answer: "Yes. We can review the order, hierarchy and clarity of the material as part of the brief. You provide the business facts and figures; I help make the story easier to follow visually." },
      { question: "Do you redesign existing decks?", answer: "Yes. Share the current file, audience and any brand guidelines. We can refine an existing structure or work on a new visual direction around the material." },
      { question: "Will the deck be editable?", answer: "We agree the working format before starting, including how your team needs to update the deck. A shareable PDF can sit alongside the editable version." },
    ],
  },
  {
    slug: "social-media", number: "003", title: "Social Media",
    summary: "On-brand content, made to feel connected.",
    headline: "Show up as one clear brand.",
    introduction: "Your content can change without your identity getting lost. I build a visual approach for your channels, bringing posts, templates and campaigns together so they feel like parts of the same brand.",
    previewImage: "/work/misk/cover.webp", heroImage: "/work/misk/cover.webp", relatedSlugs: ["misk", "neeca"],
    subServices: [
      { id: "account-management", label: "Account management", description: "Bring a clearer workflow to your brand's social presence. We map the channels, content needs and level of support, then shape a practical approach to preparing and organising the work.", deliverables: ["Channel and content requirements", "An agreed content workflow", "A defined design and support scope"] },
      { id: "social-branding", label: "Social branding", description: "Translate your identity into the places people scroll. Profile assets, colour, typography and repeatable layouts give your channels a recognisable presence without making every post look the same.", deliverables: ["Profile and cover artwork", "Social colour and typography direction", "A reusable visual layout system"] },
      { id: "content-calendar", label: "Content calendar", description: "Give each piece of content a purpose before it is designed. A clear plan connects themes, formats and key moments, helping your team see what is needed and how the pieces fit together.", deliverables: ["Content themes and format planning", "An organised calendar structure", "A practical asset and approval checklist"] },
      { id: "post-designs", label: "Post designs", description: "Clear, distinctive artwork for your messages. From individual posts to connected carousels, the design supports the content and stays aligned with your brand across the agreed channels and formats.", deliverables: ["Custom post and carousel artwork", "Sizes for the agreed channels", "Reusable templates where included in the brief"] },
    ],
    deliverables: ["A consistent social visual direction", "Assets sized for the agreed channels", "Post, carousel or template designs in scope", "Organised exports and a clear content handoff"],
    faqs: [
      { question: "Can the designs follow my existing brand?", answer: "Yes. Your identity, current content and channel requirements form the starting point. The aim is to make the work feel recognisably yours." },
      { question: "Is ongoing account support included?", answer: "Design, content planning and any ongoing management are scoped separately. Tell me which channels you use and where you need support so the brief reflects the actual work." },
      { question: "Can my team reuse the layouts?", answer: "Reusable templates can be included. We agree the tools, formats and level of flexibility your team needs before building the system." },
    ],
  },
  {
    slug: "presentation-design", number: "004", title: "Presentation Design",
    summary: "Complex ideas, made clear one slide at a time.",
    headline: "Give your ideas room to land.",
    introduction: "Good slides support the conversation. I turn dense information into a clear visual sequence, balancing content, charts and space so your audience can follow the idea and your team can present it with confidence.",
    previewImage: "/work/neeca/cover.webp", heroImage: "/work/neeca/cover.webp", relatedSlugs: ["neeca", "misk", "oneflow"],
    subServices: [
      { id: "corporate", label: "Corporate", description: "A coherent presentation for the way your business works. Updates, strategies and internal stories become easier to navigate through clear hierarchy, useful layouts and consistent brand details.", deliverables: ["A clear slide structure", "Branded content and chart layouts", "An editable business presentation"] },
      { id: "conference-keynote", label: "Conference and keynote", description: "Slides that support the speaker and work at a distance. A considered pace, strong imagery and focused messages help the talk unfold without asking the audience to read a document on screen.", deliverables: ["Visual pacing around your talk", "Stage-ready slide design", "An agreed presentation and backup export"] },
      { id: "training-education", label: "Training and education", description: "Make learning material easier to work through. Lessons, explanations and activities are organised into a consistent sequence, with diagrams and examples that support the content rather than crowd it.", deliverables: ["A clear learning sequence", "Lesson, activity and recap layouts", "Editable training presentation files"] },
      { id: "reports-annual-review", label: "Reports and annual review", description: "Give numbers and detailed findings a clearer story. Charts, tables and key messages are designed around what matters, helping people see the pattern before exploring the detail.", deliverables: ["Report structure and information hierarchy", "Chart, table and data-slide design", "Presentation and shareable report exports"] },
      { id: "sales-enablement", label: "Sales enablement", description: "A practical slide system for your sales conversations. Reusable layouts bring the offer, product details and proof points together, making it easier to adapt the deck around a client's needs.", deliverables: ["An adaptable sales deck structure", "Product, offer and case-study layouts", "Editable slides for the sales team"] },
      { id: "template-systems", label: "Template systems", description: "A presentation system your team can build on. Useful slide types, clear styles and examples make it easier to create new decks while keeping the brand and information hierarchy consistent.", deliverables: ["Reusable slide masters and layouts", "Typography, colour and chart styles", "Example slides and practical usage notes"] },
    ],
    deliverables: ["A clear content hierarchy and slide flow", "Custom layouts and information design", "An editable presentation in the agreed format", "Exported files and practical handoff notes"],
    faqs: [
      { question: "Can you redesign a presentation I already have?", answer: "Yes. Share the current deck and explain where it needs to work harder. The brief can focus on visual consistency, clearer information or a fuller redesign." },
      { question: "Can you make a template for our team?", answer: "Yes. Template systems are built around the kinds of slides your team uses, with repeatable layouts and examples that make the design easier to maintain." },
      { question: "Which file format will I receive?", answer: "The editable format and exports are agreed around how you present and update the work. Share your preferred software and any technical requirements when enquiring." },
    ],
  },
];
