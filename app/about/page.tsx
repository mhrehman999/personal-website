import type { Metadata } from "next";
import Link from "next/link";
import { brandName } from "@/content/site";
import { aboutContent } from "@/content/about";

export const metadata: Metadata = { title: "About", description: "About the people and principles behind the studio.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <main className="phase-page section-wrap"><p className="eyebrow">About the studio</p><h1 className="phase-title">Good design starts with <span className="hero-accent">clear thinking.</span></h1><p className="phase-lede">{aboutContent.story.replace("MH Rehman", brandName)}</p><section className="about-placeholder" aria-labelledby="about-principles"><h2 className="phase-subtitle" id="about-principles">{aboutContent.principlesHeading}</h2><div className="principles-grid">{aboutContent.principles.map((principle) => <article key={principle.title}><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div><h2 className="phase-subtitle">Working style</h2><p>{aboutContent.workingStyle}</p></section><div className="phase-cta-row"><Link className="button button-primary" href="/contact">Start a project <span className="button-icon" aria-hidden="true">↗</span></Link><Link className="button button-secondary" href="/work">See selected work <span aria-hidden="true">↗</span></Link></div></main>;
}
