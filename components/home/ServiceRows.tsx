"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/content/services";
import { MaskedHeadline, ScrollRevealGroup } from "@/components/motion/Reveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { SectionAction } from "@/components/ui/SectionAction";

const servicesHeadingLines = ["Four ways to move forward."];

export function ServiceRows({ overview = false }: { overview?: boolean }) {
  const [openService, setOpenService] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);
  const { reducedMotion } = useMotionPreferences();
  const activeService = services.find((service) => service.slug === activePreview);

  useEffect(() => {
    setMounted(true);
    const hide = () => setActivePreview(null);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);
    return () => { window.removeEventListener("scroll", hide); window.removeEventListener("blur", hide); cancelAnimationFrame(frame.current); };
  }, []);

  function positionPreview(clientX: number, clientY: number, immediate = false) {
    const element = preview.current;
    if (!element) return;
    const width = Math.min(360, Math.max(240, window.innerWidth * .27));
    const height = width * 2 / 3 + 48;
    const x = Math.min(window.innerWidth - width - 28, Math.max(window.innerWidth * .56, clientX + 32));
    const y = Math.max(96, Math.min(window.innerHeight - height - 24, clientY - height / 2));
    cancelAnimationFrame(frame.current);
    const transform = `translate3d(${x}px, ${y}px, 0)`;
    if (immediate || reducedMotion) {
      element.style.transition = "none";
      element.style.transform = transform;
      frame.current = requestAnimationFrame(() => { element.style.transition = ""; });
    } else {
      frame.current = requestAnimationFrame(() => { element.style.transition = ""; element.style.transform = transform; });
    }
  }

  function showPreview(event: PointerEvent<HTMLElement>, slug: string) {
    if (event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;
    positionPreview(event.clientX, event.clientY, activePreview === null);
    setActivePreview(slug);
  }

  return <section className={`home-services${overview ? " service-overview-services" : " section-wrap"}${reducedMotion ? " is-reduced-motion" : ""}`} id="services" aria-labelledby={overview ? "services-page-title" : "services-heading"}>
    {!overview && <div className="home-section-heading"><div><p className="eyebrow">What we do</p><MaskedHeadline className="home-section-title" id="services-heading" lines={servicesHeadingLines} /></div><SectionAction className="home-heading-link" href="/services">Explore services</SectionAction></div>}
    <ScrollRevealGroup className="service-list">
      {services.map((service) => {
        const expanded = openService === service.slug;
        const summary = service.summary;
        return <article className="service-row" data-reveal-item key={service.slug}
          onPointerEnter={(event) => showPreview(event, service.slug)}
          onPointerMove={(event) => showPreview(event, service.slug)}
          onPointerLeave={() => setActivePreview(null)} onPointerCancel={() => setActivePreview(null)}>
          <Link className="service-row-main" href={`/services/${service.slug}`}>
            <span className="service-row-number">{service.number}</span><span className="service-row-copy"><span className="service-row-title">{service.title}</span><span className="service-row-description">{summary}</span></span><span className="service-row-arrow" aria-hidden="true">↗</span>
          </Link>
          <button className="service-row-toggle" type="button" aria-expanded={expanded} aria-controls={`service-detail-${service.slug}`} onClick={() => setOpenService(expanded ? null : service.slug)}><span className="visually-hidden">{expanded ? "Hide" : "Show"} {service.title} details</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path className="service-toggle-vertical" d="M10 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
          <div className={`service-row-detail${expanded ? " is-open" : ""}`} id={`service-detail-${service.slug}`} aria-hidden={!expanded} inert={!expanded}><div className="service-row-detail-clip"><div className="service-row-detail-inner"><p>{summary}</p><ul>{service.subServices.map((item) => <li key={item.id}><Link href={`/services/${service.slug}/${item.id}`}>{item.label}<span aria-hidden="true">↗</span></Link></li>)}</ul><Link href={`/services/${service.slug}`}>View service <span aria-hidden="true">↗</span></Link></div></div></div>
        </article>;
      })}
    </ScrollRevealGroup>
    {mounted && createPortal(<div ref={preview} className={`service-hover-preview${activePreview ? " is-visible" : ""}${reducedMotion ? " is-reduced-motion" : ""}`} aria-hidden="true">
      <div className="service-preview-surface">
        <div className="service-preview-images">{services.map((service) => <div className={`service-preview-image${activePreview === service.slug ? " is-active" : ""}`} key={service.slug}>
          <Image src={overview ? service.heroImage : service.previewImage} alt="" fill sizes="360px" loading="eager" />
        </div>)}</div>
        <div className="service-preview-caption"><span>{activeService?.title || services[0].title}</span><span>Selected work</span></div>
      </div>
    </div>, document.body)}
  </section>;
}
