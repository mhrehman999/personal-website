"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FooterLight } from "@/components/shell/FooterLight";
import { availability, calLink, email, navigation, socials, whatsappNumber } from "@/content/site";
import { services } from "@/content/services";
import { WhatsAppGlyph } from "@/components/shell/Header";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { BrandLogo } from "@/components/shell/BrandLogo";

const footerName = "Muhammad Haris Rehman";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const fillRef = useRef<SVGRectElement>(null);
  const [progress, setProgress] = useState(0);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
        frame = 0;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); if (frame) cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !footerRef.current || !fillRef.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.fromTo(fillRef.current, { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: footerRef.current, start: "top 90%", end: "top 20%", scrub: true },
        });
      }, footerRef);
      if (reducedMotion && fillRef.current) gsap.set(fillRef.current, { scaleX: 1 });
    });
    return () => { cancelled = true; context?.revert(); };
  }, [reducedMotion]);

  const ringOffset = 2 * Math.PI * 17 * (1 - progress);
  return <footer ref={footerRef} className={`site-footer${reducedMotion ? " is-reduced-motion" : ""}`}>
    <div className="footer-atmosphere" aria-hidden="true"><i /><i /></div>
    <FooterLight reducedMotion={reducedMotion} />
    <div className="footer-crosshair footer-crosshair-top" aria-hidden="true">+</div><div className="footer-crosshair footer-crosshair-bottom" aria-hidden="true">+</div>
    <div className="footer-inner">
      <div className="footer-topline"><BrandLogo name={footerName} context="footer" />{availability.show && availability.label && <span className="availability-chip"><i aria-hidden="true" />{availability.label}</span>}</div>
      <div className="footer-columns">
        <FooterColumn title="Services">{services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}>{service.title}</Link>)}</FooterColumn>
        <FooterColumn title="Navigate">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</FooterColumn>
        <FooterColumn title="Connect"><a href={`mailto:${email}`}>{email}</a><a href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : "/contact"} target={whatsappNumber ? "_blank" : undefined} rel={whatsappNumber ? "noopener noreferrer" : undefined}><WhatsAppGlyph />WhatsApp</a><a href={calLink || "/contact"} target={calLink ? "_blank" : undefined} rel={calLink ? "noopener noreferrer" : undefined}>Book a call <span aria-hidden="true">↗</span></a>{socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">{social.label} <span aria-hidden="true">↗</span></a>)}</FooterColumn>
      </div>
      <div className="footer-wordmark">
        <svg viewBox="0 0 1200 180" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="wordmark-fill"><rect ref={fillRef} x="0" y="0" width="1200" height="180" transform="scale(0 1)" style={{ transformOrigin: "left center" }} /></clipPath></defs><text x="0" y="145" textLength="1180" lengthAdjust="spacingAndGlyphs" className="footer-wordmark-outline">{footerName.toUpperCase()}</text><text x="0" y="145" textLength="1180" lengthAdjust="spacingAndGlyphs" className="footer-wordmark-filled" clipPath="url(#wordmark-fill)">{footerName.toUpperCase()}</text></svg>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} {footerName}. All rights reserved.</p><div className="footer-legal"><Link href="/privacy">Privacy</Link><span>Built with care <span aria-hidden="true">✳</span></span></div><button className="back-to-top" type="button" aria-label={`Back to top, ${Math.round(progress * 100)} percent scrolled`} onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" })}><svg viewBox="0 0 40 40" aria-hidden="true"><circle className="back-to-top-track" cx="20" cy="20" r="17" /><circle className="back-to-top-progress" cx="20" cy="20" r="17" style={{ strokeDasharray: 2 * Math.PI * 17, strokeDashoffset: ringOffset }} /></svg><span aria-hidden="true">↑</span></button></div>
    </div>
  </footer>;
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="footer-column"><h2 className="eyebrow">{title}</h2><div>{children}</div></div>;
}
