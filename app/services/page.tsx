import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/services";

export const metadata: Metadata = { title: "Services", description: "Branding, pitch deck, social media, and presentation design services.", alternates: { canonical: "/services" } };

export default function ServicesPage() {
  return <main className="phase-page service-overview section-wrap"><p className="eyebrow">What we do</p><h1 className="phase-title">Design for brands <span className="hero-accent">with direction.</span></h1><p className="phase-lede">Four focused services for teams ready to communicate with clarity.</p><div className="service-overview-list">{services.map((service) => <Link className="service-overview-card" href={`/services/${service.slug}`} key={service.slug}><span className="eyebrow">{service.number}</span><span><strong>{service.title}</strong><small>{service.summary}</small></span><span className="service-row-arrow" aria-hidden="true">↗</span><span className="service-overview-preview" aria-hidden="true">{service.title}</span></Link>)}</div><div className="phase-cta-row"><Link className="button button-primary" href="/contact">Start a project <span className="button-icon" aria-hidden="true">↗</span></Link><Link className="button button-secondary" href="/pricing">Explore packages <span aria-hidden="true">↗</span></Link></div></main>;
}
