"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { services } from "@/content/services";
import { generalFaqs } from "@/content/home";
import { MaskedHeadline } from "@/components/motion/Reveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const serviceFaqs = services.flatMap((service) => service.faqs).slice(0, 6);
const faqs = [...serviceFaqs, ...generalFaqs];
const faqHeadingLines = ["Questions, answered."];

export function HomeFaq() {
  const [open, setOpen] = useState<number | null>(null);
  const { reducedMotion } = useMotionPreferences();
  return <section className="home-faq section-wrap" id="faq" aria-labelledby="faq-heading"><div className="home-section-heading"><div><p className="eyebrow">A few useful answers</p><MaskedHeadline className="home-section-title" id="faq-heading" lines={faqHeadingLines} /></div><p className="faq-intro">Still deciding? <a href="/contact">Tell us what you have in mind.</a></p></div><div className="faq-list">{faqs.map((faq, index) => { const expanded = open === index; return <article className={`faq-item${expanded ? " is-open" : ""}`} key={faq.question}><h3><button className="faq-trigger" type="button" aria-expanded={expanded} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(expanded ? null : index)}><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><span>{faq.question}</span><motion.span className="faq-plus" aria-hidden="true" animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}>+</motion.span></button></h3><motion.div id={`faq-answer-${index}`} className="faq-answer" aria-hidden={!expanded} initial={false} animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }} transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }} inert={!expanded}><p>{faq.answer}</p></motion.div></article>; })}</div></section>;
}
