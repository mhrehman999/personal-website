import type { Metadata } from "next";
import { Pricing } from "@/components/pricing/Pricing";

export const metadata: Metadata = { title: "Pricing & Packages", description: "Choose a focused studio package or book a call to discuss a custom project.", alternates: { canonical: "/pricing" } };

export default function PricingPage() { return <main className="phase-page"><Pricing standalone /></main>; }
