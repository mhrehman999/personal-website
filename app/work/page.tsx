import type { Metadata } from "next";
import { WorkFilter } from "@/components/work/WorkFilter";
import { workProjects } from "@/content/work";

export const metadata: Metadata = { title: "Selected Work", description: "Selected branding, pitch deck, social media, and presentation design projects.", alternates: { canonical: "/work" } };

export default function WorkPage() {
  return <main className="phase-page work-page"><p className="eyebrow">Selected projects</p><h1 className="phase-title">Good work, <span className="hero-accent">in practice.</span></h1><p className="phase-lede">A selection of brand and presentation projects. More case studies will be added as they are ready to share.</p><WorkFilter projects={workProjects} /></main>;
}
