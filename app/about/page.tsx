import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { aboutContent } from "@/content/about";
import { services } from "@/content/services";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomePartners } from "@/components/home/HomePartners";
import { PageCTA } from "@/components/ui/PageCTA";

export const metadata: Metadata = { title: "About", description: "Muhammad Haris Rehman: clear thinking and considered design across brand identity, pitch decks, presentations and social media.", alternates: { canonical: "/about" } };
export default function AboutPage() {
  return <main className="phase-page studio-page about-page"><header className="inner-hero inner-hero-split"><div><p className="eyebrow">Muhammad Haris Rehman / Designer</p><h1 className="phase-title">Clear thinking. Distinctive design.</h1><p className="phase-lede">{aboutContent.story}</p><Link className="text-link" href="/work">See the work <span aria-hidden="true">↗</span></Link></div><div className="about-visual"><Image src="/work/cognexo/cover.webp" alt="Cognexo presentation design, with a clear visual system across the slides" width={1200} height={900} priority /><Image src="/work/oneflow/cover.webp" alt="Oneflow presentation design" width={1200} height={900} /></div></header>
    <section className="about-story"><div><p className="eyebrow">A direct collaboration</p><h2 className="phase-subtitle">Good work starts with a good conversation.</h2></div><div><p>{aboutContent.workingStyle}</p><p>Whether you need one presentation or a connected identity across your business, the aim stays the same: make the message clear, make the design feel like you, and make the final work useful.</p></div></section>
    <section className="about-principles" aria-labelledby="about-principles"><p className="eyebrow">A few things I design by</p><h2 className="phase-subtitle" id="about-principles">{aboutContent.principlesHeading}</h2><div>{aboutContent.principles.map((principle) => <article key={principle.title}><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div></section>
    <section className="about-capabilities"><div><p className="eyebrow">One connected practice</p><h2 className="phase-subtitle">From the first impression to the next conversation.</h2></div><div>{services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}><span><strong>{service.title}</strong><small>{service.summary}</small></span><span aria-hidden="true">↗</span></Link>)}</div></section>
    <HomeProcess /><HomePartners /><PageCTA title="Let's shape something that feels like you." /></main>;
}
