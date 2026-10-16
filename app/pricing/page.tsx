import type { Metadata } from "next";
import { Pricing } from "@/components/pricing/Pricing";
import { PageCTA } from "@/components/ui/PageCTA";

export const metadata: Metadata = { title: "Pricing & Packages", description: "Choose a focused studio package or book a call to discuss a custom project.", alternates: { canonical: "/pricing" } };

export default function PricingPage() { return <main className="phase-page studio-page pricing-page"><Pricing standalone /><section className="pricing-explainer"><div><p className="eyebrow">A quote with context</p><h2 className="phase-subtitle">Clear scope. Considered pricing.</h2><p>A small deck refresh and a complete identity are different kinds of work. The brief helps us agree a useful scope before putting a price to it.</p></div><dl><div><dt>What we are making</dt><dd>The services, assets and formats your project needs.</dd></div><div><dt>How much detail</dt><dd>The content, complexity and level of design development.</dd></div><div><dt>When you need it</dt><dd>Your milestones and the time available to make the work.</dd></div></dl></section><PageCTA title="Not sure what to choose?" description="Share the idea. We can work out which services belong in your brief together." label="Talk through your project" /></main>; }
