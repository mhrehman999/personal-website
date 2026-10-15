"use client";

import { useEffect, useRef } from "react";
import { processSteps } from "@/content/home";
import { MaskedHeadline } from "@/components/motion/Reveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const processHeadingLines = ["From first thought to final file."];

export function HomeProcess() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const { reducedMotion } = useMotionPreferences();
  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !section.current || !line.current) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 0px)", () => {
        if (reducedMotion) { gsap.set(line.current, { scaleY: 1 }); return; }
        gsap.fromTo(line.current, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: section.current, start: "top 65%", end: "bottom 65%", scrub: true } });
        section.current?.querySelectorAll<HTMLElement>("[data-process-step]").forEach((step) => {
          ScrollTrigger.create({ trigger: step, start: "top 62%", onEnter: () => step.classList.add("is-active"), onLeaveBack: () => step.classList.remove("is-active") });
        });
      });
      context = { revert: () => media.revert() };
    });
    return () => { cancelled = true; context?.revert(); };
  }, [reducedMotion]);

  return <section ref={section} className="home-process section-wrap" id="process" aria-labelledby="process-heading"><div className="home-section-heading process-heading"><div><p className="eyebrow">A considered process</p><MaskedHeadline className="home-section-title" id="process-heading" lines={processHeadingLines} /></div><p className="process-intro">Clear steps, close collaboration, thoughtful work.</p></div><div className="process-layout"><div className="process-sticky"><p className="eyebrow">The way we work</p><span>Good work happens one clear decision at a time.</span></div><div className="process-steps"><span className="process-line" aria-hidden="true"><i ref={line} /></span>{processSteps.map((step) => <article className="process-step" data-process-step key={step.number}><span className="process-step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div><span className="process-step-mark" aria-hidden="true">↗</span></article>)}</div></div></section>;
}
