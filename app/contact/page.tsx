import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { services } from "@/content/services";
import { EmailBand } from "@/components/shell/EmailBand";
import { whatsappNumber } from "@/content/site";

export const metadata: Metadata = { title: "Contact", description: "Tell us what you are building and get a clear next step for your project.", alternates: { canonical: "/contact" } };

type Search = { service?: string | string[]; items?: string | string[]; package?: string | string[] };
function first(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

export default async function ContactPage({ searchParams }: { searchParams: Promise<Search> }) {
  const query = await searchParams;
  const requestedService = first(query.service) ?? "";
  const items = (first(query.items) ?? "").split(",").filter(Boolean).flatMap((entry) => {
    const [service, sub] = entry.split(":");
    const data = services.find((candidate) => candidate.slug === service);
    return data && sub && data.subServices.some((item) => item.id === sub) ? [{ service, sub }] : [];
  });
  const service = services.some((item) => item.slug === requestedService) ? requestedService : items[0]?.service ?? "";
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I would like to discuss a project.")}` : "/contact";
  return <main className="phase-page contact-page section-wrap"><p className="eyebrow">Start a conversation</p><h1 className="phase-title">Tell us what you’re <span className="hero-accent">building.</span></h1><p className="phase-lede">A little context helps us point you in the right direction.</p><div className="contact-layout"><section className="contact-main" aria-labelledby="contact-form-heading"><h2 className="phase-subtitle" id="contact-form-heading">Project enquiry</h2><ContactForm initial={{ service, items }} /></section><aside className="contact-aside" aria-label="Other ways to reach the studio"><p className="eyebrow">Prefer a different route?</p><h2 className="phase-subtitle">Reach us directly.</h2><EmailBand /><a className="contact-aside-link" href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel={whatsappNumber ? "noopener noreferrer" : undefined}>WhatsApp {whatsappNumber ? "" : <span className="contact-aside-note">Number to be added</span>}<span aria-hidden="true">↗</span></a><a className="contact-aside-link" href="/book-consultation">Book a call <span aria-hidden="true">↗</span></a></aside></div></main>;
}
