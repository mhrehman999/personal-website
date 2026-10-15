export const introStatement = "Good design makes a business easier to understand, easier to trust, and easier to choose.";

export const processSteps = [
  { number: "01", title: "Start with a conversation", description: "We get to know your business, your audience, and what you want to achieve. Good questions give the work a meaningful starting point." },
  { number: "02", title: "Find the right direction", description: "Together, we shape the story and visual direction. You see the thinking early, so every design decision has a clear purpose." },
  { number: "03", title: "Make it distinctive", description: "Strategy takes shape through considered typography, visuals, and layout. A brand or presentation that feels like you, and speaks to your audience." },
  { number: "04", title: "Refine every detail", description: "Your feedback guides the finishing touches. We refine the rhythm, clarity, and consistency until every element works together." },
  { number: "05", title: "Ready for what’s next", description: "The final work, thoughtfully prepared and organised for handoff. Ready to share your story, present your ideas, and put your brand out into the world." },
];

export type Testimonial = {
  quote: string;
  highlight?: string;
  name: string;
  role: string;
  company: string;
  rating?: number;
};

// Add verified reviews here. Labelled examples are shown while this is empty.
export const testimonials: Testimonial[] = [];

export const sampleTestimonials: Testimonial[] = [
  {
    quote: "From the first conversation to the final handoff, everything felt considered. The team took time to understand our story and made our brand feel like us, only clearer, more confident, and ready for what comes next.",
    highlight: "made our brand feel like us",
    name: "Sample client 01",
    role: "Founder",
    company: "Brand identity project",
    rating: 5,
  },
  {
    quote: "We had the ideas, but needed a better way to tell the story. The presentation brought clarity to every slide and turned a complicated message into something people could immediately understand.",
    highlight: "brought clarity to every slide",
    name: "Sample client 02",
    role: "Marketing lead",
    company: "Presentation design project",
    rating: 5,
  },
  {
    quote: "Thoughtful questions, honest feedback, and a real eye for the details. It felt like a collaboration from day one. We walked away with a pitch deck we were proud to put in front of investors.",
    highlight: "a collaboration from day one",
    name: "Sample client 03",
    role: "Co-founder",
    company: "Pitch deck project",
    rating: 5,
  },
];

export const generalFaqs = [
  { question: "How long does a project take?", answer: "TODO: Add the confirmed turnaround range for each service." },
  { question: "How many revisions are included?", answer: "TODO: Add the approved revision policy." },
  { question: "Which file formats will I receive?", answer: "TODO: Add the confirmed file formats and handoff details." },
  { question: "How does payment work?", answer: "TODO: Add the approved payment and deposit terms." },
  { question: "Can we work across time zones?", answer: "TODO: Add the studio's confirmed approach to working across time zones." },
  { question: "What do you need to get started?", answer: "TODO: Add the approved project kickoff requirements." },
];
