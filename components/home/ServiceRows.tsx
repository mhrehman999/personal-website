"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "@/content/services";
import { MaskedHeadline, ScrollRevealGroup } from "@/components/motion/Reveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const servicesHeadingLines = ["Four ways to move forward."];

export function ServiceRows() {
  const [openService, setOpenService] = useState<string | null>(null);
  const { reducedMotion } = useMotionPreferences();
  return <section className={`home-services section-wrap${reducedMotion ? " is-reduced-motion" : ""}`} id="services" aria-labelledby="services-heading">
    <div className="home-section-heading"><div><p className="eyebrow">What we do</p><MaskedHeadline className="home-section-title" lines={servicesHeadingLines} /><span className="visually-hidden" id="services-heading">Four ways to move forward</span></div><Link className="text-link home-heading-link" href="/services">Explore services <span aria-hidden="true">↗</span></Link></div>
    <ScrollRevealGroup className="service-list">
      {services.map((service) => {
        const expanded = openService === service.slug;
        const overview = service.summary.startsWith("TODO:") ? "Service overview pending." : service.summary;
        return <article className="service-row" data-reveal-item key={service.slug}>
          <Link className="service-row-main" href={`/services/${service.slug}`}>
            <span className="service-row-number">{service.number}</span><span className="service-row-copy"><span className="service-row-title">{service.title}</span><span className="service-row-description">{overview}</span></span><span className="service-row-arrow" aria-hidden="true">↗</span>
          </Link>
          <button className="service-row-toggle" type="button" aria-expanded={expanded} aria-controls={`service-detail-${service.slug}`} onClick={() => setOpenService(expanded ? null : service.slug)}><span className="visually-hidden">{expanded ? "Hide" : "Show"} {service.title} details</span><span aria-hidden="true">{expanded ? "−" : "+"}</span></button>
          <div className={`service-row-detail${expanded ? " is-open" : ""}`} id={`service-detail-${service.slug}`} aria-hidden={!expanded} inert={!expanded}><div className="service-row-detail-inner"><p>{overview}</p><ul>{service.subServices.map((item) => <li key={item.id}>{item.label}</li>)}</ul><Link href={`/services/${service.slug}`}>View service <span aria-hidden="true">↗</span></Link></div></div>
        </article>;
      })}
    </ScrollRevealGroup>
  </section>;
}
