import type { Metadata } from "next";
import { ServiceRows } from "@/components/home/ServiceRows";
import { PageCTA } from "@/components/ui/PageCTA";

export const metadata: Metadata = { title: "Services", description: "Brand identity, pitch decks, social media and presentations, built as one clear visual system.", alternates: { canonical: "/services" } };
export default function ServicesPage() {
  return <main className="phase-page studio-page service-overview"><header className="inner-hero"><p className="eyebrow">What we do</p><h1 className="phase-title" id="services-page-title">Your next move. Made clear.</h1><p className="phase-lede">Branding, pitch decks, presentations and social content. Four focused ways to give your business a clear, consistent visual presence.</p></header><ServiceRows overview /><PageCTA title="One project, or the whole picture." description="Choose a focused service or bring the pieces together. We can build the right brief around what your business needs." /></main>;
}
