"use client";

import Image from "next/image";
import Link from "next/link";
import { partners, samplePartners } from "@/content/partners";
import { PartnerMark } from "@/components/home/PartnerMark";
import { PartnerSculpture } from "@/components/home/PartnerSculpture";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export function HomePartners() {
  const isSample = partners.length === 0;
  const items = isSample ? samplePartners : partners;
  const { reducedMotion } = useMotionPreferences();

  return <section className={`home-partners section-wrap${reducedMotion ? " is-reduced-motion" : ""}`} id="partners" aria-labelledby="partners-title">
    <div className="partners-copy">
    <div className="partners-heading"><h2 className="home-section-title" id="partners-title">Better, together.</h2>{isSample && <span className="social-proof-sample">Sample partner marks</span>}</div>
    <p className="partners-intro">For ambitious brands, curious founders, and creative teams. There’s room for your next big idea.</p>
    <div className="partner-strip">
      <ul className="partner-logos" aria-label={isSample ? "Example partner logos" : "Our partners"}>
        {items.map((partner) => <li className={`partner-logo partner-logo-${partner.mark}`} title={partner.name} key={partner.name}>
          {partner.logoSrc ? <Image src={partner.logoSrc} alt={partner.name} width={36} height={36} /> : <><PartnerMark mark={partner.mark} /><span className="visually-hidden">{partner.name}</span></>}
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
