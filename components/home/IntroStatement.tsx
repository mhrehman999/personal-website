"use client";

import { useEffect, useRef } from "react";
import { introStatement } from "@/content/home";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const words = introStatement.split(" ");

export function IntroStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !ref.current) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const spans = ref.current.querySelectorAll<HTMLElement>("[data-intro-word]");
      if (reducedMotion) { gsap.set(spans, { color: "var(--fg)" }); return; }
      const media = gsap.matchMedia();
      media.add("(min-width: 0px)", () => {
        gsap.fromTo(spans, { color: "var(--muted)" }, { color: "var(--fg)", stagger: 0.035, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true } });
      });
      context = { revert: () => media.revert() };
    });
    return () => { cancelled = true; context?.revert(); };
  }, [reducedMotion]);

  return <section className="home-intro section-wrap" id="home-intro" aria-labelledby="home-intro-title"><p className="eyebrow">The right work changes what&apos;s possible</p><h2 className="visually-hidden" id="home-intro-title">A point of view on design</h2><p className="home-intro-statement" ref={ref} aria-label={introStatement}>{words.map((word, index) => <span key={`${word}-${index}`} data-intro-word>{word}{index < words.length - 1 ? " " : ""}</span>)}</p></section>;
}
