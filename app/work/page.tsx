import type { Metadata } from "next";
import { WorkFilter } from "@/components/work/WorkFilter";
import { workProjects } from "@/content/work";
import { PageCTA } from "@/components/ui/PageCTA";

export const metadata: Metadata = { title: "Selected Work", description: "Selected branding, pitch deck, social media, and presentation design projects.", alternates: { canonical: "/work" } };

export default function WorkPage() {
  const projects = [...workProjects.filter((project) => project.slug === "perspective"), ...workProjects.filter((project) => project.slug !== "perspective")];
  return <main className="phase-page studio-page work-page"><header className="inner-hero"><p className="eyebrow">Selected projects</p><h1 className="phase-title">Different ideas. A clear point of view.</h1><p className="phase-lede">Brand identities and presentations, each shaped around its own story. Explore the work and the details that make it distinctive.</p></header><WorkFilter projects={projects} /><PageCTA title="Something here feels like the right direction?" description="Tell me what you are working on. We can build a visual approach around your own story." /></main>;
}
