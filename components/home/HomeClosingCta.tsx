"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { calLink, whatsappNumber } from "@/content/site";
import { track } from "@/lib/analytics";
import { WhatsAppGlyph } from "@/components/shell/Header";
import { MaskedHeadline } from "@/components/motion/Reveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { motionTokens } from "@/lib/motion";
import { MagneticLink } from "@/components/home/MagneticLink";

const closingHeadingLines = ["Let's make it matter."];

export function HomeClosingCta() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();
  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    if (reducedMotion) return;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !trackRef.current) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 0px)", () => {
        let offset = 0;
        let scale = 1;
        let direction = 1;
        let paused = false;
        const tick = (_time: number, delta: number) => {
          const halfWidth = (trackRef.current?.scrollWidth ?? 0) / 2;
          if (!halfWidth || paused) return;
          offset = (offset + motionTokens.marquee.speed * scale * direction * delta / 1000) % halfWidth;
          if (offset < 0) offset += halfWidth;
          if (trackRef.current) gsap.set(trackRef.current, { x: -offset });
        };
        gsap.ticker.add(tick);
        const trigger = ScrollTrigger.create({ onUpdate: (self) => {
          direction = self.direction || 1;
          scale = Math.min(motionTokens.marquee.maximumSpeed, Math.max(motionTokens.marquee.minimumSpeed, 1 + Math.abs(self.getVelocity()) / 5000));
        } });
        const pause = () => { paused = true; };
        const resume = () => { paused = false; };
        trackRef.current?.addEventListener("pointerenter", pause);
        trackRef.current?.addEventListener("pointerleave", resume);
        return () => { trigger.kill(); gsap.ticker.remove(tick); trackRef.current?.removeEventListener("pointerenter", pause); trackRef.current?.removeEventListener("pointerleave", resume); };
      });
      context = { revert: () => media.revert() };
    });
    return () => { cancelled = true; context?.revert(); };
  }, [reducedMotion]);

  const customItems = Array.from({ length: 4 }, (_, index) => <span className={index % 2 ? "cta-marquee-outline" : "cta-marquee-fill"} key={index}>Let&apos;s work together<span aria-hidden="true"> ✳ </span></span>);
  return <section className={`home-closing-cta${reducedMotion ? " is-static" : ""}`} aria-labelledby="closing-cta-heading"><div className={`cta-marquee${reducedMotion ? " is-static" : ""}`} aria-hidden="true"><div className="cta-marquee-track" ref={trackRef}>{customItems}{customItems}</div></div><div className="closing-cta-inner section-wrap"><p className="eyebrow">Have something in mind?</p><MaskedHeadline className="closing-cta-title" id="closing-cta-heading" lines={closingHeadingLines} /><p className="closing-cta-copy">Tell us where you want to go. We’ll help shape the next step.</p><div className="closing-cta-actions"><MagneticLink className="button button-primary" href="/contact"><span>Contact form</span><span className="button-icon" aria-hidden="true">↗</span></MagneticLink><a className="button button-secondary" href={whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I would like to discuss a project.")}` : "/contact"} target={whatsappNumber ? "_blank" : undefined} rel={whatsappNumber ? "noopener noreferrer" : undefined} onClick={() => { if (whatsappNumber) track("whatsapp_click"); }}><WhatsAppGlyph />WhatsApp</a><Link className="button button-secondary" href={calLink || "/book-consultation"} target={calLink ? "_blank" : undefined} rel={calLink ? "noopener noreferrer" : undefined} onClick={() => track("book_call_click")}>Book a call <span aria-hidden="true">↗</span></Link></div></div></section>;
}
