import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { services } from "@/content/services";
import { email, whatsappNumber } from "@/content/site";

export const metadata: Metadata = { title: "Contact", description: "Tell Muhammad Haris Rehman what you are building and shape a clear design brief together.", alternates: { canonical: "/contact" } };
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
  return <main className="phase-page studio-page contact-page"><header className="inner-hero contact-hero"><div><p className="eyebrow">Start a conversation</p><h1 className="phase-title">What&apos;s your next move?</h1></div><p className="phase-lede">A brand to build, a story to present, or a message to make clearer. Tell me a little about it. We can work out the right next step together.</p></header>
    <div className="contact-layout"><section className="contact-main" aria-labelledby="contact-form-heading"><div className="contact-form-heading"><p className="eyebrow">Your project</p><h2 className="phase-subtitle" id="contact-form-heading">A little context goes a long way.</h2><p>No perfect brief needed. Share the idea, the audience and anything you already have in mind.</p></div><ContactForm initial={{ service, items }} /></section><aside className="contact-aside" aria-label="Other ways to reach the studio"><p className="eyebrow">A direct conversation</p><h2 className="phase-subtitle">Good work starts here.</h2><p>You will be speaking with Haris, the designer behind the work.</p><a className="contact-email" href={`mailto:${email}`}>{email}<span aria-hidden="true">↗</span></a><Link className="contact-aside-link" href="/book-consultation">Book a discovery call <span aria-hidden="true">↗</span></Link>{whatsappNumber && <a className="contact-aside-link" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">Continue on WhatsApp <span aria-hidden="true">↗</span></a>}<div className="contact-prep"><h3>Helpful to have, if you can.</h3><ul><li>What your business does and who it is for</li><li>The design support you need</li><li>Your timing, references or existing material</li></ul></div><Link className="text-link" href="/work">Explore the work first <span aria-hidden="true">↗</span></Link></aside></div>
    <section className="contact-next"><h2>What happens next?</h2><p>I review your enquiry, clarify the scope with you and put together a direction for the project. We agree the details before design begins.</p></section></main>;
}
