"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MaskedHeadline } from "@/components/motion/Reveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { MagneticLink } from "@/components/home/MagneticLink";

const heroWords = [
  <em key="sharp" className="hero-accent">Sharp</em>,
  "brands.",
  "Clear",
  "decks.",
];

export function HomeHero() {
  const [scrolled, setScrolled] = useState(false);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    let context: { revert: () => void } | undefined;
    let cancelled = false;
    const updateScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", updateScroll, { passive: true });

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px) and (hover: hover) and (pointer: fine)", () => {
        if (reducedMotion || window.navigator.hardwareConcurrency <= 4) return;
        const content = document.querySelector<HTMLElement>(".home-hero-content");
        const grid = document.querySelector<HTMLElement>(".home-hero-grid");
        if (!content || !grid) return;
        gsap.to(content, { scale: 0.94, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".home-hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(grid, { yPercent: -20, ease: "none", scrollTrigger: { trigger: ".home-hero", start: "top top", end: "bottom top", scrub: true } });
      });
      context = { revert: () => media.revert() };
    });

    return () => { cancelled = true; window.removeEventListener("scroll", updateScroll); context?.revert(); };
  }, [reducedMotion]);

  return <section className={`home-hero${reducedMotion ? " is-reduced-motion" : ""}`} aria-labelledby="home-title">
    <div className="home-hero-grid" aria-hidden="true" />
    <div className="home-hero-content">
      <p className="eyebrow home-hero-eyebrow">Brand, pitch deck &amp; presentation studio</p>
      <MaskedHeadline as="h1" id="home-title" className="home-hero-title" lines={heroWords} wordByWord animateOnLoad />
      <p className="home-hero-support">Identity, pitch decks and presentations designed to make your next move clear.</p>
      <div className="home-hero-actions"><MagneticLink className="button button-primary" href="/contact"><span>Start a project</span><span className="button-icon" aria-hidden="true">↗</span></MagneticLink><Link className="button button-secondary" href="#selected-work">See our work</Link></div>
    </div>
    <a className={`home-scroll-cue${scrolled ? " is-scrolled" : ""}`} href="#home-intro" aria-label="Scroll to introduction"><span>Scroll to explore</span><i aria-hidden="true" /></a>
  </section>;
}
