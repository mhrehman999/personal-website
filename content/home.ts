export const introStatement = "Branding, presentations and social media, built as one visual system so your business looks clear, consistent and unmistakably like itself everywhere people find it.";

export const processSteps = [
  { number: "01", title: "Start with a conversation", description: "We get to know your business, your audience, and what you want to achieve. Good questions give the work a meaningful starting point." },
  { number: "02", title: "Find the right direction", description: "Together, we shape the story and visual direction. You see the thinking early, so every design decision has a clear purpose." },
  { number: "03", title: "Make it distinctive", description: "Strategy takes shape through considered typography, visuals, and layout. A brand or presentation that feels like you, and speaks to your audience." },
  { number: "04", title: "Refine every detail", description: "Your feedback guides the finishing touches. We refine the rhythm, clarity, and consistency until every element works together." },
  { number: "05", title: "Ready for what’s next", description: "The final work, thoughtfully prepared and organised for handoff. Ready to share your story, present your ideas, and put your brand out into the world." },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  date?: string;
  dateLabel?: string;
  sourceUrl?: string;
  rating?: number;
  country?: string;
  duration?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "norbert-katona",
    quote: "I’ve had the privilege of working with Muhammad Haris, and I can confidently say he is a talented and reliable designer.\n\nWhat truly sets him apart is his ability to develop compelling presentation decks, or designing marketing materials.\n\nBeyond his design expertise, Muhammad is proactive, dependable, and always open to feedback.\n\nI hereby recommend working with him!",
    name: "Norbert Katona",
    role: "Visual Design Expert",
    date: "2025-09-09",
    dateLabel: "September 9, 2025",
    sourceUrl: "https://www.linkedin.com/in/norbert-katona-b0828244/",
  },
  {
    id: "omarlittler-presentation",
    quote: "Amazing Experience!!! Works fast and easy to contact thinks out of the box. Did great work on Business powerpoint presentation design. Coming back to you for more!",
    name: "omarlittler",
    role: "Presentation Design",
    country: "Germany",
    rating: 5,
  },
  {
    id: "marshan4560-presentation",
    quote: "I really love the design, background images, icons, and typography. Everything looks so well-crafted and professional. Haris was very punctual and delivered exactly what I was looking for. I am extremely happy with his services and would highly recommend him to anyone looking for top-notch work!",
    name: "marshan4560",
    role: "Presentation Design",
    country: "United Kingdom",
    duration: "6 days",
    rating: 5,
  },
  {
    id: "andreaskly-burger-presentation",
    quote: "Working with Haris was fantastic! They totally got our burger joint's vibe and created something fresh and exciting. The colors popped, the animations were cool (but not too much), and everything just looked delicious. Super easy to work with - listened to what we wanted and delivered exactly that. 10/10 would recommend to any food business!",
    name: "andreaskly",
    role: "Presentation Design",
    country: "United Kingdom",
    duration: "3 days",
    rating: 5,
  },
  {
    id: "andreaskly-brand-presentation",
    quote: "mhrehman delivered exactly what I needed, and more. His attention to detail and creative flair really brought our brand to life in the presentation. He was responsive, easy to work with, and totally nailed the vibe we were going for. Will definitely be coming back for future design needs!",
    name: "andreaskly",
    role: "Presentation Design",
    country: "United Kingdom",
    duration: "3 days",
    rating: 5,
  },
  {
    id: "mathewparker1l-presentation",
    quote: "mhrehman truly EXCELLED in presentation design, surpassing all expectations with flawless attention to detail and stunning visuals. Working with them was a pleasure, as their politeness, deep understanding, and willingness to go the extra mile made the collaboration exceptional. Highly recommend! 🙌",
    name: "mathewparker1l",
    role: "Presentation Design",
    country: "United States",
    duration: "4 days",
    rating: 5,
  },
];

export const generalFaqs = [
  { question: "How long does a project take?", answer: "Timing depends on the scope, content and level of detail. Share your deadline with the brief so we can agree a workable schedule before design begins." },
  { question: "How many revisions are included?", answer: "We agree the feedback stages and revision scope as part of the project brief. Clear checkpoints help us refine the work together and keep the direction focused." },
  { question: "Which file formats will I receive?", answer: "The handoff is shaped around how you will use and update the work. We agree the editable files, exports and any template requirements before starting." },
  { question: "How does payment work?", answer: "Your quote sets out the scope, fee and payment schedule. We agree those details before starting the project, so you know what to expect." },
  { question: "Can we work across time zones?", answer: "Yes. Share your location and working hours when you enquire. We can plan useful checkpoints and keep the conversation moving through clear written feedback." },
  { question: "What do you need to get started?", answer: "Tell me about your business, audience and the design support you need. Existing content, brand assets, references and a target date are helpful, but a first conversation is a good place to begin." },
];
