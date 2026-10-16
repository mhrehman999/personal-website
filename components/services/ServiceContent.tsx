import Image from "next/image";
import Link from "next/link";
import type { Service, SubService } from "@/content/services";
import { workProjects } from "@/content/work";
import { PageCTA } from "@/components/ui/PageCTA";

const steps = [
  ["Brief", "The audience, the message and the places the work needs to live."],
  ["Direction", "A clear visual approach, shared before the details are developed."],
  ["Design", "Layouts, imagery and typography refined around your feedback."],
  ["Handoff", "Organised files, agreed formats and a clear next step."],
];

export function ServiceContent({ service, sub }: { service: Service; sub?: SubService }) {
  const related = service.relatedSlugs.flatMap((slug) => { const project = workProjects.find((entry) => entry.slug === slug); return project ? [project] : []; }).slice(0, sub ? 2 : 3);
  const enquiry = `/contact?service=${service.slug}${sub ? `&items=${service.slug}:${sub.id}` : ""}`;
  return <main className="phase-page studio-page service-detail">
    <nav className="inner-breadcrumb" aria-label="Breadcrumb"><Link href="/services">Services</Link><span aria-hidden="true">/</span>{sub ? <><Link href={`/services/${service.slug}`}>{service.title}</Link><span aria-hidden="true">/</span><span>{sub.label}</span></> : <span>{service.title}</span>}</nav>
    <header className="inner-hero inner-hero-split"><div><p className="eyebrow">{service.title}{sub ? ` / ${sub.label}` : " / Studio capabilities"}</p><h1 className="phase-title">{sub ? sub.label : service.headline}</h1><p className="phase-lede">{sub ? sub.description : service.introduction}</p><Link className="button button-primary inner-hero-action" href={enquiry}><span>Talk about your project</span><span className="button-icon" aria-hidden="true">↗</span></Link></div><figure className="service-hero-art"><Image src={service.heroImage} alt={`${service.title} portfolio example${service.slug === "branding" ? ": Perspective identity" : ""}`} fill priority sizes="(max-width: 767px) 100vw, 48vw" /></figure></header>
    <div className="service-detail-grid">
      <section aria-labelledby="included-heading"><p className="eyebrow">{sub ? "A considered approach" : "Find your focus"}</p><h2 className="phase-subtitle" id="included-heading">{sub ? "Designed around the way you use it." : "The right support for your next move."}</h2>
        {sub ? <div className="subservice-story"><p>{service.introduction}</p><p>We start with your audience and the material you have. The brief sets the direction, the touchpoints and the level of detail, so every part of the design has a purpose.</p><Link className="text-link" href={`/services/${service.slug}`}>Explore all {service.title.toLowerCase()} services <span aria-hidden="true">↗</span></Link></div> : <div className="included-grid">{service.subServices.map((item) => <Link className="included-card" href={`/services/${service.slug}/${item.id}`} key={item.id}><h3>{item.label}<span aria-hidden="true">↗</span></h3><p>{item.description}</p><span className="included-card-link">Explore {item.label.toLowerCase()}</span></Link>)}</div>}
      </section>
      <aside className="deliverables-panel" aria-labelledby="deliverables-heading"><p className="eyebrow">Your handoff</p><h2 className="phase-subtitle" id="deliverables-heading">Useful, from the first file.</h2><ul>{(sub ? sub.deliverables : service.deliverables).map((item) => <li key={item}>{item}</li>)}</ul><p className="scope-note">Final deliverables, formats and timing are agreed around your brief.</p><Link className="text-link" href={enquiry}>Build your brief <span aria-hidden="true">↗</span></Link></aside>
    </div>
    {!sub && <section className="service-process" aria-labelledby="service-process-heading"><p className="eyebrow">From first idea to final files</p><h2 className="phase-subtitle" id="service-process-heading">A clear path through the work.</h2><ol>{steps.map(([title, description], index) => <li key={title}><span className="eyebrow">0{index + 1}</span><strong>{title}</strong><p>{description}</p></li>)}</ol></section>}
    <section className="related-work" aria-labelledby="related-work-heading"><div className="inner-section-heading"><div><p className="eyebrow">Studio work</p><h2 className="phase-subtitle" id="related-work-heading">See the thinking in practice.</h2></div><Link className="text-link" href="/work">All work <span aria-hidden="true">↗</span></Link></div><div className="service-work-grid">{related.map((project) => <Link className="service-work-card" href={`/work/${project.slug}`} key={project.slug}><div><Image src={project.coverImage} alt={project.coverAlt} width={1400} height={950} sizes="(max-width: 767px) 100vw, 40vw" /></div><h3>{project.title}<span aria-hidden="true">↗</span></h3></Link>)}</div></section>
    <section className="service-faqs" aria-labelledby="service-faq-heading"><p className="eyebrow">A little more context</p><h2 className="phase-subtitle" id="service-faq-heading">Before we begin.</h2>{service.faqs.map((faq) => <details className="service-faq" key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</section>
    {sub && <section className="service-other"><p className="eyebrow">Part of the same visual system</p><h2 className="phase-subtitle">Explore more {service.title.toLowerCase()} services.</h2><div>{service.subServices.filter((item) => item.id !== sub.id).map((item) => <Link href={`/services/${service.slug}/${item.id}`} key={item.id}>{item.label}<span aria-hidden="true">↗</span></Link>)}</div></section>}
    <PageCTA title={sub ? `Let's shape your ${sub.label.toLowerCase()} project.` : "Your next move deserves a clear direction."} href={enquiry} label="Tell me about your project" />
  </main>;
}
