"use client";

import { useEffect, useRef } from "react";
import { introStatement } from "@/content/home";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const words = introStatement.split(" ");

export function IntroStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !ref.current) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const spans = ref.current.querySelectorAll<HTMLElement>("[data-intro-word]");
      const colors = getComputedStyle(ref.current);
      const foreground = colors.getPropertyValue("--fg").trim();
      const accent = colors.getPropertyValue("--accent").trim();
      const media = gsap.matchMedia();
      media.add("(min-width: 0px)", () => {
        gsap.fromTo(spans, { color: foreground }, { color: accent, duration: .45, stagger: .035, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: .35 } });
      });
      context = { revert: () => media.revert() };
    });
    return () => { cancelled = true; context?.revert(); };
  }, [reducedMotion]);

  return <section className={`home-intro section-wrap${reducedMotion ? " is-reduced-motion" : ""}`} id="home-intro" aria-label="About the studio"><div className="intro-flow" aria-hidden="true"><i /><i /><i /></div><p className="home-intro-statement" ref={ref} aria-label={introStatement}>{words.map((word, index) => <span key={`${word}-${index}`} data-intro-word>{word}{index < words.length - 1 ? " " : ""}</span>)}</p></section>;
}
