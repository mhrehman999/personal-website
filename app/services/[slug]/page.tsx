import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { homeProjects } from "@/content/work";

export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((entry) => entry.slug === slug);
  return service ? { title: service.title, description: service.summary.replace(/^TODO: /, ""), alternates: { canonical: `/services/${slug}` } } : {};
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((entry) => entry.slug === slug);
  if (!service) notFound();
  const related = homeProjects.filter((project) => project.category === service.slug);
  return <main className="phase-page service-detail section-wrap"><p className="eyebrow">Service {service.number} / Studio capabilities</p><h1 className="phase-title">{service.title} <span className="hero-accent">with intent.</span></h1><p className="phase-lede">{service.summary}</p><div className="service-detail-grid"><section aria-labelledby="included-heading"><p className="eyebrow">The scope</p><h2 className="phase-subtitle" id="included-heading">What’s included</h2><div className="included-grid">{service.subServices.map((item, index) => <article className="included-card" key={item.id}><span className="eyebrow">{String(index + 1).padStart(2, "0")}</span><h3>{item.label}</h3><p>TODO: Confirm the scope and details for this service.</p></article>)}</div></section><section className="deliverables-panel" aria-labelledby="deliverables-heading"><p className="eyebrow">Your handoff</p><h2 className="phase-subtitle" id="deliverables-heading">Typical deliverables</h2>{service.deliverables.length ? <ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul> : <p>TODO: Add confirmed deliverables for this service.</p>}</section></div><section className="service-process" aria-labelledby="service-process-heading"><p className="eyebrow">How we work</p><h2 className="phase-subtitle" id="service-process-heading">A clear path from first brief to final files.</h2><ol>{["Discover", "Define", "Design", "Deliver"].map((step, index) => <li key={step}><span className="eyebrow">0{index + 1}</span><strong>{step}</strong></li>)}</ol></section><section className="service-faqs" aria-labelledby="service-faq-heading"><p className="eyebrow">Questions</p><h2 className="phase-subtitle" id="service-faq-heading">About {service.title.toLowerCase()}</h2>{service.faqs.map((faq) => <details className="service-faq" key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</section><section className="related-work" aria-labelledby="related-work-heading"><p className="eyebrow">Selected work</p><h2 className="phase-subtitle" id="related-work-heading">Related projects</h2>{related.length ? <div className="related-work-grid">{related.map((project) => <article className="related-work-card" key={project.slug}><span className="eyebrow">{project.year}</span><h3>{project.title}</h3><p>{project.summary}</p></article>)}</div> : <p>More work in this category is coming soon.</p>}</section><div className="phase-cta-row"><Link className="button button-primary" href={`/contact?service=${service.slug}`}>Request this service <span className="button-icon" aria-hidden="true">↗</span></Link><Link className="button button-secondary" href="/pricing">Explore packages <span aria-hidden="true">↗</span></Link></div></main>;
}
