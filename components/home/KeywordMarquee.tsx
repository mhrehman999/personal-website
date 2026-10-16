"use client";

import { useEffect, useRef } from "react";
import { services } from "@/content/services";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { motionTokens } from "@/lib/motion";

export function KeywordMarquee() {
  const track = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    if (reducedMotion) return;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !track.current) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 0px)", () => {
        let offset = 0;
        let scale = 1;
        let direction = 1;
        let cycleWidth = 0;
        const measure = () => { cycleWidth = (track.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0; };
        measure();
        const resize = new ResizeObserver(measure);
        if (track.current) resize.observe(track.current.firstElementChild!);
        const tick = (_time: number, delta: number) => {
          if (!cycleWidth) return;
          offset = (offset + motionTokens.marquee.speed * scale * direction * delta / 1000) % cycleWidth;
          if (offset < 0) offset += cycleWidth;
          if (track.current) gsap.set(track.current, { x: -offset });
        };
        gsap.ticker.add(tick);
        const scrollTrigger = ScrollTrigger.create({ onUpdate: (self) => {
          direction = self.direction || 1;
          scale = Math.min(motionTokens.marquee.maximumSpeed, Math.max(motionTokens.marquee.minimumSpeed, 1 + Math.abs(self.getVelocity()) / 5000));
        } });
        return () => { scrollTrigger.kill(); gsap.ticker.remove(tick); resize.disconnect(); };
      });
      context = { revert: () => media.revert() };
    });
    return () => { cancelled = true; context?.revert(); };
  }, [reducedMotion]);

  const keywords = services.map((service) => service.title);
  return <div className={`keyword-marquee${reducedMotion ? " is-static" : ""}`} role="img" aria-label={keywords.join(" plus ")}>
    <div className="keyword-marquee-track" ref={track} aria-hidden="true">{[0, 1].map((copy) => <div className="keyword-marquee-group" key={copy}>{[...keywords, ...keywords].map((word, index) => <span className="keyword-marquee-word" key={`${copy}-${index}`}>{word}<i aria-hidden="true">+</i></span>)}</div>)}</div>
  </div>;
}
