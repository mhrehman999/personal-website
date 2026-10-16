"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoadWords } from "@/components/motion/LoadWords";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { MagneticLink } from "@/components/home/MagneticLink";
import { ProjectFolder } from "@/components/home/ProjectFolder";

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
    <div className="hero-flow" aria-hidden="true"><i /><i /></div>
    <div className="home-hero-layout">
    <div className="home-hero-content">
      <p className="eyebrow home-hero-eyebrow" aria-label="Brand, pitch deck & presentation studio"><span aria-hidden="true"><LoadWords text="Brand, pitch deck & presentation studio" delay={.08} stagger={.035} /></span></p>
      <h1 id="home-title" className="home-hero-title" aria-label="I design the difference people actually notice."><span className="hero-title-line" aria-hidden="true"><LoadWords text="I design the" delay={.18} stagger={.065} /></span><span className="hero-title-line" aria-hidden="true"><LoadWords text="difference people" delay={.375} stagger={.065} /></span><span className="hero-title-line" aria-hidden="true"><LoadWords text="actually notice." delay={.505} stagger={.065} highlight="notice." /></span></h1>
      <p className="home-hero-support" aria-label="Identity, pitch decks and presentations designed to make your next move clear."><span aria-hidden="true"><LoadWords text="Identity, pitch decks and presentations designed to make your next move clear." delay={.6} stagger={.028} /></span></p>
      <div className="home-hero-actions"><MagneticLink className="button button-primary" href="/contact"><span>Start a project</span><span className="button-icon" aria-hidden="true">↗</span></MagneticLink><Link className="button button-secondary" href="#selected-work">See our work</Link></div>
    </div>
    <ProjectFolder />
    </div>
    <a className={`home-scroll-cue${scrolled ? " is-scrolled" : ""}`} href="#home-intro" aria-label="Scroll to introduction"><span>Scroll to explore</span><i aria-hidden="true" /></a>
  </section>;
}
