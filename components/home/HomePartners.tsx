"use client";

import Image from "next/image";
import Link from "next/link";
import { partners } from "@/content/partners";
import { PartnerSculpture } from "@/components/home/PartnerSculpture";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export function HomePartners() {
  const { reducedMotion } = useMotionPreferences();

  return <section className={`home-partners section-wrap${reducedMotion ? " is-reduced-motion" : ""}`} id="partners" aria-labelledby="partners-title">
    <div className="partners-copy">
    <div className="partners-heading"><h2 className="home-section-title" id="partners-title"><span className="partners-title-better">Better,</span>{" "}<span className="partners-title-together">together.</span></h2></div>
    <p className="partners-intro">For ambitious brands, curious founders, and creative teams. There’s room for your next big idea.</p>
    <div className="partner-strip">
      <ul className="partner-logos" aria-label="Our partners">
        {partners.map((partner) => <li className={`partner-logo partner-logo-${partner.surface}`} title={partner.name} key={partner.name}>
          <Image src={partner.logoSrc} alt={partner.name} width={partner.logoWidth} height={partner.logoHeight} sizes="40px" />
        </li>)}
      </ul>
      <span className="partner-divider" aria-hidden="true" />
      <Link href="/book-consultation" className="partner-invite" aria-label="Be the next partner. Book a consultation.">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        <span>Be the next</span>
      </Link>
    </div>
    </div>
    <PartnerSculpture />
  </section>;
}
